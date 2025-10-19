"""
Gamify Layer v2 - Smart Habit Economy Service
AI-driven behavior optimization and reward system
"""

import uuid
from datetime import datetime, timedelta
from typing import Dict, List, Optional
from app.models.gamify import GamifyEventIn, GamifyEvent, GamifyBalance, GamifyStats


# In-memory storage (replace with PostgreSQL/Redis in production)
BALANCES: Dict[str, GamifyBalance] = {}
EVENTS: List[GamifyEvent] = []


# Category weights (higher = more valuable)
CATEGORY_WEIGHTS = {
    "finance": 2.0,  # Financial responsibility
    "learning": 1.5,  # Education and growth
    "health": 1.2,  # Wellness and fitness
    "productivity": 1.0,  # Task completion
    "social": 0.8,  # Community engagement
}


# Achievement thresholds
ACHIEVEMENTS = {
    "first_step": {"threshold": 1, "name": "Ensimmäinen askel"},
    "streak_3": {"threshold": 3, "name": "3 päivän putki"},
    "streak_7": {"threshold": 7, "name": "Viikon voittaja"},
    "streak_30": {"threshold": 30, "name": "Kuukauden mestari"},
    "points_100": {"threshold": 100, "name": "Sata pistettä"},
    "points_500": {"threshold": 500, "name": "Viisisataa"},
    "points_1000": {"threshold": 1000, "name": "Tuhat pistettä"},
}


def _calculate_level(lifetime_points: float) -> tuple[int, float]:
    """Calculate level and next level threshold"""
    level = 1
    threshold = 100.0

    while lifetime_points >= threshold:
        level += 1
        threshold = level * 100.0  # Linear progression for MVP

    return level, threshold


def _check_achievements(balance: GamifyBalance) -> List[str]:
    """Check and award new achievements"""
    new_achievements = []

    # Streak achievements
    if balance.streak_days >= 30 and "streak_30" not in balance.achievements:
        new_achievements.append("streak_30")
    elif balance.streak_days >= 7 and "streak_7" not in balance.achievements:
        new_achievements.append("streak_7")
    elif balance.streak_days >= 3 and "streak_3" not in balance.achievements:
        new_achievements.append("streak_3")

    # Points achievements
    if balance.lifetime_points >= 1000 and "points_1000" not in balance.achievements:
        new_achievements.append("points_1000")
    elif balance.lifetime_points >= 500 and "points_500" not in balance.achievements:
        new_achievements.append("points_500")
    elif balance.lifetime_points >= 100 and "points_100" not in balance.achievements:
        new_achievements.append("points_100")

    # First event
    if len(EVENTS) == 1 and "first_step" not in balance.achievements:
        new_achievements.append("first_step")

    return new_achievements


def record_event(evt: GamifyEventIn) -> GamifyEvent:
    """
    Record a gamification event and update user balance

    Args:
        evt: Event data (user_id, category, action, value, metadata)

    Returns:
        Created event with calculated points
    """
    # Get or create user balance
    if evt.user_id not in BALANCES:
        BALANCES[evt.user_id] = GamifyBalance(
            user_id=evt.user_id,
            total_points=0.0,
            lifetime_points=0.0,
            streak_days=0,
            last_event=None,
            achievements=[],
        )

    balance = BALANCES[evt.user_id]
    now = datetime.utcnow()

    # Calculate base points
    weight = CATEGORY_WEIGHTS.get(evt.category, 1.0)
    base_points = evt.value * weight

    # Streak bonus calculation
    streak_bonus = 0.0
    if balance.last_event:
        days_diff = (now - balance.last_event).days

        if days_diff == 1:
            # Consecutive day - increment streak
            balance.streak_days += 1
        elif days_diff > 1:
            # Streak broken - reset
            balance.streak_days = 1
        # Same day - no change to streak
    else:
        # First event
        balance.streak_days = 1

    # Streak bonus: 5% per day, max 50%
    if balance.streak_days >= 3:
        streak_multiplier = min(0.05 * balance.streak_days, 0.5)
        streak_bonus = base_points * streak_multiplier

    # Total points
    total_points = base_points + streak_bonus

    # Update balance
    balance.total_points += total_points
    balance.lifetime_points += total_points
    balance.last_event = now

    # Calculate level
    balance.level, balance.next_level_points = _calculate_level(balance.lifetime_points)

    # Check achievements
    new_achievements = _check_achievements(balance)
    if new_achievements:
        balance.achievements.extend(new_achievements)

    # Create event record
    event = GamifyEvent(
        id=f"evt_{uuid.uuid4().hex[:8]}",
        user_id=evt.user_id,
        category=evt.category,
        action=evt.action,
        value=evt.value,
        points=total_points,
        created_at=now,
    )

    EVENTS.append(event)

    return event


def get_balance(user_id: str) -> GamifyBalance:
    """Get user gamification balance"""
    if user_id not in BALANCES:
        return GamifyBalance(
            user_id=user_id,
            total_points=0.0,
            lifetime_points=0.0,
            streak_days=0,
            last_event=None,
            achievements=[],
        )
    return BALANCES[user_id]


def get_events(user_id: str, limit: int = 50) -> List[GamifyEvent]:
    """Get user events (most recent first)"""
    user_events = [e for e in EVENTS if e.user_id == user_id]
    return sorted(user_events, key=lambda e: e.created_at, reverse=True)[:limit]


def get_stats(user_id: str) -> GamifyStats:
    """Get user gamification statistics"""
    user_events = [e for e in EVENTS if e.user_id == user_id]
    balance = get_balance(user_id)

    # Count events by category
    events_by_category: Dict[str, int] = {}
    points_by_category: Dict[str, float] = {}

    for event in user_events:
        events_by_category[event.category] = events_by_category.get(event.category, 0) + 1
        points_by_category[event.category] = (
            points_by_category.get(event.category, 0.0) + event.points
        )

    # Calculate best streak (simplified - would need date-based analysis in production)
    best_streak = balance.streak_days  # MVP: current streak = best streak

    return GamifyStats(
        user_id=user_id,
        total_events=len(user_events),
        events_by_category=events_by_category,
        points_by_category=points_by_category,
        best_streak=best_streak,
        current_streak=balance.streak_days,
        achievements=balance.achievements,
    )


def spend_points(user_id: str, amount: float, reason: str = "reward_redemption") -> bool:
    """
    Spend points (for rewards, etc.)

    Args:
        user_id: User ID
        amount: Points to spend
        reason: Reason for spending

    Returns:
        True if successful, False if insufficient balance
    """
    balance = get_balance(user_id)

    if balance.total_points < amount:
        return False

    balance.total_points -= amount

    # Record negative event for audit trail
    event = GamifyEvent(
        id=f"evt_{uuid.uuid4().hex[:8]}",
        user_id=user_id,
        category="system",
        action=reason,
        value=-amount,
        points=-amount,
        created_at=datetime.utcnow(),
    )
    EVENTS.append(event)

    return True
