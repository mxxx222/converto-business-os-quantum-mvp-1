from datetime import date
from typing import Optional
from sqlalchemy import Column, Integer, String, Numeric, Date, Boolean, Text, DateTime
from sqlalchemy.orm import Session
from shared_core.utils.db import Base
from datetime import datetime


class VATRate(Base):
    __tablename__ = "vat_rates"

    id = Column(Integer, primary_key=True)
    country = Column(String(2), nullable=False, index=True)  # FI, SE, etc.
    rate_key = Column(
        String(50), nullable=False, index=True
    )  # standard, reduced1, reduced2, zero, exempt
    rate_pct = Column(Numeric(5, 2), nullable=False)  # 25.50, 14.00, 10.00, etc.
    valid_from = Column(Date, nullable=False, index=True)
    valid_to = Column(Date, nullable=True)  # NULL = currently active
    source_url = Column(Text, nullable=True)
    last_checked = Column(DateTime, default=datetime.utcnow)
    checksum = Column(String(64), nullable=True)  # SHA256 of source data
    is_active = Column(Boolean, default=True, index=True)
    notes = Column(Text, nullable=True)

    def __repr__(self):
        return f"<VATRate {self.country} {self.rate_key} {self.rate_pct}% from {self.valid_from}>"


def get_rate(db: Session, country: str, rate_key: str, on_date: date) -> Optional[VATRate]:
    """Get VAT rate valid on specific date."""
    return (
        db.query(VATRate)
        .filter(
            VATRate.country == country,
            VATRate.rate_key == rate_key,
            VATRate.valid_from <= on_date,
            (VATRate.valid_to == None) | (VATRate.valid_to >= on_date),
            VATRate.is_active == True,
        )
        .order_by(VATRate.valid_from.desc())
        .first()
    )


def get_current_rates(db: Session, country: str = "FI") -> dict:
    """Get all current VAT rates for a country."""
    today = date.today()
    rates = {}
    for key in ["standard", "reduced1", "reduced2", "zero", "exempt"]:
        rate = get_rate(db, country, key, today)
        if rate:
            rates[key] = float(rate.rate_pct)
    return rates
