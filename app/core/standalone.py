"""
Standalone Core - Integration-free mode
Full functionality without external dependencies (Notion, WhatsApp, etc.)
"""

import os
from typing import Literal

Mode = Literal["standalone", "integrated"]

# Operating mode (default: standalone)
OPERATING_MODE = os.getenv("OPERATING_MODE", "standalone")


def is_standalone() -> bool:
    """Check if running in standalone mode (no integrations)"""
    return OPERATING_MODE == "standalone"


def is_integrated() -> bool:
    """Check if integrations are enabled"""
    return OPERATING_MODE == "integrated"


def require_standalone_or_fallback(func):
    """
    Decorator that ensures function works in standalone mode
    Falls back to internal implementation if integration is unavailable
    """
    def wrapper(*args, **kwargs):
        if is_standalone():
            # Use internal implementation
            return func(*args, **kwargs)
        else:
            # Try integration, fallback to internal if fails
            try:
                return func(*args, **kwargs)
            except Exception as e:
                print(f"Integration failed, using standalone: {e}")
                return func(*args, **kwargs)
    
    return wrapper


# Feature availability matrix
STANDALONE_FEATURES = {
    "ocr": True,              # Internal OCR (Tesseract + OpenAI)
    "vat": True,              # Internal VAT calculation
    "billing": True,          # Internal billing (Stripe optional)
    "reports": True,          # PDF/CSV generation (internal)
    "gamify": True,           # Internal points/streaks
    "reminders": True,        # Email + iCal (no WhatsApp/Slack)
    "legal": True,            # Internal legal tracking
    "auth": True,             # Magic link + TOTP
    "backup": True,           # DB dump + file archive
    "export": True,           # Full data export (ZIP)
    "import": True,           # Data import/migration
    "audit": True,            # Internal audit log
    "inbox": True,            # In-app notifications
    "calendar": True,         # iCal file generation
    "search": True,           # Internal full-text search
    "offline": True,          # PWA queue
}

INTEGRATION_FEATURES = {
    "notion": False,          # Optional (requires API key)
    "whatsapp": False,        # Optional (requires Twilio/Meta)
    "slack": False,           # Optional (requires webhook)
    "google_calendar": False, # Optional (requires OAuth)
    "bank_sync": False,       # Optional (requires Nordigen)
    "logistics": False,       # Optional (requires EasyPost)
}


def get_available_features() -> dict:
    """Get all available features in current mode"""
    features = STANDALONE_FEATURES.copy()
    
    if is_integrated():
        # Check which integrations are configured
        if os.getenv("NOTION_API_KEY"):
            features["notion"] = True
        if os.getenv("WA_META_TOKEN") or os.getenv("TWILIO_SID"):
            features["whatsapp"] = True
        if os.getenv("SLACK_WEBHOOK_URL"):
            features["slack"] = True
        # ... etc
    
    return features

