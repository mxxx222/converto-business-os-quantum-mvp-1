from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List, Optional
import os
import json
from openai import OpenAI

from .cache import get_cache

router = APIRouter(prefix="/api/v1/ai", tags=["ai"])

# Lazy-initialize OpenAI client at request time to avoid build-time failures
client: Optional[OpenAI] = None

def get_openai_client() -> OpenAI:
    global client
    if client is None:
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            # Create a placeholder client with empty key to raise clear error later
            raise RuntimeError("OPENAI_API_KEY not configured")
        client = OpenAI(api_key=api_key)
    return client

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    model: Optional[str] = "gpt-4o-mini"
    max_tokens: Optional[int] = 1000
    temperature: Optional[float] = 0.7

class ChatResponse(BaseModel):
    success: bool
    response: str
    model: str
    usage: Optional[dict] = None

@router.post("/chat", response_model=ChatResponse)
async def ai_chat(request: ChatRequest):
    """AI chat endpoint for business assistance (with caching)."""
    try:
        # Add system message if not present
        system_message = ChatMessage(
            role="system",
            content="You are CONVERTO AI Assistant, a helpful business automation expert. Provide clear, actionable advice for business operations, OCR, VAT calculations, and legal compliance."
        )
        
        messages = request.messages
        if not any(msg.role == "system" for msg in messages):
            messages = [system_message] + messages
        
        # Convert to OpenAI format
        openai_messages = [{"role": msg.role, "content": msg.content} for msg in messages]
        
        # OPTIMIZED: Check cache first
        cache = get_cache()
        cached_response = cache.get(
            model=request.model,
            messages=openai_messages,
            temperature=request.temperature,
            max_tokens=request.max_tokens,
        )
        
        if cached_response:
            return ChatResponse(
                success=True,
                response=cached_response.get("choices", [{}])[0].get("message", {}).get("content", ""),
                model=cached_response.get("model", request.model),
                usage=cached_response.get("usage"),
            )
        
        # Call OpenAI API
        completion = get_openai_client().chat.completions.create(
            model=request.model,
            messages=openai_messages,
            max_tokens=request.max_tokens,
            temperature=request.temperature,
        )
        
        # OPTIMIZED: Cache response
        response_dict = {
            "choices": [{"message": {"content": completion.choices[0].message.content}}],
            "model": completion.model,
            "usage": completion.usage.dict() if completion.usage else None,
        }
        cache.set(
            model=request.model,
            messages=openai_messages,
            response=response_dict,
            temperature=request.temperature,
            max_tokens=request.max_tokens,
        )
        
        return ChatResponse(
            success=True,
            response=completion.choices[0].message.content,
            model=completion.model,
            usage=completion.usage.dict() if completion.usage else None
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"AI chat failed: {str(e)}"
        )

@router.post("/chat/stream")
async def ai_chat_stream(request: ChatRequest):
    """AI chat endpoint with streaming support (better UX)."""
    try:
        # Add system message if not present
        system_message = ChatMessage(
            role="system",
            content="You are CONVERTO AI Assistant, a helpful business automation expert. Provide clear, actionable advice for business operations, OCR, VAT calculations, and legal compliance."
        )
        
        messages = request.messages
        if not any(msg.role == "system" for msg in messages):
            messages = [system_message] + messages
        
        # Convert to OpenAI format
        openai_messages = [{"role": msg.role, "content": msg.content} for msg in messages]
        
        # OPTIMIZED: Stream response
        stream = get_openai_client().chat.completions.create(
            model=request.model,
            messages=openai_messages,
            max_tokens=request.max_tokens,
            temperature=request.temperature,
            stream=True,
        )
        
        async def generate():
            async for chunk in stream:
                if chunk.choices[0].delta.content:
                    yield f"data: {json.dumps({'content': chunk.choices[0].delta.content})}\n\n"
            yield "data: [DONE]\n\n"
        
        return StreamingResponse(generate(), media_type="text/event-stream")
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"AI chat streaming failed: {str(e)}"
        )

@router.get("/models")
async def list_models():
    """List available AI models."""
    return {
        "openai": {
            "recommended": "gpt-4o-mini",
            "models": {
                "gpt-4o": "Most capable (expensive)",
                "gpt-4o-mini": "Fast and cheap (recommended)",
                "gpt-3.5-turbo": "Legacy (not recommended)"
            }
        }
    }

@router.get("/health")
async def ai_health():
    """AI service health check."""
    return {
        "status": "ok",
        "service": "AI Chat",
        "model": "gpt-4o-mini",
        "openai_configured": bool(os.getenv("OPENAI_API_KEY"))
    }
