#!/usr/bin/env python3
"""Seed rewards catalog for demo tenant."""
from shared_core.modules.rewards.models import RewardCatalogItem
from shared_core.utils.db import SessionLocal


def seed():
    db = SessionLocal()
    try:
        # Check if already seeded
        existing = db.query(RewardCatalogItem).filter_by(tenant_id="demo").first()
        if existing:
            print("Rewards catalog already seeded for 'demo' tenant.")
            return

        rewards = [
            RewardCatalogItem(
                tenant_id="demo",
                name="Kahvilahjakortti 10€",
                desc="Sponsorina FixuWatti Café — lunasta lähi kahvilassa",
                sponsor="FixuWatti Café",
                points_cost=100,
                stock=50,
                terms_url="https://fixuwatti.fi/terms",
            ),
            RewardCatalogItem(
                tenant_id="demo",
                name="Premium-kuukausi",
                desc="Kuukauden Converto™ Pro-tila — kaikki ominaisuudet käytössä",
                sponsor="Converto",
                points_cost=200,
                stock=20,
                terms_url=None,
            ),
            RewardCatalogItem(
                tenant_id="demo",
                name="Energia-analyysi (1h konsultaatio)",
                desc="Henkilökohtainen energia-asiantuntijan konsultaatio",
                sponsor="EnergyPro Consulting",
                points_cost=300,
                stock=10,
                terms_url="https://energypro.fi/consult",
            ),
            RewardCatalogItem(
                tenant_id="demo",
                name="Liikuntahyvinvointi-lahjakortti 25€",
                desc="Käytettävissä kuntosaleilla ja hyvinvointipalveluissa",
                sponsor="FitLife",
                points_cost=250,
                stock=30,
                terms_url=None,
            ),
        ]

        for r in rewards:
            db.add(r)

        db.commit()
        print(f"✅ Seeded {len(rewards)} rewards for tenant 'demo'.")
    finally:
        db.close()


if __name__ == "__main__":
    seed()

