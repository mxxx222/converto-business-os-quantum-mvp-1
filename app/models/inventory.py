"""
Inventory Management Models
"""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class InventoryItemIn(BaseModel):
    """Input model for creating inventory item"""
    sku: str = Field(..., description="Stock keeping unit (unique ID)")
    name: str = Field(..., description="Product name")
    category: Optional[str] = Field("Muu", description="Product category")
    unit_cost: float = Field(0.0, description="Unit cost in EUR")
    sale_price: float = Field(0.0, description="Sale price in EUR")
    stock: int = Field(0, description="Current stock level")
    reorder_point: int = Field(0, description="Reorder alert threshold")
    supplier: Optional[str] = Field(None, description="Supplier name")
    send_to_notion: bool = Field(False, description="Push to Notion database")


class InventoryItem(InventoryItemIn):
    """Full inventory item with metadata"""
    id: str
    created_at: datetime
    updated_at: datetime


class StockAdjustIn(BaseModel):
    """Input model for stock adjustment"""
    sku: str = Field(..., description="Stock keeping unit")
    delta: int = Field(..., description="Change amount (+ or -)")
    reason: Optional[str] = Field(None, description="Reason for adjustment")
    send_to_notion: bool = Field(False, description="Push to Notion database")

