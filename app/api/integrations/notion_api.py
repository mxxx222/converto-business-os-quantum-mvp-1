"""
Notion Integration API Routes
Endpoints for pushing receipts and calendar events to Notion
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional
from app.integrations.notion_service import (
    push_receipt,
    upsert_calendar_event,
    create_monthly_vat_reminder,
    test_connection,
)


router = APIRouter(prefix="/api/v1/notion", tags=["notion"])


class ReceiptIn(BaseModel):
    """Receipt data for Notion database"""

    date: str = Field(..., description="Receipt date (YYYY-MM-DD)")
    vendor: str = Field(..., description="Merchant name")
    amount: float = Field(..., description="Total amount in EUR")
    category: Optional[str] = Field(None, description="Category (e.g., Toimisto, Matkat)")
    image_url: Optional[str] = Field(None, description="Receipt image URL")
    status: Optional[str] = Field("New", description="Status (New, Reviewed, Exported)")

    class Config:
        schema_extra = {
            "example": {
                "date": "2025-10-12",
                "vendor": "K-Market",
                "amount": 12.34,
                "category": "Toimisto",
                "image_url": "https://example.com/receipt.jpg",
                "status": "New",
            }
        }


class EventIn(BaseModel):
    """Calendar event data for Notion database"""

    title: str = Field(..., description="Event title")
    start: str = Field(..., description="Start datetime (ISO 8601 with timezone)")
    end: Optional[str] = Field(None, description="End datetime (ISO 8601 with timezone)")
    location: Optional[str] = Field(None, description="Event location")
    notes: Optional[str] = Field(None, description="Event notes/description")
    status: Optional[str] = Field("Planned", description="Status (Planned, Done, Cancelled)")

    class Config:
        schema_extra = {
            "example": {
                "title": "ALV-kooste",
                "start": "2025-10-15T09:00:00+03:00",
                "end": "2025-10-15T10:00:00+03:00",
                "location": "HQ",
                "notes": "Tarkista kuukauden kuitit",
                "status": "Planned",
            }
        }


@router.get("/health")
async def health_check():
    """
    Check Notion API connection status

    Returns:
        Connection status and configuration info
    """
    connected = test_connection()
    return {
        "status": "ok" if connected else "error",
        "connected": connected,
        "message": (
            "Notion API connected" if connected else "Notion API not configured or unreachable"
        ),
    }


@router.post("/receipts")
async def create_receipt(body: ReceiptIn):
    """
    Push receipt data to Notion Receipts database

    Args:
        body: Receipt data (date, vendor, amount, etc.)

    Returns:
        Created Notion page object

    Raises:
        HTTPException: If Notion API call fails
    """
    try:
        result = push_receipt(body.dict())
        return {
            "status": "ok",
            "notion_page_id": result.get("id"),
            "url": result.get("url"),
            "message": "Receipt added to Notion",
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to push receipt to Notion: {str(e)}")


@router.post("/calendar/events")
async def create_event(body: EventIn):
    """
    Create calendar event in Notion Events database

    Args:
        body: Event data (title, start, end, location, notes)

    Returns:
        Created Notion page object

    Raises:
        HTTPException: If Notion API call fails
    """
    try:
        result = upsert_calendar_event(body.dict())
        return {
            "status": "ok",
            "notion_page_id": result.get("id"),
            "url": result.get("url"),
            "message": "Event added to Notion Calendar",
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create event in Notion: {str(e)}")


@router.post("/calendar/vat-reminder")
async def create_vat_reminder(year: int, month: int):
    """
    Create monthly VAT reminder event

    Args:
        year: Year (e.g., 2025)
        month: Month (1-12)

    Returns:
        Created Notion event page

    Raises:
        HTTPException: If Notion API call fails
    """
    try:
        if month < 1 or month > 12:
            raise ValueError("Month must be between 1 and 12")

        result = create_monthly_vat_reminder(year, month)
        return {
            "status": "ok",
            "notion_page_id": result.get("id"),
            "url": result.get("url"),
            "message": f"VAT reminder created for {year}-{month:02d}",
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create VAT reminder: {str(e)}")
