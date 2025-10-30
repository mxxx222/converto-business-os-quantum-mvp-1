"""Email automation module for Converto Business OS."""

from .service import EmailService
from .templates import EmailTemplates
from .workflows import EmailWorkflows

__all__ = ["EmailService", "EmailTemplates", "EmailWorkflows"]
