"""Backend configuration settings."""

from __future__ import annotations

import os
from typing import Any

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # Environment
    environment: str = "development"
    log_level: str = "info"
    
    # Database
    database_url: str = "postgresql://demo:demo@demo.supabase.co:5432/demo"
    
    # CORS
    cors_origins_str: str = "http://localhost:3000,http://localhost:8080"
    allowed_origin_regex: str = r".*"
    
    # Auth
    supabase_auth_enabled: bool = False
    
    class Config:
        """Pydantic config."""
        env_file = ".env"
        case_sensitive = False
        extra = "ignore"  # Ignore extra environment variables

    def cors_origins(self) -> list[str]:
        """Parse CORS origins from comma-separated string."""
        return [origin.strip() for origin in self.cors_origins_str.split(",")]


def get_settings() -> Settings:
    """Get application settings."""
    return Settings()