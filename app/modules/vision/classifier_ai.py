"""
AI-powered classification for expenses: VAT class, budget line, GL account.
"""
from typing import Dict, Optional

# Simple rule-based classifier (can be replaced with ML model)
CATEGORY_TO_VAT = {
    "ruoka": 14,  # Elintarvikkeet
    "energia": 24,  # Sähkö, lämpö
    "matka": 24,  # Matkakulut
    "toimisto": 24,  # Toimistotarvikkeet
    "viihde": 24,  # Viihde, ravintola
    "terveys": 10,  # Terveydenhuolto
    "kirjat": 10,  # Kirjat, lehdet
    "muu": 24,
}

CATEGORY_TO_BUDGET = {
    "ruoka": "5100-RUOKA",
    "energia": "6200-ENERGIA",
    "matka": "7300-MATKAKULUT",
    "toimisto": "4100-TOIMISTO",
    "viihde": "8500-EDUSTUS",
    "terveys": "6500-TERVEYS",
    "kirjat": "4300-KIRJAT",
    "muu": "9999-MUU",
}


def classify_expense(data: Dict) -> Dict:
    """
    Classify extracted receipt data into accounting categories.
    
    Args:
        data: Extracted receipt data (merchant, total, category, etc.)
    
    Returns:
        Dict with vat_class, budget_line, gl_account, suggestions
    """
    category = data.get("category", "muu").lower()
    
    vat_class = CATEGORY_TO_VAT.get(category, 24)
    budget_line = CATEGORY_TO_BUDGET.get(category, "9999-MUU")
    
    # GL account suggestion (simple mapping)
    gl_account = f"{budget_line.split('-')[0]}"
    
    # AI suggestions (can be enhanced with LLM)
    suggestions = []
    
    if data.get("total", 0) > 1000:
        suggestions.append("⚠️ Suuri summa - varmista hyväksyntä")
    
    if data.get("confidence", 0) < 0.7:
        suggestions.append("⚠️ Matala luotettavuus - tarkista manuaalisesti")
    
    if category == "muu":
        suggestions.append("💡 Kategorisoi tarkemmin parempaa raportointia varten")
    
    return {
        "vat_class": vat_class,
        "budget_line": budget_line,
        "gl_account": gl_account,
        "category": category,
        "suggestions": suggestions,
    }

