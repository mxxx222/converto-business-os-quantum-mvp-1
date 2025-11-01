"""Response caching for OpenAI API calls to reduce costs and improve performance."""

from __future__ import annotations

import hashlib
import json
import logging
import os
from typing import Any

logger = logging.getLogger("converto.ai.cache")


class OpenAICache:
    """Cache layer for OpenAI API responses."""

    def __init__(self, redis_client: Any | None = None, ttl: int = 3600):
        """Initialize cache.

        Args:
            redis_client: Redis client (optional, falls back to no-op if None)
            ttl: Time-to-live in seconds (default: 1 hour)
        """
        self.redis = redis_client
        self.ttl = ttl
        self.enabled = redis_client is not None

    def _generate_cache_key(
        self,
        model: str,
        messages: list[dict[str, Any]],
        temperature: float | None = None,
        max_tokens: int | None = None,
    ) -> str:
        """Generate cache key from request parameters."""
        # Create deterministic hash from request
        cache_data = {
            "model": model,
            "messages": messages,
            "temperature": temperature,
            "max_tokens": max_tokens,
        }
        cache_string = json.dumps(cache_data, sort_keys=True)
        cache_hash = hashlib.sha256(cache_string.encode()).hexdigest()
        return f"openai:cache:{model}:{cache_hash}"

    def get(
        self,
        model: str,
        messages: list[dict[str, Any]],
        temperature: float | None = None,
        max_tokens: int | None = None,
    ) -> dict[str, Any] | None:
        """Get cached response.

        Returns:
            Cached response dict or None if not found
        """
        if not self.enabled or not self.redis:
            return None
        try:
            cache_key = self._generate_cache_key(model, messages, temperature, max_tokens)
            cached = self.redis.get(cache_key)
            if cached:
                logger.info(f"Cache HIT: {cache_key[:32]}...")
                result: dict[str, Any] = json.loads(cached)
                return result
            logger.debug(f"Cache MISS: {cache_key[:32]}...")
            return None
        except Exception as e:
            logger.warning(f"Cache get failed: {e}")
            return None

    def set(
        self,
        model: str,
        messages: list[dict[str, Any]],
        response: dict[str, Any],
        temperature: float | None = None,
        max_tokens: int | None = None,
    ) -> bool:
        """Cache response.

        Returns:
            True if cached successfully, False otherwise
        """
        if not self.enabled or not self.redis:
            return False

        try:
            cache_key = self._generate_cache_key(model, messages, temperature, max_tokens)
            cache_value = json.dumps(response)
            self.redis.setex(cache_key, self.ttl, cache_value)
            logger.info(f"Cached response: {cache_key[:32]}... (TTL: {self.ttl}s)")
            return True
        except Exception as e:
            logger.warning(f"Cache set failed: {e}")
            return False

    def invalidate(self, pattern: str) -> int:
        """Invalidate cache entries matching pattern.

        Args:
            pattern: Redis key pattern (e.g., "openai:cache:gpt-4o-mini:*")

        Returns:
            Number of keys deleted
        """
        if not self.enabled or not self.redis:
            return 0

        try:
            keys = self.redis.keys(pattern)
            if keys:
                deleted = self.redis.delete(*keys)
                logger.info(f"Invalidated {deleted} cache entries matching {pattern}")
                return int(deleted) if deleted else 0
            return 0
        except Exception as e:
            logger.warning(f"Cache invalidation failed: {e}")
            return 0


# Global cache instance (lazy initialization)
_cache_instance: OpenAICache | None = None


def get_cache() -> OpenAICache:
    """Get global cache instance."""
    global _cache_instance
    if _cache_instance is None:
        # Try to initialize Redis if available
        try:
            import redis

            redis_client = redis.Redis(
                host=os.getenv("REDIS_HOST", "localhost"),
                port=int(os.getenv("REDIS_PORT", "6379")),
                db=int(os.getenv("REDIS_DB", "0")),
                decode_responses=True,
            )
            # Test connection
            redis_client.ping()
            ttl = int(os.getenv("OPENAI_CACHE_TTL", "3600"))  # 1 hour default
            _cache_instance = OpenAICache(redis_client=redis_client, ttl=ttl)
            logger.info(f"OpenAI cache initialized with Redis (TTL: {ttl}s)")
        except ImportError:
            logger.warning("Redis not installed, cache disabled. Install with: pip install redis")
            _cache_instance = OpenAICache(redis_client=None)
        except Exception as e:
            logger.warning(f"Redis not available, cache disabled: {e}")
            _cache_instance = OpenAICache(redis_client=None)
    return _cache_instance
