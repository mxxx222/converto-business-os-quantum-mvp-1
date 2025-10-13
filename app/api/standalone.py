"""
Standalone Mode API
Backup, export, import, and inbox endpoints
"""

from fastapi import APIRouter, HTTPException, UploadFile, File
from fastapi.responses import FileResponse
from app.services.backup import create_full_export_zip, import_from_export
from app.services.reports import generate_vat_csv, generate_vat_pdf, generate_ical_reminders
from app.services.inbox import get_messages, mark_read, create_vat_reminder, create_receipt_reminder
from pathlib import Path


router = APIRouter(prefix="/api/v1/standalone", tags=["standalone"])


@router.post("/export/{tenant_id}")
async def export_data(tenant_id: str):
    """
    Create full data export (DB + files + metadata)
    
    Returns download link to ZIP file
    """
    try:
        export_file = create_full_export_zip(tenant_id)
        
        return {
            "status": "ok",
            "export_file": str(export_file),
            "download_url": f"/api/v1/standalone/download/{export_file.name}",
            "size_mb": export_file.stat().st_size / 1024 / 1024
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Export failed: {str(e)}")


@router.get("/download/{filename}")
async def download_export(filename: str):
    """Download export file"""
    file_path = Path("backups") / filename
    
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Export file not found")
    
    return FileResponse(
        path=file_path,
        filename=filename,
        media_type="application/zip"
    )


@router.post("/import/{tenant_id}")
async def import_data(tenant_id: str, file: UploadFile = File(...), dry_run: bool = True):
    """
    Import data from export ZIP
    
    Args:
        tenant_id: Target tenant ID
        file: Export ZIP file
        dry_run: If true, only validate without importing
    """
    import tempfile
    
    try:
        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=".zip") as tmp:
            content = await file.read()
            tmp.write(content)
            tmp_path = Path(tmp.name)
        
        # Import
        report = import_from_export(tmp_path, dry_run=dry_run)
        
        # Cleanup
        tmp_path.unlink()
        
        return report
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Import failed: {str(e)}")


@router.get("/reports/vat/{tenant_id}/csv")
async def download_vat_csv(tenant_id: str, month: str):
    """Download VAT report as CSV"""
    csv_bytes = generate_vat_csv(tenant_id, month)
    
    from fastapi.responses import Response
    return Response(
        content=csv_bytes,
        media_type="text/csv",
        headers={
            "Content-Disposition": f"attachment; filename=vat_report_{month}.csv"
        }
    )


@router.get("/reports/vat/{tenant_id}/pdf")
async def download_vat_pdf(tenant_id: str, month: str):
    """Download VAT report as PDF"""
    pdf_bytes = generate_vat_pdf(tenant_id, month)
    
    from fastapi.responses import Response
    return Response(
        content=pdf_bytes,
        media_type="text/html",  # For MVP: HTML (can be printed to PDF)
        headers={
            "Content-Disposition": f"attachment; filename=vat_report_{month}.html"
        }
    )


@router.get("/calendar/{tenant_id}")
async def download_calendar(tenant_id: str):
    """Download iCal calendar with reminders"""
    ical = generate_ical_reminders(tenant_id)
    
    from fastapi.responses import Response
    return Response(
        content=ical.encode("utf-8"),
        media_type="text/calendar",
        headers={
            "Content-Disposition": f"attachment; filename=converto_reminders.ics"
        }
    )


@router.get("/inbox/{tenant_id}")
async def get_inbox(tenant_id: str, user_id: str = None, unread_only: bool = False):
    """Get inbox messages"""
    messages = get_messages(tenant_id, user_id, unread_only)
    return {"messages": [msg.dict() for msg in messages]}


@router.post("/inbox/{message_id}/read")
async def mark_message_read(message_id: str):
    """Mark message as read"""
    success = mark_read(message_id)
    
    if not success:
        raise HTTPException(status_code=404, detail="Message not found")
    
    return {"status": "ok"}


@router.post("/inbox/{tenant_id}/create-reminder")
async def create_reminder(tenant_id: str, type: str = "vat"):
    """Create reminder manually"""
    if type == "vat":
        msg = create_vat_reminder(tenant_id)
    elif type == "receipts":
        msg = create_receipt_reminder(tenant_id, count=5)
    else:
        raise HTTPException(status_code=400, detail="Unknown reminder type")
    
    return {"status": "ok", "message": msg.dict()}

