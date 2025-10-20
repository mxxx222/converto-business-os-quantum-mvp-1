#!/usr/bin/env python3
"""
AI Anomaly Detection: queries Prometheus for error rates and latency spikes,
then asks an LLM to summarize probable root causes and remediation steps.

ENV:
  PROM_URL (default http://localhost:9090)
  ANTHROPIC_API_KEY or OPENAI_API_KEY (pref Anthropic)
  GITHUB_TOKEN (optional to open issue)
"""
from __future__ import annotations

import os, sys, json, time, datetime
import requests

def prom_query(q: str, base: str) -> float:
    r = requests.get(f"{base}/api/v1/query", params={"query": q}, timeout=10)
    r.raise_for_status()
    data = r.json()["data"]["result"]
    if not data:
        return 0.0
    return float(data[0]["value"][1])

def main() -> int:
    prom = os.getenv("PROM_URL", "http://localhost:9090")
    try:
        # 5xx rate per minute (gateway)
        err_rate = prom_query('sum(rate(http_requests_total{status=~"5.."}[5m]))', prom)
        # p95 latency
        p95 = prom_query('histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le))', prom)
    except Exception as e:
        print("Prometheus query failed:", e, file=sys.stderr)
        return 0

    anomalies = []
    if err_rate > 0.1:
        anomalies.append(f"High 5xx error rate: {err_rate:.3f}/s")
    if p95 > 1.0:
        anomalies.append(f"High p95 latency: {p95:.2f}s")

    if not anomalies:
        print("No anomalies detected")
        return 0

    prompt = (
        "System metrics indicate anomalies. Given API Gateway metrics, suggest likely root causes "
        "and concrete remediation steps. Be concise and actionable.\n\n"
        f"Anomalies: {anomalies}\n"
    )

    summary = ""
    try:
        if os.getenv("ANTHROPIC_API_KEY"):
            import anthropic
            client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
            msg = client.messages.create(model="claude-3-5-sonnet-20240620", max_tokens=600, temperature=0.2, messages=[{"role":"user","content": prompt}])
            summary = msg.content[0].text if msg.content else ""
        elif os.getenv("OPENAI_API_KEY"):
            from openai import OpenAI
            client = OpenAI()
            resp = client.chat.completions.create(model="gpt-4o", messages=[{"role":"user","content": prompt}], max_tokens=600, temperature=0.2)
            summary = resp.choices[0].message.content
    except Exception as e:
        summary = f"AI summary failed: {e}"

    print("ANOMALY SUMMARY:\n", summary)
    return 0

if __name__ == "__main__":
    raise SystemExit(main())

