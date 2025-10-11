from fastapi import APIRouter, Body
from typing import Any, Dict, List

router = APIRouter(prefix="/api/v2/agent", tags=["coding-agent"])

def _plan_from_goal(goal: str) -> List[str]:
    steps: List[str] = []
    if goal:
        steps.append("Search codebase for relevant modules")
        steps.append("Propose diff (dry-run) for smallest valuable change")
        steps.append("List tests to add or update")
    return steps

@router.post("/execute")
def execute(task: Dict[str, Any] = Body(...)):
    goal = task.get("goal", "")
    constraints = task.get("constraints", {})
    mode = constraints.get("mode", "dry-run")
    plan = _plan_from_goal(goal)
    return {
        "ok": True,
        "goal": goal,
        "mode": mode,
        "plan": plan,
        "diff": "",
        "notes": ["This is a minimal stub. Hook tools and diff generator next."]
    }


