"""
OCR automation engine: create events, update ROI, award points.
"""
from typing import Dict, Any
from datetime import datetime
import uuid
from .classifier_ai import classify_expense


async def handle_ocr_event(tenant_id: str, user_id: str, ocr_data: Dict) -> Dict[str, Any]:
    """
    Process OCR extraction result and trigger all automations.
    
    Flow:
    1. Classify expense (VAT, budget, GL)
    2. Save to database
    3. Award Gamify points
    4. Update ROI forecast
    5. Notify user
    
    Args:
        tenant_id: Tenant identifier
        user_id: User identifier
        ocr_data: Extracted receipt data from Vision API
    
    Returns:
        Dict with entry_id, classification, points_awarded, notifications
    """
    # 1. Classify
    classification = classify_expense(ocr_data)
    
    # 2. Create entry (stub - replace with real DB save)
    entry_id = str(uuid.uuid4())
    entry = {
        "id": entry_id,
        "tenant_id": tenant_id,
        "user_id": user_id,
        "merchant": ocr_data.get("merchant"),
        "date": ocr_data.get("date") or datetime.utcnow().date().isoformat(),
        "total": ocr_data.get("total", 0.0),
        "vat_amount": ocr_data.get("vat_amount", 0.0),
        "category": classification["category"],
        "budget_line": classification["budget_line"],
        "gl_account": classification["gl_account"],
        "items": ocr_data.get("items", []),
        "confidence": ocr_data.get("confidence", 0.5),
        "created_at": datetime.utcnow().isoformat(),
    }
    # TODO: db.save(entry)
    
    # 3. Award Gamify points (stub)
    points_awarded = 10
    if ocr_data.get("confidence", 0) > 0.9:
        points_awarded += 5  # Bonus for high-quality scan
    # TODO: gamify.record_event(tenant_id, user_id, "ocr.success", points_awarded)
    
    # 4. Update ROI (stub)
    # TODO: roi_service.update_expense_forecast(tenant_id, entry)
    
    # 5. Notifications (stub)
    notifications = []
    if ocr_data.get("total", 0) > 500:
        notifications.append({
            "channel": "slack",
            "message": f"💸 Suuri kulu: {ocr_data['merchant']} - {ocr_data['total']} € - Hyväksy?",
        })
    # TODO: notify_service.send(notifications)
    
    return {
        "entry_id": entry_id,
        "entry": entry,
        "classification": classification,
        "points_awarded": points_awarded,
        "notifications": notifications,
        "automations_triggered": ["gamify", "roi_forecast", "budget_check"],
    }

