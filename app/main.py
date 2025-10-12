
from fastapi import FastAPI
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

registry.load_all(app)

@app.get("/")
def root():
    return {"ok": True, "name": "Converto Business OS – Quantum Edition (MVP+)"}

# simple insights demo endpoint
ins = APIRouter(prefix="/api/v1/insights", tags=["insights"])


@ins.get("/kpis")
def kpis():
    return kpis_example()


app.include_router(ins)
