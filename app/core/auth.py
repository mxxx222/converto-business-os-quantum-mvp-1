"""
JWT-based authentication and tenant context extraction.
"""
import os
import time
import jwt
from fastapi import Request, HTTPException
from typing import Dict

JWT_SECRET = os.getenv("JWT_SECRET", "dev-secret-change-in-production")
JWT_ISS = os.getenv("JWT_ISS", "converto")
JWT_AUD = os.getenv("JWT_AUD", "converto-app")


def mint_demo_jwt(tenant_id: str, user_id: str, ttl: int = 3600) -> str:
    """
    Mint a demo JWT token for development/testing.
    
    Args:
        tenant_id: Tenant identifier
        user_id: User identifier
        ttl: Time to live in seconds (default 1 hour)
    
    Returns:
        JWT token string
    """
    now = int(time.time())
    payload = {
        "iss": JWT_ISS,
        "aud": JWT_AUD,
        "iat": now,
        "exp": now + ttl,
        "sub": user_id,
        "tenant_id": tenant_id,
        "uid": user_id,
        "scopes": ["user"],
    }
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")


def verify_jwt(token: str) -> Dict:
    """
    Verify and decode a JWT token.
    
    Args:
        token: JWT token string
    
    Returns:
        Decoded token payload
    
    Raises:
        HTTPException: If token is invalid
    """
    try:
        return jwt.decode(
            token,
            JWT_SECRET,
            algorithms=["HS256"],
            audience=JWT_AUD,
            issuer=JWT_ISS,
        )
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"invalid_token: {e}")


async def tenant_ctx(request: Request) -> Dict:
    """
    Extract tenant context from request.
    
    Priority:
    1. JWT token (Authorization: Bearer <token>)
    2. Headers (x-tenant-id + x-user-id) - DEV ONLY
    
    Returns:
        Dict with tenant_id, user_id, and claims
    
    Raises:
        HTTPException: If no valid authentication found
    """
    # Try JWT first
    auth = request.headers.get("authorization", "")
    if auth.lower().startswith("bearer "):
        token = auth.split(" ", 1)[1]
        claims = verify_jwt(token)
        return {
            "tenant_id": claims.get("tenant_id"),
            "user_id": claims.get("uid") or claims.get("sub"),
            "claims": claims,
        }
    
    # DEV fallback: allow direct headers (disable in production!)
    tenant_hdr = request.headers.get("x-tenant-id")
    user_hdr = request.headers.get("x-user-id")
    if tenant_hdr and user_hdr:
        return {
            "tenant_id": tenant_hdr,
            "user_id": user_hdr,
            "claims": {"scopes": ["dev"]},
        }
    
    raise HTTPException(status_code=401, detail="missing_auth: provide JWT or x-tenant-id+x-user-id headers")


def require_scope(scope: str):
    """
    Dependency to require a specific scope in JWT.
    
    Usage:
        @router.get("/admin", dependencies=[Depends(require_scope("admin"))])
    """
    async def _check(ctx: Dict = tenant_ctx):
        scopes = ctx.get("claims", {}).get("scopes", [])
        if scope not in scopes:
            raise HTTPException(status_code=403, detail=f"missing_scope: {scope}")
        return ctx
    return _check

