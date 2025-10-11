from fastapi import APIRouter, Query
from typing import List, Dict, Any
from app.core.registry import registry
from app.modules.impact.service import kpi_summary

router = APIRouter(prefix="/api/v2", tags=["v2"])

@router.get("/health")
def health_v2():
    return {"status": "ok", "version": "v2"}

@router.get("/modules")
def list_modules() -> Dict[str, Any]:
    modules: List[Dict[str, Any]] = []
    for module_id, manifest in registry.manifests.items():
        modules.append({
            "id": module_id,
            "name": manifest.get("name"),
            "version": manifest.get("version"),
            "tier": manifest.get("tier", "free"),
            "apis": manifest.get("apis", []),
        })
    return {"modules": modules}

@router.get("/impact/summary")
def impact_summary_v2(tenant_id: str = Query("demo"), days: int = Query(30, ge=7, le=120)):
    kpi = kpi_summary(days)
    return {"tenant_id": tenant_id, "kpi": kpi}


