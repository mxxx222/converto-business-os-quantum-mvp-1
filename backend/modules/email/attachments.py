"""Email attachments support for Resend API."""

import os
import base64
from pathlib import Path
from typing import Optional
import httpx

RESEND_API_KEY = os.getenv("RESEND_API_KEY", "")
RESEND_API_BASE = "https://api.resend.com"


async def send_email_with_attachment(
    to: str | list[str],
    subject: str,
    html: str,
    attachment_path: str,
    attachment_name: Optional[str] = None,
    from_email: str = "info@converto.fi",
) -> dict:
    """
    Send email with attachment via Resend API.
    
    Args:
        to: Recipient email(s)
        subject: Email subject
        html: Email HTML content
        attachment_path: Path to attachment file
        attachment_name: Optional custom filename
        from_email: Sender email
    
    Returns:
        Email ID
    """
    if not RESEND_API_KEY:
        raise ValueError("RESEND_API_KEY not configured")

    # Read and encode file
    with open(attachment_path, "rb") as f:
        file_content = f.read()
        file_base64 = base64.b64encode(file_content).decode("utf-8")

    attachment_name = attachment_name or Path(attachment_path).name

    headers = {
        "Authorization": f"Bearer {RESEND_API_KEY}",
        "Content-Type": "application/json",
    }

    payload = {
        "from": from_email,
        "to": to if isinstance(to, list) else [to],
        "subject": subject,
        "html": html,
        "attachments": [
            {
                "filename": attachment_name,
                "content": file_base64,
            }
        ],
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{RESEND_API_BASE}/emails",
            headers=headers,
            json=payload,
        )
        response.raise_for_status()
        return response.json()

