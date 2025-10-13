
from fastapi import FastAPI
import os
import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration
from sentry_sdk.integrations.starlette import StarletteIntegration
from fastapi.middleware.cors import CORSMiddleware
from app.api import health as health_api
from app.api import v2 as v2_api
from app.api.impact import router as impact_router
from app.api.quantum import router as quantum_router
from app.api.guardian import router as guardian_router
from app.api.sentinel import router as sentinel_router
from app.api.predictive import router as predictive_router
from app.core.registry import registry
from app.routers import agent as agent_router
from app.routers import search as search_router
from shared_core.modules.ocr.router import router as ocr_router
from shared_core.modules.ai_common.insights import kpis_example
from fastapi import APIRouter
from app.api.debug import router as debug_router
from app.api import gamify as gamify_api
from app.api import rewards as rewards_api
from app.api import p2e as p2e_api
from app.api import economy_admin as economy_admin_api
from app.api import ocr_ai as ocr_ai_api
from app.api.ocr import routes as ocr_routes_v2
from app.modules.legal.api import router as legal_router
from app.api.vat_rates import router as vat_rates_router
from app.api.integrations.notion_api import router as notion_router
from app.api.integrations.notion_inventory import router as notion_inventory_router
from app.api.integrations.notion_customs import router as notion_customs_router
from app.modules.gamify_v2.api import router as gamify_v2_router
from app.modules.reminders.api import router as reminders_router
from app.api.auth_magic import router as auth_magic_router
from app.api.pricing import router as pricing_router
from app.api.entitlements import router as entitlements_router
from app.api.standalone import router as standalone_router
from app.api.standalone_backup import router as standalone_backup_router

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

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

registry.load_all(app)

# Start reminder scheduler (background thread)
from app.modules.reminders.scheduler import start_scheduler
start_scheduler(interval_seconds=60)

@app.get("/")
def root():
    return {"ok": True, "name": "Converto Business OS – Quantum Edition (MVP+)"}

# simple insights demo endpoint
ins = APIRouter(prefix="/api/v1/insights", tags=["insights"])


@ins.get("/kpis")
def kpis():
    return kpis_example()


app.include_router(ins)
