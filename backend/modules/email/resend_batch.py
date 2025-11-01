"""Batch email sending for Resend API."""

import os
from typing import List, Dict, Any
import httpx

RESEND_API_KEY = os.getenv("RESEND_API_KEY", "")
RESEND_API_BASE = "https://api.resend.com"


async def send_batch_emails(emails: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Send multiple emails via Resend Batch API.
    
    Args:
        emails: List of email objects with:
            - from: str
            - to: str | List[str]
            - subject: str
            - html: str
            - (optional) scheduled_at: datetime ISO string
    
    Returns:
        Batch result with email IDs
    """
    if not RESEND_API_KEY:
        raise ValueError("RESEND_API_KEY not configured")

    headers = {
        "Authorization": f"Bearer {RESEND_API_KEY}",
        "Content-Type": "application/json",
    }

    # Format emails for batch API
    batch_data = []
    for email in emails:
        batch_email = {
            "from": email["from"],
            "to": email["to"] if isinstance(email["to"], list) else [email["to"]],
            "subject": email["subject"],
            "html": email["html"],
        }
        if "scheduled_at" in email:
            batch_email["scheduled_at"] = email["scheduled_at"]
        batch_data.append(batch_email)

    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{RESEND_API_BASE}/batch",
            headers=headers,
            json={"emails": batch_data},
        )
        response.raise_for_status()
        return response.json()

