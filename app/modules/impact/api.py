
from fastapi import APIRouter, Query
from fastapi.responses import PlainTextResponse
from .service import kpi_summary, kpi_cards, notion_prompts_markdown

router = APIRouter(prefix="/api/v1/impact", tags=["impact"])

@router.get("/summary")
def summary(tenant_id: str = Query("demo"), days: int = Query(30, ge=7, le=120)):
    kpi = kpi_summary(days)
    return {"tenant_id": tenant_id, "kpi": kpi, "cards": kpi_cards()}

@router.get("/export_notionsetup", response_class=PlainTextResponse)
def export_notionsetup():
    return PlainTextResponse(notion_prompts_markdown(), media_type="text/markdown")
