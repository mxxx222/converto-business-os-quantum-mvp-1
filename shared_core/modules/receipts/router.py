from __future__ import annotations

from datetime import datetime
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile

router = APIRouter(prefix="/api/v1/receipts", tags=["receipts"])


@router.post("/scan")
async def scan_receipt(file: UploadFile = File(...)) -> Dict[str, Any]:
    if not file:
        raise HTTPException(status_code=400, detail="file_required")
    # Minimal mock implementation; integrate OCR pipeline later
    content = await file.read()
    size = len(content)
    receipt_id = f"rcpt_{int(datetime.utcnow().timestamp())}"
    data = {
        "id": receipt_id,
        "vendor": "Tuntematon",
        "total_amount": 0.0,
        "vat_amount": 0.0,
        "vat_rate": 24,
        "net_amount": 0.0,
        "receipt_date": datetime.utcnow().date().isoformat(),
        "invoice_number": None,
        "payment_method": None,
        "currency": "EUR",
        "items": [],
        "category": "other",
        "subcategory": None,
        "tags": [],
        "confidence": 0.5,
        "status": "processed",
    }
    return {
        "success": True,
        "receipt_id": receipt_id,
        "data": data,
        "vision_ai": {
            "model": "mock",
            "processing_time_ms": 0,
            "confidence": 0.0,
        },
        "file_info": {"name": file.filename, "size": size, "content_type": file.content_type},
    }


@router.get("/")
async def list_receipts(limit: int = 50, offset: int = 0) -> List[Dict[str, Any]]:
    # Placeholder list endpoint
    return []


@router.get("/stats")
async def receipts_stats() -> Dict[str, Any]:
    return {
        "total_receipts": 0,
        "total_amount": 0.0,
        "total_vat": 0.0,
        "categories": [],
        "average_confidence": 0.0,
    }

