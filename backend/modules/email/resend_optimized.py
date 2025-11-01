"""Optimized Resend API integration with Templates, Batch, Scheduled, and Attachments."""

import os
from datetime import datetime, timedelta
from typing import List, Optional, Dict, Any
import httpx
from pathlib import Path

RESEND_API_KEY = os.getenv("RESEND_API_KEY", "")
RESEND_API_BASE = "https://api.resend.com"


class ResendOptimized:
    """Optimized Resend API client with all Pro features."""

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
        files: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """Make API request to Resend."""
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }

        async with httpx.AsyncClient() as client:
            if method == "GET":
                response = await client.get(
                    f"{self.base_url}{endpoint}",
                    headers=headers,
                )
            elif method == "POST":
                if files:
                    # For attachments, use multipart/form-data
                    headers.pop("Content-Type")
                    response = await client.post(
                        f"{self.base_url}{endpoint}",
                        headers=headers,
                        data=data,
                        files=files,
                    )
                else:
                    response = await client.post(
                        f"{self.base_url}{endpoint}",
                        headers=headers,
                        json=data,
                    )
            else:
                raise ValueError(f"Unsupported method: {method}")

            response.raise_for_status()
            return response.json()

    # ========== TEMPLATES API ==========

    async def create_template(
        self,
        name: str,
        subject: str,
        html: str,
        text: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Create email template in Resend."""
        data = {
            "name": name,
            "subject": subject,
            "html": html,
        }
        if text:
            data["text"] = text

        return await self._request("POST", "/email-templates", data=data)

    async def send_with_template(
        self,
        template_id: str,
        to: str | List[str],
        template_data: Dict[str, Any],
        from_email: str = "info@converto.fi",
        reply_to: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Send email using Resend template."""
        data = {
            "from": from_email,
            "to": to if isinstance(to, list) else [to],
            "template_id": template_id,
            "template_data": template_data,
        }
        if reply_to:
            data["reply_to"] = reply_to

        return await self._request("POST", "/emails", data=data)

    # ========== BATCH SENDING ==========

    async def send_batch(
        self,
        emails: List[Dict[str, Any]],
    ) -> Dict[str, Any]:
        """Send multiple emails via Resend Batch API."""
        data = {"emails": emails}
        return await self._request("POST", "/batch", data=data)

    # ========== SCHEDULED EMAILS ==========

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

    # ========== ATTACHMENTS ==========

    async def send_with_attachment(
        self,
        to: str | List[str],
        subject: str,
        html: str,
        attachment_path: str,
        attachment_name: Optional[str] = None,
        from_email: str = "info@converto.fi",
    ) -> Dict[str, Any]:
        """Send email with attachment."""
        attachment_name = attachment_name or Path(attachment_path).name

        # Read file
        with open(attachment_path, "rb") as f:
            file_content = f.read()

        # Prepare multipart form data
        data = {
            "from": from_email,
            "to": to if isinstance(to, list) else ",".join(to) if isinstance(to, list) else to,
            "subject": subject,
            "html": html,
        }

        files = {
            "attachment": (attachment_name, file_content),
        }

        return await self._request("POST", "/emails", data=data, files=files)

    # ========== ANALYTICS ==========

    async def get_email_analytics(self, email_id: str) -> Dict[str, Any]:
        """Get email analytics from Resend."""
        return await self._request("GET", f"/emails/{email_id}")

    # ========== WORKFLOW HELPERS ==========

    async def send_welcome_sequence(
        self,
        email: str,
        name: str,
        company: str,
    ) -> List[Dict[str, Any]]:
        """Send welcome email sequence (Day 1, 3, 7)."""
        welcome_html = f"""
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563EB;">Tervetuloa Converto-ekosysteemiin!</h1>
          <p>Hei {name},</p>
          <p>Kiitos kiinnostuksestasi Converto Business OS™:ää kohtaan!</p>
          <p>Ystävällisin terveisin,<br>Converto-tiimi</p>
        </div>
        """

        results = []

        # Day 1: Immediate welcome
        result1 = await self.send_with_template(
            template_id="tmpl_welcome",  # Will be created in Resend
            to=email,
            template_data={"name": name, "company": company},
        )
        results.append(result1)

        # Day 3: Follow-up
        day3 = datetime.now() + timedelta(days=3)
        result2 = await self.schedule_email(
            to=email,
            subject=f"{name}, kuinka eteneekä Business OS:lla?",
            html=f"<p>Hei {name},<br>Kysymyksiä? Vastaa tähän sähköpostiin!</p>",
            scheduled_at=day3,
        )
        results.append(result2)

        # Day 7: Final follow-up
        day7 = datetime.now() + timedelta(days=7)
        result3 = await self.schedule_email(
            to=email,
            subject=f"{name}, tarvitsetko apua Business OS:lla?",
            html=f"<p>Hei {name},<br>Voimme auttaa optimoimaan käyttöäsi!</p>",
            scheduled_at=day7,
        )
        results.append(result3)

        return results

