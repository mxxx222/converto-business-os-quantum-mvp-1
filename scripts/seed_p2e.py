#!/usr/bin/env python3
"""Seed P2E quests for demo tenant."""

from shared_core.modules.p2e.models import P2EQuest
from shared_core.utils.db import SessionLocal


def seed():
    db = SessionLocal()
    try:
        # Check if already seeded
        existing = db.query(P2EQuest).filter_by(tenant_id="demo").first()
        if existing:
            print("P2E quests already seeded for 'demo' tenant.")
            return

        quests = [
            P2EQuest(
                tenant_id="demo",
                code="WEEKLY_OCR5",
                title="Skannaa 5 kuittia tällä viikolla",
                desc="Saat bonuspalkinnon kun tavoite täyttyy",
                reward=25,
                period="weekly",
                active=1,
            ),
            P2EQuest(
                tenant_id="demo",
                code="INVOICE_ON_TIME",
                title="Maksa lasku ajallaan",
                desc="Ajoissa maksettu = bonus",
                reward=10,
                period="oneoff",
                active=1,
            ),
            P2EQuest(
                tenant_id="demo",
                code="DAILY_LOGIN",
                title="Kirjaudu joka päivä",
                desc="Ylläpidä streakia ja ansaitse päivittäin",
                reward=5,
                period="daily",
                active=1,
            ),
        ]

        for q in quests:
            db.add(q)

        db.commit()
        print(f"✅ Seeded {len(quests)} P2E quests for tenant 'demo'.")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
