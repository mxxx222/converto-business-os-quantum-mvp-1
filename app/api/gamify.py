from fastapi import APIRouter, Depends, Query, Body, HTTPException
from typing import Optional, Dict
from shared_core.utils.db import get_session
from shared_core.modules.gamify.service import record_event, summary_since


router = APIRouter(prefix="/api/v1/gamify", tags=["gamify"])


@router.post("/event")
def api_record_event(
    tenant_id: Optional[str] = Query(None),
    kind: str = Query(...),
    points: Optional[int] = Query(None),
    user_id: Optional[str] = Query(None),
    meta: Optional[Dict] = Body(None),
    db=Depends(get_session),
):
    try:
        ev = record_event(db, tenant_id=tenant_id, kind=kind, points=points, user_id=user_id, meta=meta)
        return {"ok": True, "id": str(ev.id), "points": ev.points}
    except Exception as e:
        raise HTTPException(500, str(e))


@router.get("/summary")
def api_summary(tenant_id: Optional[str] = Query(None), days: int = Query(7, ge=1, le=60), db=Depends(get_session)):
    try:
        return summary_since(db, tenant_id=tenant_id, days=days)
    except Exception as e:
        raise HTTPException(500, str(e))


