"""
Sales Documents Models (Quotes & Invoices)
"""

from datetime import date
from typing import Optional, List
from pydantic import BaseModel, Field


class DocLineIn(BaseModel):
    """Document line item (quote or invoice)"""
    sku: Optional[str] = Field(None, description="Stock keeping unit (if applicable)")
    description: str = Field(..., description="Line item description")
    qty: float = Field(..., description="Quantity")
    unit_price: float = Field(..., description="Unit price in EUR")
    vat_rate: float = Field(0.0, description="VAT rate (e.g., 25.5 for 25.5%)")


class QuoteIn(BaseModel):
    """Input model for creating quote"""
    quote_no: str = Field(..., description="Quote number")
    customer: str = Field(..., description="Customer name")
    valid_until: date = Field(..., description="Quote valid until date")
    currency: str = Field("EUR", description="Currency code")
    lines: List[DocLineIn] = Field(..., description="Quote line items")
    send_to_notion: bool = Field(False, description="Push to Notion database")


class InvoiceIn(BaseModel):
    """Input model for creating invoice"""
    invoice_no: str = Field(..., description="Invoice number")
    customer: str = Field(..., description="Customer name")
    due_date: date = Field(..., description="Payment due date")
    currency: str = Field("EUR", description="Currency code")
    lines: List[DocLineIn] = Field(..., description="Invoice line items")
    reference: Optional[str] = Field(None, description="Reference (e.g., quote number)")
    send_to_notion: bool = Field(False, description="Push to Notion database")


class QuoteToInvoiceIn(BaseModel):
    """Input model for converting quote to invoice"""
    quote_no: str = Field(..., description="Quote number to convert")
    invoice_no: str = Field(..., description="New invoice number")
    due_date: date = Field(..., description="Payment due date")
    send_to_notion: bool = Field(False, description="Push to Notion database")

