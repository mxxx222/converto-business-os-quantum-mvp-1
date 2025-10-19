"""
Smart Reminders Models
AI-guided notification system for receipts, VAT, invoices, etc.
"""

from datetime import datetime
from typing import Literal, Optional, Dict, Any
from pydantic import BaseModel, Field


Channel = Literal["email", "slack", "whatsapp", "signal"]
RuleType = Literal["missing_receipts", "vat_filing", "invoice_due", "custom"]


class ReminderRule(BaseModel):
    """Reminder rule configuration"""

    id: str = Field(..., description="Unique rule ID")
    tenant_id: str = Field(..., description="Tenant ID")
    type: RuleType = Field(..., description="Rule type")
    params: Dict[str, Any] = Field(default_factory=dict, description="Rule parameters")
    channel: Channel = Field("email", description="Notification channel")
    schedule: str = Field("daily@08:00", description="Schedule (human-readable cron)")
    active: bool = Field(True, description="Rule active status")
    ai_hint: Optional[str] = Field(None, description="AI context hint for optimization")

    class Config:
        schema_extra = {
            "example": {
                "id": "r_missing_receipts",
                "tenant_id": "tenant_demo",
                "type": "missing_receipts",
                "params": {"threshold": 3},
                "channel": "whatsapp",
                "schedule": "daily@08:00",
                "active": True,
                "ai_hint": "User responds best between 8-10 AM",
            }
        }


class ReminderJob(BaseModel):
    """Scheduled reminder job"""

    rule_id: str
    next_due: datetime
    last_run: Optional[datetime] = None
    run_count: int = 0


class ReminderLog(BaseModel):
    """Reminder execution log (audit trail)"""

    id: str
    rule_id: str
    tenant_id: str
    channel: Channel
    message: str
    sent_at: datetime
    result: Literal["ok", "failed", "skipped"]
    error: Optional[str] = None
    correlation_id: Optional[str] = None
