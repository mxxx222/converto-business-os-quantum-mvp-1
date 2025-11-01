#!/usr/bin/env python3
"""
Setup Resend Templates for Converto Business OS.
Creates all email templates in Resend API.
"""

import asyncio
import os
import sys
from pathlib import Path

# Add backend to path
sys.path.insert(0, str(Path(__file__).parent.parent / "backend"))

from modules.email.resend_optimized import ResendOptimized


TEMPLATES = [
    {
        "name": "pilot_signup_confirmation",
        "subject": "Tervetuloa Converto Business OS pilottiin!",
        "html": """
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Kiitos ilmoittautumisesta!</h2>
          <p>Hei {{name}},</p>
          <p>Olemme vastaanottaneet ilmoittautumisesi Converto Business OS pilottiohjelmaan.</p>
          <p>Tiimimme ottaa sinuun yhteyttä pian ja auttaa sinua pääsemään alkuun.</p>
          <p>Odota kuulla meiltä!</p>
          <p>Ystävällisin terveisin,<br>Converto-tiimi</p>
        </div>
        """,
    },
    {
        "name": "pilot_signup_notification",
        "subject": "Uusi pilotti-ilmoittautuminen: {{company}}",
        "html": """
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Uusi pilotti-ilmoittautuminen</h2>
          <p><strong>Yritys:</strong> {{company}}</p>
          <p><strong>Yhteyshenkilö:</strong> {{name}}</p>
          <p><strong>Sähköposti:</strong> {{email}}</p>
          <p>Ota yhteyttä ja aloita pilottiohjelma!</p>
        </div>
        """,
    },
    {
        "name": "welcome_email",
        "subject": "{{name}}, tervetuloa Converto Business OS™ -ekosysteemiin!",
        "html": """
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563EB;">Tervetuloa Converto-ekosysteemiin!</h1>
          <p>Hei {{name}},</p>
          <p>Kiitos kiinnostuksestasi Converto Business OS™:ää kohtaan! Olemme innoissamme mahdollisuudesta auttaa {{company}}:a automatisoimaan prosesseja ja kasvattamaan liikevaihto.</p>
          <h2>Mitä seuraavaksi?</h2>
          <ol>
            <li><strong>Demo-kutsu</strong> - Saat kalenterikutsun 24 tunnin sisällä</li>
            <li><strong>Business OS™ -pääsy</strong> - 30 päivän ilmainen pilotti</li>
            <li><strong>ROI-analyysi</strong> - Näytämme konkreettiset säästöt</li>
          </ol>
          <p>Ystävällisin terveisin,<br><strong>Converto-tiimi</strong></p>
        </div>
        """,
    },
    {
        "name": "crm_lead_notification",
        "subject": "New lead: {{company}} ({{stage}})",
        "html": """
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>New Lead Created</h2>
          <p><strong>Company:</strong> {{company}}</p>
          <p><strong>Contact:</strong> {{name}}</p>
          <p><strong>Email:</strong> {{email}}</p>
          <p><strong>Source:</strong> {{source}}</p>
          <p><strong>Stage:</strong> {{stage}}</p>
        </div>
        """,
    },
    {
        "name": "crm_lead_welcome",
        "subject": "Tervetuloa Converto-ekosysteemiin!",
        "html": """
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Kiitos kiinnostuksestasi!</h2>
          <p>Hei {{name}},</p>
          <p>Olemme vastaanottaneet yhteydenottosi ja otamme sinuun yhteyttä pian.</p>
          <h3>Mitä seuraavaksi?</h3>
          <ol>
            <li>Tiimimme ottaa yhteyttä 24 tunnin sisällä</li>
            <li>Sovimme demo-ajan Business OS™:lle</li>
            <li>Saat pääsyn 30 päivän ilmaiseen pilottiin</li>
          </ol>
          <p>Ystävällisin terveisin,<br>Converto-tiimi</p>
        </div>
        """,
    },
]


async def setup_templates():
    """Create all templates in Resend."""
    if not os.getenv("RESEND_API_KEY"):
        print("❌ RESEND_API_KEY not configured")
        return

    client = ResendOptimized()
    created_templates = []

    print("🚀 Creating Resend Templates...\n")

    for template in TEMPLATES:
        try:
            result = await client.create_template(
                name=template["name"],
                subject=template["subject"],
                html=template["html"],
            )
            template_id = result.get("id", "unknown")
            created_templates.append({
                "name": template["name"],
                "id": template_id,
            })
            print(f"✅ Created: {template['name']} (ID: {template_id})")
        except Exception as e:
            print(f"❌ Failed to create {template['name']}: {e}")

    print(f"\n✅ Created {len(created_templates)} templates")
    print("\n📋 Template IDs (save these to config):")
    for tmpl in created_templates:
        print(f"  {tmpl['name']}: {tmpl['id']}")


if __name__ == "__main__":
    asyncio.run(setup_templates())

