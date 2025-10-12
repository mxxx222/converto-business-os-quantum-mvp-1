from fastapi import APIRouter

router = APIRouter(prefix="/api/v1/rewards", tags=["rewards"])


@router.get("/status")
def status():
    return {"points": 0, "badges": [], "streak": 0}



