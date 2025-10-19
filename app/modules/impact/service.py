from datetime import datetime, timedelta
from typing import Dict, List
import random


def _pct(a: float, b: float) -> float:
    if b == 0:
        return 0.0
    return (a - b) / b


def kpi_summary(days: int = 30) -> Dict:
    random.seed(42)
    total = random.randint(50, 180)
    prev_total = random.randint(40, 150)
    energy_wh = random.randint(12000, 54000)
    prev_energy_wh = random.randint(8000, 40000)
    avg_watts = random.randint(150, 850)
    return {
        "window_days": days,
        "processed_count": int(total),
        "energy_wh": int(energy_wh),
        "avg_watts": int(avg_watts),
        "d_processed": round(_pct(total, prev_total), 3),
        "d_energy_wh": round(_pct(energy_wh, prev_energy_wh), 3),
        "highlights": ["OCR success: demo-laskenta (synthetic)", "Liitä todellinen DB kun valmis"],
    }


def notion_prompts_markdown() -> str:
    return (
        "# Converto™ ROI Analyzer — Notion Setup Prompts (Summary)\n\n"
        "Lataa täydet ohjeet Converto-portaalista. Aja AI-ohjeet 1–8 järjestyksessä.\n"
    )


def kpi_cards():
    k = kpi_summary(30)
    return [
        {
            "title": "Liikevaihto 30 pv",
            "value": "—",
            "delta": "—",
            "hint": "Linkitä Myynti DB:hen kun valmis",
        },
        {
            "title": "OCR energia (Wh)",
            "value": f"{k['energy_wh']:,}".replace(",", " "),
            "delta": f"{int(k['d_energy_wh']*100)}%",
        },
        {
            "title": "Prosessoidut",
            "value": str(k["processed_count"]),
            "delta": f"{int(k['d_processed']*100)}%",
        },
        {"title": "Kesk. teho (W)", "value": str(k["avg_watts"]), "delta": "—"},
    ]
