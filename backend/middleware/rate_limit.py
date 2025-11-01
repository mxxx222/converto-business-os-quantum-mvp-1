"""Rate limiting middleware for FastAPI - ROI MAXIMIZED."""

from fastapi import Request
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware

from shared_core.utils.redis import rate_limiter

# Default rate limits (requests per minute)
DEFAULT_RATE_LIMITS = {
    "/api/v1/ai/chat": 60,  # 60 requests/min for AI chat
    "/api/v1/receipts/scan": 30,  # 30 requests/min for OCR
    "/api/pilot": 5,  # 5 requests/min for pilot signup
    "/api/contact": 10,  # 10 requests/min for contact form
}


class RateLimitMiddleware(BaseHTTPMiddleware):
    """Rate limiting middleware using Redis."""

    async def dispatch(self, request: Request, call_next):
        """Check rate limit before processing request."""

        # Skip rate limiting for health checks
        if request.url.path in ["/health", "/metrics", "/docs", "/openapi.json"]:
            return await call_next(request)

        # Get rate limit for path
        limit = None
        for path, rate in DEFAULT_RATE_LIMITS.items():
            if request.url.path.startswith(path):
                limit = rate
                break

        # If no specific limit, use default
        if limit is None:
            limit = 100  # Default: 100 requests/min

        # Get rate limit key (IP or user ID)
        client_ip = request.client.host if request.client else "unknown"
        user_id = getattr(request.state, "user_id", None)

        rate_limit_key = f"user:{user_id}" if user_id else f"ip:{client_ip}"

        # Check rate limit
        allowed, remaining = rate_limiter.check_rate_limit(
            key=rate_limit_key,
            limit=limit,
            window=60,  # 1 minute window
        )

        if not allowed:
            return JSONResponse(
                status_code=429,
                content={
                    "error": "Rate limit exceeded",
                    "message": f"Too many requests. Limit: {limit}/min",
                    "retry_after": 60,
                },
                headers={
                    "X-RateLimit-Limit": str(limit),
                    "X-RateLimit-Remaining": "0",
                    "Retry-After": "60",
                },
            )

        # Add rate limit headers
        response = await call_next(request)
        response.headers["X-RateLimit-Limit"] = str(limit)
        response.headers["X-RateLimit-Remaining"] = str(remaining)

        return response
