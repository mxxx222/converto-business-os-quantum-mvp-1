import os
from fastapi import Header, HTTPException


ADMIN_TOKEN = os.getenv("ADMIN_TOKEN")


def admin_required(x_admin_token: str | None = Header(default=None)):
    if not ADMIN_TOKEN:
        raise HTTPException(500, "ADMIN_TOKEN not configured")
    if x_admin_token != ADMIN_TOKEN:
        raise HTTPException(401, "Unauthorized")
    return True


