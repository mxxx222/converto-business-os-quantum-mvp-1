# 📊 Email Monitoring - Resend Metrics & Alerts

import asyncio
import logging
import time
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any

import httpx
from prometheus_client import Counter, Histogram, Gauge, CollectorRegistry

from backend.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()


class EmailMonitoring:
    """Monitor email delivery, engagement, and costs."""
    
    def __init__(self):
        self.api_key = settings.resend_api_key
        self.base_url = "https://api.resend.com"
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        # Prometheus metrics
        self.registry = CollectorRegistry()
        self._setup_metrics()
    
    def _setup_metrics(self):
        """Setup Prometheus metrics."""
        # Email delivery metrics
        self.emails_sent = Counter(
            'resend_emails_sent_total',
            'Total emails sent',
            ['template', 'locale', 'status'],
            registry=self.registry
        )
        
        self.emails_delivered = Counter(
            'resend_emails_delivered_total',
            'Total emails delivered',
            ['template', 'locale'],
            registry=self.registry
        )
        
        self.emails_opened = Counter(
            'resend_emails_opened_total',
            'Total emails opened',
            ['template', 'locale'],
            registry=self.registry
        )
        
        self.emails_clicked = Counter(
            'resend_emails_clicked_total',
            'Total emails clicked',
            ['template', 'locale'],
            registry=self.registry
        )
        
        self.emails_bounced = Counter(
            'resend_emails_bounced_total',
            'Total emails bounced',
            ['template', 'bounce_type'],
            registry=self.registry
        )
        
        self.emails_complained = Counter(
            'resend_emails_complained_total',
            'Total emails complained',
            ['template'],
            registry=self.registry
        )
        
        # Performance metrics
        self.delivery_latency = Histogram(
            'resend_delivery_latency_seconds',
            'Email delivery latency',
            ['template'],
            registry=self.registry
        )
        
        self.webhook_latency = Histogram(
            'resend_webhook_latency_seconds',
            'Webhook processing latency',
            ['event_type'],
            registry=self.registry
        )
        
        # Rate metrics
        self.delivery_rate = Gauge(
            'resend_delivery_rate',
            'Email delivery rate',
            ['template'],
            registry=self.registry
        )
        
        self.open_rate = Gauge(
            'resend_open_rate',
            'Email open rate',
            ['template'],
            registry=self.registry
        )
        
        self.click_rate = Gauge(
            'resend_click_rate',
            'Email click rate',
            ['template'],
            registry=self.registry
        )
        
        self.bounce_rate = Gauge(
            'resend_bounce_rate',
            'Email bounce rate',
            ['template'],
            registry=self.registry
        )
        
        self.complaint_rate = Gauge(
            'resend_complaint_rate',
            'Email complaint rate',
            ['template'],
            registry=self.registry
        )
        
        # Cost metrics
        self.monthly_cost = Gauge(
            'resend_monthly_cost_usd',
            'Monthly email cost in USD',
            registry=self.registry
        )
        
        self.daily_cost = Gauge(
            'resend_daily_cost_usd',
            'Daily email cost in USD',
            registry=self.registry
        )
    
    async def record_email_sent(self, template: str, locale: str, status: str):
        """Record email sent event."""
        self.emails_sent.labels(template=template, locale=locale, status=status).inc()
        logger.info(f"Email sent: {template}/{locale} - {status}")
    
    async def record_email_delivered(self, template: str, locale: str, latency: float):
        """Record email delivered event."""
        self.emails_delivered.labels(template=template, locale=locale).inc()
        self.delivery_latency.labels(template=template).observe(latency)
        logger.info(f"Email delivered: {template}/{locale} - {latency:.2f}s")
    
    async def record_email_opened(self, template: str, locale: str):
        """Record email opened event."""
        self.emails_opened.labels(template=template, locale=locale).inc()
        logger.info(f"Email opened: {template}/{locale}")
    
    async def record_email_clicked(self, template: str, locale: str):
        """Record email clicked event."""
        self.emails_clicked.labels(template=template, locale=locale).inc()
        logger.info(f"Email clicked: {template}/{locale}")
    
    async def record_email_bounced(self, template: str, bounce_type: str):
        """Record email bounced event."""
        self.emails_bounced.labels(template=template, bounce_type=bounce_type).inc()
        logger.warning(f"Email bounced: {template} - {bounce_type}")
    
    async def record_email_complained(self, template: str):
        """Record email complained event."""
        self.emails_complained.labels(template=template).inc()
        logger.warning(f"Email complained: {template}")
    
    async def record_webhook_processed(self, event_type: str, latency: float):
        """Record webhook processing event."""
        self.webhook_latency.labels(event_type=event_type).observe(latency)
        logger.info(f"Webhook processed: {event_type} - {latency:.2f}s")
    
    async def update_rates(self, template: str):
        """Update rate metrics for template."""
        # Get counts from Prometheus
        sent_count = self.emails_sent.labels(template=template, locale='*', status='*')._value.get()
        delivered_count = self.emails_delivered.labels(template=template, locale='*')._value.get()
        opened_count = self.emails_opened.labels(template=template, locale='*')._value.get()
        clicked_count = self.emails_clicked.labels(template=template, locale='*')._value.get()
        bounced_count = self.emails_bounced.labels(template=template, bounce_type='*')._value.get()
        complained_count = self.emails_complained.labels(template=template)._value.get()
        
        # Calculate rates
        if sent_count > 0:
            delivery_rate = delivered_count / sent_count
            bounce_rate = bounced_count / sent_count
            complaint_rate = complained_count / sent_count
            
            self.delivery_rate.labels(template=template).set(delivery_rate)
            self.bounce_rate.labels(template=template).set(bounce_rate)
            self.complaint_rate.labels(template=template).set(complaint_rate)
        
        if delivered_count > 0:
            open_rate = opened_count / delivered_count
            click_rate = clicked_count / delivered_count
            
            self.open_rate.labels(template=template).set(open_rate)
            self.click_rate.labels(template=template).set(click_rate)
    
    async def check_alert_thresholds(self) -> List[Dict[str, Any]]:
        """Check if any metrics exceed alert thresholds."""
        alerts = []
        
        # Check bounce rate threshold (3%)
        for template in ['pilot_onboarding', 'deployment_notification', 'error_alert']:
            bounce_rate = self.bounce_rate.labels(template=template)._value.get()
            if bounce_rate > 0.03:
                alerts.append({
                    'type': 'bounce_rate_high',
                    'template': template,
                    'value': bounce_rate,
                    'threshold': 0.03,
                    'message': f'Bounce rate {bounce_rate:.1%} exceeds 3% threshold'
                })
        
        # Check complaint rate threshold (0.1%)
        for template in ['pilot_onboarding', 'deployment_notification', 'error_alert']:
            complaint_rate = self.complaint_rate.labels(template=template)._value.get()
            if complaint_rate > 0.001:
                alerts.append({
                    'type': 'complaint_rate_high',
                    'template': template,
                    'value': complaint_rate,
                    'threshold': 0.001,
                    'message': f'Complaint rate {complaint_rate:.1%} exceeds 0.1% threshold'
                })
        
        # Check delivery latency threshold (5s p95)
        for template in ['pilot_onboarding', 'deployment_notification', 'error_alert']:
            latency_histogram = self.delivery_latency.labels(template=template)
            # Note: In real implementation, you'd calculate p95 from histogram
            # For now, we'll use a simple check
            if hasattr(latency_histogram, '_buckets'):
                max_latency = max(latency_histogram._buckets.keys())
                if max_latency > 5.0:
                    alerts.append({
                        'type': 'delivery_latency_high',
                        'template': template,
                        'value': max_latency,
                        'threshold': 5.0,
                        'message': f'Delivery latency {max_latency:.1f}s exceeds 5s threshold'
                    })
        
        return alerts
    
    async def get_cost_metrics(self) -> Dict[str, float]:
        """Get current cost metrics."""
        # Note: Resend API doesn't provide cost data directly
        # This would need to be calculated based on usage
        # For now, return estimated costs
        
        # Estimate based on typical Resend pricing
        emails_sent = sum([
            self.emails_sent.labels(template=template, locale='*', status='*')._value.get()
            for template in ['pilot_onboarding', 'deployment_notification', 'error_alert']
        ])
        
        # Resend pricing: $0.40 per 1,000 emails
        cost_per_email = 0.40 / 1000
        daily_cost = emails_sent * cost_per_email
        monthly_cost = daily_cost * 30
        
        # Update metrics
        self.daily_cost.set(daily_cost)
        self.monthly_cost.set(monthly_cost)
        
        return {
            'daily_cost': daily_cost,
            'monthly_cost': monthly_cost,
            'emails_sent': emails_sent,
            'cost_per_email': cost_per_email
        }
    
    async def generate_daily_report(self) -> Dict[str, Any]:
        """Generate daily email performance report."""
        report = {
            'date': datetime.now().isoformat(),
            'templates': {},
            'overall_metrics': {},
            'alerts': [],
            'costs': {}
        }
        
        # Get metrics for each template
        for template in ['pilot_onboarding', 'deployment_notification', 'error_alert']:
            await self.update_rates(template)
            
            report['templates'][template] = {
                'delivery_rate': self.delivery_rate.labels(template=template)._value.get(),
                'open_rate': self.open_rate.labels(template=template)._value.get(),
                'click_rate': self.click_rate.labels(template=template)._value.get(),
                'bounce_rate': self.bounce_rate.labels(template=template)._value.get(),
                'complaint_rate': self.complaint_rate.labels(template=template)._value.get()
            }
        
        # Get overall metrics
        total_sent = sum([
            self.emails_sent.labels(template=template, locale='*', status='*')._value.get()
            for template in ['pilot_onboarding', 'deployment_notification', 'error_alert']
        ])
        
        total_delivered = sum([
            self.emails_delivered.labels(template=template, locale='*')._value.get()
            for template in ['pilot_onboarding', 'deployment_notification', 'error_alert']
        ])
        
        report['overall_metrics'] = {
            'total_sent': total_sent,
            'total_delivered': total_delivered,
            'overall_delivery_rate': total_delivered / total_sent if total_sent > 0 else 0
        }
        
        # Check for alerts
        report['alerts'] = await self.check_alert_thresholds()
        
        # Get cost metrics
        report['costs'] = await self.get_cost_metrics()
        
        return report
    
    def get_prometheus_metrics(self) -> str:
        """Get Prometheus metrics in text format."""
        from prometheus_client import generate_latest
        return generate_latest(self.registry).decode('utf-8')


# Convenience functions
def get_email_monitoring() -> EmailMonitoring:
    """Get email monitoring instance."""
    return EmailMonitoring()


async def record_email_event(event_type: str, template: str, locale: str = "fi", **kwargs):
    """Record email event with monitoring."""
    monitoring = get_email_monitoring()
    
    if event_type == "sent":
        await monitoring.record_email_sent(template, locale, kwargs.get("status", "pending"))
    elif event_type == "delivered":
        await monitoring.record_email_delivered(template, locale, kwargs.get("latency", 0.0))
    elif event_type == "opened":
        await monitoring.record_email_opened(template, locale)
    elif event_type == "clicked":
        await monitoring.record_email_clicked(template, locale)
    elif event_type == "bounced":
        await monitoring.record_email_bounced(template, kwargs.get("bounce_type", "unknown"))
    elif event_type == "complained":
        await monitoring.record_email_complained(template)
    elif event_type == "webhook":
        await monitoring.record_webhook_processed(kwargs.get("event_type", "unknown"), 
                                                kwargs.get("latency", 0.0))
