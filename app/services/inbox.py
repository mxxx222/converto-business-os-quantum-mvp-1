"""
Internal Inbox Service
In-app notifications without external integrations
"""

import uuid
from datetime import datetime
from typing import List, Literal, Optional
from pydantic import BaseModel


MessageType = Literal["info", "warning", "success", "error", "reminder"]


class InboxMessage(BaseModel):
    """Internal inbox message"""

    id: str
    tenant_id: str
    user_id: Optional[str] = None
    type: MessageType
    title: str
    body: str
    action_url: Optional[str] = None
    action_label: Optional[str] = None
    read: bool = False
    created_at: datetime
    expires_at: Optional[datetime] = None


# In-memory storage (replace with database)
INBOX: List[InboxMessage] = []


def create_message(
    tenant_id: str,
    type: MessageType,
    title: str,
    body: str,
    user_id: Optional[str] = None,
    action_url: Optional[str] = None,
    action_label: Optional[str] = None,
) -> InboxMessage:
    """
    Create inbox message

    Args:
        tenant_id: Tenant ID
        type: Message type (info, warning, success, error, reminder)
        title: Message title
        body: Message body
        user_id: Optional user ID (None = all users)
        action_url: Optional action URL
        action_label: Optional action button label

    Returns:
        Created message
    """
    message = InboxMessage(
        id=str(uuid.uuid4()),
        tenant_id=tenant_id,
        user_id=user_id,
        type=type,
        title=title,
        body=body,
        action_url=action_url,
        action_label=action_label,
        created_at=datetime.now(),
    )

    INBOX.append(message)
    return message


def get_messages(
    tenant_id: str, user_id: Optional[str] = None, unread_only: bool = False
) -> List[InboxMessage]:
    """Get messages for tenant/user"""
    messages = [
        msg
        for msg in INBOX
        if msg.tenant_id == tenant_id
        and (user_id is None or msg.user_id in (None, user_id))
        and (not unread_only or not msg.read)
    ]

    return sorted(messages, key=lambda m: m.created_at, reverse=True)


def mark_read(message_id: str) -> bool:
    """Mark message as read"""
    for msg in INBOX:
        if msg.id == message_id:
            msg.read = True
            return True
    return False


def create_vat_reminder(tenant_id: str):
    """Create VAT deadline reminder"""
    return create_message(
        tenant_id=tenant_id,
        type="reminder",
        title="🧾 ALV-ilmoitus lähestyy",
        body="Muista tehdä ALV-ilmoitus 12. päivään mennessä.",
        action_url="/vat",
        action_label="Tarkista ALV-yhteenveto",
    )


def create_receipt_reminder(tenant_id: str, count: int):
    """Create missing receipts reminder"""
    return create_message(
        tenant_id=tenant_id,
        type="warning",
        title=f"📸 {count} kuittia puuttuu",
        body=f"Sinulla on {count} skannaamatonta kuittia tältä viikolta.",
        action_url="/selko/ocr",
        action_label="Skannaa nyt",
    )


def create_level_up_notification(tenant_id: str, user_id: str, new_level: int):
    """Create gamify level up notification"""
    return create_message(
        tenant_id=tenant_id,
        user_id=user_id,
        type="success",
        title=f"🏆 Tason nousu! Level {new_level}",
        body=f"Onneksi olkoon! Olet saavuttanut tason {new_level}.",
        action_url="/dashboard",
        action_label="Näytä pisteet",
    )
