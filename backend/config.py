"""Backend configuration settings."""

from __future__ import annotations

import os
from typing import Any, Optional

try:
    from pydantic_settings import BaseSettings
except ImportError:
    from pydantic import BaseSettings


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # Environment
    environment: str = "development"
    log_level: str = "info"

    # Database (Production Supabase)
    database_url: str = os.getenv("DATABASE_URL", os.getenv("SUPABASE_DATABASE_URL", ""))
    
    # Production Database Connection (if using Supabase)
    supabase_database_url: str = os.getenv("SUPABASE_DATABASE_URL", "")

    # CORS
    cors_origins_str: str = os.getenv(
        "CORS_ORIGINS_STR",
        "https://app.converto.fi,https://converto.fi,http://localhost:3000,http://localhost:8080",
    )
    allowed_origin_regex: str = r".*"

    # Supabase (Production Configuration)
    supabase_url: str = os.getenv("SUPABASE_URL", "")
    supabase_anon_key: str = os.getenv("SUPABASE_ANON_KEY", "")
    supabase_service_role_key: str = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
    supabase_jwt_secret: str = os.getenv("SUPABASE_JWT_SECRET", "")
    supabase_auth_enabled: bool = os.getenv("SUPABASE_AUTH_ENABLED", "true").lower() in (
        "true",
        "1", 
        "yes",
    )
    supabase_project_id: str = os.getenv("SUPABASE_PROJECT_ID", "")

    # Sentry
    sentry_dsn: str = ""

    # Email
    resend_api_key: str = os.getenv("RESEND_API_KEY", "")
    email_from: str = os.getenv("RESEND_FROM_EMAIL", "info@converto.fi")
    email_reply_to: str = "info@converto.fi"

    # Image Generation (Kilo Code) - ROI Optimized
    kilo_code_api_key: str = os.getenv("KILO_CODE_API_KEY", "")
    kilo_code_api_base: str = os.getenv("KILO_CODE_API_BASE", "https://api.kilocode.com")
    image_generation_enabled: bool = os.getenv("IMAGE_GENERATION_ENABLED", "false").lower() in (
        "true",
        "1",
        "yes",
    )

    # Cloudflare Bypass Token - Maximum ROI
    cloudflare_bypass_token: str = os.getenv("CLOUDFLARE_BYPASS_TOKEN", "")
    cloudflare_enabled: bool = bool(os.getenv("CLOUDFLARE_BYPASS_TOKEN", ""))

    # ROI Optimization Settings
    max_image_batch: int = int(os.getenv("MAX_IMAGE_BATCH", "12"))  # Higher than Teams limit
    priority_processing: bool = os.getenv("PRIORITY_PROCESSING", "true").lower() in (
        "true",
        "1",
        "yes",
    )
    batch_optimization: bool = os.getenv("BATCH_OPTIMIZATION", "true").lower() in (
        "true",
        "1",
        "yes",
    )

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
