"""
AI-powered hotkey command interpreter.
User can type natural language commands and AI executes them.
"""

import os
from openai import OpenAI
import json

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

COMMAND_PROMPT = """
Käyttäjä antoi komennon: "{command}"

Tunnista mitä hän haluaa tehdä ja palauta JSON:
{
  "action": "scan_receipt|show_last_scan|export_csv|send_report|analyze_month|other",
  "params": {
    "target": "...",
    "filter": "...",
    "format": "..."
  },
  "confidence": 0.95
}

Esimerkkejä:
- "skannaa kuitti" → action: scan_receipt
- "näytä viimeisin" → action: show_last_scan
- "lähetä kuun raportti slackiin" → action: send_report, params: {target: "slack", period: "month"}
- "vie CSV" → action: export_csv

Vain JSON, ei selityksiä.
"""


async def interpret_command(command: str) -> dict:
    """
    Interpret natural language command using AI.

    Args:
        command: User's command in natural language (Finnish or English)

    Returns:
        Dict with action, params, confidence
    """
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "Olet Converto Business OS:n komentoavustaja."},
                {"role": "user", "content": COMMAND_PROMPT.format(command=command)},
            ],
            response_format={"type": "json_object"},
            temperature=0.2,
            max_tokens=200,
        )

        content = response.choices[0].message.content
        result = json.loads(content)
        return result

    except Exception as e:
        return {
            "action": "other",
            "params": {},
            "confidence": 0.0,
            "error": str(e),
        }


# Hotkey to action mapping
HOTKEY_ACTIONS = {
    "shift+o": {"action": "scan_receipt", "label": "Skannaa kuitti"},
    "shift+s": {"action": "show_last_scan", "label": "Näytä viimeisin"},
    "shift+r": {"action": "rescan", "label": "Skannaa uudelleen"},
    "shift+e": {"action": "export_csv", "label": "Vie CSV"},
    "shift+n": {"action": "send_report", "label": "Lähetä raportti"},
    "ctrl+shift+a": {"action": "analyze_month", "label": "Analysoi kuukausi"},
}


def get_hotkey_map() -> dict:
    """Return available hotkeys and their actions."""
    return HOTKEY_ACTIONS
