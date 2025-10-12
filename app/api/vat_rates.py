from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from datetime import date, datetime
from typing import List
from pydantic import BaseModel
from shared_core.utils.db import get_session
from app.models.vat_rates import VATRate, get_rate, get_current_rates

router = APIRouter(prefix="/api/v1/vat", tags=["vat"])


class VATRateOut(BaseModel):
    id: int
    country: str
    rate_key: str
    rate_pct: float
    valid_from: str
    valid_to: str | None
    source_url: str | None
    notes: str | None


@router.get("/rates/{country}")
def list_rates(country: str, db: Session = Depends(get_session)) -> List[VATRateOut]:
    """List all VAT rates for a country (historical + current + future)."""
    rates = db.query(VATRate).filter(VATRate.country == country.upper(), VATRate.is_active == True).order_by(VATRate.valid_from.desc()).all()
    return [
        VATRateOut(
            id=r.id,
            country=r.country,
            rate_key=r.rate_key,
            rate_pct=float(r.rate_pct),
            valid_from=r.valid_from.isoformat(),
            valid_to=r.valid_to.isoformat() if r.valid_to else None,
            source_url=r.source_url,
            notes=r.notes,
        )
        for r in rates
    ]


@router.get("/rates/{country}/current")
def current_rates(country: str, db: Session = Depends(get_session)):
    """Get current VAT rates for a country."""
    rates = get_current_rates(db, country.upper())
    return {
        "country": country.upper(),
        "as_of": date.today().isoformat(),
        "rates": rates,
        "source": "Vero.fi (official)",
    }


@router.get("/rate")
def get_rate_for_date(
    country: str = Query("FI"),
    rate_key: str = Query("standard"),
    on_date: str = Query(None),
    db: Session = Depends(get_session),
):
    """Get VAT rate valid on a specific date."""
    target_date = date.fromisoformat(on_date) if on_date else date.today()
    rate = get_rate(db, country.upper(), rate_key, target_date)
    if not rate:
        raise HTTPException(404, f"No VAT rate found for {country} {rate_key} on {target_date}")
    return {
        "country": rate.country,
        "rate_key": rate.rate_key,
        "rate_pct": float(rate.rate_pct),
        "valid_from": rate.valid_from.isoformat(),
        "valid_to": rate.valid_to.isoformat() if rate.valid_to else None,
        "source": rate.source_url,
    }

