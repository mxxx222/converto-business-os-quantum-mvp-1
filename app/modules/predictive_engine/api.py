from fastapi import APIRouter, Query

router = APIRouter(prefix="/api/v1/predictive", tags=["predictive"])


@router.get("/forecast")
def forecast(days: int = Query(14, ge=7, le=60)):
    return {"days": days, "forecast": [100 + i * 3 for i in range(days)]}
