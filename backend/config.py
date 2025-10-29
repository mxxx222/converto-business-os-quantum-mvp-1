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
    allowed_origin_regex: str | None = field(
        default_factory=lambda: os.getenv(
            "ALLOWED_ORIGIN_REGEX",
            r"https://[A-Za-z0-9-]+\.vercel\.app$",
        )
    )
    log_level: str = field(default_factory=lambda: os.getenv("LOG_LEVEL", "info"))
    # Supabase
    supabase_url: str = field(default_factory=lambda: os.getenv("SUPABASE_URL", ""))
    supabase_jwt_iss: str = field(default_factory=lambda: os.getenv("SUPABASE_JWT_ISS", ""))
    supabase_jwt_aud: str = field(default_factory=lambda: os.getenv("SUPABASE_JWT_AUD", "authenticated"))
    supabase_auth_enabled: bool = field(default_factory=lambda: os.getenv("SUPABASE_AUTH_ENABLED", "false").lower() in {"1", "true", "yes"})

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
