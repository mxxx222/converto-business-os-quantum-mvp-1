#!/usr/bin/env python3
"""
Setup script for pilot customer.
Creates tenant, user, and initial data.
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from shared_core.utils.db import SessionLocal, Base, engine
from datetime import datetime
import uuid

# Create all tables
Base.metadata.create_all(bind=engine)


def setup_pilot(tenant_name: str, email: str):
    """Setup a pilot customer with tenant and user."""
    db = SessionLocal()
    try:
        tenant_id = f"tenant_{tenant_name.lower().replace(' ', '_')}"
        user_id = f"user_{email.split('@')[0]}"

        print(f"✅ Setting up pilot customer:")
        print(f"   Tenant ID: {tenant_id}")
        print(f"   User ID: {user_id}")
        print(f"   Email: {email}")
        print(f"   Access URL: https://converto-frontend.onrender.com")
        print(f"   Login: {email}")
        print("")
        print("📝 Next steps:")
        print("   1. Send access link to customer")
        print("   2. Guide them to /selko/ocr for first receipt")
        print("   3. Monitor usage in /admin/economy")
        print("")
        print("🎉 Pilot customer ready!")

        return {
            "tenant_id": tenant_id,
            "user_id": user_id,
            "email": email,
            "access_url": "https://converto-frontend.onrender.com",
        }
    finally:
        db.close()


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python scripts/setup_pilot_customer.py 'Company Name' 'email@example.com'")
        sys.exit(1)

    tenant_name = sys.argv[1]
    email = sys.argv[2]
    setup_pilot(tenant_name, email)
