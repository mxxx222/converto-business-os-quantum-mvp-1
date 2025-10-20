from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any
import hashlib
import time
import os
import json
import redis

router = APIRouter(prefix="/api/v1/audit", tags=["audit"])

redis_client = redis.Redis(
    host=os.getenv("REDIS_HOST", "localhost"),
    port=int(os.getenv("REDIS_PORT", "6379")),
    db=int(os.getenv("REDIS_DB", "0")),
    decode_responses=True,
)


class AuditRecord(BaseModel):
    tenant_id: str
    entity_type: str  # invoice, payment, report, etc.
    entity_id: str
    payload: Dict[str, Any]
    prev_hash: Optional[str] = None


@router.post("/record")
def record_audit(entry: AuditRecord):
    ts = int(time.time())
    base = {
        "tenant_id": entry.tenant_id,
        "entity_type": entry.entity_type,
        "entity_id": entry.entity_id,
        "payload": entry.payload,
        "prev_hash": entry.prev_hash,
        "timestamp": ts,
    }
    raw = json.dumps(base, sort_keys=True)
    h = hashlib.sha256(raw.encode()).hexdigest()
    base["hash"] = h
    key = f"audit:{entry.tenant_id}:{entry.entity_type}:{entry.entity_id}:{ts}"
    redis_client.set(key, json.dumps(base))
    # Store head pointer
    redis_client.set(f"audit:head:{entry.tenant_id}:{entry.entity_type}:{entry.entity_id}", h)
    return {"status": "ok", "hash": h, "timestamp": ts}


@router.get("/verify/{tenant_id}/{entity_type}/{entity_id}")
def verify_chain(tenant_id: str, entity_type: str, entity_id: str):
    # Fetch all entries for entity (simplified scan)
    keys = sorted(redis_client.keys(f"audit:{tenant_id}:{entity_type}:{entity_id}:*"))
    valid = True
    last_hash = None
    for k in keys:
        data = json.loads(redis_client.get(k) or '{}')
        payload = {k2: v for k2, v in data.items() if k2 != 'hash'}
        h = hashlib.sha256(json.dumps(payload, sort_keys=True).encode()).hexdigest()
        if h != data.get('hash'):
            valid = False
            break
        if data.get('prev_hash') and data['prev_hash'] != last_hash:
            valid = False
            break
        last_hash = data.get('hash')
    return {"valid": valid, "count": len(keys), "last_hash": last_hash}


