from fastapi import APIRouter, Query
from datetime import datetime


router = APIRouter()


@router.get("/sentinel/anomaly")
async def anomaly(score: float = Query(default=0.07)):
    classification = "normal"
    if score >= 0.8:
        classification = "critical"
    elif score >= 0.4:
        classification = "elevated"
    elif score >= 0.15:
        classification = "watch"
    return {
        "score": score,
        "classification": classification,
        "timestamp": datetime.now().isoformat(),
        "status": "ok",
    }
