"""Batch API support for OpenAI to reduce costs and improve throughput."""

from __future__ import annotations

import json
import logging
import os
from typing import Any

from openai import OpenAI

logger = logging.getLogger("converto.ai.batch")


class OpenAIBatchProcessor:
    """Process OpenAI API requests in batches."""

    def __init__(self, client: OpenAI | None = None):
        """Initialize batch processor.

        Args:
            client: OpenAI client (optional, creates new if None)
        """
        self.client = client or OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        self.batch_size = int(os.getenv("OPENAI_BATCH_SIZE", "50"))

    async def process_chat_batch(
        self,
        requests: list[dict[str, Any]],
        model: str = "gpt-4o-mini",
    ) -> list[dict[str, Any]]:
        """Process multiple chat completion requests in batch.

        Args:
            requests: List of request dicts with 'messages' key
            model: Model to use

        Returns:
            List of response dicts
        """
        if not requests:
            return []

        # Create batch request file
        batch_requests = []
        for req in requests:
            batch_requests.append(
                {
                    "custom_id": f"request-{len(batch_requests)}",
                    "method": "POST",
                    "url": "/v1/chat/completions",
                    "body": {
                        "model": model,
                        "messages": req.get("messages", []),
                        "temperature": req.get("temperature", 0.7),
                        "max_tokens": req.get("max_tokens", 1000),
                    },
                }
            )

        # Submit batch
        try:
            # Create batch file (upload to OpenAI)
            batch_file = self.client.files.create(
                file=json.dumps(batch_requests).encode(),
                purpose="batch",
            )

            # Create batch
            batch = self.client.batches.create(
                input_file_id=batch_file.id,
                endpoint="/v1/chat/completions",
            )

            logger.info(f"Batch created: {batch.id} ({len(requests)} requests)")

            # Wait for completion (poll)
            while batch.status in ["validating", "in_progress"]:
                import asyncio

                await asyncio.sleep(5)
                batch = self.client.batches.retrieve(batch.id)

            if batch.status == "completed":
                # Retrieve results
                output_file_id = batch.output_file_id
                output_file = self.client.files.content(output_file_id)
                results = json.loads(output_file.read())

                # Parse responses
                responses = []
                for result in results.get("data", []):
                    if result.get("status") == "completed":
                        response_body = result.get("response", {}).get("body", {})
                        responses.append(response_body)
                    else:
                        logger.warning(f"Request failed: {result.get('error')}")
                        responses.append({"error": result.get("error")})

                return responses
            else:
                logger.error(f"Batch failed: {batch.status}")
                return []

        except Exception as e:
            logger.error(f"Batch processing failed: {e}")
            # Fallback to individual requests
            return await self._fallback_individual(requests, model)

    async def process_embedding_batch(
        self,
        texts: list[str],
        model: str = "text-embedding-3-small",
    ) -> list[list[float]]:
        """Process multiple embedding requests in batch.

        Args:
            texts: List of texts to embed
            model: Embedding model to use

        Returns:
            List of embedding vectors
        """
        if not texts:
            return []

        # Create batch request file
        batch_requests = []
        for i, text in enumerate(texts):
            batch_requests.append(
                {
                    "custom_id": f"embedding-{i}",
                    "method": "POST",
                    "url": "/v1/embeddings",
                    "body": {
                        "model": model,
                        "input": text,
                    },
                }
            )

        # Submit batch (similar to chat batch)
        try:
            batch_file = self.client.files.create(
                file=json.dumps(batch_requests).encode(),
                purpose="batch",
            )

            batch = self.client.batches.create(
                input_file_id=batch_file.id,
                endpoint="/v1/embeddings",
            )

            logger.info(f"Embedding batch created: {batch.id} ({len(texts)} texts)")

            # Wait and retrieve (same as chat batch)
            while batch.status in ["validating", "in_progress"]:
                import asyncio

                await asyncio.sleep(5)
                batch = self.client.batches.retrieve(batch.id)

            if batch.status == "completed":
                output_file_id = batch.output_file_id
                output_file = self.client.files.content(output_file_id)
                results = json.loads(output_file.read())

                embeddings = []
                for result in results.get("data", []):
                    if result.get("status") == "completed":
                        response_body = result.get("response", {}).get("body", {})
                        embedding = response_body.get("data", [{}])[0].get("embedding", [])
                        embeddings.append(embedding)
                    else:
                        logger.warning(f"Embedding failed: {result.get('error')}")
                        embeddings.append([])

                return embeddings
            else:
                logger.error(f"Embedding batch failed: {batch.status}")
                return []

        except Exception as e:
            logger.error(f"Embedding batch failed: {e}")
            # Fallback to individual requests
            return await self._fallback_embeddings(texts, model)

    async def _fallback_individual(
        self,
        requests: list[dict[str, Any]],
        model: str,
    ) -> list[dict[str, Any]]:
        """Fallback to individual requests if batch fails."""
        responses = []
        for req in requests:
            try:
                response = self.client.chat.completions.create(
                    model=model,
                    messages=req.get("messages", []),
                    temperature=req.get("temperature", 0.7),
                    max_tokens=req.get("max_tokens", 1000),
                )
                responses.append(
                    {
                        "choices": [{"message": {"content": response.choices[0].message.content}}],
                        "usage": response.usage.dict() if response.usage else None,
                    }
                )
            except Exception as e:
                logger.error(f"Individual request failed: {e}")
                responses.append({"error": str(e)})
        return responses

    async def _fallback_embeddings(
        self,
        texts: list[str],
        model: str,
    ) -> list[list[float]]:
        """Fallback to individual embedding requests."""
        embeddings = []
        for text in texts:
            try:
                response = self.client.embeddings.create(
                    model=model,
                    input=text,
                )
                embeddings.append(response.data[0].embedding)
            except Exception as e:
                logger.error(f"Individual embedding failed: {e}")
                embeddings.append([])
        return embeddings
