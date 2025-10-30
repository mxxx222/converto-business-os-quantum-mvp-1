"""Email API routes for Converto Business OS."""

import logging
from typing import Dict, Any, List

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel

from .service import EmailService, EmailData
from .workflows import EmailWorkflows
from .templates import EmailTemplates

logger = logging.getLogger("converto.email")
router = APIRouter(prefix="/api/v1/email", tags=["email"])


# Dependency to get email service
def get_email_service() -> EmailService:
    """Get email service instance."""
    import os
    api_key = os.getenv("RESEND_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="RESEND_API_KEY not configured")
    return EmailService(api_key)


def get_email_workflows(email_service: EmailService = Depends(get_email_service)) -> EmailWorkflows:
    """Get email workflows instance."""
    return EmailWorkflows(email_service)


# Request models
class SendEmailRequest(BaseModel):
    to: str
    subject: str
    html: str
    from_email: str = "noreply@converto.fi"
    reply_to: str = None
    tags: List[Dict[str, str]] = None


class PilotSignupRequest(BaseModel):
    email: str
    name: str
    company: str


class DeploymentNotificationRequest(BaseModel):
    service_name: str
    status: str
    url: str = ""


class DailyReportRequest(BaseModel):
    metrics: Dict[str, Any]


class ErrorAlertRequest(BaseModel):
    error_message: str
    service: str
    severity: str = "high"


# Routes
@router.post("/send")
async def send_email(
    request: SendEmailRequest,
    email_service: EmailService = Depends(get_email_service)
) -> Dict[str, Any]:
    """Send a single email."""
    try:
        email_data = EmailData(
            to=request.to,
            subject=request.subject,
            html=request.html,
            from_email=request.from_email,
            reply_to=request.reply_to,
            tags=request.tags
        )
        
        result = await email_service.send_email(email_data)
        return result
    except Exception as e:
        logger.error(f"Failed to send email: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/pilot-signup")
async def pilot_signup_workflow(
    request: PilotSignupRequest,
    workflows: EmailWorkflows = Depends(get_email_workflows)
) -> Dict[str, Any]:
    """Trigger pilot signup email workflow."""
    try:
        result = await workflows.pilot_onboarding_sequence(
            request.email, request.name, request.company
        )
        return result
    except Exception as e:
        logger.error(f"Pilot signup workflow failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/deployment-notification")
async def deployment_notification(
    request: DeploymentNotificationRequest,
    workflows: EmailWorkflows = Depends(get_email_workflows)
) -> Dict[str, Any]:
    """Send deployment notification."""
    try:
        result = await workflows.deployment_notifications(
            request.service_name, request.status, request.url
        )
        return result
    except Exception as e:
        logger.error(f"Deployment notification failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/daily-report")
async def daily_report(
    request: DailyReportRequest,
    workflows: EmailWorkflows = Depends(get_email_workflows)
) -> Dict[str, Any]:
    """Send daily metrics report."""
    try:
        result = await workflows.daily_metrics_report(request.metrics)
        return result
    except Exception as e:
        logger.error(f"Daily report failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/error-alert")
async def error_alert(
    request: ErrorAlertRequest,
    workflows: EmailWorkflows = Depends(get_email_workflows)
) -> Dict[str, Any]:
    """Send error alert."""
    try:
        result = await workflows.error_alert_workflow(
            request.error_message, request.service, request.severity
        )
        return result
    except Exception as e:
        logger.error(f"Error alert failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/templates")
async def get_templates() -> Dict[str, Any]:
    """Get available email templates."""
    templates = EmailTemplates()
    return {
        "templates": [
            "pilot_signup_welcome",
            "deployment_success", 
            "daily_metrics_report",
            "error_alert"
        ],
        "example": {
            "pilot_signup_welcome": templates.pilot_signup_welcome("Testi", "Testi Oy")
        }
    }


@router.get("/health")
async def email_health() -> Dict[str, str]:
    """Email service health check."""
    return {"status": "healthy", "service": "email"}
