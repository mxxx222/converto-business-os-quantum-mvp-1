"""
OCR AI API routes: scan, recent scans.
"""

from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from app.modules.vision.extractor_openai import extract_receipt_data
from app.modules.vision.classifier_ai import enrich
from app.modules.vision.automations import handle_ocr_event, _STORE

router = APIRouter(prefix="/api/v1/ocr", tags=["ocr-ai-v2"])


@router.post("/scan")
async def scan(
    file: UploadFile = File(...),
    tenant_id: str = Form(...),
    user_id: str = Form(...),
):
    """
    Enhanced OCR scan with AI classification.

    Args:
        file: Image file (JPEG, PNG, PDF)
        tenant_id: Tenant identifier
        user_id: User identifier

    Returns:
        Scan result with extracted data, classification, automation status
    """
    try:
        # Extract with Vision API
        raw = await extract_receipt_data(file)

        # Classify & enrich
        enriched = enrich(raw)

        # Handle automation
        result = await handle_ocr_event(tenant_id, user_id, enriched)

        return {"ok": True, "result": result}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/recent")
def recent(tenant_id: str):
    """
    Get recent scans for a tenant.

    Args:
        tenant_id: Tenant identifier

    Returns:
        List of recent scans (max 10)
    """
    rows = [r for r in _STORE["receipts"] if r["tenant_id"] == tenant_id]
    rows = sorted(rows, key=lambda x: x["created_at"], reverse=True)[:10]
    return {"items": rows}
