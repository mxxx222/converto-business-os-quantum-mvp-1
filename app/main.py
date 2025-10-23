import base64
import contextlib
import os

from fastapi import APIRouter, FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.types import ASGIApp, Scope, Receive, Send
from fastapi.responses import HTMLResponse, RedirectResponse
from sentry_sdk.integrations.fastapi import FastApiIntegration
from sentry_sdk.integrations.starlette import StarletteIntegration
from starlette.staticfiles import StaticFiles

from app.api import economy_admin as economy_admin_api
from app.api import gamify as gamify_api
from app.api import health as health_api
from app.api import ocr_ai as ocr_ai_api
from app.api import p2e as p2e_api
from app.api import rewards as rewards_api
from app.api import v2 as v2_api
from app.api.ai_adapter_api import router as ai_adapter_api_router
from app.api.audit import router as audit_router
from app.api.auth_magic import router as auth_magic_router
from app.api.auto_heal import router as auto_heal_router
from app.api.debug import router as debug_router
from app.api.entitlements import router as entitlements_router
from app.api.guardian import router as guardian_router
from app.api.impact import router as impact_router
from app.api.integrations.notion_api import router as notion_router
from app.api.integrations.notion_customs import router as notion_customs_router
from app.api.integrations.notion_inventory import router as notion_inventory_router
from app.api.ml_feedback import router as ml_feedback_router
from app.api.ocr import routes as ocr_routes_v2
from app.api.pii import router as pii_router
from app.api.predictive import router as predictive_router
from app.api.pricing import router as pricing_router
from app.api.quantum import router as quantum_router
from app.api.sentinel import router as sentinel_router
from app.api.standalone import router as standalone_router
from app.api.standalone_backup import router as standalone_backup_router
from app.api.vat_rates import router as vat_rates_router
from app.api.vision import router as vision_router
from app.core.registry import registry
from app.modules.gamify_v2.api import router as gamify_v2_router
from app.modules.legal.api import router as legal_router
from app.modules.reminders.api import router as reminders_router
from app.routers import agent as agent_router
from app.routers import search as search_router
from shared_core.modules.ai_common.insights import kpis_example
from shared_core.modules.ocr.router import router as ocr_router

# Light mode support
LIGHT_MODE = os.getenv("CONVERTO_LIGHT_MODE", "0") == "1"

# Initialize Sentry only if not in light mode
if not LIGHT_MODE:
    import sentry_sdk

    sentry_dsn = os.getenv("SENTRY_DSN")
    if sentry_dsn:
        sentry_sdk.init(
            dsn=sentry_dsn,
            integrations=[FastApiIntegration(), StarletteIntegration()],
            environment=os.getenv("SENTRY_ENV", "local"),
            traces_sample_rate=float(os.getenv("SENTRY_SAMPLE_RATE", "0.0")),
            profiles_sample_rate=0.0,
            send_default_pii=False,
        )

app = FastAPI(title="Converto Business OS – Quantum Edition (MVP+)")

# Optional static mount (safe even if directory missing)
with contextlib.suppress(Exception):
    app.mount("/static", StaticFiles(directory="app/static"), name="static")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://converto.fi",
        "https://www.converto.fi",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        resp = await call_next(request)
        resp.headers.setdefault("X-Content-Type-Options", "nosniff")
        resp.headers.setdefault("Referrer-Policy", "strict-origin-when-cross-origin")
        resp.headers.setdefault(
            "Permissions-Policy", "camera=(), microphone=(), geolocation=()"
        )
        resp.headers.setdefault(
            "Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload"
        )
        return resp


app.add_middleware(SecurityHeadersMiddleware)

app.include_router(health_api.router)
app.include_router(v2_api.router)
app.include_router(agent_router.router)
app.include_router(search_router.router)
app.include_router(impact_router, prefix="/api/v1")
app.include_router(quantum_router, prefix="/api/v1")
app.include_router(guardian_router, prefix="/api/v1")
app.include_router(sentinel_router, prefix="/api/v1")
app.include_router(predictive_router, prefix="/api/v1")
app.include_router(ocr_router)
app.include_router(debug_router)
app.include_router(gamify_api.router)
app.include_router(rewards_api.router)
app.include_router(p2e_api.router)
app.include_router(economy_admin_api.router)
app.include_router(ocr_ai_api.router)
app.include_router(ocr_routes_v2.router)
app.include_router(legal_router)
app.include_router(vat_rates_router)
app.include_router(notion_router)
app.include_router(notion_inventory_router)
app.include_router(notion_customs_router)
app.include_router(gamify_v2_router)
app.include_router(reminders_router)
app.include_router(auth_magic_router)
app.include_router(pricing_router)
app.include_router(entitlements_router)
app.include_router(standalone_router)
app.include_router(standalone_backup_router)
app.include_router(ai_adapter_api_router)
app.include_router(vision_router)
app.include_router(auto_heal_router)
app.include_router(ml_feedback_router)
app.include_router(audit_router)
app.include_router(pii_router)

registry.load_all(app)

# Start ML retraining scheduler (every 24h)
from app.ml.retrain import schedule_retraining

schedule_retraining(interval_hours=24)

# Start reminder scheduler (background thread)
from app.modules.reminders.scheduler import start_scheduler

start_scheduler(interval_seconds=60)


@app.get("/", include_in_schema=False)
def root() -> RedirectResponse:
    # Keep 308 but ensure target exists within backend
    return RedirectResponse(url="/coming-soon", status_code=308)


@app.get("/coming-soon", response_class=HTMLResponse, include_in_schema=False)
def coming_soon() -> str:
    return """
<!doctype html>
<html lang=\"en\">
<head>
  <meta charset=\"utf-8\">
  <title>Converto — Coming soon</title>
  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />
  <link rel=\"icon\" href=\"/static/favicon-32.png\" sizes=\"32x32\"> 
  <link rel=\"apple-touch-icon\" href=\"/static/apple-touch-icon.png\" sizes=\"180x180\"> 
  <meta name=\"theme-color\" content=\"#0B0B0C\"> 
  <meta name=\"description\" content=\"Converto — automation platform. Launching soon.\"> 
  <meta property=\"og:title\" content=\"Converto — Coming soon\"> 
  <meta property=\"og:description\" content=\"Backend live. Frontend launching shortly.\"> 
  <meta property=\"og:type\" content=\"website\"> 
  <meta property=\"og:url\" content=\"https://converto.fi/\"> 
  <meta property=\"og:image\" content=\"https://converto.fi/static/og-card.png\"> 
  <style>
    html,body {height:100%;margin:0;font-family:system-ui,-apple-system,Segoe UI,Roboto,Inter,sans-serif;background:#0B0B0C;color:#EDEDED;}
    .wrap {min-height:100%;display:flex;align-items:center;justify-content:center;padding:48px;}
    .card {max-width:720px;width:100%;background:#141415;border:1px solid #2A2A2C;border-radius:12px;padding:28px;box-shadow:0 10px 24px rgba(0,0,0,.25);}
    h1 {margin:0 0 8px;font-size:28px}
    p {opacity:.85;line-height:1.6}
    code {background:#1b1b1d;padding:2px 6px;border-radius:6px}
  </style>
  </head>
<body>
  <div class=\"wrap\">
    <div class=\"card\">
      <h1>Converto — Coming soon</h1>
      <p>Backend on käynnissä ja valmiina palvelemaan. Frontend julkaistaan pian.</p>
      <p><code>/health</code> palauttaa {\"status\":\"ok\"} ja redirect <code>/ → /coming-soon</code> on käytössä.</p>
    </div>
  </div>
</body>
</html>
"""


# Tiny 16x16 ICO to avoid 404 noise if no static/favicon exists
FAVICON_B64 = (
    "AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAGAAAAAAAAAAAAAAAAAAAAAAAAAAA"
    "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
    "AAAAAAAAAAAAAP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////"
    "AP///wD///8A////AP///wD///8A////AP///wD///8A////AAAAAAAAAAAAAAAAAAAAAAAAAAAA"
    "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
)


@app.get("/favicon.ico", include_in_schema=False)
def favicon() -> Response:
    raw = base64.b64decode(FAVICON_B64)
    return Response(content=raw, media_type="image/x-icon")


# simple insights demo endpoint
ins = APIRouter(prefix="/api/v1/insights", tags=["insights"])


@ins.get("/kpis")
def kpis() -> dict:
    return kpis_example()


app.include_router(ins)
