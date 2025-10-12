"""
Shipping & Customs Models
"""

from datetime import date
from typing import Optional, List
from pydantic import BaseModel, Field


class ShipmentLineIn(BaseModel):
    """Shipment line item"""
    sku: str = Field(..., description="Stock keeping unit")
    qty: int = Field(..., description="Quantity")
    unit_cost: float = Field(..., description="Unit cost in EUR")


class ShipmentIn(BaseModel):
    """Input model for creating shipment"""
    shipment_id: str = Field(..., description="Unique shipment ID")
    supplier: Optional[str] = Field(None, description="Supplier name")
    eta: Optional[date] = Field(None, description="Estimated time of arrival")
    hs_code: Optional[str] = Field(None, description="HS code (harmonized system)")
    origin_country: Optional[str] = Field(None, description="Country of origin (ISO code)")
    note: Optional[str] = Field(None, description="Additional notes")
    lines: List[ShipmentLineIn] = Field(default_factory=list, description="Shipment line items")
    send_to_notion: bool = Field(False, description="Push to Notion database")


class ShipmentReceiveIn(BaseModel):
    """Input model for receiving shipment"""
    shipment_id: str = Field(..., description="Shipment ID to receive")
    received_date: Optional[date] = Field(None, description="Date received")
    send_to_notion: bool = Field(False, description="Update Notion database")

