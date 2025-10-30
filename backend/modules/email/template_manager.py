# 📧 Template Manager - Resend Email Templates

import json
import logging
from pathlib import Path
from typing import Dict, List, Optional, Any

from backend.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()


class TemplateManager:
    """Manage email templates and their validation."""
    
    def __init__(self):
        self.templates_dir = Path("backend/modules/email/templates")
        self.schemas_dir = Path("backend/modules/email/schemas")
        self.locales = ["fi", "en", "sv", "ru", "et"]
        self.layouts = ["base_layout", "minimal_layout", "marketing_layout"]
        
    def load_template(self, template_name: str, locale: str = "fi") -> Dict[str, Any]:
        """Load template with specified locale."""
        template_path = self.templates_dir / "locales" / locale / f"{template_name}.html"
        
        if not template_path.exists():
            logger.warning(f"Template not found: {template_path}")
            return self._get_fallback_template(template_name, locale)
        
        with open(template_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        return {
            "name": template_name,
            "locale": locale,
            "content": content,
            "path": str(template_path)
        }
    
    def load_layout(self, layout_name: str) -> str:
        """Load layout template."""
        layout_path = self.templates_dir / "layouts" / f"{layout_name}.html"
        
        if not layout_path.exists():
            logger.error(f"Layout not found: {layout_path}")
            return self._get_fallback_layout()
        
        with open(layout_path, 'r', encoding='utf-8') as f:
            return f.read()
    
    def load_partial(self, partial_name: str) -> str:
        """Load partial template."""
        partial_path = self.templates_dir / "partials" / f"{partial_name}.html"
        
        if not partial_path.exists():
            logger.warning(f"Partial not found: {partial_path}")
            return ""
        
        with open(partial_path, 'r', encoding='utf-8') as f:
            return f.read()
    
    def render_template(self, template_name: str, locale: str = "fi", 
                      layout: str = "base_layout", **kwargs) -> Dict[str, Any]:
        """Render complete email template."""
        # Load template content
        template = self.load_template(template_name, locale)
        template_content = template["content"]
        
        # Load layout
        layout_content = self.load_layout(layout)
        
        # Load partials
        legal_footer = self.load_partial("legal_footer")
        unsubscribe_footer = self.load_partial("unsubscribe_footer")
        social_links = self.load_partial("social_links")
        
        # Replace placeholders
        rendered_content = template_content.format(
            legal_footer=legal_footer,
            unsubscribe_footer=unsubscribe_footer,
            social_links=social_links,
            **kwargs
        )
        
        # Wrap in layout
        final_content = layout_content.format(
            content=rendered_content,
            **kwargs
        )
        
        return {
            "subject": self._get_subject(template_name, locale, **kwargs),
            "preheader": self._get_preheader(template_name, locale, **kwargs),
            "from": self._get_from_address(template_name),
            "reply_to": self._get_reply_to_address(template_name),
            "content": final_content,
            "locale": locale,
            "layout": layout
        }
    
    def _get_subject(self, template_name: str, locale: str, **kwargs) -> str:
        """Get email subject based on template and locale."""
        subjects = {
            "pilot_onboarding": {
                "fi": "Tervetuloa Converto Business OS:een! 🚀",
                "en": "Welcome to Converto Business OS! 🚀",
                "sv": "Välkommen till Converto Business OS! 🚀",
                "ru": "Добро пожаловать в Converto Business OS! 🚀",
                "et": "Tere tulemast Converto Business OS:esse! 🚀"
            },
            "deployment_notification": {
                "fi": "Deployment {status} - {service_name}",
                "en": "Deployment {status} - {service_name}",
                "sv": "Deployment {status} - {service_name}",
                "ru": "Deployment {status} - {service_name}",
                "et": "Deployment {status} - {service_name}"
            },
            "error_alert": {
                "fi": "🚨 {severity} Alert - {service_name}",
                "en": "🚨 {severity} Alert - {service_name}",
                "sv": "🚨 {severity} Alert - {service_name}",
                "ru": "🚨 {severity} Alert - {service_name}",
                "et": "🚨 {severity} Alert - {service_name}"
            }
        }
        
        return subjects.get(template_name, {}).get(locale, "Converto Business OS").format(**kwargs)
    
    def _get_preheader(self, template_name: str, locale: str, **kwargs) -> str:
        """Get email preheader based on template and locale."""
        preheaders = {
            "pilot_onboarding": {
                "fi": "Aloita automaatio 5 minuutissa",
                "en": "Start automation in 5 minutes",
                "sv": "Starta automatisering på 5 minuter",
                "ru": "Начните автоматизацию за 5 минут",
                "et": "Alusta automatiseerimine 5 minuti jooksul"
            },
            "deployment_notification": {
                "fi": "Tarkista palvelun tila",
                "en": "Check service status",
                "sv": "Kontrollera tjänstestatus",
                "ru": "Проверьте статус сервиса",
                "et": "Kontrolli teenuse staatust"
            },
            "error_alert": {
                "fi": "Tarkista palvelun tila välittömästi",
                "en": "Check service status immediately",
                "sv": "Kontrollera tjänstestatus omedelbart",
                "ru": "Проверьте статус сервиса немедленно",
                "et": "Kontrolli teenuse staatust kohe"
            }
        }
        
        return preheaders.get(template_name, {}).get(locale, "Converto Business OS").format(**kwargs)
    
    def _get_from_address(self, template_name: str) -> str:
        """Get from address based on template type."""
        from_addresses = {
            "pilot_onboarding": "no-reply@converto.fi",
            "deployment_notification": "no-reply@converto.fi",
            "error_alert": "no-reply@converto.fi"
        }
        return from_addresses.get(template_name, "no-reply@converto.fi")
    
    def _get_reply_to_address(self, template_name: str) -> str:
        """Get reply-to address based on template type."""
        reply_to_addresses = {
            "pilot_onboarding": "support@converto.fi",
            "deployment_notification": "support@converto.fi",
            "error_alert": "support@converto.fi"
        }
        return reply_to_addresses.get(template_name, "support@converto.fi")
    
    def _get_fallback_template(self, template_name: str, locale: str) -> Dict[str, Any]:
        """Get fallback template when original not found."""
        return {
            "name": template_name,
            "locale": locale,
            "content": f"<h1>Converto Business OS</h1><p>Template {template_name} not found for locale {locale}</p>",
            "path": "fallback"
        }
    
    def _get_fallback_layout(self) -> str:
        """Get fallback layout when original not found."""
        return """
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>Converto Business OS</title>
        </head>
        <body>
            {content}
        </body>
        </html>
        """
    
    def validate_template(self, template_name: str, locale: str = "fi") -> Dict[str, Any]:
        """Validate template structure and content."""
        template = self.load_template(template_name, locale)
        
        validation_result = {
            "valid": True,
            "errors": [],
            "warnings": []
        }
        
        # Check required elements
        content = template["content"]
        
        if "unsubscribe" not in content.lower():
            validation_result["warnings"].append("Missing unsubscribe link")
        
        if "converto.fi" not in content:
            validation_result["warnings"].append("Missing company domain")
        
        # Check for spam triggers
        spam_words = ["free", "urgent", "act now", "limited time", "click here"]
        for word in spam_words:
            if word in content.lower():
                validation_result["warnings"].append(f"Potential spam trigger: {word}")
        
        # Check subject length
        subject = self._get_subject(template_name, locale)
        if len(subject) > 78:
            validation_result["errors"].append(f"Subject too long: {len(subject)} chars")
        
        # Check preheader length
        preheader = self._get_preheader(template_name, locale)
        if len(preheader) > 100:
            validation_result["errors"].append(f"Preheader too long: {len(preheader)} chars")
        
        validation_result["valid"] = len(validation_result["errors"]) == 0
        
        return validation_result
    
    def get_available_templates(self) -> List[str]:
        """Get list of available templates."""
        templates = []
        for locale_dir in self.templates_dir.glob("locales/*"):
            if locale_dir.is_dir():
                for template_file in locale_dir.glob("*.html"):
                    template_name = template_file.stem
                    if template_name not in templates:
                        templates.append(template_name)
        return templates
    
    def create_template_schema(self) -> Dict[str, Any]:
        """Create JSON schema for template validation."""
        return {
            "$schema": "http://json-schema.org/draft-07/schema#",
            "type": "object",
            "properties": {
                "name": {"type": "string"},
                "locale": {"type": "string", "enum": self.locales},
                "subject": {"type": "string", "maxLength": 78},
                "preheader": {"type": "string", "maxLength": 100},
                "from": {"type": "string", "format": "email"},
                "reply_to": {"type": "string", "format": "email"},
                "layout": {"type": "string", "enum": self.layouts},
                "content": {"type": "string"}
            },
            "required": ["name", "locale", "subject", "preheader", "from", "reply_to", "content"]
        }


# Convenience functions
def get_template_manager() -> TemplateManager:
    """Get template manager instance."""
    return TemplateManager()


def render_pilot_onboarding(user_name: str, locale: str = "fi") -> Dict[str, Any]:
    """Render pilot onboarding email."""
    manager = get_template_manager()
    return manager.render_template(
        "pilot_onboarding",
        locale=locale,
        user_name=user_name,
        company_name="Converto Business OS"
    )


def render_deployment_notification(service_name: str, status: str, 
                                 locale: str = "en") -> Dict[str, Any]:
    """Render deployment notification email."""
    manager = get_template_manager()
    return manager.render_template(
        "deployment_notification",
        locale=locale,
        service_name=service_name,
        status=status
    )


def render_error_alert(service_name: str, severity: str, error_message: str,
                      locale: str = "en") -> Dict[str, Any]:
    """Render error alert email."""
    manager = get_template_manager()
    return manager.render_template(
        "error_alert",
        locale=locale,
        service_name=service_name,
        severity=severity,
        error_message=error_message
    )
