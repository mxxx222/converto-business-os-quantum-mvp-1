"""Optimized Resend Email Service with all Pro features."""

import os
from datetime import datetime, timedelta
from typing import List, Optional, Dict, Any
import httpx
from pathlib import Path

RESEND_API_KEY = os.getenv("RESEND_API_KEY", "")
RESEND_API_BASE = "https://api.resend.com"


class ResendServiceOptimized:
    """Optimized Resend service with Templates, Batch, Scheduled, Attachments."""

    def __init__(self):
        self.api_key = RESEND_API_KEY
        self.base_url = RESEND_API_BASE
        if not self.api_key:
            raise ValueError("RESEND_API_KEY not configured")

    async def _request(
        self,
        method: str,
        endpoint: str,
        data: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """Make API request."""
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }

        async with httpx.AsyncClient() as client:
            if method == "GET":
                response = await client.get(f"{self.base_url}{endpoint}", headers=headers)
            elif method == "POST":
                response = await client.post(
                    f"{self.base_url}{endpoint}", headers=headers, json=data
                )
            else:
                raise ValueError(f"Unsupported method: {method}")

            response.raise_for_status()
            return response.json()

    async def send_batch(self, emails: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Send batch emails (10x faster)."""
        return await self._request("POST", "/batch", data={"emails": emails})

    async def schedule_email(
        self,
        to: str | List[str],
        subject: str,
        html: str,
        scheduled_at: datetime,
        from_email: str = "info@converto.fi",
    ) -> Dict[str, Any]:
        """Schedule email for future delivery."""
        data = {
            "from": from_email,
            "to": to if isinstance(to, list) else [to],
            "subject": subject,
            "html": html,
            "scheduled_at": scheduled_at.isoformat(),
        }
        return await self._request("POST", "/emails", data=data)

    async def send_with_template(
        self,
        template_id: str,
        to: str | List[str],
        template_data: Dict[str, Any],
        from_email: str = "info@converto.fi",
    ) -> Dict[str, Any]:
        """Send email using template."""
        data = {
            "from": from_email,
            "to": to if isinstance(to, list) else [to],
            "template_id": template_id,
            "template_data": template_data,
        }
        return await self._request("POST", "/emails", data=data)

    async def send_with_attachment(
        self,
        to: str | List[str],
        subject: str,
        html: str,
        attachment_path: str,
        from_email: str = "info@converto.fi",
    ) -> Dict[str, Any]:
        """Send email with attachment (requires multipart/form-data)."""
        import base64

        # Read and encode file
        with open(attachment_path, "rb") as f:
            file_content = f.read()
            file_base64 = base64.b64encode(file_content).decode("utf-8")

        data = {
            "from": from_email,
            "to": to if isinstance(to, list) else [to],
            "subject": subject,
            "html": html,
            "attachments": [
                {
                    "filename": Path(attachment_path).name,
                    "content": file_base64,
                }
            ],
        }
        return await self._request("POST", "/emails", data=data)

    async def get_analytics(self, email_id: str) -> Dict[str, Any]:
        """Get email analytics."""
        return await self._request("GET", f"/emails/{email_id}")

