"""
Seed official VAT rates for Finland.
Sources:
- Vero.fi: 25.5% standard from 2024-09-01
- Vero.fi: 10% → 14% changes from 2025-01-01 (some exceptions remain 10%)
"""

from datetime import date
from sqlalchemy.orm import Session
from app.models.vat_rates import VATRate
from shared_core.utils.db import SessionLocal, engine, Base

# Create tables
Base.metadata.create_all(bind=engine)


def seed_finland():
    db = SessionLocal()
    try:
        # Historical: 24% standard until 2024-08-31
        db.add(
            VATRate(
                country="FI",
                rate_key="standard",
                rate_pct=24.00,
                valid_from=date(2013, 1, 1),
                valid_to=date(2024, 8, 31),
                source_url="https://www.vero.fi/syventavat-vero-ohjeet/ohje-hakusivu/48411/arvonlisaverotus/",
                is_active=True,
                notes="Standard rate before Sept 2024 increase",
            )
        )

        # Current: 25.5% standard from 2024-09-01
        db.add(
            VATRate(
                country="FI",
                rate_key="standard",
                rate_pct=25.50,
                valid_from=date(2024, 9, 1),
                valid_to=None,  # Currently active
                source_url="https://www.vero.fi/syventavat-vero-ohjeet/ohje-hakusivu/48411/arvonlisaverotus/",
                is_active=True,
                notes="Standard rate increased to 25.5% from Sept 1, 2024",
            )
        )

        # Reduced 1: 14% (food, restaurants) - historical 10% until 2024-12-31
        db.add(
            VATRate(
                country="FI",
                rate_key="reduced1",
                rate_pct=10.00,
                valid_from=date(2013, 1, 1),
                valid_to=date(2024, 12, 31),
                source_url="https://www.vero.fi/syventavat-vero-ohjeet/ohje-hakusivu/48411/arvonlisaverotus/",
                is_active=True,
                notes="Food/restaurant 10% until end of 2024",
            )
        )

        # Reduced 1: 14% from 2025-01-01
        db.add(
            VATRate(
                country="FI",
                rate_key="reduced1",
                rate_pct=14.00,
                valid_from=date(2025, 1, 1),
                valid_to=None,
                source_url="https://www.vero.fi/syventavat-vero-ohjeet/ohje-hakusivu/48411/arvonlisaverotus/",
                is_active=True,
                notes="Food/restaurant increased to 14% from Jan 1, 2025",
            )
        )

        # Reduced 2: 10% (books, pharma, public transport - exceptions remain)
        db.add(
            VATRate(
                country="FI",
                rate_key="reduced2",
                rate_pct=10.00,
                valid_from=date(2013, 1, 1),
                valid_to=None,
                source_url="https://www.vero.fi/syventavat-vero-ohjeet/ohje-hakusivu/48411/arvonlisaverotus/",
                is_active=True,
                notes="Books, pharma, transport - remains 10% even after 2025 changes",
            )
        )

        # Zero rate
        db.add(
            VATRate(
                country="FI",
                rate_key="zero",
                rate_pct=0.00,
                valid_from=date(2013, 1, 1),
                valid_to=None,
                source_url="https://www.vero.fi/syventavat-vero-ohjeet/ohje-hakusivu/48411/arvonlisaverotus/",
                is_active=True,
                notes="Zero-rated goods (exports, etc.)",
            )
        )

        # Exempt
        db.add(
            VATRate(
                country="FI",
                rate_key="exempt",
                rate_pct=0.00,
                valid_from=date(2013, 1, 1),
                valid_to=None,
                source_url="https://www.vero.fi/syventavat-vero-ohjeet/ohje-hakusivu/48411/arvonlisaverotus/",
                is_active=True,
                notes="VAT-exempt services (healthcare, education, etc.)",
            )
        )

        db.commit()
        print("✅ Seeded Finland VAT rates (2013-2025+)")
        print("   - 24% → 25.5% (Sept 1, 2024)")
        print("   - 10% → 14% food/restaurants (Jan 1, 2025)")
        print("   - 10% remains for books/pharma/transport")
    finally:
        db.close()


if __name__ == "__main__":
    seed_finland()
