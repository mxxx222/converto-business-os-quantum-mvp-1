#!/usr/bin/env python3
"""
Generate a demo JWT token for development.

Usage:
    python scripts/mint_token.py [tenant_id] [user_id] [ttl_seconds]

Examples:
    python scripts/mint_token.py demo user_demo 86400
    python scripts/mint_token.py my_tenant my_user 3600
"""

import sys
import os

# Add parent directory to path to import app modules
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.auth import mint_demo_jwt

if __name__ == "__main__":
    tenant_id = sys.argv[1] if len(sys.argv) > 1 else "demo"
    user_id = sys.argv[2] if len(sys.argv) > 2 else "user_demo"
    ttl = int(sys.argv[3]) if len(sys.argv) > 3 else 86400  # 24 hours default

    token = mint_demo_jwt(tenant_id, user_id, ttl)
    print(f"\n🔑 JWT Token generated:")
    print(f"   Tenant: {tenant_id}")
    print(f"   User: {user_id}")
    print(f"   TTL: {ttl}s ({ttl//3600}h)")
    print(f"\n{token}\n")
    print(f"💡 Add to frontend/.env.local:")
    print(f"   NEXT_PUBLIC_DEV_JWT={token}\n")
