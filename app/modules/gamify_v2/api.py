"""
Gamify Layer v2 API Routes
"""

from fastapi import APIRouter, HTTPException
from app.models.gamify import GamifyEventIn, GamifyEvent, GamifyBalance, GamifyStats
from . import service


router = APIRouter(prefix="/api/v2/gamify", tags=["gamify-v2"])


@router.post("/event", response_model=GamifyEvent)
async def post_event(body: GamifyEventIn):
    """
    Record a gamification event

    Args:
        body: Event data (user_id, category, action, value)

    Returns:
        Created event with calculated points

    Example:
        POST /api/v2/gamify/event
        {
            "user_id": "user_123",
            "category": "finance",
            "action": "paid_invoice",
            "value": 2.0,
            "metadata": {"invoice_amount": 150.00}
        }
    """
    try:
        event = service.record_event(body)
        return event
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to record event: {str(e)}")


@router.get("/balance/{user_id}", response_model=GamifyBalance)
async def get_balance(user_id: str):
    """
    Get user gamification balance

    Args:
        user_id: User ID

    Returns:
        User balance (points, streak, level, achievements)
    """
    return service.get_balance(user_id)


@router.get("/events/{user_id}", response_model=list[GamifyEvent])
async def get_events(user_id: str, limit: int = 50):
    """
    Get user events (most recent first)

    Args:
        user_id: User ID
        limit: Maximum number of events to return (default: 50)

    Returns:
        List of user events
    """
    return service.get_events(user_id, limit)


@router.get("/stats/{user_id}", response_model=GamifyStats)
async def get_stats(user_id: str):
    """
    Get user gamification statistics

    Args:
        user_id: User ID

    Returns:
        User stats (total events, breakdown by category, achievements)
    """
    return service.get_stats(user_id)


@router.post("/spend")
async def spend_points(user_id: str, amount: float, reason: str = "reward_redemption"):
    """
    Spend points (for rewards, etc.)

    Args:
        user_id: User ID
        amount: Points to spend
        reason: Reason for spending

    Returns:
        Success status
    """
    success = service.spend_points(user_id, amount, reason)

    if not success:
        raise HTTPException(status_code=400, detail="Insufficient points")

    return {"status": "ok", "spent": amount, "reason": reason}


@router.get("/leaderboard")
async def get_leaderboard(limit: int = 10):
    """
    Get top users by lifetime points

    Args:
        limit: Number of users to return (default: 10)

    Returns:
        List of top users
    """
    all_balances = list(service.BALANCES.values())
    sorted_balances = sorted(all_balances, key=lambda b: b.lifetime_points, reverse=True)[:limit]

    return [
        {
            "user_id": b.user_id,
            "lifetime_points": b.lifetime_points,
            "level": b.level,
            "streak_days": b.streak_days,
        }
        for b in sorted_balances
    ]
