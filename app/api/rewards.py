from fastapi import APIRouter, Depends, Query, Body, HTTPException
from typing import Optional
from pydantic import BaseModel
from sqlalchemy.orm import Session
from shared_core.utils.db import get_session
from shared_core.modules.rewards.service import list_rewards, redeem_reward, list_redemptions

router = APIRouter(prefix="/api/v1/rewards", tags=["rewards"])


class RedeemIn(BaseModel):
    tenant_id: str
    user_id: str
    reward_id: str


@router.get("/catalog")
def get_catalog(tenant_id: str = Query(...), db: Session = Depends(get_session)):
    """List available rewards."""
    return list_rewards(db, tenant_id=tenant_id)


@router.post("/redeem")
def post_redeem(body: RedeemIn, db: Session = Depends(get_session)):
    """Redeem a reward if user has enough CT tokens."""
    ok, data = redeem_reward(db, body.tenant_id, body.user_id, body.reward_id)
    if not ok:
        raise HTTPException(400, detail=data.get("error", "redeem_failed"))
    return {"ok": True, **data}


@router.get("/history")
def get_history(
    tenant_id: str = Query(...),
    user_id: str = Query(...),
    db: Session = Depends(get_session),
):
    """Get user's redemption history."""
    return list_redemptions(db, tenant_id=tenant_id, user_id=user_id)

