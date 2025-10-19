"""
AI-powered classification for expenses: VAT class, budget line, GL account.
"""

import re
from typing import Dict, List

VAT_MAP = {24: "standard", 14: "food", 10: "reduced", 0: "zero"}


def guess_vat_rates(items: List[Dict], total_vat=None) -> List[Dict]:
    """Ensure all items have vat_rate."""
    for it in items:
        if "vat_rate" not in it:
            it["vat_rate"] = 24  # Default Finnish VAT
    return items


def classify_category(merchant: str, items: List[Dict]) -> str:
    """Classify based on merchant name and item names."""
    m = (merchant or "").lower()

    # Grocery stores
    if any(x in m for x in ["abc", "alepa", "k-market", "s-market", "lidl", "prisma"]):
        return "Groceries"

    # Fuel stations
    if any(x in m for x in ["shell", "st1", "neste", "abc"]):
        return "Fuel"

    # Item-based classification
    names = " ".join([(i.get("name") or "").lower() for i in items])
    if re.search(r"(tool|battery|charger|adapter|saw|drill)", names):
        return "Tools"
    if re.search(r"(coffee|lunch|dinner|restaurant)", names):
        return "Meals"

    return "General"


def map_budget_line(category: str) -> str:
    """Map category to budget line."""
    table = {
        "Groceries": "OPEX:Office:Snacks",
        "Fuel": "OPEX:Transport:Fuel",
        "Tools": "CAPEX:Equipment:Tools",
        "Meals": "OPEX:Meals:Staff",
        "General": "OPEX:General",
    }
    return table.get(category, "OPEX:General")


def enrich(data: Dict) -> Dict:
    """
    Enrich extracted data with classification.

    Args:
        data: Raw extracted data from Vision API

    Returns:
        Enriched data with category, budget_line, vat_rates
    """
    items = guess_vat_rates(data.get("items", []), data.get("vat"))
    cat = classify_category(data.get("merchant", ""), items)
    budget = map_budget_line(cat)

    data["category"] = cat
    data["budget_line"] = budget
    data["items"] = items

    return data
