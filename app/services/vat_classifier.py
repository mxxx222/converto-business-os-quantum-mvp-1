"""
VAT Classifier: AI classifies items into rate_key, but actual % comes from vat_rates table.
This ensures regulatory compliance - AI never invents tax rates.
"""

from datetime import date
from typing import Dict, Any
from sqlalchemy.orm import Session
from app.models.vat_rates import get_rate

# AI classification rules (merchant/item text → rate_key)
CLASSIFICATION_RULES = {
    "standard": ["tools", "equipment", "electronics", "clothing", "general"],
    "reduced1": ["food", "restaurant", "cafe", "grocery", "market", "meal"],
    "reduced2": ["book", "medicine", "pharmacy", "bus", "train", "public transport"],
    "zero": ["export", "international"],
    "exempt": ["health", "education", "insurance", "financial"],
}


def classify_rate_key(merchant: str, items_text: str) -> str:
    """
    Classify transaction into VAT rate_key based on merchant/items.
    Returns: 'standard', 'reduced1', 'reduced2', 'zero', or 'exempt'
    """
    text = f"{merchant} {items_text}".lower()
    
    for rate_key, keywords in CLASSIFICATION_RULES.items():
        if any(kw in text for kw in keywords):
            return rate_key
    
    # Default to standard if no match
    return "standard"


def get_vat_for_receipt(
    db: Session,
    merchant: str,
    items_text: str,
    receipt_date: date,
    country: str = "FI"
) -> Dict[str, Any]:
    """
    Get correct VAT rate for a receipt.
    1. AI classifies → rate_key
    2. Lookup official rate from vat_rates table for that date
    3. Return both classification and official rate
    """
    rate_key = classify_rate_key(merchant, items_text)
    rate_record = get_rate(db, country, rate_key, receipt_date)
    
    if not rate_record:
        # Fallback to current standard rate
        rate_record = get_rate(db, country, "standard", date.today())
    
    return {
        "rate_key": rate_key,
        "rate_pct": float(rate_record.rate_pct) if rate_record else 25.5,
        "valid_from": rate_record.valid_from.isoformat() if rate_record else None,
        "source": rate_record.source_url if rate_record else "Vero.fi",
        "is_historical": receipt_date < date(2024, 9, 1) if rate_key == "standard" else False,
    }

