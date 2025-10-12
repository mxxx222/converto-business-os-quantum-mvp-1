"""
Notion Inventory Integration API
Endpoints for syncing inventory/stock data to Notion
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional
from app.integrations.notion_service import inventory_create, inventory_adjust


router = APIRouter(prefix="/api/v1/notion/inventory", tags=["notion", "inventory"])


class InventoryItemIn(BaseModel):
    """Inventory item data for Notion database"""
    sku: str = Field(..., description="Stock keeping unit (unique ID)")
    nimi: Optional[str] = Field(None, description="Product name")
    kategoria: Optional[str] = Field(None, description="Category (e.g., Laitteet, Komponentit)")
    varastosaldo: Optional[int] = Field(0, description="Current stock level")
    yksikkokustannus: Optional[float] = Field(0, description="Unit cost in EUR")
    halytysraja: Optional[int] = Field(0, description="Alert threshold")
    toimittaja: Optional[str] = Field(None, description="Supplier name")
    
    class Config:
        schema_extra = {
            "example": {
                "sku": "SKU-1001",
                "nimi": "Akku 600Wh",
                "kategoria": "Laitteet",
                "varastosaldo": 10,
                "yksikkokustannus": 199.00,
                "halytysraja": 3,
                "toimittaja": "ACME Batteries"
            }
        }


class StockAdjustmentIn(BaseModel):
    """Stock adjustment data"""
    sku: str = Field(..., description="Stock keeping unit")
    delta: int = Field(..., description="Change amount (+ or -)")
    notes: Optional[str] = Field(None, description="Optional notes")
    
    class Config:
        schema_extra = {
            "example": {
                "sku": "SKU-1001",
                "delta": 5,
                "notes": "Received new shipment"
            }
        }


@router.post("/create")
async def create_inventory_item(body: InventoryItemIn):
    """
    Create new inventory item in Notion
    
    Args:
        body: Inventory item data
        
    Returns:
        Created Notion page object
        
    Raises:
        HTTPException: If Notion API call fails
    """
    try:
        result = inventory_create(body.dict())
        return {
            "status": "ok",
            "notion_page_id": result.get("id"),
            "url": result.get("url"),
            "message": "Inventory item created in Notion"
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create inventory item: {str(e)}")


@router.post("/adjust")
async def adjust_stock(body: StockAdjustmentIn):
    """
    Adjust inventory stock level
    
    Creates an audit entry in Notion showing the stock change
    
    Args:
        body: Stock adjustment data (SKU, delta, notes)
        
    Returns:
        Created Notion audit entry
        
    Raises:
        HTTPException: If Notion API call fails
    """
    try:
        result = inventory_adjust(body.sku, body.delta, body.notes or "")
        return {
            "status": "ok",
            "notion_page_id": result.get("id"),
            "url": result.get("url"),
            "message": f"Stock adjusted: {body.sku} {body.delta:+d}"
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to adjust stock: {str(e)}")

