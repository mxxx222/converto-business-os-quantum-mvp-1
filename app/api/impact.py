from fastapi import APIRouter, Query
from datetime import datetime
from typing import Optional


router = APIRouter()


@router.get("/impact/summary")
async def get_impact_summary(tenant_id: Optional[str] = Query(default=None)):
    """
    Minimal impact summary for the MVP dashboard.
    Returns a few KPI cards so the frontend's ImpactCard can render.
    """
    now = datetime.now().isoformat()
    cards = [
        {"title": "Monthly Revenue", "value": "€52,430", "delta": "+3.1%"},
        {"title": "Churn Risk", "value": "2.3%", "delta": "-0.2%"},
        {"title": "Active Tenants", "value": "128"},
        {"title": "Support SLA", "value": "99.3%"},
    ]
    return {
        "tenantId": tenant_id or "demo",
        "cards": cards,
        "generatedAt": now,
        "status": "ok",
    }
