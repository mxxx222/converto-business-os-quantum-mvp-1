"""
Magic Link & TOTP Authentication
Email-based passwordless login with optional 2FA
"""

from datetime import datetime, timedelta
import os
import jwt
import httpx
import pyotp
from fastapi import APIRouter, HTTPException, Request, Response
from pydantic import BaseModel, EmailStr


router = APIRouter(prefix="/api/v1/auth", tags=["auth"])

JWT_SECRET = os.getenv("JWT_SECRET", "dev-secret-change-in-production")
APP_BASE_URL = os.getenv("APP_BASE_URL", "http://localhost:3000")
RESEND_API_KEY = os.getenv("RESEND_API_KEY", "")
RESEND_FROM = os.getenv("RESEND_FROM", "Converto <login@converto.fi>")

# In-memory stores (replace with Redis/PostgreSQL in production)
MAGIC_PENDING = {}  # email -> jti (one-time use)
TOTP_SECRETS = {}   # email -> base32 secret


class MagicRequest(BaseModel):
    """Magic link request"""
    email: EmailStr


class MagicVerify(BaseModel):
    """Magic link verification"""
    token: str


class TOTPEnrollRequest(BaseModel):
    """TOTP enrollment request"""
    email: EmailStr


class TOTPVerifyRequest(BaseModel):
    """TOTP verification"""
    email: EmailStr
    code: str


def mint_magic_token(email: str) -> str:
    """Create one-time magic link token"""
    jti = f"magic_{int(datetime.utcnow().timestamp())}_{hash(email)}"
    MAGIC_PENDING[email] = jti
    
    payload = {
        "sub": email,
        "jti": jti,
        "exp": datetime.utcnow() + timedelta(minutes=10),
        "scope": "magic",
        "iat": datetime.utcnow()
    }
    
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")


def verify_magic_token(token: str) -> str:
    """Verify and consume magic token (one-time use)"""
    try:
        data = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        email = data["sub"]
        jti = data["jti"]
        
        # Verify one-time use
        if MAGIC_PENDING.get(email) != jti:
            raise ValueError("Token already used or expired")
        
        # Consume token
        MAGIC_PENDING.pop(email, None)
        
        return email
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid or expired token: {str(e)}")


def create_session_token(email: str, hours: int = 8) -> str:
    """Create session JWT"""
    payload = {
        "sub": email,
        "exp": datetime.utcnow() + timedelta(hours=hours),
        "iat": datetime.utcnow(),
        "scope": "session"
    }
    
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")


@router.post("/magic/request")
async def magic_request(body: MagicRequest):
    """
    Request magic link login
    
    Args:
        body: Email address
        
    Returns:
        Status and dev link (if Resend not configured)
    """
    email = body.email.lower()
    token = mint_magic_token(email)
    magic_url = f"{APP_BASE_URL}/auth/callback?token={token}"
    
    # If Resend not configured, return dev link
    if not RESEND_API_KEY:
        return {
            "email_sent": False,
            "dev_link": magic_url,
            "message": "DEV MODE: Resend not configured, use link above"
        }
    
    # Send email via Resend
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            response = await client.post(
                "https://api.resend.com/emails",
                headers={
                    "Authorization": f"Bearer {RESEND_API_KEY}",
                    "Content-Type": "application/json"
                },
                json={
                    "from": RESEND_FROM,
                    "to": [email],
                    "subject": "Kirjaudu Convertoon",
                    "html": f"""
                    <div style="font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;">
                      <h2 style="color:#1f2937;">Kirjaudu Convertoon</h2>
                      <p style="color:#4b5563;margin-bottom:24px;">
                        Vahvista kirjautumisesi klikkaamalla alla olevaa nappia:
                      </p>
                      <p style="margin-bottom:32px;">
                        <a href="{magic_url}"
                           style="display:inline-block;padding:12px 24px;background:#6366f1;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;">
                          Jatka kirjautumista →
                        </a>
                      </p>
                      <p style="color:#9ca3af;font-size:14px;margin-top:24px;">
                        Linkki vanhenee 10 minuutissa. Jos et pyytänyt kirjautumista, 
                        voit jättää tämän viestin huomiotta.
                      </p>
                      <hr style="margin:24px 0;border:none;border-top:1px solid #e5e7eb;">
                      <p style="color:#9ca3af;font-size:12px;text-align:center;">
                        © 2025 Converto Business OS
                      </p>
                    </div>
                    """
                }
            )
            
            if response.status_code >= 300:
                raise HTTPException(status_code=500, detail=f"Email sending failed: {response.text}")
            
            return {
                "email_sent": True,
                "message": "Kirjautumislinkki lähetetty sähköpostiisi"
            }
            
    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail="Email service timeout")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to send email: {str(e)}")


@router.post("/magic/verify")
async def magic_verify(body: MagicVerify, response: Response):
    """
    Verify magic link token and create session
    
    Args:
        body: Magic token
        response: FastAPI response (for cookie setting)
        
    Returns:
        Success status
    """
    email = verify_magic_token(body.token)
    
    # Create session token
    session_token = create_session_token(email)
    
    # Set secure HTTP-only cookie
    response.set_cookie(
        key="converto_session",
        value=session_token,
        httponly=True,
        secure=False,  # Set True in production with HTTPS
        samesite="lax",
        max_age=28800,  # 8 hours
        path="/"
    )
    
    return {"ok": True, "email": email}


@router.post("/totp/enroll")
async def totp_enroll(body: TOTPEnrollRequest):
    """
    Enroll user in TOTP 2FA
    
    Args:
        body: Email address
        
    Returns:
        TOTP secret and provisioning URI (for QR code)
    """
    email = body.email.lower()
    secret = pyotp.random_base32()
    
    TOTP_SECRETS[email] = secret
    
    # Generate provisioning URI for QR code
    totp = pyotp.TOTP(secret)
    uri = totp.provisioning_uri(name=email, issuer_name="Converto")
    
    return {
        "secret": secret,
        "uri": uri,
        "message": "Scan QR code with Google Authenticator or Authy"
    }


@router.post("/totp/verify")
async def totp_verify(body: TOTPVerifyRequest, response: Response):
    """
    Verify TOTP code and create session
    
    Args:
        body: Email and TOTP code
        response: FastAPI response (for cookie setting)
        
    Returns:
        Success status
    """
    email = body.email.lower()
    secret = TOTP_SECRETS.get(email)
    
    if not secret:
        raise HTTPException(status_code=400, detail="TOTP not enrolled for this email")
    
    totp = pyotp.TOTP(secret)
    
    # Verify code (valid_window=1 allows ±30s time drift)
    if not totp.verify(body.code, valid_window=1):
        raise HTTPException(status_code=400, detail="Invalid TOTP code")
    
    # Create session token
    session_token = create_session_token(email)
    
    # Set secure HTTP-only cookie
    response.set_cookie(
        key="converto_session",
        value=session_token,
        httponly=True,
        secure=False,  # Set True in production with HTTPS
        samesite="lax",
        max_age=28800,  # 8 hours
        path="/"
    )
    
    return {"ok": True, "email": email}


@router.get("/session")
async def get_session(request: Request):
    """
    Get current session status
    
    Returns:
        Authentication status and user info
    """
    token = request.cookies.get("converto_session")
    
    if not token:
        return {"authenticated": False}
    
    try:
        data = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        return {
            "authenticated": True,
            "email": data.get("sub"),
            "expires_at": data.get("exp")
        }
    except jwt.ExpiredSignatureError:
        return {"authenticated": False, "error": "Token expired"}
    except Exception:
        return {"authenticated": False, "error": "Invalid token"}


@router.post("/logout")
async def logout(response: Response):
    """
    Logout user and clear session
    
    Returns:
        Success status
    """
    # Delete cookie
    response.delete_cookie("converto_session", path="/")
    
    # Also set expired cookie as fallback for older browsers
    response.set_cookie(
        key="converto_session",
        value="",
        expires=0,
        path="/"
    )
    
    return {"ok": True, "message": "Logged out successfully"}


# Dependency for protected routes
async def require_auth(request: Request) -> str:
    """
    Require authentication for endpoint
    
    Args:
        request: FastAPI request
        
    Returns:
        User email
        
    Raises:
        HTTPException 401 if not authenticated
        
    Usage:
        @router.get("/protected")
        async def protected(email: str = Depends(require_auth)):
            return {"email": email}
    """
    token = request.cookies.get("converto_session")
    
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    try:
        data = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        return data["sub"]
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Session expired")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid session")

