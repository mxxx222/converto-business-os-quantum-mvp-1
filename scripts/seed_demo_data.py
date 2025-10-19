#!/usr/bin/env python3
"""
Demo Data Seeder
Creates sample data for dashboard presentation
"""

from datetime import datetime, timedelta
import uuid
import json
import os
from pathlib import Path


DEMO_TENANT = "tenant_demo"
DATA_DIR = Path("data/demo")


def write_json(path: Path, obj):
    """Write JSON file with proper formatting"""
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(obj, f, ensure_ascii=False, indent=2)
    print(f"✅ Created: {path}")


def seed_demo_data():
    """Generate all demo data"""
    now = datetime.utcnow()

    # ========================================
    # 1. OCR RECEIPTS (3 samples)
    # ========================================
    receipts = [
        {
            "id": str(uuid.uuid4()),
            "tenant": DEMO_TENANT,
            "vendor": "K-Market",
            "total_cents": 3420,
            "total_eur": 34.20,
            "vat_rate": 14.0,
            "vat_cents": 420,
            "date": (now - timedelta(days=2)).strftime("%Y-%m-%d"),
            "category": "Tarvikkeet",
            "status": "confirmed",
            "created_at": (now - timedelta(days=2)).isoformat(),
        },
        {
            "id": str(uuid.uuid4()),
            "tenant": DEMO_TENANT,
            "vendor": "Shell",
            "total_cents": 6590,
            "total_eur": 65.90,
            "vat_rate": 24.0,
            "vat_cents": 1278,
            "date": (now - timedelta(days=5)).strftime("%Y-%m-%d"),
            "category": "Polttoaine",
            "status": "confirmed",
            "created_at": (now - timedelta(days=5)).isoformat(),
        },
        {
            "id": str(uuid.uuid4()),
            "tenant": DEMO_TENANT,
            "vendor": "Ravintola Savoy",
            "total_cents": 2590,
            "total_eur": 25.90,
            "vat_rate": 14.0,
            "vat_cents": 321,
            "date": (now - timedelta(days=1)).strftime("%Y-%m-%d"),
            "category": "Edustus",
            "status": "confirmed",
            "created_at": (now - timedelta(days=1)).isoformat(),
        },
    ]

    write_json(DATA_DIR / "receipts.json", receipts)

    # ========================================
    # 2. VAT SUMMARY (current month)
    # ========================================
    vat_summary = {
        "tenant": DEMO_TENANT,
        "month": now.strftime("%Y-%m"),
        "rate_current": 25.5,  # New Finnish VAT rate
        "sales_vat_cents": 18200,
        "sales_vat_eur": 182.00,
        "purchases_vat_cents": 9400,
        "purchases_vat_eur": 94.00,
        "net_vat_cents": 8800,
        "net_vat_eur": 88.00,
        "last_filing": (now - timedelta(days=30)).strftime("%Y-%m-%d"),
        "next_deadline": (now + timedelta(days=10)).strftime("%Y-%m-%d"),
    }

    write_json(DATA_DIR / "vat_summary.json", vat_summary)

    # ========================================
    # 3. IMPACT METRICS (time & money saved)
    # ========================================
    impact = {
        "tenant": DEMO_TENANT,
        "period": "current_month",
        "minutes_saved": 185,  # ~3 hours
        "hours_saved": 3.08,
        "eur_saved": 77.00,  # 3.08h × 25€/h
        "receipts_scanned": 3,
        "vat_reports_generated": 1,
        "reminders_sent": 5,
        "breakdown": {
            "ocr": {"minutes": 6, "description": "3 kuitit × 2min"},
            "vat": {"minutes": 30, "description": "ALV-raportti"},
            "billing": {"minutes": 0, "description": "Ei laskuja"},
            "reminders": {"minutes": 25, "description": "5 muistutusta × 5min"},
            "legal": {"minutes": 60, "description": "Lakipäivitys"},
            "manual_work_saved": {"minutes": 64, "description": "Muu automaatio"},
        },
    }

    write_json(DATA_DIR / "impact.json", impact)

    # ========================================
    # 4. GAMIFY POINTS & STREAK
    # ========================================
    gamify = {
        "tenant": DEMO_TENANT,
        "user_id": "demo_user",
        "total_points": 220,
        "lifetime_points": 1050,
        "streak_days": 4,
        "level": 3,
        "next_level_points": 300,
        "recent_events": [
            {
                "action": "scanned_receipt",
                "points": 10,
                "date": (now - timedelta(days=0)).isoformat(),
            },
            {"action": "paid_invoice", "points": 20, "date": (now - timedelta(days=1)).isoformat()},
            {"action": "vat_report", "points": 30, "date": (now - timedelta(days=2)).isoformat()},
            {
                "action": "scanned_receipt",
                "points": 10,
                "date": (now - timedelta(days=3)).isoformat(),
            },
            {"action": "legal_sync", "points": 15, "date": (now - timedelta(days=4)).isoformat()},
        ],
    }

    write_json(DATA_DIR / "gamify.json", gamify)

    # ========================================
    # 5. LEGAL RULES (sample)
    # ========================================
    legal_rules = [
        {
            "id": "rule_001",
            "title": "Arvonlisäverokantojen muutos 1.9.2024",
            "regulation_code": "AVL 85a §",
            "domain": "VAT",
            "summary": "Yleinen verokanta nousee 24%:sta 25,5%:iin 1.9.2024 alkaen.",
            "valid_from": "2024-09-01",
            "source_url": "https://www.finlex.fi/fi/laki/ajantasa/1993/19931501",
            "is_active": True,
        }
    ]

    write_json(DATA_DIR / "legal_rules.json", legal_rules)

    # ========================================
    # SUMMARY
    # ========================================
    print("\n" + "=" * 50)
    print("✅ Demo data seeded successfully!")
    print("=" * 50)
    print(f"📊 Receipts: {len(receipts)}")
    print(f"💰 VAT Summary: Net {vat_summary['net_vat_eur']}€")
    print(f"⏱️  Time Saved: {impact['hours_saved']:.1f}h")
    print(f"💵 Money Saved: {impact['eur_saved']}€")
    print(f"🎮 Gamify Points: {gamify['total_points']}")
    print(f"⚖️  Legal Rules: {len(legal_rules)}")
    print("=" * 50)
    print("\n👉 Start backend and frontend to see demo data in action!")


if __name__ == "__main__":
    seed_demo_data()
