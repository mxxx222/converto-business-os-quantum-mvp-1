"""
Gamify Layer v2 - Smart Habit Economy Models
"""

from datetime import datetime
from typing import Optional, Dict, Any
from pydantic import BaseModel, Field


class GamifyEventIn(BaseModel):
    """Input model for gamification event"""

    user_id: str = Field(..., description="User ID")
    category: str = Field(
        ..., description="Event category (finance, learning, health, productivity)"
    )
    action: str = Field(..., description="Action performed (e.g., paid_invoice, completed_task)")
    value: float = Field(1.0, description="Base value/weight of action")
    metadata: Optional[Dict[str, Any]] = Field(
        default_factory=dict, description="Additional metadata"
    )

    class Config:
        schema_extra = {
            "example": {
                "user_id": "user_123",
                "category": "finance",
                "action": "paid_invoice",
                "value": 2.0,
                "metadata": {"invoice_amount": 150.00},
            }
        }


class GamifyEvent(BaseModel):
    """Full gamification event with calculated points"""

    id: str
    user_id: str
    category: str
    action: str
    value: float
    points: float
    created_at: datetime


class GamifyBalance(BaseModel):
    """User gamification balance"""

    user_id: str
    total_points: float
    lifetime_points: float
    streak_days: int
    last_event: Optional[datetime]
    level: int = 1
    next_level_points: float = 100.0

    class Config:
        schema_extra = {
            "example": {
                "user_id": "user_123",
                "total_points": 245.5,
                "lifetime_points": 1250.0,
                "streak_days": 7,
                "level": 3,
                "next_level_points": 500.0,
            }
        }


class GamifyStats(BaseModel):
    """User gamification statistics"""

    user_id: str
    total_events: int
    events_by_category: Dict[str, int]
    points_by_category: Dict[str, float]
    best_streak: int
    current_streak: int
    achievements: list[str] = []
