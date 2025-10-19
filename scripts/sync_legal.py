#!/usr/bin/env python3
"""
Legal Rules Sync Script
Run daily to fetch updates from Finlex and Vero.fi
"""

import sys
from pathlib import Path

# Add project root to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from shared_core.utils.db import SessionLocal
from app.modules.legal.sync import sync_all


def main():
    print("🔁 Syncing legal rules from official sources...")
    db = SessionLocal()
    try:
        result = sync_all(db)
        print(f"✅ Synced {result['total']} rules")
        print(f"   - Finlex: {result['finlex']}")
        print(f"   - Vero.fi: {result['vero']}")
        print(f"   - Timestamp: {result['synced_at']}")
    except Exception as e:
        print(f"❌ Sync failed: {e}")
        sys.exit(1)
    finally:
        db.close()


if __name__ == "__main__":
    main()
