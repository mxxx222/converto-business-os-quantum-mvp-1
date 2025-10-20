"""
OCR Microservice - Handles document scanning and text extraction
"""

from fastapi import FastAPI, UploadFile, File, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, Dict, Any
import pytesseract
import cv2
import numpy as np
from PIL import Image
import io
import os
import logging

app = FastAPI(title="OCR Service", version="1.0.0")

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class OCRRequest(BaseModel):
    file_data: bytes
    language: str = "fin+eng"
    preprocessing: bool = True


class OCRResponse(BaseModel):
    text: str
    confidence: float
    language: str
    processing_time_ms: int
    metadata: Dict[str, Any]


class OCRExtractionRequest(BaseModel):
    text: str
    extraction_type: str = "specs"  # specs, contact, invoice


class OCRExtractionResponse(BaseModel):
    extracted_data: Dict[str, Any]
    confidence: float
    extraction_type: str


@app.post("/ocr/extract", response_model=OCRResponse)
async def extract_text(request: OCRRequest):
    """Extract text from image data"""
    
    import time
    start_time = time.time()
    
    try:
        # Load image
        img = Image.open(io.BytesIO(request.file_data)).convert("RGB")
        img_array = cv2.cvtColor(np.array(img), cv2.COLOR_RGB2BGR)
        
        # Preprocess if requested
        if request.preprocessing:
            img_array = preprocess_image(img_array)
        
        # OCR extraction
        config = "--oem 1 --psm 6"
        text = pytesseract.image_to_string(img_array, lang=request.language, config=config)
        
        # Get confidence
        data = pytesseract.image_to_data(img_array, lang=request.language, output_type=pytesseract.Output.DICT)
        confidences = [int(conf) for conf in data['conf'] if int(conf) > 0]
        avg_confidence = sum(confidences) / len(confidences) if confidences else 0
        
        processing_time_ms = int((time.time() - start_time) * 1000)
        
        return OCRResponse(
            text=text.strip(),
            confidence=avg_confidence / 100.0,
            language=request.language,
            processing_time_ms=processing_time_ms,
            metadata={
                "image_size": img.size,
                "preprocessing_applied": request.preprocessing
            }
        )
        
    except Exception as e:
        logger.error(f"OCR extraction failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"OCR error: {str(e)}")


@app.post("/ocr/upload", response_model=OCRResponse)
async def upload_and_extract(file: UploadFile = File(...), language: str = "fin+eng"):
    """Upload file and extract text"""
    
    # Validate file type
    if not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    file_data = await file.read()
    
    request = OCRRequest(
        file_data=file_data,
        language=language,
        preprocessing=True
    )
    
    return await extract_text(request)


@app.post("/ocr/extract-data", response_model=OCRExtractionResponse)
async def extract_structured_data(request: OCRExtractionRequest):
    """Extract structured data from OCR text"""
    
    try:
        if request.extraction_type == "specs":
            extracted_data = extract_device_specs(request.text)
        elif request.extraction_type == "contact":
            extracted_data = extract_contact_info(request.text)
        elif request.extraction_type == "invoice":
            extracted_data = extract_invoice_data(request.text)
        else:
            raise HTTPException(status_code=400, detail="Unsupported extraction type")
        
        return OCRExtractionResponse(
            extracted_data=extracted_data,
            confidence=0.85,  # Mock confidence
            extraction_type=request.extraction_type
        )
        
    except Exception as e:
        logger.error(f"Data extraction failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Extraction error: {str(e)}")


@app.get("/ocr/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "ocr-service"}


def preprocess_image(img: np.ndarray) -> np.ndarray:
    """Preprocess image for better OCR results"""
    # Convert to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # Denoise
    gray = cv2.fastNlMeansDenoising(gray, None, 7, 7, 21)
    
    # Adaptive threshold
    thresh = cv2.adaptiveThreshold(
        gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 35, 11
    )
    
    return thresh


def extract_device_specs(text: str) -> Dict[str, Any]:
    """Extract device specifications from text"""
    import re
    
    specs = {}
    
    # Power (W, kW, VA)
    power_match = re.search(r'(\d+(?:[.,]\d+)?)\s*(W|kW|VA|w|kw|va)', text, re.IGNORECASE)
    if power_match:
        value, unit = power_match.groups()
        specs['power'] = {
            'value': float(value.replace(',', '.')),
            'unit': unit.upper()
        }
    
    # Voltage (V)
    voltage_match = re.search(r'(\d+(?:[.,]\d+)?)\s*V\b', text, re.IGNORECASE)
    if voltage_match:
        specs['voltage'] = float(voltage_match.group(1).replace(',', '.'))
    
    # Current (A)
    current_match = re.search(r'(\d+(?:[.,]\d+)?)\s*A\b', text, re.IGNORECASE)
    if current_match:
        specs['current'] = float(current_match.group(1).replace(',', '.'))
    
    return specs


def extract_contact_info(text: str) -> Dict[str, Any]:
    """Extract contact information from text"""
    import re
    
    contact = {}
    
    # Email
    email_match = re.search(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', text)
    if email_match:
        contact['email'] = email_match.group()
    
    # Phone
    phone_match = re.search(r'(\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}', text)
    if phone_match:
        contact['phone'] = phone_match.group()
    
    return contact


def extract_invoice_data(text: str) -> Dict[str, Any]:
    """Extract invoice data from text"""
    import re
    
    invoice = {}
    
    # Total amount
    amount_match = re.search(r'(\d+(?:[.,]\d{2})?)\s*(€|EUR|euro)', text, re.IGNORECASE)
    if amount_match:
        invoice['total_amount'] = float(amount_match.group(1).replace(',', '.'))
    
    # VAT amount
    vat_match = re.search(r'ALV[:\s]*(\d+(?:[.,]\d{2})?)', text, re.IGNORECASE)
    if vat_match:
        invoice['vat_amount'] = float(vat_match.group(1).replace(',', '.'))
    
    # Date
    date_match = re.search(r'(\d{1,2}[./]\d{1,2}[./]\d{2,4})', text)
    if date_match:
        invoice['date'] = date_match.group(1)
    
    return invoice


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)
