# 📊 Metrics Route - Converto Business OS
from fastapi import APIRouter, Response

from app.core.metrics import get_metrics, get_metrics_content_type

router = APIRouter()


@router.get("/metrics")
async def metrics() -> Response:
    """Prometheus metrics endpoint"""
    return Response(content=get_metrics(), media_type=get_metrics_content_type())
