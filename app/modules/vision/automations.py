"""
OCR automation engine: create events, update ROI, award points.
"""
from datetime import datetime
from typing import Dict

# MVP in-memory store (replace with DB/ORM)
_STORE = {"receipts": []}


def _persist(tenant_id: str, user_id: str, data: Dict) -> str:
    """Save receipt to in-memory store (stub for DB)."""
    rid = f"rcpt_{len(_STORE['receipts']) + 1:06d}"
    _STORE["receipts"].append({
        "id": rid,
        "tenant_id": tenant_id,
        "user_id": user_id,
        "data": data,
        "created_at": datetime.utcnow().isoformat(),
    })
    return rid


async def handle_ocr_event(tenant_id: str, user_id: str, data: Dict) -> Dict:
    """
    Process OCR extraction result and trigger automations.
    
    Args:
        tenant_id: Tenant identifier
        user_id: User identifier
        data: Enriched OCR data (from classifier)
    
    Returns:
        Dict with receipt_id, data
    """
    rid = _persist(tenant_id, user_id, data)
    
    # TODO: Real integrations
    # - link_to_ledger(data)
    # - update_roi(tenant_id, data)
    # - await award_points(tenant_id, user_id, "ocr_success", 10)
    
    return {"receipt_id": rid, "data": data}

