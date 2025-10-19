"""
Pricing API Endpoints
Public pricing information and tier comparisons
"""

from fastapi import APIRouter
from app.core.pricing import (
    get_all_tiers,
    get_tier,
    get_all_modules,
    get_module,
    get_bundles,
    tier_includes_module,
    calculate_roi,
)


router = APIRouter(prefix="/api/v1/pricing", tags=["pricing"])


@router.get("/tiers")
async def list_tiers():
    """
    Get all pricing tiers

    Returns:
        Dictionary of all tiers with prices and features
    """
    return {"currency": "EUR", "billing_cycle": "monthly", "tiers": get_all_tiers()}


@router.get("/tiers/{tier_name}")
async def get_tier_details(tier_name: str):
    """
    Get specific tier details

    Args:
        tier_name: Tier name (starter, pro, business, enterprise)

    Returns:
        Tier configuration
    """
    tier = get_tier(tier_name)

    if not tier:
        return {"error": "Tier not found"}

    return tier


@router.get("/modules")
async def list_modules():
    """
    Get all available modules

    Returns:
        Dictionary of all modules
    """
    return get_all_modules()


@router.get("/modules/{module_name}")
async def get_module_details(module_name: str):
    """
    Get specific module details

    Args:
        module_name: Module name

    Returns:
        Module configuration
    """
    module = get_module(module_name)

    if not module:
        return {"error": "Module not found"}

    return module


@router.get("/bundles")
async def list_bundles():
    """
    Get bundled offers

    Returns:
        Dictionary of bundle offers
    """
    return get_bundles()


@router.get("/roi/{module_name}")
async def get_module_roi(module_name: str):
    """
    Calculate ROI for a specific module

    Args:
        module_name: Module name

    Returns:
        ROI calculation (time saved, value, cost, percentage)
    """
    roi = calculate_roi(module_name)

    if not roi:
        return {"error": "ROI data not available for this module"}

    return roi


@router.get("/compare")
async def compare_tiers(current: str = "starter", target: str = "pro"):
    """
    Compare two tiers

    Args:
        current: Current tier name
        target: Target tier name

    Returns:
        Comparison with differences and upgrade benefits
    """
    current_tier = get_tier(current)
    target_tier = get_tier(target)

    if not current_tier or not target_tier:
        return {"error": "Invalid tier"}

    current_modules = set(current_tier.get("includes", []))
    target_modules = set(target_tier.get("includes", []))

    new_modules = target_modules - current_modules
    price_diff = target_tier["price"] - current_tier["price"]

    return {
        "current": current,
        "target": target,
        "price_difference": price_diff,
        "new_modules": list(new_modules),
        "new_features": [
            f for f in target_tier.get("features", []) if f not in current_tier.get("features", [])
        ],
    }
