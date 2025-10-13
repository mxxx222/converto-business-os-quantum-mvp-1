"""
Email Sending Service
Supports Resend and Mailgun with multipart text/html
"""

import os
import re
import html
import httpx
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from pathlib import Path


SENDER_EMAIL = os.getenv("SENDER_EMAIL", "support@converto.fi")
RESEND_API_KEY = os.getenv("RESEND_API_KEY", "")
MAILGUN_DOMAIN = os.getenv("MAILGUN_DOMAIN", "")
MAILGUN_API_KEY = os.getenv("MAILGUN_API_KEY", "")


def html_to_text(html_str: str) -> str:
    """Convert HTML to plain text"""
    # Remove script and style tags
    text = re.sub(r"<(script|style).*?</\1>", "", html_str, flags=re.S | re.I)
    
    # Convert common tags
    text = re.sub(r"<br\s*/?>", "\n", text, flags=re.I)
    text = re.sub(r"</p>", "\n\n", text, flags=re.I)
    text = re.sub(r"</li>", "\n", text, flags=re.I)
    text = re.sub(r"</h[1-6]>", "\n\n", text, flags=re.I)
    
    # Remove all HTML tags
    text = re.sub(r"<[^>]+>", "", text)
    
    # Decode HTML entities
    text = html.unescape(text)
    
    # Clean up whitespace
    text = re.sub(r"\n{3,}", "\n\n", text).strip()
    
    return text


def build_multipart(subject: str, html_body: str, from_email: str, to_email: str) -> MIMEMultipart:
    """Build multipart email (text + HTML)"""
    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = from_email
    msg["To"] = to_email
    
    # Plain text version
    text_body = html_to_text(html_body)
    msg.attach(MIMEText(text_body, "plain", "utf-8"))
    
    # HTML version
    msg.attach(MIMEText(html_body, "html", "utf-8"))
    
    return msg


async def send_via_resend(subject: str, html_body: str, to_email: str) -> dict:
    """Send email via Resend"""
    if not RESEND_API_KEY:
        raise ValueError("RESEND_API_KEY not configured")
    
    text_body = html_to_text(html_body)
    
    async with httpx.AsyncClient(timeout=15) as client:
        response = await client.post(
            "https://api.resend.com/emails",
            headers={
                "Authorization": f"Bearer {RESEND_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "from": SENDER_EMAIL,
                "to": [to_email],
                "subject": subject,
                "html": html_body,
                "text": text_body
            }
        )
        
        response.raise_for_status()
        return response.json()


async def send_via_mailgun(subject: str, html_body: str, to_email: str) -> dict:
    """Send email via Mailgun"""
    if not MAILGUN_API_KEY or not MAILGUN_DOMAIN:
        raise ValueError("Mailgun credentials not configured")
    
    text_body = html_to_text(html_body)
    
    async with httpx.AsyncClient(timeout=15) as client:
        response = await client.post(
            f"https://api.mailgun.net/v3/{MAILGUN_DOMAIN}/messages",
            auth=("api", MAILGUN_API_KEY),
            data={
                "from": SENDER_EMAIL,
                "to": [to_email],
                "subject": subject,
                "text": text_body,
                "html": html_body
            }
        )
        
        response.raise_for_status()
        return response.json()


async def send_email(subject: str, html_body: str, to_email: str, provider: str = "auto") -> dict:
    """
    Send email using configured provider
    
    Args:
        subject: Email subject
        html_body: HTML body
        to_email: Recipient email
        provider: "resend", "mailgun", or "auto" (auto-detect)
        
    Returns:
        Response from email provider
    """
    # Auto-detect provider
    if provider == "auto":
        if RESEND_API_KEY:
            provider = "resend"
        elif MAILGUN_API_KEY and MAILGUN_DOMAIN:
            provider = "mailgun"
        else:
            raise ValueError("No email provider configured (RESEND_API_KEY or MAILGUN_*)")
    
    # Send via selected provider
    if provider == "resend":
        return await send_via_resend(subject, html_body, to_email)
    elif provider == "mailgun":
        return await send_via_mailgun(subject, html_body, to_email)
    else:
        raise ValueError(f"Unknown email provider: {provider}")

