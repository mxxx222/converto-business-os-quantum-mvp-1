"""
Enhanced OpenAI Vision-based receipt data extraction.
Structured output with merchant, date, total, VAT, items, category.
"""

import os
import base64
import json
from typing import Dict, Any
from fastapi import UploadFile
import httpx

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
VISION_MODEL = os.getenv("OPENAI_VISION_MODEL", "gpt-4o-mini")

PROMPT = (
    "Extract structured receipt JSON with keys: "
    "merchant (string), date (YYYY-MM-DD), total (number), "
    "vat (number|object if multiple, use {rate:%, amount}), "
    "currency (string, default 'EUR'), items (array of {name, qty, unit_price, vat_rate?}), "
    "payment_method (string|optional). "
    "Default locale FI, infer when missing. Respond ONLY valid JSON."
)


async def extract_receipt_data(file: UploadFile) -> Dict[str, Any]:
    """
    Extract structured data from receipt image using OpenAI Vision.

    Args:
        file: Uploaded image file

    Returns:
        Dict with merchant, date, total, vat, items, category, confidence
    """
    content = await file.read()
    img_b64 = base64.b64encode(content).decode()

    payload = {
        "model": VISION_MODEL,
        "messages": [
            {
                "role": "system",
                "content": "You are an expert Finnish receipt parser. Output strict JSON.",
            },
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": PROMPT},
                    {
                        "type": "image_url",
                        "image_url": {"url": f"data:image/jpeg;base64,{img_b64}"},
                    },
                ],
            },
        ],
        "temperature": 0,
    }

    headers = {"Authorization": f"Bearer {OPENAI_API_KEY}"}

    try:
        async with httpx.AsyncClient(timeout=120) as client:
            r = await client.post(
                "https://api.openai.com/v1/chat/completions", json=payload, headers=headers
            )
            r.raise_for_status()
            text = r.json()["choices"][0]["message"]["content"]

        # Try parse JSON
        try:
            data = json.loads(text)
        except Exception:
            # Fallback: strip code fence
            text = text.strip("` \n").replace("json\n", "")
            data = json.loads(text)

        # Minimal normalization
        data.setdefault("currency", "EUR")
        data.setdefault("items", [])
        data.setdefault("merchant", "Tuntematon")
        data.setdefault("total", 0.0)

        return data

    except Exception as e:
        return {
            "merchant": "Virhe",
            "total": 0.0,
            "category": "muu",
            "confidence": 0.0,
            "error": str(e),
        }
