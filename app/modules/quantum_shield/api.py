from fastapi import APIRouter

router = APIRouter(prefix="/api/v1/quantum", tags=["quantum"])


@router.get("/status")
def status():
    return {"module": "quantum_shield", "pqc": "stub", "status": "ready"}
