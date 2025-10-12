"""
Smart Reminders Service
AI-guided notification execution and scheduling
"""

import uuid
from datetime import datetime, timedelta
from typing import Dict, List, Optional
from .models import ReminderRule, ReminderJob, ReminderLog, Channel


# In-memory storage (replace with database in production)
RULES: Dict[str, ReminderRule] = {}
JOBS: Dict[str, ReminderJob] = {}
LOGS: List[ReminderLog] = []


def _parse_schedule(human: str) -> timedelta:
    """
    Parse human-readable schedule to timedelta
    MVP: Only supports "daily@HH:MM"
    """
    # TODO: Implement full cron parser
    return timedelta(days=1)


def _next_scheduled_time(schedule: str = "daily@08:00") -> datetime:
    """Calculate next scheduled time based on schedule string"""
    # MVP: Simple daily at 08:00 local time
    now = datetime.now()
    next_run = now.replace(hour=8, minute=0, second=0, microsecond=0)
    
    if next_run <= now:
        next_run += timedelta(days=1)
    
    return next_run


def register_rule(rule: ReminderRule) -> ReminderRule:
    """Register a new reminder rule"""
    RULES[rule.id] = rule
    JOBS[rule.id] = ReminderJob(
        rule_id=rule.id,
        next_due=_next_scheduled_time(rule.schedule),
        last_run=None,
        run_count=0
    )
    return rule


def get_rules(tenant_id: Optional[str] = None) -> List[ReminderRule]:
    """Get all rules (optionally filtered by tenant)"""
    rules = list(RULES.values())
    if tenant_id:
        rules = [r for r in rules if r.tenant_id == tenant_id]
    return rules


def update_rule(rule_id: str, updates: Dict) -> Optional[ReminderRule]:
    """Update existing rule"""
    if rule_id not in RULES:
        return None
    
    rule = RULES[rule_id]
    for key, value in updates.items():
        if hasattr(rule, key):
            setattr(rule, key, value)
    
    return rule


def delete_rule(rule_id: str) -> bool:
    """Delete a rule"""
    if rule_id in RULES:
        del RULES[rule_id]
        if rule_id in JOBS:
            del JOBS[rule_id]
        return True
    return False


def run_due_jobs() -> List[str]:
    """
    Execute all due reminder jobs
    Returns list of executed rule IDs
    """
    now = datetime.now()
    executed = []
    
    for job in JOBS.values():
        if job.next_due <= now:
            rule = RULES.get(job.rule_id)
            
            if not rule or not rule.active:
                # Skip inactive rules but reschedule
                job.next_due = _next_scheduled_time(rule.schedule if rule else "daily@08:00")
                continue
            
            # Execute rule
            success = _execute_rule(rule)
            
            # Update job
            job.last_run = now
            job.run_count += 1
            job.next_due = _next_scheduled_time(rule.schedule)
            
            if success:
                executed.append(job.rule_id)
    
    return executed


def _execute_rule(rule: ReminderRule) -> bool:
    """
    Execute a single reminder rule
    Returns True if message was sent
    """
    message = None
    
    try:
        # Generate message based on rule type
        if rule.type == "missing_receipts":
            message = _check_missing_receipts(rule)
        elif rule.type == "vat_filing":
            message = _check_vat_deadline(rule)
        elif rule.type == "invoice_due":
            message = _check_due_invoices(rule)
        elif rule.type == "custom":
            message = rule.params.get("message", "Custom reminder")
        
        if not message:
            # Nothing to remind about
            _log_reminder(rule, "skipped", "No action needed")
            return False
        
        # Send message via appropriate channel
        success = _send_message(rule.channel, rule.tenant_id, message, rule.ai_hint)
        
        if success:
            _log_reminder(rule, "ok", message)
            return True
        else:
            _log_reminder(rule, "failed", message, error="Failed to send message")
            return False
            
    except Exception as e:
        _log_reminder(rule, "failed", message or "Error", error=str(e))
        return False


def _check_missing_receipts(rule: ReminderRule) -> Optional[str]:
    """Check for missing receipts"""
    # TODO: Implement actual check against OCR database
    threshold = rule.params.get("threshold", 3)
    
    # Mock: Assume 5 receipts missing
    missing_count = 5
    
    if missing_count >= threshold:
        return f"📸 {missing_count} kuittia puuttuu tältä viikolta. Lataa ne nyt → /selko/ocr"
    
    return None


def _check_vat_deadline(rule: ReminderRule) -> Optional[str]:
    """Check VAT filing deadline"""
    # TODO: Implement actual VAT deadline check
    country = rule.params.get("country", "FI")
    
    # Mock: Next deadline is in 5 days
    deadline = (datetime.now() + timedelta(days=5)).strftime("%d.%m.%Y")
    
    return f"🧾 ALV-ilmoitus lähestyy ({country}): määräpäivä {deadline}. Tarkista ALV-yhteenveto → /vat"


def _check_due_invoices(rule: ReminderRule) -> Optional[str]:
    """Check for due invoices"""
    # TODO: Implement actual invoice check
    days_ahead = rule.params.get("days_ahead", 7)
    
    # Mock: 3 invoices due
    due_count = 3
    total_amount = 1250.00
    
    if due_count > 0:
        return f"💳 {due_count} laskua erääntyy {days_ahead} päivän sisällä, yhteensä {total_amount:.2f} €. Hoidetaan → /billing"
    
    return None


def _send_message(channel: Channel, tenant_id: str, message: str, ai_hint: Optional[str] = None) -> bool:
    """
    Send message via specified channel
    Returns True if successful
    """
    # TODO: Implement actual channel integrations
    print(f"[{channel.upper()}] To: {tenant_id}")
    print(f"Message: {message}")
    if ai_hint:
        print(f"AI Hint: {ai_hint}")
    
    # Mock: Always successful
    return True


def _log_reminder(rule: ReminderRule, result: str, message: str, error: Optional[str] = None):
    """Log reminder execution for audit trail"""
    log = ReminderLog(
        id=f"log_{uuid.uuid4().hex[:8]}",
        rule_id=rule.id,
        tenant_id=rule.tenant_id,
        channel=rule.channel,
        message=message,
        sent_at=datetime.now(),
        result=result,  # type: ignore
        error=error,
        correlation_id=f"corr_{uuid.uuid4().hex[:8]}"
    )
    LOGS.append(log)


def get_logs(tenant_id: Optional[str] = None, limit: int = 50) -> List[ReminderLog]:
    """Get reminder logs (most recent first)"""
    logs = LOGS
    if tenant_id:
        logs = [log for log in logs if log.tenant_id == tenant_id]
    
    return sorted(logs, key=lambda log: log.sent_at, reverse=True)[:limit]

