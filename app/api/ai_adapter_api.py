"""
AI Adapter API
Test and manage AI providers
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Optional
from app.core.ai_adapter import AIAdapter, AI_PROVIDER
import os


router = APIRouter(prefix="/api/v1/ai", tags=["ai"])


class ChatRequest(BaseModel):
    prompt: str
    temperature: float = 0.2
    max_tokens: int = 2000
    provider: Optional[str] = None


class ChatResponse(BaseModel):
    ok: bool
    text: str
    provider: str
    model: str


@router.get("/whoami")
def whoami():
    """
    Get current AI provider configuration

    Returns info about configured providers and models
    """
    return {
        "default_provider": AI_PROVIDER,
        "providers": {
            "openai": {
                "configured": bool(os.getenv("OPENAI_API_KEY")),
                "model": os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
            },
            "ollama": {
                "configured": True,  # Always available if running
                "host": os.getenv("OLLAMA_HOST", "http://127.0.0.1:11434"),
                "model": os.getenv("OLLAMA_MODEL", "mistral"),
            },
            "anthropic": {
                "configured": bool(os.getenv("ANTHROPIC_API_KEY")),
                "model": os.getenv("ANTHROPIC_MODEL", "claude-3-haiku-20240307"),
            },
        },
    }


@router.get("/test/{provider}")
def test_provider(provider: str):
    """
    Test if provider is available and working

    Args:
        provider: openai, ollama, or anthropic
    """
    try:
        ai = AIAdapter(provider=provider)
        info = ai.get_info()

        # Try a simple ping
        try:
            response = ai.simple("Say 'pong' in one word", temperature=0, max_tokens=10)
            return {"status": "ok", "provider": provider, "info": info, "test_response": response}
        except Exception as e:
            return {"status": "error", "provider": provider, "info": info, "error": str(e)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Provider test failed: {str(e)}")


@router.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    """
    Chat with AI

    Body:
    ```json
    {
      "prompt": "Kerro kolme ideaa PK-yritykselle",
      "temperature": 0.2,
      "provider": "openai"  // optional, uses default if not set
    }
    ```
    """
    try:
        ai = AIAdapter(provider=req.provider)

        text = ai.simple(prompt=req.prompt, temperature=req.temperature, max_tokens=req.max_tokens)

        return ChatResponse(ok=True, text=text, provider=ai.provider, model=ai.model)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat failed: {str(e)}")


@router.post("/structured")
def structured_chat(
    prompt: str,
    system: Optional[str] = None,
    temperature: float = 0.1,
    provider: Optional[str] = None,
):
    """
    Structured chat with system message

    Useful for JSON responses, classification, etc.

    Query params:
    - prompt: User prompt
    - system: System message (optional)
    - temperature: Randomness (default: 0.1)
    - provider: AI provider (optional, uses default)
    """
    try:
        ai = AIAdapter(provider=provider)

        text = ai.structured(prompt=prompt, system=system, temperature=temperature)

        return {"ok": True, "text": text, "provider": ai.provider, "model": ai.model}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Structured chat failed: {str(e)}")


@router.get("/models/list")
def list_models():
    """
    List available models for each provider

    Returns suggested models for different use cases
    """
    return {
        "openai": {
            "recommended": "gpt-4o-mini",
            "models": {
                "gpt-4o": "Most capable (expensive)",
                "gpt-4o-mini": "Fast and cheap (recommended)",
                "gpt-3.5-turbo": "Legacy (not recommended)",
            },
        },
        "ollama": {
            "recommended": "mistral",
            "models": {
                "mistral": "7B, fast, general purpose",
                "llama3": "8B, Meta's latest",
                "phi3": "3.8B, lightweight, Microsoft",
                "codellama": "7B, specialized for code",
                "gemma": "7B, Google",
            },
            "install": "ollama pull <model>",
        },
        "anthropic": {
            "recommended": "claude-3-haiku-20240307",
            "models": {
                "claude-3-opus-20240229": "Most capable (expensive)",
                "claude-3-sonnet-20240229": "Balanced",
                "claude-3-haiku-20240307": "Fast and cheap (recommended)",
            },
        },
    }
