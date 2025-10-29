"""Content Security Policy routes."""

from fastapi import APIRouter

router = APIRouter()


@router.get("/csp")
async def csp_info():
    """Get CSP information."""
    return {"csp": "Content Security Policy enabled"}