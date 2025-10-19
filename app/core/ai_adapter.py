"""
AI Adapter Layer - Provider-Agnostic Intelligence

Supports:
- OpenAI (cloud)
- Ollama (local)
- Future: Anthropic, Google, custom models

Switch providers with AI_PROVIDER env var
"""

import os
from typing import List, Dict, Optional, Literal

AIProvider = Literal["openai", "ollama", "anthropic"]

# Global provider selection
AI_PROVIDER = os.getenv("AI_PROVIDER", "openai").lower()


class AIAdapter:
    """
    Universal AI adapter that works with multiple providers

    Usage:
        ai = AIAdapter()  # Uses AI_PROVIDER env
        response = ai.simple("Analyze this receipt")

        # Or specify provider
        ai = AIAdapter(provider="ollama")
        response = ai.chat([
            {"role": "system", "content": "You are a VAT expert"},
            {"role": "user", "content": "What is the VAT rate for food?"}
        ])
    """

    def __init__(self, provider: Optional[str] = None):
        self.provider = (provider or AI_PROVIDER).lower()

        if self.provider == "openai":
            self._init_openai()
        elif self.provider == "ollama":
            self._init_ollama()
        elif self.provider == "anthropic":
            self._init_anthropic()
        else:
            raise ValueError(f"Unknown AI provider: {self.provider}")

    def _init_openai(self):
        """Initialize OpenAI client"""
        try:
            import openai

            self.openai = openai
            self.openai.api_key = os.getenv("OPENAI_API_KEY", "")
            self.model = os.getenv("OPENAI_MODEL", "gpt-4o-mini")

            if not self.openai.api_key:
                print("⚠️  OPENAI_API_KEY not set")
        except ImportError:
            raise ImportError("openai package not installed. Run: pip install openai")

    def _init_ollama(self):
        """Initialize Ollama (local) client"""
        try:
            import httpx

            self.httpx = httpx
            self.ollama_host = os.getenv("OLLAMA_HOST", "http://127.0.0.1:11434")
            self.model = os.getenv("OLLAMA_MODEL", "mistral")

            # Test connectivity
            try:
                with httpx.Client(timeout=2) as client:
                    client.get(f"{self.ollama_host}/api/tags")
                print(f"✅ Ollama connected: {self.ollama_host}")
            except Exception as e:
                print(f"⚠️  Ollama not reachable: {e}")
                print(f"💡 Start with: ollama serve")
        except ImportError:
            raise ImportError("httpx package not installed. Run: pip install httpx")

    def _init_anthropic(self):
        """Initialize Anthropic (Claude) client"""
        try:
            import anthropic

            self.anthropic = anthropic
            self.anthropic_client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY", ""))
            self.model = os.getenv("ANTHROPIC_MODEL", "claude-3-haiku-20240307")

            if not os.getenv("ANTHROPIC_API_KEY"):
                print("⚠️  ANTHROPIC_API_KEY not set")
        except ImportError:
            raise ImportError("anthropic package not installed. Run: pip install anthropic")

    def chat(
        self, messages: List[Dict[str, str]], temperature: float = 0.2, max_tokens: int = 2000
    ) -> str:
        """
        Chat completion with message history

        Args:
            messages: List of {"role": "user/system/assistant", "content": "..."}
            temperature: Randomness (0-1)
            max_tokens: Max response length

        Returns:
            Model response text
        """
        if self.provider == "openai":
            return self._chat_openai(messages, temperature, max_tokens)
        elif self.provider == "ollama":
            return self._chat_ollama(messages, temperature, max_tokens)
        elif self.provider == "anthropic":
            return self._chat_anthropic(messages, temperature, max_tokens)
        else:
            raise ValueError(f"Provider {self.provider} not implemented")

    def _chat_openai(
        self, messages: List[Dict[str, str]], temperature: float, max_tokens: int
    ) -> str:
        """OpenAI chat completion"""
        try:
            resp = self.openai.ChatCompletion.create(
                model=self.model,
                messages=messages,
                temperature=temperature,
                max_tokens=max_tokens,
            )
            return resp["choices"][0]["message"]["content"]
        except Exception as e:
            raise RuntimeError(f"OpenAI API error: {e}")

    def _chat_ollama(
        self, messages: List[Dict[str, str]], temperature: float, max_tokens: int
    ) -> str:
        """Ollama local chat completion"""
        try:
            with self.httpx.Client(timeout=120) as client:
                r = client.post(
                    f"{self.ollama_host}/api/chat",
                    json={
                        "model": self.model,
                        "messages": messages,
                        "stream": False,
                        "options": {"temperature": temperature, "num_predict": max_tokens},
                    },
                )
                r.raise_for_status()
                data = r.json()
                return data.get("message", {}).get("content", "")
        except Exception as e:
            raise RuntimeError(f"Ollama API error: {e}")

    def _chat_anthropic(
        self, messages: List[Dict[str, str]], temperature: float, max_tokens: int
    ) -> str:
        """Anthropic (Claude) chat completion"""
        try:
            # Anthropic requires system message separately
            system = None
            user_messages = []

            for msg in messages:
                if msg["role"] == "system":
                    system = msg["content"]
                else:
                    user_messages.append(msg)

            response = self.anthropic_client.messages.create(
                model=self.model,
                max_tokens=max_tokens,
                temperature=temperature,
                system=system,
                messages=user_messages,
            )

            return response.content[0].text
        except Exception as e:
            raise RuntimeError(f"Anthropic API error: {e}")

    def simple(self, prompt: str, temperature: float = 0.2, max_tokens: int = 2000) -> str:
        """
        Simple single-turn prompt

        Args:
            prompt: User prompt
            temperature: Randomness
            max_tokens: Max response length

        Returns:
            Model response
        """
        return self.chat(
            [{"role": "user", "content": prompt}], temperature=temperature, max_tokens=max_tokens
        )

    def structured(
        self,
        prompt: str,
        system: Optional[str] = None,
        temperature: float = 0.1,
        max_tokens: int = 2000,
    ) -> str:
        """
        Structured prompt with system message

        Useful for JSON responses, classification, etc.
        """
        messages = []

        if system:
            messages.append({"role": "system", "content": system})

        messages.append({"role": "user", "content": prompt})

        return self.chat(messages, temperature=temperature, max_tokens=max_tokens)

    def get_info(self) -> dict:
        """Get current provider info"""
        return {
            "provider": self.provider,
            "model": self.model,
            "available": self._test_connectivity(),
        }

    def _test_connectivity(self) -> bool:
        """Test if provider is reachable"""
        try:
            if self.provider == "openai":
                return bool(self.openai.api_key)
            elif self.provider == "ollama":
                with self.httpx.Client(timeout=2) as client:
                    r = client.get(f"{self.ollama_host}/api/tags")
                    return r.status_code == 200
            elif self.provider == "anthropic":
                return bool(os.getenv("ANTHROPIC_API_KEY"))
            return False
        except Exception:
            return False


# Convenience function
def get_ai(provider: Optional[str] = None) -> AIAdapter:
    """Get AI adapter instance"""
    return AIAdapter(provider=provider)
