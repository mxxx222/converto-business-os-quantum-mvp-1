from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from shared_core.utils.db import get_session
from app.modules.legal import service, sync

router = APIRouter(prefix="/api/v1/legal", tags=["legal"])


class LegalRuleOut(BaseModel):
    id: str
    domain: str
    regulation_code: str
    title: str
    summary: Optional[str]
    valid_from: str
    valid_to: Optional[str]
    source_url: Optional[str]
    is_active: bool


@router.get("/rules", response_model=List[LegalRuleOut])
def list_rules(domain: Optional[str] = Query(None), db: Session = Depends(get_session)):
    """List legal rules, optionally filtered by domain."""
    rules = service.list_rules(db, domain=domain, active_only=False)
    return [
        LegalRuleOut(
            id=r.id,
            domain=r.domain,
            regulation_code=r.regulation_code,
            title=r.title,
            summary=r.summary,
            valid_from=r.valid_from.isoformat(),
            valid_to=r.valid_to.isoformat() if r.valid_to else None,
            source_url=r.source_url,
            is_active=r.is_active,
        )
        for r in rules
    ]


@router.post("/sync")
def sync_rules(db: Session = Depends(get_session)):
    """Sync legal rules from official sources (Finlex, Vero.fi)."""
    try:
        result = sync.sync_all(db)
        return {"ok": True, **result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/promote/{rule_id}")
def promote_rule(rule_id: str, db: Session = Depends(get_session)):
    """Activate a pending legal rule."""
    rule = service.promote_rule(db, rule_id)
    if not rule:
        raise HTTPException(status_code=404, detail="Rule not found")
    return {"ok": True, "rule_id": rule.id, "is_active": rule.is_active}


@router.get("/rules/{rule_id}")
def get_rule(rule_id: str, db: Session = Depends(get_session)):
    """Get a specific legal rule."""
    rule = service.get_rule(db, rule_id)
    if not rule:
        raise HTTPException(status_code=404, detail="Rule not found")
    return LegalRuleOut(
        id=rule.id,
        domain=rule.domain,
        regulation_code=rule.regulation_code,
        title=rule.title,
        summary=rule.summary,
        valid_from=rule.valid_from.isoformat(),
        valid_to=rule.valid_to.isoformat() if rule.valid_to else None,
        source_url=rule.source_url,
        is_active=rule.is_active,
    )

