"""Runtime configuration helpers for the backend service."""

from __future__ import annotations

import os
from dataclasses import dataclass, field
from functools import lru_cache
from typing import List


@dataclass(slots=True)
class Settings:
    """Container for backend configuration values."""

    environment: str = field(default_factory=lambda: os.getenv("ENVIRONMENT", "development"))
    database_url: str = field(default_factory=lambda: os.getenv("DATABASE_URL", "sqlite:///./local.db"))
    allowed_origins: str = field(default_factory=lambda: os.getenv("ALLOWED_ORIGINS", "*"))
    log_level: str = field(default_factory=lambda: os.getenv("LOG_LEVEL", "info"))

    def cors_origins(self) -> List[str]:
        """Return the configured CORS origins as a list."""
        raw = self.allowed_origins.strip()
        if not raw or raw == "*":
            return ["*"]
        return [origin.strip() for origin in raw.split(",") if origin.strip()]


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    """Return a cached settings instance."""

    return Settings()


__all__ = ["Settings", "get_settings"]
