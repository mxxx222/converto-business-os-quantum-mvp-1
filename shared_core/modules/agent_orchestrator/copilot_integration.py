"""Copilot Integration - Natural language workflow execution."""

import logging
import re
from typing import Any

from pydantic import BaseModel, Field

from .orchestrator import AgentOrchestrator

logger = logging.getLogger("converto.agent_orchestrator")


class CopilotCommand(BaseModel):
    """Copilot command model."""

    command: str = Field(..., description="Natural language command")
    context: dict[str, Any] | None = Field(
        None, description="Optional context (tenant_id, user_id, etc.)"
    )


class CopilotWorkflowExecutor:
    """Executes workflows from natural language commands."""

    def __init__(self, orchestrator: AgentOrchestrator):
        self.orchestrator = orchestrator
        self._workflow_keywords = self._build_workflow_keywords()

    def _build_workflow_keywords(self) -> dict[str, str]:
        """Build mapping of keywords to workflow templates."""
        templates = self.orchestrator.list_workflow_templates()
        keywords = {}

        for template in templates:
            # Map template ID to keywords
            template_keywords = {
                "receipt_processing": [
                    "käsittele kuitti",
                    "tunnista kuitti",
                    "analysoi kuitti",
                    "process receipt",
                    "scan receipt",
                    "analyze receipt",
                ],
                "financial_reporting": [
                    "luo raportti",
                    "talousraportti",
                    "kuukausiraportti",
                    "create report",
                    "financial report",
                    "monthly report",
                    "luo ALV-raportti",
                    "create VAT report",
                ],
                "tax_optimization": [
                    "optimoi verot",
                    "verooptimointi",
                    "vähennyskelpoiset",
                    "optimize tax",
                    "tax optimization",
                    "deductibles",
                ],
                "invoice_processing": [
                    "käsittele lasku",
                    "tunnista lasku",
                    "process invoice",
                    "analyze invoice",
                    "analysoi lasku",
                ],
                "expense_approval": ["hyväksy kulu", "expense approval", "kulu hyväksyntä"],
                "monthly_performance": [
                    "kuukausittainen suoritus",
                    "monthly performance",
                    "kuukausiraportti",
                    "monthly report",
                ],
            }

            if template.template_id in template_keywords:
                for keyword in template_keywords[template.template_id]:
                    keywords[keyword.lower()] = template.template_id

        return keywords

    async def execute_from_command(
        self, command: str, context: dict[str, Any] | None = None
    ) -> dict[str, Any]:
        """Execute workflow from natural language command.

        Args:
            command: Natural language command
            context: Optional context (tenant_id, user_id, etc.)

        Returns:
            Execution result
        """
        # Parse command and find matching workflow
        workflow_id, variables = self._parse_command(command, context)

        if not workflow_id:
            return {
                "success": False,
                "error": "Could not find matching workflow for command",
                "suggestions": self._suggest_workflows(),
            }

        # Execute workflow
        try:
            execution = await self.orchestrator.execute_workflow(
                template_id=workflow_id,
                initial_variables=variables or {},
                execution_name=f"Copilot: {command[:50]}",
            )

            return {
                "success": True,
                "execution_id": execution.execution_id,
                "workflow_id": workflow_id,
                "status": execution.status.value,
                "message": f"Workflow '{workflow_id}' käynnistetty",
            }

        except Exception as e:
            logger.error(f"Copilot workflow execution failed: {e}")
            return {
                "success": False,
                "error": str(e),
            }

    def _parse_command(
        self, command: str, context: dict[str, Any] | None = None
    ) -> tuple[str | None, dict[str, Any] | None]:
        """Parse natural language command to workflow ID and variables.

        Args:
            command: Natural language command
            context: Optional context

        Returns:
            Tuple of (workflow_id, variables)
        """
        command_lower = command.lower()

        # Find matching workflow
        workflow_id = None
        for keyword, template_id in self._workflow_keywords.items():
            if keyword in command_lower:
                workflow_id = template_id
                break

        # Extract variables from command
        variables = {}

        # Extract period/days
        if "viime kuu" in command_lower or "last month" in command_lower:
            variables["days_back"] = 30
            variables["period"] = "last_month"
        elif "tämä kuu" in command_lower or "this month" in command_lower:
            variables["days_back"] = 0  # Current month
            variables["period"] = "this_month"
        elif "viime vuosi" in command_lower or "last year" in command_lower:
            variables["days_back"] = 365
            variables["period"] = "last_year"
        else:
            # Default
            variables["days_back"] = 30
            variables["period"] = "monthly"

        # Extract format
        if "pdf" in command_lower:
            variables["format"] = "pdf"
        elif "json" in command_lower:
            variables["format"] = "json"
        else:
            variables["format"] = "html"

        # Extract receipt file if mentioned
        receipt_pattern = r"(?:kuitti|receipt)[\s:]+(.+?)(?:\.pdf|\.jpg|\.png)?"
        receipt_match = re.search(receipt_pattern, command_lower)
        if receipt_match:
            variables["receipt_file"] = receipt_match.group(1).strip()

        # Add context if provided
        if context:
            variables.update(context)

        return workflow_id, variables

    def _suggest_workflows(self) -> list[str]:
        """Suggest available workflows."""
        templates = self.orchestrator.list_workflow_templates()
        return [f"- {t.name}: {t.description}" for t in templates]


from pydantic import BaseModel, Field
