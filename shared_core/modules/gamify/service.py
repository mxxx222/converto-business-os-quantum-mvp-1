from typing import Optional, Dict, List
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..utils.db import engine, SessionLocal, Base
from .models import GamifyEvent


_tables_ready = False


def ensure_tables_created() -> None:
    global _tables_ready
    if _tables_ready:
        return
    # Creates all known tables under shared_core Base (idempotent)
    Base.metadata.create_all(bind=engine)
    _tables_ready = True


DEFAULT_POINTS: Dict[str, int] = {
    "ocr.upload": 10,
    "vat.report.on_time": 20,
    "impact.roi.improve": 25,
    "billing.on_time": 10,
}


def record_event(
    db: Session,
    tenant_id: Optional[str],
    kind: str,
    points: Optional[int] = None,
    user_id: Optional[str] = None,
    meta: Optional[Dict] = None,
) -> GamifyEvent:
    ensure_tables_created()
    pts = int(points if points is not None else DEFAULT_POINTS.get(kind, 5))
    ev = GamifyEvent(tenant_id=tenant_id, user_id=user_id, kind=kind, points=pts, meta=meta or {})
    db.add(ev)
    db.commit()
    db.refresh(ev)
    return ev


def summary_since(db: Session, tenant_id: Optional[str], days: int = 7) -> Dict:
    ensure_tables_created()
    since = datetime.utcnow() - timedelta(days=days)
    q = db.query(
        func.date_trunc("day", GamifyEvent.created_at).label("d"),
        func.sum(GamifyEvent.points).label("p"),
    ).filter(GamifyEvent.created_at >= since)
    if tenant_id:
        q = q.filter(GamifyEvent.tenant_id == tenant_id)
    q = q.group_by(func.date_trunc("day", GamifyEvent.created_at)).order_by(func.date_trunc("day", GamifyEvent.created_at))
    rows = q.all()
    series = [{"day": r.d.date().isoformat(), "points": int(r.p or 0)} for r in rows]
    total = sum(x["points"] for x in series)
    return {"days": days, "total": total, "series": series}


