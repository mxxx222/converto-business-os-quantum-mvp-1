"""
Auto-Heal API
Monitor and manage self-healing system
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.core.auto_heal import get_auto_heal


router = APIRouter(prefix="/api/v1/admin/auto-heal", tags=["auto-heal"])


class FixResultIn(BaseModel):
    fingerprint: str
    fix: str
    success: bool
    notes: Optional[str] = None


@router.get("/stats")
def get_statistics():
    """
    Get auto-heal statistics

    Returns error counts, success rates, KB size
    """
    engine = get_auto_heal()
    return engine.get_statistics()


@router.get("/history")
def get_error_history():
    """
    Get all errors in knowledge base

    Returns list of unique errors with fix suggestions
    """
    engine = get_auto_heal()

    errors = []
    for fingerprint, entry in engine.knowledge_base.items():
        errors.append(
            {
                "fingerprint": fingerprint,
                "error_type": entry["error_type"],
                "error_message": entry["error_message"],
                "file": entry["file"],
                "count": entry["count"],
                "first_seen": entry["first_seen"],
                "last_seen": entry["last_seen"],
                "has_fix": bool(entry.get("successful_fix")),
                "fixes_attempted": len(entry.get("fixes_attempted", [])),
                "suggestion": entry.get("successful_fix"),
            }
        )

    # Sort by count (most frequent first)
    errors.sort(key=lambda e: e["count"], reverse=True)

    return {"errors": errors, "total": len(errors)}


@router.get("/error/{fingerprint}")
def get_error_detail(fingerprint: str):
    """
    Get detailed info about specific error

    Returns full KB entry including all fix attempts
    """
    engine = get_auto_heal()

    if fingerprint not in engine.knowledge_base:
        raise HTTPException(status_code=404, detail="Error not found")

    return engine.knowledge_base[fingerprint]


@router.post("/fix-result")
def record_fix_result(result: FixResultIn):
    """
    Record result of applied fix

    Body:
    ```json
    {
      "fingerprint": "a3f2c8d1e5b6...",
      "fix": "def foo():\n    return bar",
      "success": true,
      "notes": "Fixed import error"
    }
    ```
    """
    engine = get_auto_heal()

    engine.record_fix_result(
        fingerprint=result.fingerprint, fix=result.fix, success=result.success, notes=result.notes
    )

    return {"status": "ok", "message": "Fix result recorded"}


@router.get("/export")
def export_knowledge_base():
    """
    Export complete knowledge base as JSON

    Use this to backup or share KB between instances
    """
    engine = get_auto_heal()

    from fastapi.responses import Response

    return Response(
        content=engine.export_knowledge_base(),
        media_type="application/json",
        headers={"Content-Disposition": "attachment; filename=auto_heal_kb.json"},
    )


@router.post("/import")
def import_knowledge_base(kb_json: str):
    """
    Import knowledge base from JSON

    Body: Raw JSON string (from export)
    """
    engine = get_auto_heal()

    try:
        engine.import_knowledge_base(kb_json)
        return {"status": "ok", "message": "Knowledge base imported"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Import failed: {str(e)}")


@router.delete("/error/{fingerprint}")
def delete_error(fingerprint: str):
    """
    Remove error from knowledge base

    Use this to clean up old/irrelevant errors
    """
    engine = get_auto_heal()

    if fingerprint in engine.knowledge_base:
        del engine.knowledge_base[fingerprint]
        engine._save_knowledge_base()
        return {"status": "ok", "message": "Error deleted"}
    else:
        raise HTTPException(status_code=404, detail="Error not found")
