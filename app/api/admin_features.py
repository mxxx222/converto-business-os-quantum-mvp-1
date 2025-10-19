from fastapi import APIRouter, Body, Depends, Query
from sqlalchemy.orm import Session
from app.db import get_db  # adjust if your DB helper lives elsewhere
from app.services.entitlements import set_entitlements
from app.core.admin_auth import admin_required


router = APIRouter(prefix="/api/v1/admin/features", tags=["admin"])


@router.post("/set", dependencies=[Depends(admin_required)])
def admin_set(
    tenant_id: str = Query(...), modules: list[str] = Body(...), db: Session = Depends(get_db)
):
    set_entitlements(db, tenant_id, set(modules), source="admin")
    return {"ok": True, "tenant_id": tenant_id, "modules": modules}
