"""Adapter to make OCR Service compatible with Agent Orchestrator."""

import base64
import json
import logging
from typing import Any

from shared_core.modules.ocr.privacy import blur_faces_and_plates
from shared_core.modules.ocr.service import run_ocr_bytes

from ..agent_registry import Agent, AgentMetadata, AgentType

logger = logging.getLogger("converto.agent_orchestrator")


class OCRAgentAdapter(Agent):
    """Adapter to make OCR Service compatible with Agent Orchestrator."""

    def __init__(self):
        pass

    async def execute(self, input_data: dict[str, Any], context: dict[str, Any]) -> dict[str, Any]:
        """Execute OCR extraction on receipt image.

        Args:
            input_data: Input data (receipt_file, receipt_bytes, receipt_url)
            context: Execution context

        Returns:
            OCR extraction result
        """
        try:
            # Get receipt file/bytes
            receipt_bytes = None

            if "receipt_bytes" in input_data:
                # Direct bytes
                receipt_bytes = input_data["receipt_bytes"]
                if isinstance(receipt_bytes, str):
                    # Base64 encoded
                    receipt_bytes = base64.b64decode(receipt_bytes)
            elif "receipt_file" in input_data:
                # File path - would need to read file
                file_path = input_data["receipt_file"]
                with open(file_path, "rb") as f:
                    receipt_bytes = f.read()
            elif "receipt_url" in input_data:
                # URL - would need to fetch
                import httpx

                async with httpx.AsyncClient() as client:
                    response = await client.get(input_data["receipt_url"])
                    receipt_bytes = response.content

            if not receipt_bytes:
                raise ValueError(
                    "No receipt data provided (receipt_bytes, receipt_file, or receipt_url required)"
                )

            # Blur faces and license plates for privacy
            safe_bytes = blur_faces_and_plates(receipt_bytes)

            # Run OCR
            ocr_text = run_ocr_bytes(safe_bytes)

            # Run vision enrichment if needed (for receipts, not power devices)
            vision_data = None
            if input_data.get("use_vision", True):
                try:
                    # Use a receipt-specific vision prompt
                    import os

                    from openai import AsyncOpenAI

                    openai_api_key = os.getenv("OPENAI_API_KEY")
                    if openai_api_key:
                        client = AsyncOpenAI(api_key=openai_api_key)
                        import base64

                        b64_image = base64.b64encode(safe_bytes).decode()

                        response = await client.chat.completions.create(
                            model="gpt-4o-mini",
                            messages=[
                                {
                                    "role": "user",
                                    "content": [
                                        {
                                            "type": "text",
                                            "text": "Extract receipt data from this image. Return JSON with: merchant_name, date, total_amount, vat_amount, vat_rate, items (array of {name, price}).",
                                        },
                                        {
                                            "type": "image_url",
                                            "image_url": {
                                                "url": f"data:image/jpeg;base64,{b64_image}"
                                            },
                                        },
                                    ],
                                }
                            ],
                            response_format={"type": "json_object"},
                            temperature=0.2,
                        )
                        vision_data = json.loads(response.choices[0].message.content)
                except Exception as e:
                    logger.warning(f"Vision enrichment failed: {e}")

            # Extract structured data
            extracted_data = {
                "ocr_text": ocr_text,
                "vision_data": vision_data,
                "raw_bytes_length": len(receipt_bytes),
            }

            # Try to extract common receipt fields
            if vision_data:
                extracted_data.update(
                    {
                        "merchant_name": vision_data.get("merchant_name"),
                        "date": vision_data.get("date"),
                        "total_amount": vision_data.get("total_amount"),
                        "vat_amount": vision_data.get("vat_amount"),
                        "vat_rate": vision_data.get("vat_rate"),
                        "items": vision_data.get("items", []),
                    }
                )

            return {
                "extracted_data": extracted_data,
                "confidence": vision_data.get("confidence", 0.8) if vision_data else 0.6,
                "success": True,
            }

        except Exception as e:
            logger.error(f"OCR Agent execution failed: {e}")
            raise

    def get_metadata(self) -> AgentMetadata:
        """Get OCR Agent metadata."""
        from ..agent_registry import AgentMetadata

        return AgentMetadata(
            agent_id="ocr_agent",
            agent_type=AgentType.OCR,
            name="OCR Agent",
            description="AI-powered OCR agent that extracts text and data from receipt images using Tesseract OCR and OpenAI Vision",
            version="1.0.0",
            capabilities=[
                "text_extraction",
                "receipt_parsing",
                "vision_enrichment",
                "privacy_protection",
            ],
            input_schema={
                "type": "object",
                "properties": {
                    "receipt_bytes": {
                        "type": "string",
                        "description": "Receipt image bytes (base64 encoded)",
                    },
                    "receipt_file": {"type": "string", "description": "Path to receipt image file"},
                    "receipt_url": {"type": "string", "description": "URL to receipt image"},
                    "use_vision": {
                        "type": "boolean",
                        "description": "Whether to use OpenAI Vision for enrichment",
                        "default": True,
                    },
                },
            },
            output_schema={
                "type": "object",
                "properties": {
                    "extracted_data": {"type": "object", "description": "Extracted receipt data"},
                    "confidence": {"type": "number", "description": "Extraction confidence score"},
                    "success": {
                        "type": "boolean",
                        "description": "Whether extraction was successful",
                    },
                },
            },
            dependencies=[],
            cost_per_request=0.02,  # Estimated cost (Vision API)
            avg_response_time_ms=3000,
        )

    async def validate_input(self, input_data: dict[str, Any]) -> bool:
        """Validate input data for OCR Agent.

        Args:
            input_data: Input data to validate

        Returns:
            True if valid, False otherwise
        """
        # Must have at least one receipt source
        has_receipt_source = (
            "receipt_bytes" in input_data
            or "receipt_file" in input_data
            or "receipt_url" in input_data
        )

        return has_receipt_source
