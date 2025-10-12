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


# ========================================
# INVENTORY (VARASTO) INTEGRATION
# ========================================

INVENTORY_DB = os.getenv("NOTION_INVENTORY_DB", "")


def inventory_create(item: Dict) -> Dict:
    """
    Create inventory item in Notion
    
    Args:
        item: Inventory data dict with keys:
            - sku: Stock keeping unit (unique ID)
            - nimi: Product name
            - kategoria: Category (e.g., "Laitteet", "Komponentit")
            - varastosaldo: Current stock level
            - yksikkokustannus: Unit cost in EUR
            - halytysraja: Alert threshold
            - toimittaja: Supplier name
            
    Returns:
        Created Notion page object
    """
    properties = {
        "SKU": {
            "title": [{"text": {"content": item["sku"][:200]}}]
        },
        "Nimi": {
            "rich_text": [{"text": {"content": item.get("nimi", "")}}]
        },
        "Kategoria": {
            "select": {"name": item.get("kategoria", "Muu")}
        },
        "Varastosaldo": {
            "number": float(item.get("varastosaldo", 0))
        },
        "Yksikkökustannus": {
            "number": float(item.get("yksikkokustannus", 0))
        },
        "Hälytysraja": {
            "number": float(item.get("halytysraja", 0))
        },
        "Toimittaja": {
            "rich_text": [{"text": {"content": item.get("toimittaja", "")}}]
        }
    }
    
    return _create_page(INVENTORY_DB, properties)


def inventory_adjust(sku: str, delta: int, notes: str = "") -> Dict:
    """
    Adjust inventory stock level
    
    Creates an audit entry in Notion showing the stock change
    
    Args:
        sku: Stock keeping unit
        delta: Change amount (positive = increase, negative = decrease)
        notes: Optional notes about the adjustment
        
    Returns:
        Created Notion page object
    """
    properties = {
        "SKU": {
            "title": [{"text": {"content": f"{sku} – muutos {delta:+d}"}}]
        },
        "Nimi": {
            "rich_text": [{"text": {"content": notes or "Varastomuutos"}}]
        },
        "Varastosaldo": {
            "number": float(delta)
        }
    }
    
    return _create_page(INVENTORY_DB, properties)


# ========================================
# CUSTOMS/SHIPMENTS INTEGRATION
# ========================================

SHIPMENTS_DB = os.getenv("NOTION_SHIPMENTS_DB", "")


def shipment_create(shipment: Dict) -> Dict:
    """
    Create customs/shipment entry in Notion
    
    Args:
        shipment: Shipment data dict with keys:
            - id: Shipment ID (e.g., "IMP-2025-0001")
            - hs: HS code (harmonized system code)
            - arvo_eur: Value in EUR
            - alv: VAT percentage
            - tulli: Customs duty percentage
            - lahtomaa: Country of origin (ISO code)
            - saapumapaiva: Arrival date (YYYY-MM-DD)
            - status: Status (Draft, Filed, Released, Delivered)
            - liite_url: Optional attachment URL
            
    Returns:
        Created Notion page object
    """
    properties = {
        "Shipment ID": {
            "title": [{"text": {"content": shipment["id"][:200]}}]
        },
        "Status": {
            "select": {"name": shipment.get("status", "Draft")}
        },
        "HS-koodi": {
            "rich_text": [{"text": {"content": shipment.get("hs", "")}}]
        },
        "Arvo (EUR)": {
            "number": float(shipment.get("arvo_eur", 0))
        },
        "ALV %": {
            "number": float(shipment.get("alv", 0))
        },
        "Tulli %": {
            "number": float(shipment.get("tulli", 0))
        },
        "Lähtömaa": {
            "rich_text": [{"text": {"content": shipment.get("lahtomaa", "")}}]
        }
    }
    
    # Add arrival date if provided
    if shipment.get("saapumapaiva"):
        properties["Saapumispäivä"] = {
            "date": {"start": shipment["saapumapaiva"]}
        }
    
    # Add attachment if provided
    if shipment.get("liite_url"):
        properties["Liitteet"] = {
            "files": [{
                "type": "external",
                "name": "document",
                "external": {"url": shipment["liite_url"]}
            }]
        }
    
    return _create_page(SHIPMENTS_DB, properties)


# ========================================
# CALENDAR INTEGRATION
# ========================================

def notion_calendar_enabled() -> bool:
    """Check if Notion calendar is configured"""
    calendar_db = os.getenv("NOTION_CALENDAR_DB_ID", "")
    return bool(NOTION_KEY and calendar_db)


def upsert_calendar_event(
    title: str,
    start: str,
    end: Optional[str] = None,
    status: str = "Open",
    notes: Optional[str] = None,
    page_id: Optional[str] = None
) -> Dict:
    """
    Create or update calendar event in Notion
    
    Args:
        title: Event title
        start: Start datetime (ISO format)
        end: Optional end datetime (ISO format)
        status: Event status (Open, Done, Cancelled)
        notes: Optional notes
        page_id: Optional page ID for updates
        
    Returns:
        Created/updated Notion page object
    """
    calendar_db = os.getenv("NOTION_CALENDAR_DB_ID", "")
    
    if not NOTION_KEY or not calendar_db:
        raise ValueError("Notion calendar not configured (NOTION_API_KEY, NOTION_CALENDAR_DB_ID)")
    
    properties = {
        "Name": {
            "title": [{"text": {"content": title[:200]}}]
        },
        "Date": {
            "date": {
                "start": start,
                "end": end
            }
        },
        "Status": {
            "select": {"name": status}
        }
    }
    
    if notes:
        properties["Notes"] = {
            "rich_text": [{"text": {"content": notes}}]
        }
    
    if page_id:
        # Update existing page
        response = requests.patch(
            f"{API_BASE}/pages/{page_id}",
            headers=HEADERS,
            json={"properties": properties},
            timeout=10
        )
    else:
        # Create new page
        response = requests.post(
            f"{API_BASE}/pages",
            headers=HEADERS,
            json={
                "parent": {"database_id": calendar_db},
                "properties": properties
            },
            timeout=10
        )
    
    response.raise_for_status()
    return response.json()

