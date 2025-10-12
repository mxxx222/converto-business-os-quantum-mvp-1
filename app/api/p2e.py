from fastapi import APIRouter, Depends, Query, Body, HTTPException
from typing import Optional, Dict
from pydantic import BaseModel
from sqlalchemy.orm import Session
from shared_core.utils.db import get_session
from shared_core.modules.p2e.service import get_balance, mint, burn, list_quests


router = APIRouter(prefix="/api/v1/p2e", tags=["p2e"])


class WalletOut(BaseModel):
    tenant_id: str
    user_id: str
    balance: int


class MintIn(BaseModel):
    tenant_id: str
    user_id: str
    amount: int
    reason: str
    ref_id: Optional[str] = None


class RedeemIn(BaseModel):
    tenant_id: str
    user_id: str
    amount: int
    reward_id: str


@router.get("/wallet", response_model=WalletOut)
def get_wallet_endpoint(t: str = Query(..., alias="t"), u: str = Query(..., alias="u"), db: Session = Depends(get_session)):
    balance = get_balance(db, tenant_id=t, user_id=u)
    return {"tenant_id": t, "user_id": u, "balance": balance}


@router.post("/mint")
def post_mint(body: MintIn, db: Session = Depends(get_session)):
    ok, data = mint(db, body.tenant_id, body.user_id, body.amount, body.reason, body.ref_id)
    if not ok:
        raise HTTPException(400, detail=data.get("error", "mint_failed"))
    return {"ok": True, **data}


@router.post("/redeem")
def post_redeem(body: RedeemIn, db: Session = Depends(get_session)):
    reason = f"redeem:{body.reward_id}"
    ok, data = burn(db, body.tenant_id, body.user_id, body.amount, reason, ref_id=body.reward_id)
    if not ok:
        raise HTTPException(400, detail=data.get("error", "redeem_failed"))
    return {"ok": True, **data}


@router.get("/quests")
def get_quests(tenant_id: str = Query(...), db: Session = Depends(get_session)):
    return list_quests(db, tenant_id=tenant_id)

