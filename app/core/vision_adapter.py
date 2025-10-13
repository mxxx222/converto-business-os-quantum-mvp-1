"""
Vision Adapter - Provider-Agnostic OCR/Vision

Supports:
- OpenAI Vision (gpt-4o-mini with vision)
- Ollama (LLaVA, Llama 3.2 Vision, etc.)
- Tesseract OCR (local, fallback)

Switch providers with VISION_PROVIDER env var
"""

import os
import base64
import io
import re
from typing import Dict, Any, Optional, List
from datetime import datetime
from PIL import Image
import pytesseract


# Global provider selection
VISION_PROVIDER = os.getenv("VISION_PROVIDER", "openai").lower()


class VisionAdapter:
    """
    Universal vision/OCR adapter for receipt processing
    
    Usage:
        vision = VisionAdapter()  # Uses VISION_PROVIDER env
        result = vision.extract_structured(image)
        
        # Or specify provider
        vision = VisionAdapter(provider="ollama")
        result = vision.extract_structured(image)
    """
    
    def __init__(self, provider: Optional[str] = None):
        self.provider = (provider or VISION_PROVIDER).lower()
        
        # Validate provider
        if self.provider not in ["openai", "ollama", "tesseract"]:
            print(f"⚠️  Unknown vision provider: {self.provider}, falling back to tesseract")
            self.provider = "tesseract"
    
    @staticmethod
    def _image_to_base64(image: Image.Image) -> str:
        """Convert PIL Image to base64 string"""
        buf = io.BytesIO()
        image.save(buf, format="PNG")
        return base64.b64encode(buf.getvalue()).decode("utf-8")
    
    def extract_structured(self, image: Image.Image, fallback: bool = True) -> Dict[str, Any]:
        """
        Extract structured data from receipt image
        
        Args:
            image: PIL Image object
            fallback: If True, falls back to tesseract on error
            
        Returns:
            {
                "vendor": str | None,
                "date": str | None (YYYY-MM-DD),
                "total": float | None,
                "vat": float | None,
                "items": [{"name": str, "qty": float, "unit_price": float, "vat": float}],
                "raw_text": str,
                "provider": str
            }
        """
        # Try selected provider
        try:
            if self.provider == "openai":
                return self._extract_openai(image)
            elif self.provider == "ollama":
                return self._extract_ollama(image)
            elif self.provider == "tesseract":
                return self._extract_tesseract(image)
        except Exception as e:
            print(f"⚠️  {self.provider} extraction failed: {e}")
            
            if fallback and self.provider != "tesseract":
                print("🔄 Falling back to Tesseract OCR")
                try:
                    return self._extract_tesseract(image)
                except Exception as e2:
                    print(f"❌ Tesseract fallback also failed: {e2}")
        
        # Ultimate fallback
        return {
            "vendor": None,
            "date": None,
            "total": None,
            "vat": None,
            "items": [],
            "raw_text": "",
            "provider": "error",
            "error": str(e) if 'e' in locals() else "Unknown error"
        }
    
    def _extract_openai(self, image: Image.Image) -> Dict[str, Any]:
        """Extract using OpenAI Vision API"""
        try:
            import openai
            
            openai.api_key = os.getenv("OPENAI_API_KEY", "")
            if not openai.api_key:
                raise ValueError("OPENAI_API_KEY not set")
            
            model = os.getenv("OPENAI_VISION_MODEL", "gpt-4o-mini")
            b64_image = self._image_to_base64(image)
            
            prompt = """Extract receipt data as JSON with these exact keys:
- vendor: string (store name)
- date: string (YYYY-MM-DD format)
- total: number (total amount)
- vat: number (VAT/ALV amount, or null if not found)
- items: array of {name: string, qty: number, unit_price: number, vat: number}
- raw_text: string (all text from receipt)

Reply ONLY with valid JSON. No markdown, no explanations."""
            
            resp = openai.ChatCompletion.create(
                model=model,
                messages=[{
                    "role": "user",
                    "content": [
                        {"type": "text", "text": prompt},
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/png;base64,{b64_image}"
                            }
                        }
                    ]
                }],
                temperature=0,
                max_tokens=2000
            )
            
            content = resp["choices"][0]["message"]["content"]
            
            # Parse JSON response
            import json
            # Remove markdown code blocks if present
            content = content.strip()
            if content.startswith("```"):
                content = "\n".join(content.split("\n")[1:-1])
            
            data = json.loads(content)
            data["provider"] = "openai"
            
            return data
            
        except Exception as e:
            raise RuntimeError(f"OpenAI Vision error: {e}")
    
    def _extract_ollama(self, image: Image.Image) -> Dict[str, Any]:
        """Extract using Ollama local vision model"""
        try:
            import httpx
            import json
            
            host = os.getenv("OLLAMA_HOST", "http://127.0.0.1:11434")
            model = os.getenv("OLLAMA_VISION_MODEL", "llava:latest")
            
            b64_image = self._image_to_base64(image)
            
            system_msg = """You are a strict JSON extractor. Return ONLY valid JSON with these exact keys:
vendor (string), date (YYYY-MM-DD), total (number), vat (number or null), 
items (array of {name, qty, unit_price, vat}), raw_text (string).
No prose, no markdown, just pure JSON."""
            
            user_msg = "Extract all receipt fields from this image. Use null for missing values."
            
            payload = {
                "model": model,
                "messages": [
                    {"role": "system", "content": system_msg},
                    {
                        "role": "user",
                        "content": user_msg,
                        "images": [b64_image]
                    }
                ],
                "stream": False,
                "options": {
                    "temperature": 0,
                    "num_predict": 2000
                }
            }
            
            with httpx.Client(timeout=120) as client:
                r = client.post(f"{host}/api/chat", json=payload)
                r.raise_for_status()
                
                response = r.json()
                content = response.get("message", {}).get("content", "{}")
                
                # Clean up response
                content = content.strip()
                if content.startswith("```"):
                    content = "\n".join(content.split("\n")[1:-1])
                
                data = json.loads(content)
                data["provider"] = "ollama"
                
                return data
                
        except Exception as e:
            raise RuntimeError(f"Ollama Vision error: {e}")
    
    def _extract_tesseract(self, image: Image.Image) -> Dict[str, Any]:
        """Extract using Tesseract OCR with heuristics"""
        try:
            # OCR with Finnish + English
            lang = os.getenv("TESSERACT_LANG", "eng+fin")
            raw_text = pytesseract.image_to_string(image, lang=lang)
            
            # Heuristic extraction
            data = {
                "vendor": self._extract_vendor(raw_text),
                "date": self._extract_date(raw_text),
                "total": self._extract_total(raw_text),
                "vat": self._extract_vat(raw_text),
                "items": self._extract_items(raw_text),
                "raw_text": raw_text,
                "provider": "tesseract"
            }
            
            return data
            
        except Exception as e:
            raise RuntimeError(f"Tesseract OCR error: {e}")
    
    # Heuristic helpers for Tesseract
    
    def _extract_vendor(self, text: str) -> Optional[str]:
        """Try to extract vendor name from first lines"""
        lines = [l.strip() for l in text.split("\n") if l.strip()]
        
        # Common Finnish stores
        known_vendors = [
            "k-market", "k-supermarket", "k-citymarket",
            "s-market", "prisma", "alepa",
            "lidl", "tokmanni", "shell", "neste",
            "r-kioski", "sale"
        ]
        
        # Check first 3 lines
        for line in lines[:3]:
            line_lower = line.lower()
            for vendor in known_vendors:
                if vendor in line_lower:
                    return line
        
        # Default to first non-empty line
        return lines[0] if lines else None
    
    def _extract_date(self, text: str) -> Optional[str]:
        """Extract date in various formats"""
        # Match DD.MM.YYYY, DD/MM/YYYY, DD-MM-YYYY
        patterns = [
            r"(\d{1,2})[.\-/](\d{1,2})[.\-/](\d{4})",
            r"(\d{1,2})[.\-/](\d{1,2})[.\-/](\d{2})"
        ]
        
        for pattern in patterns:
            match = re.search(pattern, text)
            if match:
                day, month, year = match.groups()
                
                # Pad day/month
                day = day.zfill(2)
                month = month.zfill(2)
                
                # Handle 2-digit year
                if len(year) == 2:
                    year = "20" + year
                
                # Validate
                try:
                    datetime.strptime(f"{year}-{month}-{day}", "%Y-%m-%d")
                    return f"{year}-{month}-{day}"
                except ValueError:
                    continue
        
        return None
    
    def _extract_total(self, text: str) -> Optional[float]:
        """Extract total amount"""
        # Look for "yhteensä", "summa", "total" followed by amount
        patterns = [
            r"(?:yhteensä|summa|total|maksettava)[^\d]*(\d+[,\.]\d{2})",
            r"(?:eur|€)[^\d]*(\d+[,\.]\d{2})",
        ]
        
        for pattern in patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                amount_str = match.group(1).replace(",", ".")
                try:
                    return float(amount_str)
                except ValueError:
                    continue
        
        # Fallback: find largest amount
        amounts = re.findall(r"(\d+[,\.]\d{2})", text)
        if amounts:
            amounts_float = [float(a.replace(",", ".")) for a in amounts]
            return max(amounts_float)
        
        return None
    
    def _extract_vat(self, text: str) -> Optional[float]:
        """Extract VAT amount"""
        # Look for "ALV", "VAT", "vero"
        patterns = [
            r"(?:alv|vat|vero)[^\d]*(\d+[,\.]\d{2})",
            r"(\d+[,\.]\d{2}).*(?:alv|vat)",
        ]
        
        for pattern in patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                amount_str = match.group(1).replace(",", ".")
                try:
                    return float(amount_str)
                except ValueError:
                    continue
        
        return None
    
    def _extract_items(self, text: str) -> List[Dict[str, Any]]:
        """Try to extract line items (basic heuristic)"""
        items = []
        
        # Look for lines with pattern: text + number
        lines = text.split("\n")
        
        for line in lines:
            # Skip empty lines
            if not line.strip():
                continue
            
            # Look for amount at end of line
            match = re.search(r"^(.+?)\s+(\d+[,\.]\d{2})\s*$", line.strip())
            if match:
                name = match.group(1).strip()
                price_str = match.group(2).replace(",", ".")
                
                # Skip if name is too short or looks like a label
                if len(name) < 3 or name.lower() in ["yhteensä", "total", "summa", "alv", "vat"]:
                    continue
                
                try:
                    items.append({
                        "name": name,
                        "qty": 1.0,  # Tesseract can't reliably extract qty
                        "unit_price": float(price_str),
                        "vat": None
                    })
                except ValueError:
                    continue
        
        return items[:10]  # Limit to 10 items
    
    def get_info(self) -> dict:
        """Get current provider info"""
        return {
            "provider": self.provider,
            "available": self._test_connectivity()
        }
    
    def _test_connectivity(self) -> bool:
        """Test if provider is available"""
        try:
            if self.provider == "openai":
                return bool(os.getenv("OPENAI_API_KEY"))
            elif self.provider == "ollama":
                import httpx
                host = os.getenv("OLLAMA_HOST", "http://127.0.0.1:11434")
                with httpx.Client(timeout=2) as client:
                    r = client.get(f"{host}/api/tags")
                    return r.status_code == 200
            elif self.provider == "tesseract":
                # Test tesseract installation
                pytesseract.get_tesseract_version()
                return True
            return False
        except Exception:
            return False


# Convenience function
def get_vision(provider: Optional[str] = None) -> VisionAdapter:
    """Get vision adapter instance"""
    return VisionAdapter(provider=provider)

