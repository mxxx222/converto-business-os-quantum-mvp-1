"""Email automation cron tasks for Converto Business OS."""

import asyncio
import logging
import os
from datetime import datetime, timedelta

from backend.modules.email.service import EmailService
from backend.modules.email.workflows import EmailWorkflows
from backend.modules.email.triggers import EmailTriggers

logger = logging.getLogger("converto.tasks.email_automation")


async def daily_metrics_report():
    """Send daily metrics report."""
    try:
        api_key = os.getenv("RESEND_API_KEY")
        if not api_key:
            logger.error("RESEND_API_KEY not configured")
            return
        
        email_service = EmailService(api_key)
        workflows = EmailWorkflows(email_service)
        
        # Collect metrics (this would come from your metrics system)
        metrics = {
            "date": datetime.now().strftime("%Y-%m-%d"),
            "pilot_signups": 5,  # This would be from database
            "ocr_processed": 150,  # This would be from database
            "api_calls": 2500,  # This would be from metrics
            "uptime": "99.9%",  # This would be from monitoring
            "target_signups": 20,
            "target_ocr": 100
        }
        
        result = await workflows.daily_metrics_report(metrics)
        logger.info(f"Daily metrics report sent: {result}")
        
        await email_service.close()
        
    except Exception as e:
        logger.error(f"Daily metrics report failed: {str(e)}")


async def cleanup_old_triggers():
    """Clean up old email triggers."""
    try:
        api_key = os.getenv("RESEND_API_KEY")
        if not api_key:
            logger.error("RESEND_API_KEY not configured")
            return
        
        email_service = EmailService(api_key)
        triggers = EmailTriggers(email_service)
        
        cleaned = await triggers.cleanup_old_triggers(days=30)
        logger.info(f"Cleaned up {cleaned} old email triggers")
        
        await email_service.close()
        
    except Exception as e:
        logger.error(f"Trigger cleanup failed: {str(e)}")


async def pilot_follow_up_emails():
    """Send follow-up emails to pilots."""
    try:
        api_key = os.getenv("RESEND_API_KEY")
        if not api_key:
            logger.error("RESEND_API_KEY not configured")
            return
        
        email_service = EmailService(api_key)
        workflows = EmailWorkflows(email_service)
        
        # This would query database for pilots needing follow-up
        # For now, we'll just log the task
        logger.info("Pilot follow-up emails task executed")
        
        await email_service.close()
        
    except Exception as e:
        logger.error(f"Pilot follow-up emails failed: {str(e)}")


async def main():
    """Main function for email automation tasks."""
    logger.info("Starting email automation tasks")
    
    # Run all tasks
    await asyncio.gather(
        daily_metrics_report(),
        cleanup_old_triggers(),
        pilot_follow_up_emails()
    )
    
    logger.info("Email automation tasks completed")


if __name__ == "__main__":
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s | %(levelname)s | %(name)s | %(message)s"
    )
    asyncio.run(main())
