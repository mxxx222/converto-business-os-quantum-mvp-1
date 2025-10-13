"""
Vision API
OCR and vision processing endpoints
"""

from fastapi import APIRouter, UploadFile, File, HTTPException, Query
from PIL import Image
from app.core.vision_adapter import VisionAdapter, VISION_PROVIDER
import os
import io


router = APIRouter(prefix="/api/v1/vision", tags=["vision"])


@router.get("/whoami")
def whoami():
    """
    Get current vision provider configuration
    """
    return {
        "default_provider": VISION_PROVIDER,
        "providers": {
            "openai": {
                "configured": bool(os.getenv("OPENAI_API_KEY")),
                "model": os.getenv("OPENAI_VISION_MODEL", "gpt-4o-mini"),
            },
            "ollama": {
                "configured": True,
                "host": os.getenv("OLLAMA_HOST", "http://127.0.0.1:11434"),
                "model": os.getenv("OLLAMA_VISION_MODEL", "llava:latest"),
            },
            "tesseract": {
                "configured": True,
                "lang": os.getenv("TESSERACT_LANG", "eng+fin"),
            }
        }
    }


@router.get("/test/{provider}")
def test_provider(provider: str):
    """
    Test if vision provider is available
    
    Args:
        provider: openai, ollama, or tesseract
    """
    try:
        vision = VisionAdapter(provider=provider)
        info = vision.get_info()
        
        return {
            "status": "ok" if info["available"] else "unavailable",
            "provider": provider,
            "info": info
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Provider test failed: {str(e)}")


@router.post("/extract")
async def extract_receipt(
    file: UploadFile = File(...),
    provider: str = Query(None, description="Override default provider")
):
    """
    Extract structured data from receipt image
    
    Body: multipart/form-data with image file
    
    Query params:
    - provider: Optional provider override (openai, ollama, tesseract)
    
    Returns structured receipt data:
    ```json
    {
      "ok": true,
      "data": {
        "vendor": "K-Market",
        "date": "2025-10-13",
        "total": 24.50,
        "vat": 3.20,
        "items": [
          {"name": "Maito", "qty": 1, "unit_price": 1.29, "vat": 0.18}
        ],
        "raw_text": "...",
        "provider": "openai"
      }
    }
    ```
    """
    try:
        # Validate file type
        if not file.content_type or not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Read image
        content = await file.read()
        image = Image.open(io.BytesIO(content))
        
        # Convert to RGB (remove alpha channel if present)
        if image.mode != "RGB":
            image = image.convert("RGB")
        
        # Extract
        vision = VisionAdapter(provider=provider)
        data = vision.extract_structured(image, fallback=True)
        
        return {
            "ok": True,
            "data": data
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Vision extraction failed: {str(e)}")


@router.post("/raw-ocr")
async def raw_ocr(
    file: UploadFile = File(...),
    lang: str = Query("eng+fin", description="Tesseract language codes")
):
    """
    Raw OCR text extraction (Tesseract only)
    
    Returns plain text without structured extraction
    """
    try:
        import pytesseract
        
        # Read image
        content = await file.read()
        image = Image.open(io.BytesIO(content))
        
        # Convert to RGB
        if image.mode != "RGB":
            image = image.convert("RGB")
        
        # OCR
        text = pytesseract.image_to_string(image, lang=lang)
        
        return {
            "ok": True,
            "text": text,
            "provider": "tesseract"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OCR failed: {str(e)}")


@router.get("/models/list")
def list_models():
    """
    List available vision models
    """
    return {
        "openai": {
            "recommended": "gpt-4o-mini",
            "models": {
                "gpt-4o": "Best vision (expensive)",
                "gpt-4o-mini": "Fast vision (recommended)",
            }
        },
        "ollama": {
            "recommended": "llava:latest",
            "models": {
                "llava:latest": "7B vision model (LLaVA)",
                "llava:13b": "13B vision model (better quality)",
                "llama3.2-vision": "Llama 3.2 with vision (latest)",
                "bakllava": "Mistral-based vision model"
            },
            "install": "ollama pull <model>"
        },
        "tesseract": {
            "recommended": "eng+fin",
            "languages": {
                "eng": "English",
                "fin": "Finnish (suomi)",
                "swe": "Swedish (svenska)",
                "eng+fin": "English + Finnish (recommended)"
            },
            "install": "brew install tesseract (macOS) or apt-get install tesseract-ocr (Linux)"
        }
    }

