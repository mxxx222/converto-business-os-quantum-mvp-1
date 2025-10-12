"""
Enhanced OpenAI Vision-based receipt data extraction.
Structured output with merchant, date, total, VAT, items, category.
"""
import base64
import json
import os
from typing import Dict, Any
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
VISION_MODEL = os.getenv("VISION_MODEL", "gpt-4o-mini")

EXTRACTION_PROMPT = """
Tehtävä: Lue kaikki tiedot tästä kuitista/laskusta.

Palauta JSON:
{
  "merchant": "Kaupan/palvelun nimi",
  "date": "YYYY-MM-DD",
  "total": 123.45,
  "vat_amount": 24.00,
  "vat_rate": 24,
  "currency": "EUR",
  "category": "ruoka|energia|matka|toimisto|viihde|muu",
  "items": [
    {"name": "Tuote 1", "quantity": 2, "unit_price": 10.50, "total": 21.00}
  ],
  "payment_method": "käteinen|kortti|lasku|muu",
  "confidence": 0.95
}

Jos jokin tieto puuttuu, käytä null. Confidence = luotettavuus (0-1).
Ei selityksiä, vain JSON.
"""


async def extract_receipt_data(file_bytes: bytes) -> Dict[str, Any]:
    """
    Extract structured data from receipt image using OpenAI Vision.
    
    Args:
        file_bytes: Image file content as bytes
    
    Returns:
        Dict with merchant, date, total, vat, items, category, confidence
    """
    b64 = base64.b64encode(file_bytes).decode()
    
    try:
        response = client.chat.completions.create(
            model=VISION_MODEL,
            messages=[
                {
                    "role": "system",
                    "content": "Olet suomalainen kuittien ja laskujen analytiikka-asiantuntija. Palauta aina vain JSON, ei selityksiä.",
                },
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": EXTRACTION_PROMPT},
                        {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{b64}"}},
                    ],
                },
            ],
            response_format={"type": "json_object"},
            temperature=0.1,
            max_tokens=1000,
        )
        
        content = response.choices[0].message.content
        data = json.loads(content)
        
        # Ensure required fields
        data.setdefault("merchant", "Tuntematon")
        data.setdefault("total", 0.0)
        data.setdefault("category", "muu")
        data.setdefault("confidence", 0.5)
        
        return data
    
    except Exception as e:
        # Fallback: return minimal structure
        return {
            "merchant": "Virhe: " + str(e)[:50],
            "total": 0.0,
            "category": "muu",
            "confidence": 0.0,
            "error": str(e),
        }

