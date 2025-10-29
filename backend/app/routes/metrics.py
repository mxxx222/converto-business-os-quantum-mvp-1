"""Metrics routes for Prometheus."""

from fastapi import APIRouter

router = APIRouter()


@router.get("/metrics")
async def metrics():
    """Prometheus metrics endpoint."""
    return {"metrics": "Prometheus metrics endpoint"}