from fastapi import APIRouter, Query
from datetime import datetime, timedelta


router = APIRouter()


@router.get("/predictive/forecast")
async def forecast(days: int = Query(default=14)):
    days = max(1, min(days, 60))
    today = datetime.now().date()
    series = []
    base = 50000.0
    for i in range(days):
        dt = today + timedelta(days=i)
        value = base * (1.0 + 0.001 * i)
        series.append({"date": dt.isoformat(), "revenue": round(value, 2)})
    return {
        "horizonDays": days,
        "series": series,
        "generatedAt": datetime.now().isoformat(),
        "status": "ok",
    }
