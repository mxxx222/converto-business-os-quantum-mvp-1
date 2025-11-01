"""Redis management endpoints - ROI MAXIMIZED."""

from typing import Any

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from shared_core.utils.redis import (
    advanced_cache,
    get_redis_client,
    pubsub_manager,
    queue_manager,
    rate_limiter,
    session_manager,
)

router = APIRouter(prefix="/api/v1/redis", tags=["redis"])


class SessionData(BaseModel):
    session_id: str
    data: dict[str, Any]
    ttl: int | None = None


class QueueJob(BaseModel):
    queue_name: str
    job: dict[str, Any]


class PubSubMessage(BaseModel):
    channel: str
    message: dict[str, Any]


class CacheData(BaseModel):
    key: str
    value: Any
    ttl: int | None = None


@router.get("/health")
async def redis_health():
    """Check Redis connection health."""
    client = get_redis_client()
    if not client:
        return {"status": "unavailable", "message": "Redis not configured"}

    try:
        client.ping()
        return {"status": "healthy", "message": "Redis connected"}
    except Exception as e:
        return {"status": "unhealthy", "message": str(e)}


# Session Management
@router.post("/sessions")
async def create_session(session_data: SessionData):
    """Create or update session."""
    success = session_manager.set_session(
        session_id=session_data.session_id,
        data=session_data.data,
        ttl=session_data.ttl,
    )
    if not success:
        raise HTTPException(status_code=500, detail="Failed to create session")
    return {"success": True, "session_id": session_data.session_id}


@router.get("/sessions/{session_id}")
async def get_session(session_id: str):
    """Get session data."""
    data = session_manager.get_session(session_id)
    if data is None:
        raise HTTPException(status_code=404, detail="Session not found")
    return {"session_id": session_id, "data": data}


@router.delete("/sessions/{session_id}")
async def delete_session(session_id: str):
    """Delete session."""
    success = session_manager.delete_session(session_id)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to delete session")
    return {"success": True, "session_id": session_id}


# Rate Limiting
@router.get("/rate-limit/{key}")
async def check_rate_limit(key: str, limit: int = 100, window: int = 60):
    """Check rate limit status."""
    allowed, remaining = rate_limiter.check_rate_limit(
        key=key,
        limit=limit,
        window=window,
    )
    return {
        "key": key,
        "allowed": allowed,
        "remaining": remaining,
        "limit": limit,
        "window": window,
    }


# Queue Management
@router.post("/queues/enqueue")
async def enqueue_job(job: QueueJob):
    """Add job to queue."""
    success = queue_manager.enqueue(job.queue_name, job.job)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to enqueue job")
    return {"success": True, "queue_name": job.queue_name}


@router.post("/queues/dequeue")
async def dequeue_job(queue_name: str, timeout: int = 0):
    """Get job from queue."""
    job = queue_manager.dequeue(queue_name, timeout)
    if job is None:
        raise HTTPException(status_code=404, detail="No jobs available")
    return {"queue_name": queue_name, "job": job}


@router.get("/queues/{queue_name}/length")
async def get_queue_length(queue_name: str):
    """Get queue length."""
    length = queue_manager.queue_length(queue_name)
    return {"queue_name": queue_name, "length": length}


# Pub/Sub
@router.post("/pubsub/publish")
async def publish_message(message: PubSubMessage):
    """Publish message to channel."""
    success = pubsub_manager.publish(message.channel, message.message)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to publish message")
    return {"success": True, "channel": message.channel}


# Advanced Caching
@router.post("/cache")
async def set_cache(cache_data: CacheData):
    """Set cached value."""
    success = advanced_cache.cache_set(
        key=cache_data.key,
        value=cache_data.value,
        ttl=cache_data.ttl,
    )
    if not success:
        raise HTTPException(status_code=500, detail="Failed to set cache")
    return {"success": True, "key": cache_data.key}


@router.get("/cache/{key}")
async def get_cache(key: str):
    """Get cached value."""
    value = advanced_cache.cache_get(key)
    if value is None:
        raise HTTPException(status_code=404, detail="Cache key not found")
    return {"key": key, "value": value}


@router.delete("/cache/{pattern}")
async def delete_cache(pattern: str):
    """Delete cache entries matching pattern."""
    deleted = advanced_cache.cache_delete(pattern)
    return {"pattern": pattern, "deleted": deleted}
