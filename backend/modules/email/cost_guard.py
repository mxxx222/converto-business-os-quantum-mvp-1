# 💰 Cost Guard - Resend API Cost Management

import asyncio
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any

import httpx
from backend.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()


class CostGuard:
    """Monitor and control email costs to prevent budget overruns."""
    
    def __init__(self):
        self.api_key = settings.resend_api_key
        self.base_url = "https://api.resend.com"
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        # Cost limits (in USD)
        self.monthly_limit = 100.0  # $100/month
        self.daily_limit = 5.0      # $5/day
        self.per_route_limits = {
            "pilot_onboarding": 50.0,      # $50/month
            "deployment_notification": 10.0,  # $10/month
            "error_alert": 5.0             # $5/month
        }
        
        # Resend pricing (as of 2025)
        self.cost_per_email = 0.40 / 1000  # $0.40 per 1,000 emails
        self.free_tier_limit = 100  # 100 emails/day free
        
    async def get_usage_stats(self) -> Dict[str, Any]:
        """Get current usage statistics from Resend API."""
        # Note: Resend API doesn't provide usage stats directly
        # This would need to be tracked internally or estimated
        
        # For now, return estimated usage based on our tracking
        return {
            "emails_sent_today": await self._get_emails_sent_today(),
            "emails_sent_this_month": await self._get_emails_sent_this_month(),
            "estimated_daily_cost": await self._calculate_daily_cost(),
            "estimated_monthly_cost": await self._calculate_monthly_cost()
        }
    
    async def _get_emails_sent_today(self) -> int:
        """Get emails sent today (mock implementation)."""
        # In real implementation, this would query your database
        # For now, return a mock value
        return 50
    
    async def _get_emails_sent_this_month(self) -> int:
        """Get emails sent this month (mock implementation)."""
        # In real implementation, this would query your database
        # For now, return a mock value
        return 1500
    
    async def _calculate_daily_cost(self) -> float:
        """Calculate daily cost based on usage."""
        emails_sent = await self._get_emails_sent_today()
        
        # Apply free tier
        if emails_sent <= self.free_tier_limit:
            return 0.0
        
        # Calculate cost for emails above free tier
        paid_emails = emails_sent - self.free_tier_limit
        return paid_emails * self.cost_per_email
    
    async def _calculate_monthly_cost(self) -> float:
        """Calculate monthly cost based on usage."""
        emails_sent = await self._get_emails_sent_this_month()
        
        # Apply free tier (100 emails/day * 30 days = 3000 emails/month)
        free_tier_monthly = self.free_tier_limit * 30
        
        if emails_sent <= free_tier_monthly:
            return 0.0
        
        # Calculate cost for emails above free tier
        paid_emails = emails_sent - free_tier_monthly
        return paid_emails * self.cost_per_email
    
    async def check_cost_limits(self) -> Dict[str, Any]:
        """Check if current usage exceeds cost limits."""
        usage = await self.get_usage_stats()
        
        alerts = []
        warnings = []
        
        # Check daily limit
        daily_cost = usage["estimated_daily_cost"]
        if daily_cost > self.daily_limit:
            alerts.append({
                "type": "daily_limit_exceeded",
                "limit": self.daily_limit,
                "current": daily_cost,
                "message": f"Daily cost ${daily_cost:.2f} exceeds limit ${self.daily_limit}"
            })
        elif daily_cost > self.daily_limit * 0.8:  # 80% threshold
            warnings.append({
                "type": "daily_limit_warning",
                "limit": self.daily_limit,
                "current": daily_cost,
                "message": f"Daily cost ${daily_cost:.2f} approaching limit ${self.daily_limit}"
            })
        
        # Check monthly limit
        monthly_cost = usage["estimated_monthly_cost"]
        if monthly_cost > self.monthly_limit:
            alerts.append({
                "type": "monthly_limit_exceeded",
                "limit": self.monthly_limit,
                "current": monthly_cost,
                "message": f"Monthly cost ${monthly_cost:.2f} exceeds limit ${self.monthly_limit}"
            })
        elif monthly_cost > self.monthly_limit * 0.8:  # 80% threshold
            warnings.append({
                "type": "monthly_limit_warning",
                "limit": self.monthly_limit,
                "current": monthly_cost,
                "message": f"Monthly cost ${monthly_cost:.2f} approaching limit ${self.monthly_limit}"
            })
        
        # Check per-route limits
        for route, limit in self.per_route_limits.items():
            route_usage = await self._get_route_usage(route)
            route_cost = route_usage * self.cost_per_email
            
            if route_cost > limit:
                alerts.append({
                    "type": "route_limit_exceeded",
                    "route": route,
                    "limit": limit,
                    "current": route_cost,
                    "message": f"Route {route} cost ${route_cost:.2f} exceeds limit ${limit}"
                })
            elif route_cost > limit * 0.8:  # 80% threshold
                warnings.append({
                    "type": "route_limit_warning",
                    "route": route,
                    "limit": limit,
                    "current": route_cost,
                    "message": f"Route {route} cost ${route_cost:.2f} approaching limit ${limit}"
                })
        
        return {
            "usage": usage,
            "alerts": alerts,
            "warnings": warnings,
            "limits_exceeded": len(alerts) > 0
        }
    
    async def _get_route_usage(self, route: str) -> int:
        """Get usage for specific route (mock implementation)."""
        # In real implementation, this would query your database
        # For now, return mock values
        route_usage = {
            "pilot_onboarding": 1000,
            "deployment_notification": 200,
            "error_alert": 50
        }
        return route_usage.get(route, 0)
    
    async def should_allow_email(self, template: str, recipient: str) -> Dict[str, Any]:
        """Check if email should be allowed based on cost limits."""
        cost_check = await self.check_cost_limits()
        
        # If limits exceeded, block email
        if cost_check["limits_exceeded"]:
            return {
                "allowed": False,
                "reason": "cost_limit_exceeded",
                "message": "Email blocked due to cost limit exceeded",
                "cost_info": cost_check
            }
        
        # Check if recipient is in suppression list
        if await self._is_suppressed(recipient):
            return {
                "allowed": False,
                "reason": "recipient_suppressed",
                "message": "Recipient is in suppression list",
                "cost_info": cost_check
            }
        
        # Check rate limiting
        if await self._is_rate_limited(template, recipient):
            return {
                "allowed": False,
                "reason": "rate_limited",
                "message": "Rate limit exceeded for this template/recipient",
                "cost_info": cost_check
            }
        
        return {
            "allowed": True,
            "reason": "ok",
            "message": "Email allowed",
            "cost_info": cost_check
        }
    
    async def _is_suppressed(self, recipient: str) -> bool:
        """Check if recipient is in suppression list."""
        # In real implementation, this would query your database
        # For now, return False (not suppressed)
        return False
    
    async def _is_rate_limited(self, template: str, recipient: str) -> bool:
        """Check if recipient is rate limited for template."""
        # In real implementation, this would check rate limiting rules
        # For now, return False (not rate limited)
        return False
    
    async def generate_cost_report(self) -> Dict[str, Any]:
        """Generate detailed cost report."""
        usage = await self.get_usage_stats()
        cost_check = await self.check_cost_limits()
        
        # Calculate projections
        daily_projection = usage["estimated_daily_cost"] * 30
        monthly_projection = usage["estimated_monthly_cost"]
        
        # Calculate savings from free tier
        free_tier_usage = min(usage["emails_sent_today"], self.free_tier_limit)
        free_tier_savings = free_tier_usage * self.cost_per_email
        
        return {
            "report_date": datetime.now().isoformat(),
            "current_usage": usage,
            "cost_analysis": {
                "daily_cost": usage["estimated_daily_cost"],
                "monthly_cost": usage["estimated_monthly_cost"],
                "daily_projection": daily_projection,
                "monthly_projection": monthly_projection,
                "free_tier_savings": free_tier_savings
            },
            "limits": {
                "daily_limit": self.daily_limit,
                "monthly_limit": self.monthly_limit,
                "per_route_limits": self.per_route_limits
            },
            "alerts": cost_check["alerts"],
            "warnings": cost_check["warnings"],
            "recommendations": await self._generate_recommendations(usage)
        }
    
    async def _generate_recommendations(self, usage: Dict[str, Any]) -> List[str]:
        """Generate cost optimization recommendations."""
        recommendations = []
        
        daily_cost = usage["estimated_daily_cost"]
        monthly_cost = usage["estimated_monthly_cost"]
        
        # Free tier optimization
        if usage["emails_sent_today"] < self.free_tier_limit:
            recommendations.append(
                f"You're using {usage['emails_sent_today']}/{self.free_tier_limit} free emails today. "
                f"Consider increasing volume to maximize free tier benefits."
            )
        
        # Cost optimization
        if daily_cost > self.daily_limit * 0.5:
            recommendations.append(
                "Consider implementing email batching to reduce costs and improve deliverability."
            )
        
        if monthly_cost > self.monthly_limit * 0.5:
            recommendations.append(
                "Consider upgrading to a higher tier plan for better pricing and features."
            )
        
        # Template optimization
        if usage["emails_sent_today"] > 0:
            cost_per_email = daily_cost / usage["emails_sent_today"]
            if cost_per_email > self.cost_per_email * 1.5:
                recommendations.append(
                    "Consider optimizing email templates to reduce size and improve delivery."
                )
        
        return recommendations
    
    async def send_cost_alert(self, alert_type: str, details: Dict[str, Any]):
        """Send cost alert notification."""
        # In real implementation, this would send alerts via Slack, email, etc.
        logger.warning(f"Cost alert: {alert_type} - {details}")
        
        # For now, just log the alert
        if alert_type == "daily_limit_exceeded":
            logger.error(f"Daily cost limit exceeded: ${details['current']:.2f} > ${details['limit']}")
        elif alert_type == "monthly_limit_exceeded":
            logger.error(f"Monthly cost limit exceeded: ${details['current']:.2f} > ${details['limit']}")
        elif alert_type == "route_limit_exceeded":
            logger.error(f"Route {details['route']} limit exceeded: ${details['current']:.2f} > ${details['limit']}")


# Convenience functions
def get_cost_guard() -> CostGuard:
    """Get cost guard instance."""
    return CostGuard()


async def check_email_allowed(template: str, recipient: str) -> bool:
    """Check if email is allowed based on cost limits."""
    guard = get_cost_guard()
    result = await guard.should_allow_email(template, recipient)
    return result["allowed"]


async def get_daily_cost_report() -> Dict[str, Any]:
    """Get daily cost report."""
    guard = get_cost_guard()
    return await guard.generate_cost_report()
