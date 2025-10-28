"""CSP report collection endpoint for security monitoring."""

from __future__ import annotations

import json
import logging
from typing import Any, Dict

from fastapi import APIRouter, Request, Response


router = APIRouter()
log = logging.getLogger("csp")


@router.post("/csp/report")
async def csp_report(request: Request) -> Response:
    """Accept CSP violation reports in JSON or text form.

    Returns 204 to indicate the report was accepted without content.
    """

    payload: Dict[str, Any]
    try:
        payload = await request.json()
    except Exception:
        raw = await request.body()
        payload = {"_raw": raw.decode("utf-8", errors="ignore")}

    report = payload.get("csp-report") or payload
    try:
        log.warning("CSP-REPORT %s", json.dumps(report)[:5000])
    except Exception:
        # Fallback in case report contains non-serializable objects
        log.warning("CSP-REPORT <non-serializable> %r", report)

    return Response(status_code=204)

