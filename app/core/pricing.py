"""
Pricing & Entitlements Service
Load pricing from YAML and manage tier-based features
"""

import os
import yaml
from pathlib import Path
from typing import Dict, List, Optional


# Load pricing configuration
CONFIG_PATH = Path(__file__).parent.parent.parent / "config" / "pricing_tiers.yaml"

try:
    with open(CONFIG_PATH, "r", encoding="utf-8") as f:
        PRICING_CONFIG = yaml.safe_load(f)
except FileNotFoundError:
    print(f"Warning: Pricing config not found at {CONFIG_PATH}")
    PRICING_CONFIG = {"tiers": {}, "modules": {}}


def get_all_tiers() -> Dict:
    """Get all pricing tiers"""
    return PRICING_CONFIG.get("tiers", {})


def get_tier(tier_name: str) -> Optional[Dict]:
    """Get specific pricing tier"""
    return PRICING_CONFIG.get("tiers", {}).get(tier_name)


def get_tier_price(tier_name: str) -> int:
    """Get price for tier (in EUR)"""
    tier = get_tier(tier_name)
    return tier.get("price", 0) if tier else 0


def get_tier_modules(tier_name: str) -> List[str]:
    """Get included modules for tier"""
    tier = get_tier(tier_name)
    return tier.get("includes", []) if tier else []


def get_tier_limits(tier_name: str) -> Dict:
    """Get usage limits for tier"""
    tier = get_tier(tier_name)
    return tier.get("limits", {}) if tier else {}


def get_all_modules() -> Dict:
    """Get all available modules"""
    return PRICING_CONFIG.get("modules", {})


def get_module(module_name: str) -> Optional[Dict]:
    """Get specific module configuration"""
    return PRICING_CONFIG.get("modules", {}).get(module_name)


def get_module_env_flags(module_name: str) -> List[str]:
    """Get environment flags for module"""
    module = get_module(module_name)
    return module.get("env_flags", []) if module else []


def get_module_price(module_name: str) -> Optional[int]:
    """Get add-on price for module (if applicable)"""
    module = get_module(module_name)
    return module.get("addon_price") if module else None


def calculate_tier_cost(tier_name: str) -> Dict:
    """Calculate cost structure for tier"""
    costs = PRICING_CONFIG.get("cost_per_tier", {}).get(tier_name, {})
    return costs


def get_bundles() -> Dict:
    """Get bundled offers"""
    return PRICING_CONFIG.get("bundles", {})


def tier_includes_module(tier_name: str, module_name: str) -> bool:
    """Check if tier includes specific module"""
    modules = get_tier_modules(tier_name)
    return module_name in modules


def calculate_roi(module_name: str) -> Optional[Dict]:
    """
    Calculate ROI for a module
    
    Returns:
        ROI data (time saved, value, cost, percentage)
    """
    # Hardcoded ROI estimates (could be in YAML)
    roi_data = {
        "notion_sync": {
            "time_saved_hours": 2,
            "hourly_rate": 30,
            "monthly_value": 60,
            "cost": 9,
            "roi_percent": 600
        },
        "bank_sync": {
            "time_saved_hours": 4,
            "hourly_rate": 30,
            "monthly_value": 120,
            "cost": 15,
            "roi_percent": 700
        },
        "whatsapp_notify": {
            "retention_improvement": 0.20,
            "churn_reduction_value": 50,
            "cost": 9,
            "roi_percent": 456
        }
    }
    
    return roi_data.get(module_name)

