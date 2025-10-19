"""
Notion Customs/Shipments Integration API
Endpoints for syncing customs declarations and shipments to Notion
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional
from app.integrations.notion_service import shipment_create


router = APIRouter(prefix="/api/v1/notion/customs", tags=["notion", "customs"])


class ShipmentIn(BaseModel):
    """Customs shipment data for Notion database"""

    id: str = Field(..., description="Shipment ID (e.g., IMP-2025-0001)")
    hs: Optional[str] = Field(None, description="HS code (harmonized system)")
    arvo_eur: Optional[float] = Field(0, description="Value in EUR")
    alv: Optional[float] = Field(0, description="VAT percentage")
    tulli: Optional[float] = Field(0, description="Customs duty percentage")
    lahtomaa: Optional[str] = Field(None, description="Country of origin (ISO code)")
    saapumapaiva: Optional[str] = Field(None, description="Arrival date (YYYY-MM-DD)")
    status: Optional[str] = Field("Draft", description="Status (Draft, Filed, Released, Delivered)")
    liite_url: Optional[str] = Field(None, description="Attachment URL (invoice, etc.)")

    class Config:
        schema_extra = {
            "example": {
                "id": "IMP-2025-0001",
                "hs": "8507.60",
                "arvo_eur": 12000.00,
                "alv": 25.5,
                "tulli": 2.2,
                "lahtomaa": "CN",
                "saapumapaiva": "2025-11-05",
                "status": "Filed",
                "liite_url": "https://example.com/invoice.pdf",
            }
        }


@router.post("/shipment")
async def create_shipment(body: ShipmentIn):
    """
    Create customs/shipment entry in Notion

    Args:
        body: Shipment data (ID, HS code, value, duties, etc.)

    Returns:
        Created Notion page object

    Raises:
        HTTPException: If Notion API call fails
    """
    try:
        result = shipment_create(body.dict())
        return {
            "status": "ok",
            "notion_page_id": result.get("id"),
            "url": result.get("url"),
            "message": f"Shipment {body.id} created in Notion",
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create shipment: {str(e)}")
