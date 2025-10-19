from fastapi import APIRouter, Body

router = APIRouter(prefix="/api/v1/ai/guardian", tags=["ai-guardian"])


@router.post("/review")
def review(code: str = Body(..., embed=True)):
    return {"ok": True, "issues": [{"line": 1, "type": "style", "hint": "Use snake_case"}]}
