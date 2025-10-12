"""
Unified Notification Service
Multi-channel messaging: Email, Slack, WhatsApp, Signal
"""

import os
import requests
import base64
from typing import Optional


def send_message(channel: str, tenant_id: str, text: str, ai_hint: Optional[str] = None) -> bool:
    """
    Send notification via specified channel
    
    Args:
        channel: Notification channel (email, slack, whatsapp, signal)
        tenant_id: Tenant ID for context
        text: Message text
        ai_hint: Optional AI context hint for optimization
        
    Returns:
        True if successful, False otherwise
    """
    try:
        if channel == "whatsapp":
            return _wa_send(text)
        elif channel == "slack":
            return _slack_send(text, tenant_id)
        elif channel == "email":
            return _email_send(text, tenant_id)
        elif channel == "signal":
            return _signal_send(text)
        else:
            print(f"[Notify] Unknown channel: {channel}")
            return False
    except Exception as e:
        print(f"[Notify] Error sending to {channel}: {e}")
        return False


def _wa_send(text: str) -> bool:
    """Send WhatsApp message"""
    provider = os.getenv("WA_PROVIDER", "meta")
    
    if provider == "meta":
        return _wa_meta(text)
    elif provider == "twilio":
        return _wa_twilio(text)
    else:
        print(f"[WhatsApp] Unknown provider: {provider}")
        return False


def _wa_meta(text: str) -> bool:
    """Send via Meta WhatsApp Cloud API"""
    token = os.getenv("WA_META_TOKEN")
    phone_id = os.getenv("WA_META_PHONE_ID")
    to = os.getenv("WA_TO_PHONE")
    
    if not all([token, phone_id, to]):
        print("[WhatsApp Meta] Missing configuration (WA_META_TOKEN, WA_META_PHONE_ID, WA_TO_PHONE)")
        return False
    
    url = f"https://graph.facebook.com/v20.0/{phone_id}/messages"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    data = {
        "messaging_product": "whatsapp",
        "to": to,
        "type": "text",
        "text": {"body": text[:4096]}  # WhatsApp limit
    }
    
    response = requests.post(url, headers=headers, json=data, timeout=10)
    response.raise_for_status()
    
    print(f"[WhatsApp Meta] Sent to {to}")
    return True


def _wa_twilio(text: str) -> bool:
    """Send via Twilio WhatsApp"""
    sid = os.getenv("TWILIO_SID")
    token = os.getenv("TWILIO_TOKEN")
    from_number = os.getenv("WA_TWILIO_FROM")
    to = os.getenv("WA_TO_PHONE")
    
    if not all([sid, token, from_number, to]):
        print("[WhatsApp Twilio] Missing configuration (TWILIO_SID, TWILIO_TOKEN, WA_TWILIO_FROM, WA_TO_PHONE)")
        return False
    
    url = f"https://api.twilio.com/2010-04-01/Accounts/{sid}/Messages.json"
    auth = base64.b64encode(f"{sid}:{token}".encode()).decode()
    headers = {"Authorization": f"Basic {auth}"}
    data = {
        "From": from_number,
        "To": to,
        "Body": text[:1600]  # Twilio limit
    }
    
    response = requests.post(url, headers=headers, data=data, timeout=10)
    response.raise_for_status()
    
    print(f"[WhatsApp Twilio] Sent to {to}")
    return True


def _slack_send(text: str, tenant_id: str) -> bool:
    """Send Slack message"""
    webhook_url = os.getenv("SLACK_WEBHOOK_URL")
    
    if not webhook_url:
        print("[Slack] Missing SLACK_WEBHOOK_URL")
        return False
    
    data = {
        "text": text,
        "username": "Converto Reminders",
        "icon_emoji": ":bell:"
    }
    
    response = requests.post(webhook_url, json=data, timeout=10)
    response.raise_for_status()
    
    print(f"[Slack] Sent to tenant {tenant_id}")
    return True


def _email_send(text: str, tenant_id: str) -> bool:
    """Send email (stub - implement with SendGrid/SES)"""
    # TODO: Implement email sending
    print(f"[Email] Would send to tenant {tenant_id}: {text[:50]}...")
    return True


def _signal_send(text: str) -> bool:
    """Send Signal message (stub - implement with signal-cli)"""
    # TODO: Implement Signal sending
    print(f"[Signal] Would send: {text[:50]}...")
    return True
