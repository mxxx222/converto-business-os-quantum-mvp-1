"""Email automation triggers and webhooks for Converto Business OS."""

import asyncio
import logging
from datetime import datetime, timedelta
from typing import Dict, Any, Optional

from .service import EmailService
from .workflows import EmailWorkflows

logger = logging.getLogger("converto.email.triggers")


class EmailTriggers:
    """Automated email triggers based on business events."""
    
    def __init__(self, email_service: EmailService):
        self.email_service = email_service
        self.workflows = EmailWorkflows(email_service)
        self.active_triggers = {}
    
    async def on_pilot_signup(self, email: str, name: str, company: str) -> Dict[str, Any]:
        """Trigger when new pilot signs up."""
        logger.info(f"Pilot signup trigger: {email}")
        
        result = await self.workflows.pilot_onboarding_sequence(email, name, company)
        
        # Store trigger data
        self.active_triggers[f"pilot_{email}"] = {
            "type": "pilot_signup",
            "email": email,
            "timestamp": datetime.now(),
            "status": "active"
        }
        
        return result
    
    async def on_deployment_status(self, service_name: str, status: str, url: str = "") -> Dict[str, Any]:
        """Trigger when deployment status changes."""
        logger.info(f"Deployment trigger: {service_name} - {status}")
        
        result = await self.workflows.deployment_notifications(service_name, status, url)
        
        # Store deployment history
        self.active_triggers[f"deployment_{service_name}_{datetime.now().timestamp()}"] = {
            "type": "deployment",
            "service": service_name,
            "status": status,
            "timestamp": datetime.now(),
            "url": url
        }
        
        return result
    
    async def on_error_occurred(self, error_message: str, service: str, severity: str = "high") -> Dict[str, Any]:
        """Trigger when error occurs."""
        logger.info(f"Error trigger: {service} - {severity}")
        
        result = await self.workflows.error_alert_workflow(error_message, service, severity)
        
        # Store error for analysis
        self.active_triggers[f"error_{service}_{datetime.now().timestamp()}"] = {
            "type": "error",
            "service": service,
            "severity": severity,
            "message": error_message,
            "timestamp": datetime.now()
        }
        
        return result
    
    async def on_daily_metrics(self, metrics: Dict[str, Any]) -> Dict[str, Any]:
        """Trigger daily metrics report."""
        logger.info("Daily metrics trigger")
        
        result = await self.workflows.daily_metrics_report(metrics)
        
        return result
    
    async def on_customer_action(self, customer_email: str, action: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Trigger when customer performs action."""
        logger.info(f"Customer action trigger: {customer_email} - {action}")
        
        # Different actions trigger different email sequences
        if action == "first_login":
            result = await self.workflows.customer_engagement_sequence(customer_email, data.get("name", ""))
        elif action == "billing_due":
            result = await self.workflows.billing_notifications(
                customer_email, 
                data.get("amount", 0), 
                data.get("due_date", "")
            )
        else:
            result = {"status": "no_action", "action": action}
        
        return result
    
    async def on_webhook_received(self, webhook_data: Dict[str, Any]) -> Dict[str, Any]:
        """Process incoming webhooks."""
        webhook_type = webhook_data.get("type")
        
        if webhook_type == "stripe.payment_succeeded":
            return await self._handle_stripe_payment(webhook_data)
        elif webhook_type == "stripe.payment_failed":
            return await self._handle_stripe_payment_failed(webhook_data)
        elif webhook_type == "github.push":
            return await self._handle_github_push(webhook_data)
        else:
            logger.warning(f"Unknown webhook type: {webhook_type}")
            return {"status": "ignored", "type": webhook_type}
    
    async def _handle_stripe_payment(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Handle successful Stripe payment."""
        customer_email = data.get("data", {}).get("object", {}).get("customer_email")
        amount = data.get("data", {}).get("object", {}).get("amount")
        
        if customer_email:
            # Send payment confirmation
            email_data = EmailData(
                to=customer_email,
                subject="💳 Maksu vahvistettu - Converto Business OS",
                html=f"""
                <h1>Maksu vahvistettu!</h1>
                <p>Kiitos maksustasi {amount/100}€</p>
                <p>Palvelusi on nyt aktiivinen.</p>
                """,
                tags=[{"name": "payment", "value": "success"}]
            )
            
            result = await self.email_service.send_email(email_data)
            return {"type": "stripe_payment", "result": result}
        
        return {"status": "no_customer_email"}
    
    async def _handle_stripe_payment_failed(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Handle failed Stripe payment."""
        customer_email = data.get("data", {}).get("object", {}).get("customer_email")
        
        if customer_email:
            # Send payment failure notification
            email_data = EmailData(
                to=customer_email,
                subject="⚠️ Maksu epäonnistui - Converto Business OS",
                html="""
                <h1>Maksu epäonnistui</h1>
                <p>Maksusi ei voitu käsitellä. Tarkista maksutiedot.</p>
                <p>Päivitä maksutiedot: <a href="https://converto.fi/billing">converto.fi/billing</a></p>
                """,
                tags=[{"name": "payment", "value": "failed"}]
            )
            
            result = await self.email_service.send_email(email_data)
            return {"type": "stripe_payment_failed", "result": result}
        
        return {"status": "no_customer_email"}
    
    async def _handle_github_push(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Handle GitHub push webhook."""
        repository = data.get("repository", {}).get("name")
        commits = data.get("commits", [])
        
        if repository and commits:
            # Send deployment notification
            commit_message = commits[0].get("message", "Code updated") if commits else "Code updated"
            
            result = await self.workflows.deployment_notifications(
                repository, "triggered", f"https://github.com/mxxx222/{repository}"
            )
            
            return {"type": "github_push", "repository": repository, "result": result}
        
        return {"status": "no_repository"}
    
    async def cleanup_old_triggers(self, days: int = 30):
        """Clean up old trigger data."""
        cutoff_date = datetime.now() - timedelta(days=days)
        
        to_remove = []
        for trigger_id, trigger_data in self.active_triggers.items():
            if trigger_data.get("timestamp", datetime.now()) < cutoff_date:
                to_remove.append(trigger_id)
        
        for trigger_id in to_remove:
            del self.active_triggers[trigger_id]
        
        logger.info(f"Cleaned up {len(to_remove)} old triggers")
        return len(to_remove)
    
    async def get_trigger_stats(self) -> Dict[str, Any]:
        """Get trigger statistics."""
        trigger_types = {}
        for trigger_data in self.active_triggers.values():
            trigger_type = trigger_data.get("type", "unknown")
            trigger_types[trigger_type] = trigger_types.get(trigger_type, 0) + 1
        
        return {
            "total_triggers": len(self.active_triggers),
            "trigger_types": trigger_types,
            "active_since": min(
                [t.get("timestamp", datetime.now()) for t in self.active_triggers.values()],
                default=datetime.now()
            ).isoformat()
        }
