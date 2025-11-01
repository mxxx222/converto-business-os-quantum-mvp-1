"""API router for Agent Orchestrator."""

from __future__ import annotations

import logging
from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from shared_core.utils.db import get_session

from .agent_registry import AgentType
from .orchestrator import AgentOrchestrator
from .workflow_engine import WorkflowStatus

logger = logging.getLogger("converto.agent_orchestrator")

router = APIRouter(prefix="/api/v1/agent-orchestrator", tags=["agent-orchestrator"])

# Global orchestrator instance (in production, use dependency injection)
_orchestrator: AgentOrchestrator | None = None


def get_orchestrator() -> AgentOrchestrator:
    """Get or create orchestrator instance."""
    global _orchestrator
    if _orchestrator is None:
        _orchestrator = AgentOrchestrator()
        _register_default_agents(_orchestrator)
    return _orchestrator


def _register_default_agents(orchestrator: AgentOrchestrator) -> None:
    """Register default agents in the orchestrator.

    Args:
        orchestrator: Agent orchestrator instance
    """
    from .agents import (
        CategorizationAgentAdapter,
        FinanceAgentAdapter,
        OCRAgentAdapter,
        ReportingAgentAdapter,
        VATAgentAdapter,
    )

    # Register agents (using default tenant_id for now)
    # In production, tenant_id should come from authenticated user context
    orchestrator.register_agent(OCRAgentAdapter())
    orchestrator.register_agent(VATAgentAdapter())
    orchestrator.register_agent(CategorizationAgentAdapter())
    orchestrator.register_agent(ReportingAgentAdapter())

    # FinanceAgent requires tenant_id, so we'll register it per-request
    # For now, we'll use a default one
    default_tenant = "default"
    orchestrator.register_agent(FinanceAgentAdapter(tenant_id=default_tenant))

    logger.info("Default agents registered")


class ExecuteWorkflowRequest(BaseModel):
    """Request model for workflow execution."""

    template_id: str = Field(..., description="Workflow template ID")
    initial_variables: dict[str, Any] = Field(
        default_factory=dict, description="Initial workflow variables"
    )
    execution_name: str | None = Field(None, description="Optional execution name")


class WorkflowExecutionResponse(BaseModel):
    """Response model for workflow execution."""

    execution_id: str
    template_id: str
    name: str
    status: str
    created_at: str
    started_at: str | None = None
    completed_at: str | None = None


class AgentMetadataResponse(BaseModel):
    """Response model for agent metadata."""

    agent_id: str
    agent_type: str
    name: str
    description: str
    version: str
    capabilities: list[str]
    dependencies: list[str]


class WorkflowTemplateResponse(BaseModel):
    """Response model for workflow template."""

    template_id: str
    name: str
    description: str
    version: str
    tags: list[str]
    steps_count: int


@router.post("/workflows/execute", response_model=WorkflowExecutionResponse)
async def execute_workflow(
    request: ExecuteWorkflowRequest,
    orchestrator: AgentOrchestrator = Depends(get_orchestrator),
) -> WorkflowExecutionResponse:
    """Execute a workflow from a template.

    Args:
        request: Workflow execution request
        orchestrator: Agent orchestrator instance

    Returns:
        Workflow execution response
    """
    try:
        execution = await orchestrator.execute_workflow(
            template_id=request.template_id,
            initial_variables=request.initial_variables,
            execution_name=request.execution_name,
        )

        return WorkflowExecutionResponse(
            execution_id=execution.execution_id,
            template_id=execution.template_id,
            name=execution.name,
            status=execution.status.value,
            created_at=execution.created_at.isoformat(),
            started_at=execution.started_at.isoformat() if execution.started_at else None,
            completed_at=execution.completed_at.isoformat() if execution.completed_at else None,
        )

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Workflow execution failed: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get("/workflows/{execution_id}/status")
async def get_workflow_status(
    execution_id: str,
    orchestrator: AgentOrchestrator = Depends(get_orchestrator),
) -> dict[str, Any]:
    """Get workflow execution status.

    Args:
        execution_id: Execution identifier
        orchestrator: Agent orchestrator instance

    Returns:
        Workflow status
    """
    execution = orchestrator.workflow_engine.get_execution(execution_id)

    if not execution:
        raise HTTPException(status_code=404, detail="Workflow execution not found")

    return {
        "execution_id": execution.execution_id,
        "status": execution.status.value,
        "started_at": execution.started_at.isoformat() if execution.started_at else None,
        "completed_at": execution.completed_at.isoformat() if execution.completed_at else None,
        "error": execution.error,
        "steps": [
            {
                "step_id": step.step_id,
                "agent_id": step.agent_id,
                "status": step.status.value,
                "error": step.error,
            }
            for step in execution.steps
        ],
    }


@router.get("/workflows/{execution_id}/result")
async def get_workflow_result(
    execution_id: str,
    orchestrator: AgentOrchestrator = Depends(get_orchestrator),
) -> dict[str, Any]:
    """Get workflow execution result.

    Args:
        execution_id: Execution identifier
        orchestrator: Agent orchestrator instance

    Returns:
        Workflow result (final variables)
    """
    result = orchestrator.get_workflow_result(execution_id)

    if result is None:
        execution = orchestrator.workflow_engine.get_execution(execution_id)
        if not execution:
            raise HTTPException(status_code=404, detail="Workflow execution not found")

        if execution.status != WorkflowStatus.COMPLETED:
            raise HTTPException(
                status_code=400,
                detail=f"Workflow not completed yet (status: {execution.status.value})",
            )

    return result


@router.get("/agents", response_model=list[AgentMetadataResponse])
async def list_agents(
    agent_type: str | None = None,
    orchestrator: AgentOrchestrator = Depends(get_orchestrator),
) -> list[AgentMetadataResponse]:
    """List registered agents.

    Args:
        agent_type: Optional filter by agent type
        orchestrator: Agent orchestrator instance

    Returns:
        List of agent metadata
    """
    agent_type_enum = AgentType(agent_type) if agent_type else None
    agents = orchestrator.list_agents(agent_type_enum)

    return [
        AgentMetadataResponse(
            agent_id=agent.agent_id,
            agent_type=agent.agent_type.value,
            name=agent.name,
            description=agent.description,
            version=agent.version,
            capabilities=agent.capabilities,
            dependencies=agent.dependencies,
        )
        for agent in agents
    ]


@router.get("/templates", response_model=list[WorkflowTemplateResponse])
async def list_templates(
    orchestrator: AgentOrchestrator = Depends(get_orchestrator),
) -> list[WorkflowTemplateResponse]:
    """List available workflow templates.

    Args:
        orchestrator: Agent orchestrator instance

    Returns:
        List of workflow templates
    """
    templates = orchestrator.list_workflow_templates()

    return [
        WorkflowTemplateResponse(
            template_id=template.template_id,
            name=template.name,
            description=template.description,
            version=template.version,
            tags=template.tags,
            steps_count=len(template.steps),
        )
        for template in templates
    ]


@router.get("/executions")
async def list_executions(
    template_id: str | None = None,
    status: str | None = None,
    orchestrator: AgentOrchestrator = Depends(get_orchestrator),
) -> list[dict[str, Any]]:
    """List workflow executions.

    Args:
        template_id: Optional filter by template
        status: Optional filter by status
        orchestrator: Agent orchestrator instance

    Returns:
        List of workflow executions
    """
    status_enum = WorkflowStatus(status) if status else None
    executions = orchestrator.list_workflow_executions(template_id, status_enum)

    return [
        {
            "execution_id": exec.execution_id,
            "template_id": exec.template_id,
            "name": exec.name,
            "status": exec.status.value,
            "created_at": exec.created_at.isoformat(),
            "started_at": exec.started_at.isoformat() if exec.started_at else None,
            "completed_at": exec.completed_at.isoformat() if exec.completed_at else None,
        }
        for exec in executions
    ]


@router.post("/copilot/execute")
async def copilot_execute_workflow(
    request: dict[str, Any],
    orchestrator: AgentOrchestrator = Depends(get_orchestrator),
) -> dict[str, Any]:
    """Execute workflow from natural language command (Copilot integration).

    Args:
        request: Copilot command (command, context)
        orchestrator: Agent orchestrator instance

    Returns:
        Execution result
    """
    from .copilot_integration import CopilotWorkflowExecutor

    try:
        command = request.get("command", "")
        context = request.get("context", {})

        if not command:
            raise HTTPException(status_code=400, detail="Command is required")

        executor = CopilotWorkflowExecutor(orchestrator)
        result = await executor.execute_from_command(command, context)

        return result

    except Exception as e:
        logger.error(f"Copilot execution failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/copilot/suggestions")
async def copilot_suggestions(
    query: str | None = None,
    orchestrator: AgentOrchestrator = Depends(get_orchestrator),
) -> dict[str, Any]:
    """Get workflow suggestions based on query (for autocomplete).

    Args:
        query: Optional search query
        orchestrator: Agent orchestrator instance

    Returns:
        List of suggestions
    """
    from .copilot_integration import CopilotWorkflowExecutor

    CopilotWorkflowExecutor(orchestrator)
    templates = orchestrator.list_workflow_templates()

    suggestions = [
        {
            "template_id": t.template_id,
            "name": t.name,
            "description": t.description,
            "example_commands": [
                f"Luo {t.name.lower()}",
                f"Käynnistä {t.name.lower()}",
                f"Suorita {t.name.lower()}",
            ],
        }
        for t in templates
    ]

    # Filter by query if provided
    if query:
        query_lower = query.lower()
        suggestions = [
            s
            for s in suggestions
            if query_lower in s["name"].lower() or query_lower in s["description"].lower()
        ]

    return {
        "suggestions": suggestions,
        "count": len(suggestions),
    }


@router.get("/metrics")
async def get_workflow_metrics(
    tenant_id: str | None = None,
    hours_back: int = 24,
    db: Session = Depends(get_session),
) -> dict[str, Any]:
    """Get workflow metrics for dashboard.

    Args:
        tenant_id: Optional tenant filter
        hours_back: Hours to look back
        db: Database session

    Returns:
        Metrics dictionary
    """
    from .metrics_dashboard import WorkflowMetrics

    metrics = WorkflowMetrics(db)
    return metrics.get_workflow_metrics(tenant_id, hours_back)


@router.get("/metrics/recent")
async def get_recent_executions(
    tenant_id: str | None = None,
    limit: int = 20,
    db: Session = Depends(get_session),
) -> list[dict[str, Any]]:
    """Get recent workflow executions.

    Args:
        tenant_id: Optional tenant filter
        limit: Maximum number of executions
        db: Database session

    Returns:
        List of execution records
    """
    from .metrics_dashboard import WorkflowMetrics

    metrics = WorkflowMetrics(db)
    return metrics.get_recent_executions(tenant_id, limit)
