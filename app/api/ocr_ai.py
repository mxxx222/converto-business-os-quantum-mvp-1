"""
OCR AI endpoints: enhanced scanning, classification, hotkey commands.
"""
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends, Body
from typing import Optional
from app.core.auth import tenant_ctx
from app.modules.vision.extractor_openai import extract_receipt_data
from app.modules.vision.automations import handle_ocr_event
from app.modules.vision.hotkeys import interpret_command, get_hotkey_map

router = APIRouter(prefix="/api/v1/ocr-ai", tags=["ocr-ai"])


@router.post("/scan")
async def scan_receipt(
    file: UploadFile = File(...),
    auto_confirm: bool = Form(False),
    ctx: dict = Depends(tenant_ctx),
):
    """
    Enhanced OCR scan with AI classification and automation.
    
    Args:
        file: Image file (JPEG, PNG)
        auto_confirm: If True, automatically create entry and award points
        ctx: Tenant context (from JWT)
    
    Returns:
        Extracted data + classification + automation results
    """
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(415, "Only images supported")
    
    content = await file.read()
    
    # Extract data with Vision API
    data = await extract_receipt_data(content)
    
    # If auto_confirm, trigger automations
    if auto_confirm:
        result = await handle_ocr_event(ctx["tenant_id"], ctx["user_id"], data)
        return {"status": "confirmed", **result}
    
    # Otherwise, return for preview
    return {"status": "preview", "data": data}


@router.post("/command")
async def execute_command(
    command: str = Body(..., embed=True),
    ctx: dict = Depends(tenant_ctx),
):
    """
    Interpret and execute a natural language command.
    
    Args:
        command: Natural language command (e.g., "skannaa kuitti", "lähetä raportti")
        ctx: Tenant context
    
    Returns:
        Interpreted action + execution result
    """
    interpretation = await interpret_command(command)
    
    # Execute action based on interpretation
    action = interpretation.get("action")
    
    if action == "scan_receipt":
        return {"message": "Avaa kamera tai valitse tiedosto skannataksesi kuitti", "action": action}
    elif action == "show_last_scan":
        # TODO: fetch last scan from DB
        return {"message": "Viimeisin skannaus ladataan...", "action": action}
    elif action == "export_csv":
        return {"message": "CSV-vienti käynnistetään...", "action": action, "url": "/api/v1/ocr/results.csv"}
    elif action == "send_report":
        params = interpretation.get("params", {})
        target = params.get("target", "slack")
        return {"message": f"Lähetetään raportti → {target}", "action": action}
    else:
        return {"message": "Komentoa ei tunnistettu", "action": "unknown", "interpretation": interpretation}


@router.get("/hotkeys")
async def list_hotkeys():
    """
    List available hotkeys and their actions.
    """
    return get_hotkey_map()

