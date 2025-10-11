from fastapi import APIRouter, Body
from datetime import datetime


router = APIRouter()


@router.post("/ai/guardian/review")
async def guardian_review(payload: dict = Body(...)):
    text = payload.get("text", "")
    flags = []
    if any(k in text.lower() for k in ["token", "secret", "password"]):
        flags.append("possible_credential_leak")
    return {
        "risks": flags,
        "score": 0.07 if flags else 0.01,
        "timestamp": datetime.now().isoformat(),
        "status": "ok",
    }


