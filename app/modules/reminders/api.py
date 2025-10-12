"""
Smart Reminders API Routes
"""

from fastapi import APIRouter, HTTPException
from typing import Optional
from .models import ReminderRule, ReminderLog
from . import service


router = APIRouter(prefix="/api/v1/reminders", tags=["reminders"])


@router.post("/rules", response_model=ReminderRule)
async def create_rule(rule: ReminderRule):
    """
    Create a new reminder rule
    
    Args:
        rule: Reminder rule configuration
        
    Returns:
        Created rule
    """
    try:
        created_rule = service.register_rule(rule)
        return created_rule
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create rule: {str(e)}")


@router.get("/rules", response_model=list[ReminderRule])
async def list_rules(tenant_id: Optional[str] = None):
    """
    List all reminder rules
    
    Args:
        tenant_id: Optional tenant filter
        
    Returns:
        List of rules
    """
    return service.get_rules(tenant_id)


@router.get("/rules/{rule_id}", response_model=ReminderRule)
async def get_rule(rule_id: str):
    """Get specific rule by ID"""
    rule = service.RULES.get(rule_id)
    if not rule:
        raise HTTPException(status_code=404, detail="Rule not found")
    return rule


@router.patch("/rules/{rule_id}", response_model=ReminderRule)
async def update_rule(rule_id: str, updates: dict):
    """
    Update existing rule
    
    Args:
        rule_id: Rule ID
        updates: Fields to update
        
    Returns:
        Updated rule
    """
    rule = service.update_rule(rule_id, updates)
    if not rule:
        raise HTTPException(status_code=404, detail="Rule not found")
    return rule


@router.delete("/rules/{rule_id}")
async def delete_rule(rule_id: str):
    """Delete a rule"""
    success = service.delete_rule(rule_id)
    if not success:
        raise HTTPException(status_code=404, detail="Rule not found")
    return {"status": "ok", "deleted": rule_id}


@router.post("/run")
async def run_now():
    """
    Manually trigger reminder job execution
    Useful for testing and debugging
    
    Returns:
        List of executed rule IDs
    """
    executed = service.run_due_jobs()
    return {
        "status": "ok",
        "executed": executed,
        "count": len(executed)
    }


@router.get("/logs", response_model=list[ReminderLog])
async def get_logs(tenant_id: Optional[str] = None, limit: int = 50):
    """
    Get reminder execution logs
    
    Args:
        tenant_id: Optional tenant filter
        limit: Maximum number of logs to return
        
    Returns:
        List of logs (most recent first)
    """
    return service.get_logs(tenant_id, limit)


@router.get("/jobs")
async def get_jobs():
    """
    Get scheduled jobs status
    
    Returns:
        List of jobs with next execution time
    """
    jobs = []
    for job in service.JOBS.values():
        rule = service.RULES.get(job.rule_id)
        jobs.append({
            "rule_id": job.rule_id,
            "rule_type": rule.type if rule else "unknown",
            "next_due": job.next_due,
            "last_run": job.last_run,
            "run_count": job.run_count,
            "active": rule.active if rule else False
        })
    
    return sorted(jobs, key=lambda j: j["next_due"])

