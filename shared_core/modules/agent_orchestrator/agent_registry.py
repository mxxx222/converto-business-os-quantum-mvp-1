"""Agent Registry - Manages agent discovery and metadata."""

import logging
from abc import ABC, abstractmethod
from dataclasses import dataclass
from enum import Enum
from typing import Any

logger = logging.getLogger("converto.agent_orchestrator")


class AgentType(str, Enum):
    """Types of agents available in the system."""

    FINANCE = "finance"
    OCR = "ocr"
    CATEGORIZATION = "categorization"
    VAT = "vat"
    REPORTING = "reporting"
    PREDICTION = "prediction"
    ANALYSIS = "analysis"
    INVOICE = "invoice"


@dataclass
class AgentMetadata:
    """Metadata for an agent."""

    agent_id: str
    agent_type: AgentType
    name: str
    description: str
    version: str
    capabilities: list[str]
    input_schema: dict[str, Any]
    output_schema: dict[str, Any]
    dependencies: list[str]  # Other agent IDs this agent depends on
    cost_per_request: float = 0.0
    avg_response_time_ms: int = 0
    reliability: float = 1.0  # 0.0-1.0, success rate
    region: str | None = None  # e.g., "FI", "EU", "global"
    tags: list[str] = None  # Additional tags for categorization
    fallback_agent_id: str | None = None  # Fallback agent if this one fails
    max_retries: int = 3  # Maximum retry attempts
    timeout_ms: int = 30000  # Timeout in milliseconds

    def __post_init__(self):
        if self.tags is None:
            self.tags = []


class Agent(ABC):
    """Base class for all agents in the system."""

    @abstractmethod
    async def execute(self, input_data: dict[str, Any], context: dict[str, Any]) -> dict[str, Any]:
        """Execute the agent's task.

        Args:
            input_data: Input data for the agent
            context: Execution context (workflow state, previous results, etc.)

        Returns:
            Agent execution result
        """
        pass

    @abstractmethod
    def get_metadata(self) -> AgentMetadata:
        """Get agent metadata."""
        pass

    @abstractmethod
    async def validate_input(self, input_data: dict[str, Any]) -> bool:
        """Validate input data for the agent."""
        pass


class AgentRegistry:
    """Registry for managing agents in the system."""

    def __init__(self):
        self._agents: dict[str, Agent] = {}
        self._metadata: dict[str, AgentMetadata] = {}

    def register(self, agent: Agent) -> None:
        """Register an agent in the registry.

        Args:
            agent: Agent instance to register
        """
        metadata = agent.get_metadata()
        agent_id = metadata.agent_id

        if agent_id in self._agents:
            logger.warning(f"Agent {agent_id} already registered, overwriting")

        self._agents[agent_id] = agent
        self._metadata[agent_id] = metadata
        logger.info(f"Registered agent: {agent_id} ({metadata.name})")

    def get_agent(self, agent_id: str) -> Agent | None:
        """Get an agent by ID.

        Args:
            agent_id: Agent identifier

        Returns:
            Agent instance or None if not found
        """
        return self._agents.get(agent_id)

    def get_metadata(self, agent_id: str) -> AgentMetadata | None:
        """Get agent metadata by ID.

        Args:
            agent_id: Agent identifier

        Returns:
            Agent metadata or None if not found
        """
        return self._metadata.get(agent_id)

    def list_agents(self, agent_type: AgentType | None = None) -> list[AgentMetadata]:
        """List all registered agents, optionally filtered by type.

        Args:
            agent_type: Optional filter by agent type

        Returns:
            List of agent metadata
        """
        if agent_type:
            return [
                metadata
                for metadata in self._metadata.values()
                if metadata.agent_type == agent_type
            ]
        return list(self._metadata.values())

    def find_agents_by_capability(self, capability: str) -> list[AgentMetadata]:
        """Find agents that have a specific capability.

        Args:
            capability: Capability to search for

        Returns:
            List of agents with the capability
        """
        return [
            metadata for metadata in self._metadata.values() if capability in metadata.capabilities
        ]

    def get_agent_dependencies(self, agent_id: str) -> list[str]:
        """Get list of agent IDs that this agent depends on.

        Args:
            agent_id: Agent identifier

        Returns:
            List of dependency agent IDs
        """
        metadata = self.get_metadata(agent_id)
        if metadata:
            return metadata.dependencies
        return []

    def validate_workflow_dependencies(self, agent_ids: list[str]) -> bool:
        """Validate that all dependencies for a workflow are satisfied.

        Args:
            agent_ids: List of agent IDs in the workflow

        Returns:
            True if all dependencies are satisfied, False otherwise
        """
        workflow_agents = set(agent_ids)

        for agent_id in agent_ids:
            dependencies = self.get_agent_dependencies(agent_id)
            missing_deps = set(dependencies) - workflow_agents

            if missing_deps:
                logger.error(f"Agent {agent_id} has missing dependencies: {missing_deps}")
                return False

        return True
