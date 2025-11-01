"""Workflow Engine - Executes multi-agent workflows."""

import asyncio
import logging
from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
from typing import Any
from uuid import uuid4

from .agent_registry import AgentRegistry

logger = logging.getLogger("converto.agent_orchestrator")


class WorkflowStatus(str, Enum):
    """Workflow execution status."""

    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"


class StepStatus(str, Enum):
    """Individual step execution status."""

    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    SKIPPED = "skipped"


@dataclass
class WorkflowStep:
    """A single step in a workflow."""

    step_id: str
    agent_id: str
    input_mapping: dict[str, str]  # Maps workflow variables to agent inputs
    output_mapping: dict[str, str]  # Maps agent outputs to workflow variables
    dependencies: list[str] = field(default_factory=list)  # Step IDs this step depends on
    condition: str | None = None  # Optional condition for conditional execution
    status: StepStatus = StepStatus.PENDING
    result: dict[str, Any] | None = None
    error: str | None = None
    started_at: datetime | None = None
    completed_at: datetime | None = None


@dataclass
class WorkflowTemplate:
    """Template for creating workflows."""

    template_id: str
    name: str
    description: str
    steps: list[dict[str, Any]]  # Step definitions
    version: str = "1.0.0"
    tags: list[str] = field(default_factory=list)


@dataclass
class WorkflowExecution:
    """Represents a workflow execution instance."""

    execution_id: str
    template_id: str
    name: str
    status: WorkflowStatus
    steps: list[WorkflowStep]
    variables: dict[str, Any]  # Workflow variables (shared state)
    created_at: datetime
    started_at: datetime | None = None
    completed_at: datetime | None = None
    error: str | None = None
    metadata: dict[str, Any] = field(default_factory=dict)


class WorkflowEngine:
    """Engine for executing multi-agent workflows."""

    def __init__(self, agent_registry: AgentRegistry):
        self.agent_registry = agent_registry
        self._templates: dict[str, WorkflowTemplate] = {}
        self._executions: dict[str, WorkflowExecution] = {}
        self._load_default_templates()

    def register_template(self, template: WorkflowTemplate) -> None:
        """Register a workflow template.

        Args:
            template: Workflow template to register
        """
        self._templates[template.template_id] = template
        logger.info(f"Registered workflow template: {template.template_id} ({template.name})")

    def get_template(self, template_id: str) -> WorkflowTemplate | None:
        """Get a workflow template by ID.

        Args:
            template_id: Template identifier

        Returns:
            Workflow template or None if not found
        """
        return self._templates.get(template_id)

    def list_templates(self) -> list[WorkflowTemplate]:
        """List all registered workflow templates.

        Returns:
            List of workflow templates
        """
        return list(self._templates.values())

    async def execute_workflow(
        self, template_id: str, initial_variables: dict[str, Any], execution_name: str | None = None
    ) -> WorkflowExecution:
        """Execute a workflow from a template.

        Args:
            template_id: Template identifier
            initial_variables: Initial workflow variables
            execution_name: Optional name for this execution

        Returns:
            Workflow execution instance
        """
        template = self.get_template(template_id)
        if not template:
            raise ValueError(f"Workflow template not found: {template_id}")

        # Create workflow steps from template
        steps = []
        for step_def in template.steps:
            step = WorkflowStep(
                step_id=step_def["step_id"],
                agent_id=step_def["agent_id"],
                input_mapping=step_def.get("input_mapping", {}),
                output_mapping=step_def.get("output_mapping", {}),
                dependencies=step_def.get("dependencies", []),
                condition=step_def.get("condition"),
            )
            steps.append(step)

        # Validate dependencies
        agent_ids = [step.agent_id for step in steps]
        if not self.agent_registry.validate_workflow_dependencies(agent_ids):
            raise ValueError("Workflow dependencies not satisfied")

        # Create execution
        execution = WorkflowExecution(
            execution_id=str(uuid4()),
            template_id=template_id,
            name=execution_name or template.name,
            status=WorkflowStatus.PENDING,
            steps=steps,
            variables=initial_variables.copy(),
            created_at=datetime.utcnow(),
        )

        self._executions[execution.execution_id] = execution

        # Execute workflow asynchronously
        asyncio.create_task(self._run_workflow(execution))

        return execution

    async def _run_workflow(self, execution: WorkflowExecution) -> None:
        """Run a workflow execution (internal method).

        Args:
            execution: Workflow execution to run
        """
        execution.status = WorkflowStatus.RUNNING
        execution.started_at = datetime.utcnow()

        try:
            # Build dependency graph
            step_map = {step.step_id: step for step in execution.steps}
            ready_steps = self._get_ready_steps(execution.steps)

            while ready_steps:
                # Execute ready steps in parallel
                tasks = [
                    self._execute_step(step, execution.variables, step_map) for step in ready_steps
                ]

                results = await asyncio.gather(*tasks, return_exceptions=True)

                # Update step results
                for step, result in zip(ready_steps, results, strict=False):
                    if isinstance(result, Exception):
                        step.status = StepStatus.FAILED
                        step.error = str(result)
                        logger.error(f"Step {step.step_id} failed: {result}")
                    else:
                        step.status = StepStatus.COMPLETED
                        step.result = result

                # Check if any step failed
                if any(step.status == StepStatus.FAILED for step in ready_steps):
                    execution.status = WorkflowStatus.FAILED
                    execution.error = "One or more steps failed"
                    execution.completed_at = datetime.utcnow()
                    return

                # Get next ready steps
                ready_steps = self._get_ready_steps(execution.steps)

            # All steps completed successfully
            execution.status = WorkflowStatus.COMPLETED
            execution.completed_at = datetime.utcnow()
            logger.info(f"Workflow {execution.execution_id} completed successfully")

        except Exception as e:
            execution.status = WorkflowStatus.FAILED
            execution.error = str(e)
            execution.completed_at = datetime.utcnow()
            logger.error(f"Workflow {execution.execution_id} failed: {e}")

    async def _execute_step(
        self, step: WorkflowStep, variables: dict[str, Any], step_map: dict[str, WorkflowStep]
    ) -> dict[str, Any]:
        """Execute a single workflow step.

        Args:
            step: Step to execute
            variables: Workflow variables
            step_map: Map of step_id to WorkflowStep

        Returns:
            Agent execution result
        """
        step.status = StepStatus.RUNNING
        step.started_at = datetime.utcnow()

        try:
            # Build agent input from workflow variables
            agent_input = {}
            for var_name, input_key in step.input_mapping.items():
                if var_name in variables:
                    agent_input[input_key] = variables[var_name]
                elif var_name.startswith("step:"):
                    # Reference to another step's output
                    step_id = var_name.split(":")[1]
                    dep_step = step_map.get(step_id)
                    if dep_step and dep_step.result:
                        output_key = var_name.split(":")[2] if ":" in var_name[5:] else None
                        if output_key and output_key in dep_step.result:
                            agent_input[input_key] = dep_step.result[output_key]
                        else:
                            agent_input[input_key] = dep_step.result

            # Get agent and execute
            agent = self.agent_registry.get_agent(step.agent_id)
            if not agent:
                raise ValueError(f"Agent not found: {step.agent_id}")

            # Validate input
            if not await agent.validate_input(agent_input):
                raise ValueError(f"Invalid input for agent {step.agent_id}")

            # Execute agent
            context = {
                "workflow_variables": variables,
                "step_id": step.step_id,
                "execution_id": step.step_id,  # Simplified
            }

            result = await agent.execute(agent_input, context)

            # Map agent output to workflow variables
            for output_key, var_name in step.output_mapping.items():
                if output_key in result:
                    variables[var_name] = result[output_key]
                # Handle nested keys (e.g., "step:ocr_extract:extracted_data")
                elif "." in output_key:
                    # Try to access nested key
                    keys = output_key.split(".")
                    current = result
                    for key in keys:
                        if isinstance(current, dict) and key in current:
                            current = current[key]
                        else:
                            break
                    else:
                        variables[var_name] = current

            step.completed_at = datetime.utcnow()
            return result

        except Exception as e:
            step.status = StepStatus.FAILED
            step.error = str(e)
            step.completed_at = datetime.utcnow()
            raise

    def _get_ready_steps(self, steps: list[WorkflowStep]) -> list[WorkflowStep]:
        """Get steps that are ready to execute (dependencies satisfied).

        Args:
            steps: List of workflow steps

        Returns:
            List of ready steps
        """
        ready = []

        for step in steps:
            if step.status != StepStatus.PENDING:
                continue

            # Check if all dependencies are completed
            deps_completed = True
            for dep_id in step.dependencies:
                dep_step = next((s for s in steps if s.step_id == dep_id), None)
                if not dep_step or dep_step.status != StepStatus.COMPLETED:
                    deps_completed = False
                    break

            if deps_completed:
                ready.append(step)

        return ready

    def get_execution(self, execution_id: str) -> WorkflowExecution | None:
        """Get a workflow execution by ID.

        Args:
            execution_id: Execution identifier

        Returns:
            Workflow execution or None if not found
        """
        return self._executions.get(execution_id)

    def list_executions(
        self, template_id: str | None = None, status: WorkflowStatus | None = None
    ) -> list[WorkflowExecution]:
        """List workflow executions, optionally filtered.

        Args:
            template_id: Optional filter by template
            status: Optional filter by status

        Returns:
            List of workflow executions
        """
        executions = list(self._executions.values())

        if template_id:
            executions = [e for e in executions if e.template_id == template_id]

        if status:
            executions = [e for e in executions if e.status == status]

        return executions

    def _load_default_templates(self) -> None:
        """Load default workflow templates."""
        # Receipt Processing Workflow
        receipt_workflow = WorkflowTemplate(
            template_id="receipt_processing",
            name="Receipt Processing Workflow",
            description="Complete receipt processing: OCR → Categorization → VAT → Finance Analysis",
            steps=[
                {
                    "step_id": "ocr_extract",
                    "agent_id": "ocr_agent",
                    "input_mapping": {"receipt_file": "receipt_file"},
                    "output_mapping": {"extracted_data": "receipt_data"},
                    "dependencies": [],
                },
                {
                    "step_id": "categorize",
                    "agent_id": "categorization_agent",
                    "input_mapping": {"receipt_data": "step:ocr_extract:extracted_data"},
                    "output_mapping": {"category": "category", "tags": "tags"},
                    "dependencies": ["ocr_extract"],
                },
                {
                    "step_id": "calculate_vat",
                    "agent_id": "vat_agent",
                    "input_mapping": {"receipt_data": "step:ocr_extract:extracted_data"},
                    "output_mapping": {"vat_amount": "vat_amount", "vat_rate": "vat_rate"},
                    "dependencies": ["ocr_extract"],
                },
                {
                    "step_id": "finance_analysis",
                    "agent_id": "finance_agent",
                    "input_mapping": {
                        "receipt_data": "step:ocr_extract:extracted_data",
                        "category": "step:categorize:category",
                        "vat_amount": "step:calculate_vat:vat_amount",
                    },
                    "output_mapping": {
                        "insights": "insights",
                        "recommendations": "recommendations",
                    },
                    "dependencies": ["categorize", "calculate_vat"],
                },
            ],
            tags=["receipt", "automation", "finance"],
        )

        self.register_template(receipt_workflow)

        # Financial Reporting Workflow
        financial_reporting = WorkflowTemplate(
            template_id="financial_reporting",
            name="Financial Reporting Workflow",
            description="Generate comprehensive financial reports: Analyze receipts → Calculate VAT → Generate insights → Create report",
            steps=[
                {
                    "step_id": "analyze_all_receipts",
                    "agent_id": "finance_agent",
                    "input_mapping": {"days_back": "days_back"},
                    "output_mapping": {"insights": "financial_insights"},
                    "dependencies": [],
                },
                {
                    "step_id": "calculate_total_vat",
                    "agent_id": "vat_agent",
                    "input_mapping": {"receipt_data": "all_receipts"},
                    "output_mapping": {"total_vat": "total_vat_amount"},
                    "dependencies": [],
                },
                {
                    "step_id": "generate_report",
                    "agent_id": "reporting_agent",
                    "input_mapping": {
                        "insights": "step:analyze_all_receipts:insights",
                        "vat_data": "step:calculate_total_vat:total_vat",
                    },
                    "output_mapping": {"report": "financial_report"},
                    "dependencies": ["analyze_all_receipts", "calculate_total_vat"],
                },
            ],
            tags=["finance", "reporting", "analytics"],
        )
        self.register_template(financial_reporting)

        # Tax Optimization Workflow
        tax_optimization = WorkflowTemplate(
            template_id="tax_optimization",
            name="Tax Optimization Workflow",
            description="Optimize tax deductions: Analyze expenses → Detect deductible items → Calculate savings → Provide recommendations",
            steps=[
                {
                    "step_id": "analyze_expenses",
                    "agent_id": "finance_agent",
                    "input_mapping": {"days_back": "period_days"},
                    "output_mapping": {"expenses": "expense_analysis"},
                    "dependencies": [],
                },
                {
                    "step_id": "detect_deductibles",
                    "agent_id": "finance_agent",
                    "input_mapping": {"expenses": "step:analyze_expenses:expenses"},
                    "output_mapping": {"deductibles": "deductible_items"},
                    "dependencies": ["analyze_expenses"],
                },
                {
                    "step_id": "calculate_savings",
                    "agent_id": "vat_agent",
                    "input_mapping": {"deductibles": "step:detect_deductibles:deductibles"},
                    "output_mapping": {"savings": "estimated_savings"},
                    "dependencies": ["detect_deductibles"],
                },
                {
                    "step_id": "generate_recommendations",
                    "agent_id": "finance_agent",
                    "input_mapping": {
                        "analysis": "step:analyze_expenses:expenses",
                        "savings": "step:calculate_savings:savings",
                    },
                    "output_mapping": {"recommendations": "tax_recommendations"},
                    "dependencies": ["calculate_savings"],
                },
            ],
            tags=["tax", "optimization", "finance"],
        )
        self.register_template(tax_optimization)

        # Invoice Processing Workflow
        invoice_processing = WorkflowTemplate(
            template_id="invoice_processing",
            name="Invoice Processing Workflow",
            description="Process invoices: OCR → Categorization → Finance Analysis → Report",
            steps=[
                {
                    "step_id": "ocr_extract",
                    "agent_id": "ocr_agent",
                    "input_mapping": {"invoice_file": "invoice_file"},
                    "output_mapping": {"extracted_data": "invoice_data"},
                    "dependencies": [],
                },
                {
                    "step_id": "categorize",
                    "agent_id": "categorization_agent",
                    "input_mapping": {"receipt_data": "step:ocr_extract:extracted_data"},
                    "output_mapping": {"category": "category", "tags": "tags"},
                    "dependencies": ["ocr_extract"],
                },
                {
                    "step_id": "finance_analysis",
                    "agent_id": "finance_agent",
                    "input_mapping": {
                        "receipt_data": "step:ocr_extract:extracted_data",
                        "category": "step:categorize:category",
                    },
                    "output_mapping": {
                        "insights": "insights",
                        "recommendations": "recommendations",
                    },
                    "dependencies": ["categorize"],
                },
                {
                    "step_id": "generate_report",
                    "agent_id": "reporting_agent",
                    "input_mapping": {
                        "insights": "step:finance_analysis:insights",
                    },
                    "output_mapping": {"report": "invoice_report"},
                    "dependencies": ["finance_analysis"],
                },
            ],
            tags=["invoice", "automation", "finance"],
        )
        self.register_template(invoice_processing)

        # Expense Approval Workflow
        expense_approval = WorkflowTemplate(
            template_id="expense_approval",
            name="Expense Approval Workflow",
            description="Expense approval: OCR → Categorization → Slack Notification → Approval",
            steps=[
                {
                    "step_id": "ocr_extract",
                    "agent_id": "ocr_agent",
                    "input_mapping": {"receipt_file": "receipt_file"},
                    "output_mapping": {"extracted_data": "receipt_data"},
                    "dependencies": [],
                },
                {
                    "step_id": "categorize",
                    "agent_id": "categorization_agent",
                    "input_mapping": {"receipt_data": "step:ocr_extract:extracted_data"},
                    "output_mapping": {"category": "category", "tags": "tags"},
                    "dependencies": ["ocr_extract"],
                },
                {
                    "step_id": "slack_notification",
                    "agent_id": "email_agent",  # Use email agent for notifications
                    "input_mapping": {
                        "receipt_data": "step:ocr_extract:extracted_data",
                        "category": "step:categorize:category",
                    },
                    "output_mapping": {"notification_sent": "notification_status"},
                    "dependencies": ["categorize"],
                },
            ],
            tags=["expense", "approval", "notification"],
        )
        self.register_template(expense_approval)

        # Monthly Performance Workflow
        monthly_performance = WorkflowTemplate(
            template_id="monthly_performance",
            name="Monthly Performance Workflow",
            description="Monthly performance: Finance Analysis → Reporting → Email Dispatch",
            steps=[
                {
                    "step_id": "finance_analysis",
                    "agent_id": "finance_agent",
                    "input_mapping": {"days_back": "30"},
                    "output_mapping": {"insights": "financial_insights"},
                    "dependencies": [],
                },
                {
                    "step_id": "generate_report",
                    "agent_id": "reporting_agent",
                    "input_mapping": {
                        "insights": "step:finance_analysis:insights",
                        "period": "monthly",
                    },
                    "output_mapping": {"report": "performance_report"},
                    "dependencies": ["finance_analysis"],
                },
                {
                    "step_id": "email_dispatch",
                    "agent_id": "email_agent",  # Email agent via email module
                    "input_mapping": {
                        "report": "step:generate_report:report",
                    },
                    "output_mapping": {"email_sent": "email_status"},
                    "dependencies": ["generate_report"],
                },
            ],
            tags=["monthly", "performance", "reporting", "email"],
        )
        self.register_template(monthly_performance)
