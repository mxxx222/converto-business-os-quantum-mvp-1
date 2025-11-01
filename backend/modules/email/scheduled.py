"""Scheduled email functionality for Resend API."""

import os
from datetime import datetime, timedelta
from typing import Optional
import httpx

RESEND_API_KEY = os.getenv("RESEND_API_KEY", "")
RESEND_API_BASE = "https://api.resend.com"


async def schedule_email(
    to: str | list[str],
    subject: str,
    html: str,
    scheduled_at: datetime,
    from_email: str = "info@converto.fi",
    reply_to: Optional[str] = None,
) -> dict:
    """
    Schedule email for future delivery via Resend API.
    
    Args:
        to: Recipient email(s)
        subject: Email subject
        html: Email HTML content
        scheduled_at: When to send the email
        from_email: Sender email
        reply_to: Reply-to email
    
    Returns:
        Email ID and scheduled time
    """
    if not RESEND_API_KEY:
        raise ValueError("RESEND_API_KEY not configured")

    headers = {
        "Authorization": f"Bearer {RESEND_API_KEY}",
        "Content-Type": "application/json",
    }

    payload = {
        "from": from_email,
        "to": to if isinstance(to, list) else [to],
        "subject": subject,
        "html": html,
        "scheduled_at": scheduled_at.isoformat(),
    }

    if reply_to:
        payload["reply_to"] = reply_to

    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{RESEND_API_BASE}/emails",
            headers=headers,
            json=payload,
        )
        response.raise_for_status()
        return response.json()


async def schedule_welcome_sequence(
    email: str,
    name: str,
    company: str,
) -> list[dict]:
    """
    Schedule welcome email sequence (Day 1, 3, 7).
    
    Returns:
        List of scheduled email IDs
    """
    now = datetime.now()
    results = []

    # Day 1: Immediate (send now, not scheduled)
    # Day 3: Follow-up
    day3 = now + timedelta(days=3)
    result1 = await schedule_email(
        to=email,
        subject=f"{name}, kuinka eteneekä Business OS:lla?",
        html=f"<p>Hei {name},<br>Kysymyksiä? Vastaa tähän sähköpostiin!</p>",
        scheduled_at=day3,
    )
    results.append(result1)

    # Day 7: Final follow-up
    day7 = now + timedelta(days=7)
    result2 = await schedule_email(
        to=email,
        subject=f"{name}, tarvitsetko apua Business OS:lla?",
        html=f"<p>Hei {name},<br>Voimme auttaa optimoimaan käyttöäsi!</p>",
        scheduled_at=day7,
    )
    results.append(result2)

    return results

