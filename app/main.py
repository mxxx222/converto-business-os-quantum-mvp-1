
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import health as health_api
from app.api import v2 as v2_api
from app.core.registry import registry

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

registry.load_all(app)

@app.get("/")
def root():
    return {"ok": True, "name": "Converto Business OS – Quantum Edition (MVP+)"}
