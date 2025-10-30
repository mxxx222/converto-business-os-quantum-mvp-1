"""Email automation workflows for Converto Business OS."""

import asyncio
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional

from .service import EmailService, EmailData
from .templates import EmailTemplates

logger = logging.getLogger("converto.email.workflows")


class EmailWorkflows:
    """Automated email workflows for business processes."""
    
    def __init__(self, email_service: EmailService):
        self.email_service = email_service
        self.templates = EmailTemplates()
    
    async def pilot_onboarding_sequence(self, email: str, name: str, company: str) -> Dict[str, Any]:
        """Complete pilot onboarding email sequence."""
        results = []
        
        # Day 0: Welcome email
        welcome_email = EmailData(
            to=email,
            subject="🚀 Tervetuloa Converto Business OS:een!",
            html=self.templates.pilot_signup_welcome(name, company),
            tags=[{"name": "onboarding", "value": "welcome"}]
        )
        result = await self.email_service.send_email(welcome_email)
        results.append({"step": "welcome", "result": result})
        
        # Schedule follow-up emails
        await self._schedule_follow_up_emails(email, name, company)
        
        return {
            "sequence": "pilot_onboarding",
            "total_emails": 5,
            "sent": len([r for r in results if r["result"].get("success")]),
            "results": results
        }
    
    async def _schedule_follow_up_emails(self, email: str, name: str, company: str):
        """Schedule follow-up emails for pilot onboarding."""
        # This would integrate with a job queue like Celery or APScheduler
        # For now, we'll just log the scheduled emails
        logger.info(f"Scheduled follow-up emails for {email}")
        
        follow_ups = [
            {"day": 1, "subject": "📋 Käyttöohjeet ja ensimmäiset askeleet"},
            {"day": 3, "subject": "🎯 15 min onboarding-kutsu"},
            {"day": 7, "subject": "📊 Ensimmäiset automatisointitulokset"},
            {"day": 14, "subject": "💡 Lisätoiminnot ja optimointi"}
        ]
        
        for follow_up in follow_ups:
            logger.info(f"Email scheduled for day {follow_up['day']}: {follow_up['subject']}")
    
    async def deployment_notifications(self, service_name: str, status: str, url: str = "") -> Dict[str, Any]:
        """Send deployment notifications."""
        recipients = ["max@herbspot.fi", "team@converto.fi"]
        results = []
        
        if status == "success":
            subject = f"✅ {service_name} - Deployment Onnistui"
            html = self.templates.deployment_success(service_name, url)
        else:
            subject = f"❌ {service_name} - Deployment Epäonnistui"
            html = f"""
            <h1>Deployment Epäonnistui</h1>
            <p><strong>Palvelu:</strong> {service_name}</p>
            <p><strong>Status:</strong> {status}</p>
            <p>Tarkista lokit ja korjaa ongelmat.</p>
            """
        
        for recipient in recipients:
            email = EmailData(
                to=recipient,
                subject=subject,
                html=html,
                tags=[{"name": "deployment", "value": service_name}]
            )
            result = await self.email_service.send_email(email)
            results.append({"recipient": recipient, "result": result})
        
        return {
            "service": service_name,
            "status": status,
            "recipients": len(recipients),
            "results": results
        }
    
    async def daily_metrics_report(self, metrics: Dict[str, Any]) -> Dict[str, Any]:
        """Send daily metrics report."""
        recipients = ["max@herbspot.fi", "team@converto.fi"]
        
        email = EmailData(
            to=",".join(recipients),
            subject=f"📊 Päivittäinen Raportti - {metrics.get('date', datetime.now().strftime('%Y-%m-%d'))}",
            html=self.templates.daily_metrics_report(metrics),
            tags=[{"name": "report", "value": "daily_metrics"}]
        )
        
        result = await self.email_service.send_email(email)
        return {
            "type": "daily_metrics",
            "date": metrics.get('date'),
            "result": result
        }
    
    async def error_alert_workflow(self, error_message: str, service: str, severity: str = "high") -> Dict[str, Any]:
        """Send error alerts with escalation."""
        recipients = ["max@herbspot.fi"]
        
        # Add team members for critical errors
        if severity == "critical":
            recipients.append("team@converto.fi")
        
        email = EmailData(
            to=",".join(recipients),
            subject=f"🚨 {severity.upper()} - {service}",
            html=self.templates.error_alert(error_message, service, severity),
            tags=[{"name": "alert", "value": severity}]
        )
        
        result = await self.email_service.send_email(email)
        
        # Schedule follow-up for critical errors
        if severity == "critical":
            await self._schedule_error_follow_up(service, error_message)
        
        return {
            "service": service,
            "severity": severity,
            "result": result
        }
    
    async def _schedule_error_follow_up(self, service: str, error_message: str):
        """Schedule follow-up for critical errors."""
        logger.info(f"Scheduled error follow-up for {service}")
        # This would integrate with a job queue
    
    async def customer_engagement_sequence(self, customer_email: str, customer_name: str) -> Dict[str, Any]:
        """Customer engagement email sequence."""
        # This would be triggered by customer actions
        logger.info(f"Customer engagement sequence started for {customer_email}")
        return {"status": "scheduled", "customer": customer_email}
    
    async def billing_notifications(self, customer_email: str, amount: float, due_date: str) -> Dict[str, Any]:
        """Send billing notifications."""
        email = EmailData(
            to=customer_email,
            subject="💳 Lasku lähestyy - Converto Business OS",
            html=f"""
            <h1>Lasku lähestyy</h1>
            <p>Hei!</p>
            <p>Lasku summa: {amount}€</p>
            <p>Eräpäivä: {due_date}</p>
            <p>Maksa nyt: <a href="https://converto.fi/billing">converto.fi/billing</a></p>
            """,
            tags=[{"name": "billing", "value": "reminder"}]
        )
        
        result = await self.email_service.send_email(email)
        return {"type": "billing_reminder", "result": result}
    
    async def close(self):
        """Close the email service."""
        await self.email_service.close()
