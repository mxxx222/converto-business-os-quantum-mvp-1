/**
 * AI Console - Developer Panel
 * Accessible only with NEXT_PUBLIC_DEV_AI=1
 */

"use client";
import { useEffect, useRef, useState } from "react";
import { useChatStream } from "@/hooks/useChatStream";
import { Sparkles, Send } from "lucide-react";

export default function AIConsolePage() {
  const [prompt, setPrompt] = useState("");
  const [systemMessage, setSystemMessage] = useState("You are a helpful business assistant.");
  const [model, setModel] = useState("gpt-4o-mini");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [stream, setStream] = useState(false);
  const [showRaw, setShowRaw] = useState(false);
  const [rawLines, setRawLines] = useState<string[]>([]);
  const [nonStreamUsage, setNonStreamUsage] = useState<any>(null);
  const [nonStreamMs, setNonStreamMs] = useState<number | null>(null);
  const [nonStreamMeta, setNonStreamMeta] = useState<{ model: string; org: string; project: string } | null>(null);
  const [retryAfterSec, setRetryAfterSec] = useState<number | null>(null);
  const [countdownSec, setCountdownSec] = useState<number | null>(null);
  const [autoRetry, setAutoRetry] = useState<boolean>(true);
  const [attempts, setAttempts] = useState<number[]>([]); // timestamps (ms)
  const [attemptsTotal, setAttemptsTotal] = useState<number>(0);
  const timerRef = useRef<number | null>(null);

  const ATTEMPT_WINDOW_MS = 5 * 60 * 1000; // last 5 minutes
  function recordAttempt() {
    const now = Date.now();
    setAttempts((prev) => {
      const pruned = prev.filter((t) => now - t <= ATTEMPT_WINDOW_MS);
      pruned.push(now);
      return pruned;
    });
    setAttemptsTotal((n) => n + 1);
  }

  function getAttempts5mWindow() {
    const now = Date.now();
    const minTs = now - ATTEMPT_WINDOW_MS;
    return attempts.filter((t) => t >= minTs);
  }

  function onClear5m() {
    setAttempts([]);
  }

  function onResetTotal() {
    // eslint-disable-next-line no-alert
    if (confirm('Reset total attempts?')) setAttemptsTotal(0);
  }

  function toJsonBlob(data: unknown) {
    return new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  }

  function downloadBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function onExportJson() {
    const windowed = getAttempts5mWindow();
    const payload = {
      generatedAt: new Date().toISOString(),
      window: '5m',
      count: windowed.length,
      attempts: windowed.map((ts) => ({ ts, iso: new Date(ts).toISOString() })),
    };
    downloadBlob(toJsonBlob(payload), `attempts-5m-${new Date().toISOString()}.json`);
  }

  async function onCopyJson() {
    const windowed = getAttempts5mWindow();
    const payload = {
      generatedAt: new Date().toISOString(),
      window: '5m',
      count: windowed.length,
      attempts: windowed.map((ts) => ({ ts, iso: new Date(ts).toISOString() })),
    };
    await navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
  }

  function toCsvBlob(rows: Array<{ ts: number; iso: string }>) {
    const header = 'ts,iso\n';
    const body = rows.map((r) => `${r.ts},${r.iso}`).join('\n');
    return new Blob([header + body + '\n'], { type: 'text/csv' });
  }

  function onExportCsv() {
    const rows = getAttempts5mWindow().map((ts) => ({ ts, iso: new Date(ts).toISOString() }));
    const blob = toCsvBlob(rows);
    downloadBlob(blob, `attempts-5m-${new Date().toISOString()}.csv`);
  }

  async function onCopyCsv() {
    const rows = getAttempts5mWindow().map((ts) => ({ ts, iso: new Date(ts).toISOString() }));
    const header = 'ts,iso\n';
    const body = rows.map((r) => `${r.ts},${r.iso}`).join('\n');
    await navigator.clipboard.writeText(header + body + '\n');
  }
  const { text, loading: streaming, send, cancel, metrics } = useChatStream({
    onRaw: (line) => {
      if (showRaw) setRawLines((prev) => [...prev, line]);
    },
  });

  // Check if dev mode is enabled
  const devEnabled = process.env.NEXT_PUBLIC_DEV_AI === "1";

  if (!devEnabled) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600">
            AI Console requires NEXT_PUBLIC_DEV_AI=1
          </p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    if (countdownSec == null) return;
    if (countdownSec <= 0) {
      setCountdownSec(null);
      if (autoRetry) {
        // Auto retry when countdown finishes
        void sendPrompt();
      }
      return;
    }
    timerRef.current = window.setTimeout(() => {
      setCountdownSec((s) => (s == null ? null : s - 1));
    }, 1000) as unknown as number;
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [countdownSec, autoRetry]);

  async function sendPrompt() {
    setResponse("");
    recordAttempt();
    const messages = [
      { role: "system" as const, content: systemMessage },
      { role: "user" as const, content: prompt }
    ];
    if (stream) {
      setRawLines([]);
      await send(messages, model);
    } else {
      setLoading(true);
      try {
        const t0 = performance.now();
        const res = await fetch("/api/ai/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages, model, stream: false })
        });
        const t1 = performance.now();
        setNonStreamMs(t1 - t0);
        const modelHdr = res.headers.get('x-model') || '-';
        const orgHdr = res.headers.get('x-org') || '-';
        const projectHdr = res.headers.get('x-project') || '-';
        setNonStreamMeta({ model: modelHdr, org: orgHdr, project: projectHdr });

        if (res.status === 429) {
          const retry = Number(res.headers.get('retry-after') || '0') || 0;
          setRetryAfterSec(retry);
          setCountdownSec(retry);
        }

        const data = await res.json().catch(() => null);
        if (data?.error) setResponse(`Error: ${data.error}`);
        else setResponse(data?.choices?.[0]?.message?.content || "No response");
        setNonStreamUsage(data?.usage || null);
      } catch (error) {
        setResponse(`Error: ${error}`);
      } finally {
        setLoading(false);
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-8 h-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              AI Console (Dev Mode)
            </h1>
          </div>
          <p className="text-gray-600">
            Raw AI testing panel - not available to customers
          </p>
        </div>

        {/* Configuration */}
        <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
          <h2 className="font-semibold mb-4">Configuration</h2>

          <div className="space-y-4">
            {/* Model Selection */}
            <div>
              <label className="block text-sm font-medium mb-1">Model</label>
              <select
                className="w-full border rounded-lg px-3 py-2"
                value={model}
                onChange={(e) => setModel(e.target.value)}
              >
                <option value="gpt-4o-mini">gpt-4o-mini (fast, cheap)</option>
                <option value="gpt-4o">gpt-4o (advanced)</option>
                <option value="gpt-4-turbo">gpt-4-turbo</option>
              </select>
            </div>

            {/* System Message */}
            <div>
              <label className="block text-sm font-medium mb-1">System Message</label>
              <textarea
                className="w-full border rounded-lg px-3 py-2 text-sm font-mono"
                rows={3}
                value={systemMessage}
                onChange={(e) => setSystemMessage(e.target.value)}
              />
            </div>

            {/* Stream & debug toggles */}
            <div className="flex items-center gap-3">
              <input id="stream-toggle" type="checkbox" className="h-4 w-4" checked={stream} onChange={(e) => setStream(e.target.checked)} />
              <label htmlFor="stream-toggle" className="text-sm">Stream mode</label>
            </div>
            <div className="flex items-center gap-3">
              <input id="raw-toggle" type="checkbox" className="h-4 w-4" checked={showRaw} onChange={(e) => setShowRaw(e.target.checked)} />
              <label htmlFor="raw-toggle" className="text-sm">Show raw SSE</label>
            </div>
            <div className="flex items-center gap-3">
              <input id="retry-toggle" type="checkbox" className="h-4 w-4" checked={autoRetry} onChange={(e) => setAutoRetry(e.target.checked)} />
              <label htmlFor="retry-toggle" className="text-sm">Auto-retry</label>
            </div>
          </div>
        </div>

        {/* Prompt Input */}
        <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
          <h2 className="font-semibold mb-4">Prompt</h2>

          <textarea
            className="w-full border rounded-lg px-3 py-2 text-sm font-mono mb-4"
            rows={6}
            placeholder="Enter your prompt..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />

          <button
            onClick={sendPrompt}
            disabled={loading || streaming || !prompt.trim() || (countdownSec != null && countdownSec > 0)}
            className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading || streaming ? (
              "Processing..."
            ) : (
              <>
                <Send className="w-4 h-4" />
                Send Prompt
              </>
            )}
          </button>
          {stream && streaming && (
            <button onClick={cancel} className="mt-3 w-full px-4 py-2 bg-gray-200 rounded-lg">Cancel</button>
          )}

          {countdownSec != null && countdownSec > 0 && (
            <div className="mt-3 w-full px-4 py-2 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-sm flex items-center justify-between">
              <span>
                Rate limited. Retry in {countdownSec}s {retryAfterSec ? `(Retry-After: ${retryAfterSec}s)` : ''}
              </span>
              <button
                onClick={() => {
                  setCountdownSec(null);
                  setRetryAfterSec(null);
                  void sendPrompt();
                }}
                disabled={loading || streaming}
                className="ml-3 inline-flex items-center px-3 py-1.5 rounded-md bg-amber-600 text-white hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Retry now
              </button>
            </div>
          )}
        </div>

        {/* Metrics */}
        <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
          <h2 className="font-semibold mb-4">Latency + Tokens</h2>
          {stream ? (
            <ul className="text-sm text-slate-700 space-y-1">
              <li><span className="font-medium">Request ID:</span> {metrics?.requestId || '-'}</li>
              <li><span className="font-medium">Model:</span> {metrics?.model || '-'}</li>
              <li><span className="font-medium">Org:</span> {metrics?.org || '-'}</li>
              <li><span className="font-medium">Project:</span> {metrics?.project || '-'}</li>
              <li><span className="font-medium">Latency:</span> {metrics?.ms ? Math.round(metrics.ms) : '-'} ms</li>
              <li><span className="font-medium">SSE events:</span> {metrics?.events ?? 0}</li>
              <li><span className="font-medium">Appended chars:</span> {metrics?.chars ?? 0}</li>
              <li className="flex items-center gap-2 flex-wrap">
                <span className="font-medium">Attempts (5m):</span> {getAttempts5mWindow().length}
                <button type="button" onClick={onClear5m} className="px-2 py-0.5 text-xs rounded bg-slate-200 hover:bg-slate-300">Clear</button>
                <button type="button" onClick={onExportJson} className="px-2 py-0.5 text-xs rounded bg-slate-200 hover:bg-slate-300">Export JSON</button>
                <button type="button" onClick={onCopyJson} className="px-2 py-0.5 text-xs rounded bg-slate-200 hover:bg-slate-300">Copy JSON</button>
                <button type="button" onClick={onExportCsv} className="px-2 py-0.5 text-xs rounded bg-slate-200 hover:bg-slate-300">Export CSV</button>
                <button type="button" onClick={onCopyCsv} className="px-2 py-0.5 text-xs rounded bg-slate-200 hover:bg-slate-300">Copy CSV</button>
              </li>
              <li className="flex items-center gap-2">
                <span className="font-medium">Total attempts:</span> {attemptsTotal}
                <button type="button" onClick={onResetTotal} className="px-2 py-0.5 text-xs rounded bg-slate-200 hover:bg-slate-300">Reset total</button>
              </li>
            </ul>
          ) : (
            <ul className="text-sm text-slate-700 space-y-1">
              <li><span className="font-medium">Model:</span> {nonStreamMeta?.model || '-'}</li>
              <li><span className="font-medium">Org:</span> {nonStreamMeta?.org || '-'}</li>
              <li><span className="font-medium">Project:</span> {nonStreamMeta?.project || '-'}</li>
              <li><span className="font-medium">Latency:</span> {nonStreamMs ? Math.round(nonStreamMs) : '-'} ms</li>
              <li><span className="font-medium">Usage:</span> {nonStreamUsage ? JSON.stringify(nonStreamUsage) : '-'}</li>
              <li className="flex items-center gap-2 flex-wrap">
                <span className="font-medium">Attempts (5m):</span> {getAttempts5mWindow().length}
                <button type="button" onClick={onClear5m} className="px-2 py-0.5 text-xs rounded bg-slate-200 hover:bg-slate-300">Clear</button>
                <button type="button" onClick={onExportJson} className="px-2 py-0.5 text-xs rounded bg-slate-200 hover:bg-slate-300">Export JSON</button>
                <button type="button" onClick={onCopyJson} className="px-2 py-0.5 text-xs rounded bg-slate-200 hover:bg-slate-300">Copy JSON</button>
                <button type="button" onClick={onExportCsv} className="px-2 py-0.5 text-xs rounded bg-slate-200 hover:bg-slate-300">Export CSV</button>
                <button type="button" onClick={onCopyCsv} className="px-2 py-0.5 text-xs rounded bg-slate-200 hover:bg-slate-300">Copy CSV</button>
              </li>
              <li className="flex items-center gap-2">
                <span className="font-medium">Total attempts:</span> {attemptsTotal}
                <button type="button" onClick={onResetTotal} className="px-2 py-0.5 text-xs rounded bg-slate-200 hover:bg-slate-300">Reset total</button>
              </li>
            </ul>
          )}
        </div>

        {/* Response */}
        {!stream && response && (
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="font-semibold mb-4">Response</h2>
            <pre className="text-sm bg-gray-50 p-4 rounded-lg overflow-x-auto whitespace-pre-wrap font-mono">
              {response}
            </pre>
          </div>
        )}
        {stream && (
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="font-semibold mb-4">Stream</h2>
            <pre className="text-sm bg-gray-50 p-4 rounded-lg overflow-x-auto whitespace-pre-wrap font-mono min-h-[120px]">
              {text}
            </pre>
            {showRaw && (
              <details className="mt-4">
                <summary className="cursor-pointer text-slate-700">Raw SSE</summary>
                <pre className="text-xs bg-gray-50 p-3 rounded-lg overflow-x-auto whitespace-pre-wrap font-mono max-h-60">{rawLines.join('\n')}</pre>
              </details>
            )}
          </div>
        )}

        {/* Quick Templates */}
        <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-4">
          <h3 className="font-semibold text-green-900 mb-2">✅ Secure Dev Mode</h3>
          <p className="text-sm text-green-800">
            This panel now uses secure API routes. No API keys are exposed to the browser.
            Requires <code className="bg-green-100 px-1 py-0.5 rounded">NEXT_PUBLIC_DEV_AI=1</code>.
          </p>
          <p className="text-sm text-green-800 mt-2">
            API calls are proxied through <code className="bg-green-100 px-1 py-0.5 rounded">/api/dev/ai-chat</code>.
          </p>
        </div>
      </div>
    </div>
  );
}
