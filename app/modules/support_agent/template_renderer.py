"""
Email Template Renderer
Load and render HTML email templates with variable substitution
"""

from pathlib import Path
from typing import Dict


TEMPLATES_DIR = Path(__file__).parent / "templates"


def render_template(template_name: str, variables: Dict[str, str]) -> str:
    """
    Render email template with variables

    Args:
        template_name: Template name (without .html extension)
        variables: Dictionary of variables to substitute

    Returns:
        Rendered HTML

    Example:
        html = render_template("pricing", {
            "PRICE_STARTER": "19€",
            "PRICE_PRO": "39€",
            "PRICING_URL": "https://converto.fi/pricing"
        })
    """
    # Load base template
    base_path = TEMPLATES_DIR / "base.html"
    if not base_path.exists():
        raise FileNotFoundError(f"Base template not found: {base_path}")

    base_html = base_path.read_text(encoding="utf-8")

    # Load content template
    content_path = TEMPLATES_DIR / f"{template_name}.html"
    if not content_path.exists():
        raise FileNotFoundError(f"Template not found: {content_path}")

    content_html = content_path.read_text(encoding="utf-8")

    # Inject content into base
    html = base_html.replace("{{BODY}}", content_html)

    # Substitute variables
    for key, value in variables.items():
        placeholder = f"{{{{{key}}}}}"
        html = html.replace(placeholder, str(value))

    # Set default values for common variables
    defaults = {
        "{{PREFERENCES_URL}}": "https://converto.fi/preferences",
        "{{APP_URL}}": "https://app.converto.fi",
        "{{DOCS_URL}}": "https://converto.fi/docs",
        "{{PRICING_URL}}": "https://converto.fi/pricing",
        "{{DEMO_URL}}": "https://converto.fi/demo",
    }

    for placeholder, default_value in defaults.items():
        if placeholder in html:
            html = html.replace(placeholder, default_value)

    return html


def render_all_templates(variables: Dict[str, str]) -> Dict[str, str]:
    """
    Render all available templates

    Args:
        variables: Common variables for all templates

    Returns:
        Dictionary of template_name: rendered_html
    """
    templates = ["pricing", "demo", "billing", "tech"]
    rendered = {}

    for template in templates:
        try:
            rendered[template] = render_template(template, variables)
        except FileNotFoundError:
            pass  # Skip missing templates

    return rendered
