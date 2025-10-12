"""
Feature Flags System
Control feature availability at runtime
"""

import os
from functools import wraps
from fastapi import HTTPException


def is_enabled(feature: str) -> bool:
    """
    Check if a feature is enabled
    
    Args:
        feature: Feature name (e.g., "gamify", "rewards", "p2e")
        
    Returns:
        True if feature is enabled (env var = "1"), False otherwise
        
    Example:
        if is_enabled("gamify"):
            # Show gamify widget
    """
    env_key = f"FEATURES_{feature.upper()}"
    return os.getenv(env_key, "0") == "1"


def require_feature(feature: str):
    """
    Decorator to require a feature to be enabled
    
    Args:
        feature: Feature name
        
    Raises:
        HTTPException 403 if feature is not enabled
        
    Example:
        @router.post("/rewards/redeem")
        @require_feature("rewards")
        async def redeem_reward(...):
            ...
    """
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            if not is_enabled(feature):
                raise HTTPException(
                    status_code=403,
                    detail=f"Feature '{feature}' is not enabled. Contact support for access."
                )
            return await func(*args, **kwargs)
        return wrapper
    return decorator


# Feature registry
FEATURES = {
    "gamify": {
        "name": "Gamification",
        "description": "Points, streaks, and achievements",
        "default": True
    },
    "rewards": {
        "name": "Rewards Catalog",
        "description": "Redeem points for rewards",
        "default": False
    },
    "p2e": {
        "name": "Play-to-Earn",
        "description": "Token economy and quests",
        "default": False
    },
    "legal_sync": {
        "name": "Legal Compliance Sync",
        "description": "Automatic Finlex updates",
        "default": True
    },
    "customs": {
        "name": "Customs & Logistics",
        "description": "HS codes and shipment tracking",
        "default": False
    }
}


def get_all_features() -> dict:
    """
    Get all features and their status
    
    Returns:
        Dict of features with status
    """
    return {
        name: {
            **config,
            "enabled": is_enabled(name)
        }
        for name, config in FEATURES.items()
    }

