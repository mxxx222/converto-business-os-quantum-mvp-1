"""
Notion Integration Service for Converto Business OS
Handles automatic receipt logging and calendar event creation
"""

import os
import requests
from typing import Dict, Optional
from datetime import datetime


# Notion API Configuration
NOTION_KEY = os.getenv("NOTION_API_KEY", "")
RECEIPTS_DB = os.getenv("NOTION_RECEIPTS_DB", "")
EVENTS_DB = os.getenv("NOTION_EVENTS_DB", "")

HEADERS = {
    "Authorization": f"Bearer {NOTION_KEY}",
    "Notion-Version": "2022-06-28",
    "Content-Type": "application/json",
}

API_BASE = "https://api.notion.com/v1"


def _create_page(db_id: str, properties: Dict, children: Optional[list] = None) -> Dict:
    """
    Create a new page in a Notion database
    
    Args:
        db_id: Notion database ID
        properties: Page properties dict
        children: Optional page content blocks
        
    Returns:
        Created page object from Notion API
    """
    if not NOTION_KEY or not db_id:
        raise ValueError("Notion API key or database ID not configured")
    
    payload = {
        "parent": {"database_id": db_id},
        "properties": properties
    }
    
    if children:
        payload["children"] = children
    
    response = requests.post(
        f"{API_BASE}/pages",
        headers=HEADERS,
        json=payload,
        timeout=10
    )
    response.raise_for_status()
    return response.json()


def push_receipt(data: Dict) -> Dict:
    """
    Push OCR receipt data to Notion Receipts database
    
    Args:
        data: Receipt data dict with keys:
            - date: ISO date string (YYYY-MM-DD)
            - vendor: Merchant name
            - amount: Total amount (float)
            - category: Optional category (e.g., "Toimisto", "Matkat")
            - image_url: Optional receipt image URL
            - status: Optional status (default: "New")
            
    Returns:
        Created Notion page object
        
    Example:
        push_receipt({
            "date": "2025-10-12",
            "vendor": "K-Market",
            "amount": 12.34,
            "category": "Toimisto",
            "image_url": "https://example.com/receipt.jpg",
            "status": "New"
        })
    """
    # Build Notion properties
    properties = {
        "Date": {
            "date": {"start": data["date"]}
        },
        "Vendor": {
            "title": [{"text": {"content": data["vendor"][:200]}}]
        },
        "Amount": {
            "number": float(data["amount"])
        },
        "Category": {
            "select": {"name": data.get("category", "Muu")}
        },
        "Status": {
            "select": {"name": data.get("status", "New")}
        }
    }
    
    # Add image if provided
    if data.get("image_url"):
        properties["Image"] = {
            "files": [{
                "type": "external",
                "name": "receipt",
                "external": {"url": data["image_url"]}
            }]
        }
    
    return _create_page(RECEIPTS_DB, properties)


def upsert_calendar_event(event: Dict) -> Dict:
    """
    Create or update a calendar event in Notion Events database
    
    Args:
        event: Event data dict with keys:
            - title: Event title
            - start: ISO datetime string with timezone
            - end: Optional end datetime
            - location: Optional location
            - notes: Optional notes/description
            - status: Optional status (default: "Planned")
            
    Returns:
        Created Notion page object
        
    Example:
        upsert_calendar_event({
            "title": "ALV-kooste",
            "start": "2025-10-15T09:00:00+03:00",
            "end": "2025-10-15T10:00:00+03:00",
            "location": "HQ",
            "notes": "Tarkista kuukauden kuitit",
            "status": "Planned"
        })
    """
    # Build Notion properties
    properties = {
        "Title": {
            "title": [{"text": {"content": event["title"][:200]}}]
        },
        "Start": {
            "date": {
                "start": event["start"],
                "end": event.get("end")
            }
        },
        "Status": {
            "select": {"name": event.get("status", "Planned")}
        }
    }
    
    # Add optional fields
    if event.get("location"):
        properties["Location"] = {
            "rich_text": [{"text": {"content": event["location"]}}]
        }
    
    if event.get("notes"):
        properties["Notes"] = {
            "rich_text": [{"text": {"content": event["notes"]}}]
        }
    
    return _create_page(EVENTS_DB, properties)


def create_monthly_vat_reminder(year: int, month: int) -> Dict:
    """
    Create a monthly VAT reminder event
    
    Args:
        year: Year (e.g., 2025)
        month: Month (1-12)
        
    Returns:
        Created Notion event page
    """
    # VAT deadline is typically 12th of next month
    from datetime import date, timedelta
    
    reminder_date = date(year, month, 1) + timedelta(days=40)
    reminder_date = reminder_date.replace(day=12)
    
    return upsert_calendar_event({
        "title": f"ALV-kooste {year}-{month:02d}",
        "start": reminder_date.isoformat() + "T09:00:00+03:00",
        "notes": f"Tarkista kuukauden {month}/{year} kuitit ja ALV-laskelmat",
        "status": "Planned"
    })


def test_connection() -> bool:
    """
    Test Notion API connection
    
    Returns:
        True if connection successful, False otherwise
    """
    try:
        if not NOTION_KEY:
            return False
        
        response = requests.get(
            f"{API_BASE}/users/me",
            headers=HEADERS,
            timeout=5
        )
        return response.status_code == 200
    except Exception:
        return False

