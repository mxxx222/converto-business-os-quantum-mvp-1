from fastapi import APIRouter, Depends, Query, HTTPException
from typing import Optional
from sqlalchemy.orm import Session
from shared_core.utils.db import get_session
from shared_core.modules.gamify.rewards import RewardCatalog, RewardRedemption, RewardStatus
from shared_core.modules.gamify.service import summary_since

router = APIRouter(prefix="/api/v1/rewards", tags=["rewards"])


@router.get("/catalog")
def list_catalog(db: Session = Depends(get_session)):
    """List available rewards."""
    items = db.query(RewardCatalog).filter(RewardCatalog.stock > 0).all()
    return [
        {
            "id": str(r.id),
            "name": r.name,
            "sponsor": r.sponsor,
            "points_cost": r.points_cost,
            "stock": r.stock,
        }
        for r in items
    ]


@router.post("/redeem")
def redeem_reward(
    reward_id: str = Query(...),
    tenant_id: Optional[str] = Query(None),
    user_id: Optional[str] = Query(None),
    db: Session = Depends(get_session),
):
    """Redeem a reward if user has enough points."""
    reward = db.query(RewardCatalog).filter(RewardCatalog.id == reward_id).first()
    if not reward:
        raise HTTPException(404, "Reward not found")
    if reward.stock <= 0:
        raise HTTPException(400, "Out of stock")

    # Check user points
    summary = summary_since(db, tenant_id=tenant_id, user_id=user_id, days=365)
    if summary["total"] < reward.points_cost:
        raise HTTPException(400, f"Insufficient points. Need {reward.points_cost}, have {summary['total']}")

    # Reserve redemption (actual fulfillment is async)
    redemption = RewardRedemption(
        tenant_id=tenant_id,
        user_id=user_id,
        reward_id=reward.id,
        points_spent=reward.points_cost,
        status=RewardStatus.reserved,
    )
    db.add(redemption)
    reward.stock -= 1
    db.commit()
    db.refresh(redemption)

    return {"ok": True, "redemption_id": str(redemption.id), "status": "reserved"}

