"""FastAPI application entrypoint for the Converto Business OS backend."""

from __future__ import annotations

import logging
from contextlib import asynccontextmanager
from typing import AsyncIterator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.config import get_settings
from shared_core.modules.ocr.router import router as ocr_router
from shared_core.utils.db import Base, engine

settings = get_settings()
logger = logging.getLogger("converto.backend")


def configure_logging() -> None:
    """Configure the global logging setup only once."""

    if logging.getLogger().handlers:
        return
    logging.basicConfig(
        level=settings.log_level.upper(),
        format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
    )
    logger.debug("Logging configured with level %s", settings.log_level.upper())


@asynccontextmanager
async def lifespan(_: FastAPI) -> AsyncIterator[None]:
    """FastAPI lifespan hook used to initialise infrastructure."""

    configure_logging()
    logger.info("Ensuring database schema is up to date")
    Base.metadata.create_all(bind=engine)
    logger.info("Database schema ready")
    yield


def create_app() -> FastAPI:
    """Create the FastAPI application instance."""

    app = FastAPI(
        title="Converto Business OS API",
        version="1.0.0",
        docs_url="/docs",
        openapi_url="/openapi.json",
        lifespan=lifespan,
    )

    origins = settings.cors_origins()
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.get("/", tags=["system"])
    async def root() -> dict[str, str]:
        """Simple index route for health probes."""

        return {
            "service": "converto-backend",
            "status": "ok",
            "environment": settings.environment,
        }

    @app.get("/health", tags=["system"])
    async def health() -> dict[str, str]:
        """Return the service health status used by Render probes."""

        return {"status": "healthy"}

    app.include_router(ocr_router)
    return app


app = create_app()

__all__ = ["app", "create_app"]
