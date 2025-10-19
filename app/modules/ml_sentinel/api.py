from fastapi import APIRouter, Query

router = APIRouter(prefix="/api/v1/sentinel", tags=["ml-sentinel"])


@router.get("/anomaly")
def anomaly(score: float = Query(0.02)):
    alert = score > 0.05
    return {"score": score, "alert": alert}
