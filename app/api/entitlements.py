"""
Entitlements API
Check and manage feature access based on subscription tier
"""

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Dict, Optional
from app.api.auth_magic import require_auth


router = APIRouter(prefix="/api/v1/entitlements", tags=["entitlements"])


# Mock entitlements (replace with database in production)
TENANT_ENTITLEMENTS: Dict[str, dict] = {
    "tenant_demo": {
        "tier": "pro",
        "modules": {
            "ai_chat": True,
            "notion_sync": True,
            "whatsapp": True,
            "bank_sync": False,
            "logistics": False,
            "legal_ml": False,
        },
        "limits": {
            "ocr_scans_per_month": 500,
            "ai_tokens_per_month": 400000,
            "ai_chat_queries_per_month": 100,
            "users": 3,
        },
        "usage": {"ocr_scans_used": 42, "ai_tokens_used": 12500, "ai_chat_queries_used": 15},
    }
}


class EntitlementsResponse(BaseModel):
    """Entitlements response model"""

    tier: str
    modules: Dict[str, bool]
    limits: Dict[str, int]
    usage: Dict[str, int]


@router.get("/{tenant_id}", response_model=EntitlementsResponse)
async def get_entitlements(tenant_id: str):
    """Get entitlements for tenant"""
    entitlements = TENANT_ENTITLEMENTS.get(tenant_id)

    if not entitlements:
        # Return default (Starter) for unknown tenants
        return EntitlementsResponse(
            tier="starter",
            modules={
                "ai_chat": False,
                "notion_sync": False,
                "whatsapp": False,
                "bank_sync": False,
                "logistics": False,
                "legal_ml": False,
            },
            limits={
                "ocr_scans_per_month": 150,
                "ai_tokens_per_month": 150000,
                "ai_chat_queries_per_month": 0,
                "users": 1,
            },
            usage={"ocr_scans_used": 0, "ai_tokens_used": 0, "ai_chat_queries_used": 0},
        )

    return EntitlementsResponse(**entitlements)


@router.get("/{tenant_id}/feature/{feature_name}")
async def check_feature(tenant_id: str, feature_name: str):
    """Check if specific feature is enabled"""
    entitlements = TENANT_ENTITLEMENTS.get(tenant_id, {})
    modules = entitlements.get("modules", {})
    enabled = modules.get(feature_name, False)

    return {"tenant_id": tenant_id, "feature": feature_name, "enabled": enabled}


@router.post("/{tenant_id}/usage/{metric}")
async def increment_usage(tenant_id: str, metric: str, amount: int = 1):
    """Increment usage metric"""
    if tenant_id not in TENANT_ENTITLEMENTS:
        raise HTTPException(status_code=404, detail="Tenant not found")

    usage = TENANT_ENTITLEMENTS[tenant_id].get("usage", {})

    if metric not in usage:
        raise HTTPException(status_code=400, detail=f"Unknown metric: {metric}")

    usage[metric] = usage.get(metric, 0) + amount

    # Check limits
    limits = TENANT_ENTITLEMENTS[tenant_id].get("limits", {})
    limit_key = metric.replace("_used", "_per_month")

    if limit_key in limits and usage[metric] > limits[limit_key]:
        return {
            "usage": usage[metric],
            "limit": limits[limit_key],
            "exceeded": True,
            "message": f"Limit exceeded for {metric}",
        }

    return {"usage": usage[metric], "limit": limits.get(limit_key), "exceeded": False}


def require_feature(feature_name: str):
    """Dependency for requiring specific feature"""

    async def check(tenant_id: str = "tenant_demo"):
        entitlements = TENANT_ENTITLEMENTS.get(tenant_id, {})
        modules = entitlements.get("modules", {})

        if not modules.get(feature_name, False):
            raise HTTPException(
                status_code=403,
                detail=f"Feature '{feature_name}' requires upgrade. Visit /billing to unlock.",
            )

        return tenant_id

    return check
