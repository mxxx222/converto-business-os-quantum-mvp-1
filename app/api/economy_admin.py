from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
import yaml
import os

router = APIRouter(prefix="/api/v1/economy", tags=["economy-admin"])

WEIGHTS_FILE = os.getenv("ECONOMY_WEIGHTS_PATH", "config/weights.yaml")


class Weight(BaseModel):
    event: str
    points: int
    multiplier: float = 1.0
    streak_bonus: int = 0
    active: bool = True


def _load_weights() -> List[Weight]:
    if not os.path.exists(WEIGHTS_FILE):
        return []
    with open(WEIGHTS_FILE, "r", encoding="utf-8") as f:
        data = yaml.safe_load(f) or []
    return [Weight(**d) for d in data]


def _save_weights(weights: List[dict]):
    os.makedirs(os.path.dirname(WEIGHTS_FILE), exist_ok=True)
    with open(WEIGHTS_FILE, "w", encoding="utf-8") as f:
        yaml.safe_dump(weights, f, default_flow_style=False, allow_unicode=True)


@router.get("/weights")
def get_weights():
    """Get all event weights."""
    return [w.dict() for w in _load_weights()]


@router.post("/weights/{event}")
def post_weight(event: str, body: Weight):
    """Update or create an event weight."""
    weights = [w.dict() for w in _load_weights()]
    updated = False
    for i, w in enumerate(weights):
        if w["event"] == event:
            weights[i] = body.dict()
            updated = True
            break
    if not updated:
        weights.append(body.dict())
    _save_weights(weights)
    return {"status": "ok", "event": event}


@router.delete("/weights/{event}")
def delete_weight(event: str):
    """Delete an event weight."""
    weights = [w.dict() for w in _load_weights()]
    weights = [w for w in weights if w["event"] != event]
    _save_weights(weights)
    return {"status": "deleted", "event": event}
