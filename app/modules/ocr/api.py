from fastapi import APIRouter, UploadFile, File

router = APIRouter(prefix="/api/v1/ocr", tags=["ocr"])


@router.post("/scan")
async def scan(file: UploadFile = File(...)):
    # Placeholder: simply echoes filename and fake text
    return {
        "filename": file.filename,
        "text": "[stub] OCR result text",
        "confidence": 0.93,
    }
