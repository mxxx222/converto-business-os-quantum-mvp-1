from fastapi import APIRouter, Depends
from app.core.registry import registry
from app.core.admin_auth import admin_required


router = APIRouter(prefix="/api/v1/dev", tags=["dev"])


@router.get("/manifests", dependencies=[Depends(admin_required)])
def manifests():
    return [{"id": (v.get("id") or k), **v} for k, v in registry.manifests.items()]
