"""
Legal Rules Sync - Fetch updates from official sources.
Sources:
- Finlex RSS (Finnish legislation)
- Vero.fi news
- Future: EU regulations, PRH updates
"""

import feedparser
import requests
from datetime import datetime, date
from sqlalchemy.orm import Session
from app.modules.legal.service import add_rule

FINLEX_RSS = "https://www.finlex.fi/fi/laki/ajantasa/rss.xml"
VERO_NEWS_RSS = "https://www.vero.fi/fi/rss/ajankohtaista/"


def sync_finlex(db: Session) -> int:
    """Sync recent legislation from Finlex."""
    count = 0
    try:
        feed = feedparser.parse(FINLEX_RSS)
        for entry in feed.entries[:20]:  # Latest 20
            rule_data = {
                "id": f"finlex_{entry.link.split('/')[-1]}",
                "domain": "General",
                "regulation_code": entry.title.split()[0] if entry.title else "N/A",
                "title": entry.title,
                "summary": entry.summary if hasattr(entry, "summary") else entry.title,
                "valid_from": date.today(),
                "source_url": entry.link,
                "notes": "Auto-synced from Finlex RSS",
            }
            add_rule(db, rule_data)
            count += 1
    except Exception as e:
        print(f"Finlex sync error: {e}")
    
    return count


def sync_vero(db: Session) -> int:
    """Sync tax news from Vero.fi."""
    count = 0
    try:
        feed = feedparser.parse(VERO_NEWS_RSS)
        for entry in feed.entries[:10]:
            rule_data = {
                "id": f"vero_{entry.link.split('/')[-1]}",
                "domain": "Tax",
                "regulation_code": "Vero.fi",
                "title": entry.title,
                "summary": entry.summary if hasattr(entry, "summary") else entry.title,
                "valid_from": date.today(),
                "source_url": entry.link,
                "notes": "Auto-synced from Vero.fi RSS",
            }
            add_rule(db, rule_data)
            count += 1
    except Exception as e:
        print(f"Vero sync error: {e}")
    
    return count


def sync_all(db: Session) -> dict:
    """Sync from all sources."""
    finlex_count = sync_finlex(db)
    vero_count = sync_vero(db)
    
    return {
        "finlex": finlex_count,
        "vero": vero_count,
        "total": finlex_count + vero_count,
        "synced_at": datetime.utcnow().isoformat(),
    }

