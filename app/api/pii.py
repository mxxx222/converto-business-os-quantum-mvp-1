from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.tokenization import Tokenizer

router = APIRouter(prefix="/api/v1/pii", tags=["pii"])
tokenizer = Tokenizer()


class TokenizeRequest(BaseModel):
    value: str


@router.post("/tokenize")
def tokenize(req: TokenizeRequest):
    return tokenizer.tokenize(req.value)


class DetokenizeRequest(BaseModel):
    token: str


@router.post("/detokenize")
def detokenize(req: DetokenizeRequest):
    try:
        value = tokenizer.detokenize(req.token)
        return {"value": value}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


