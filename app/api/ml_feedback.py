"""
ML Feedback API
Collect user feedback and trigger retraining
"""

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, Optional
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.ml.feedback_loop import record_feedback, get_feedback_stats
from app.ml.retrain import retrain_model, retrain_all_models


router = APIRouter(prefix="/api/v1/ml", tags=["ml-feedback"])


class FeedbackIn(BaseModel):
    action: str  # e.g., "ocr_classify"
    feature_vector: Dict[str, Any]  # Input features
    ai_result: str  # AI prediction
    ai_confidence: float  # AI confidence (0-1)
    corrected_result: str  # User's correction
    is_correct: bool  # True if AI was right
    user_id: Optional[str] = None
    tenant_id: Optional[str] = None
    context: Optional[Dict[str, Any]] = None


@router.post("/feedback")
def submit_feedback(feedback: FeedbackIn, db: Session = Depends(get_db)):
    """
    Submit user feedback on AI prediction

    Body:
    ```json
    {
      "action": "ocr_classify",
      "feature_vector": {"text": "K-Market 24.50€"},
      "ai_result": "groceries",
      "ai_confidence": 0.92,
      "corrected_result": "groceries",
      "is_correct": true
    }
    ```
    """
    result = record_feedback(
        db=db,
        action=feedback.action,
        feature_vector=feedback.feature_vector,
        ai_result=feedback.ai_result,
        ai_confidence=feedback.ai_confidence,
        corrected_result=feedback.corrected_result,
        is_correct=feedback.is_correct,
        user_id=feedback.user_id,
        tenant_id=feedback.tenant_id,
        context=feedback.context,
    )

    return result


@router.get("/stats")
def get_stats(action: Optional[str] = None, db: Session = Depends(get_db)):
    """
    Get feedback statistics

    Query params:
    - action: Optional filter by action type

    Returns overall accuracy and breakdown by action
    """
    return get_feedback_stats(db, action=action)


@router.post("/retrain/{action}")
def trigger_retrain(action: str, db: Session = Depends(get_db)):
    """
    Manually trigger retraining for specific action

    Args:
        action: Action type to retrain
    """
    try:
        result = retrain_model(action, db)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Retraining failed: {str(e)}")


@router.post("/retrain-all")
def trigger_retrain_all(db: Session = Depends(get_db)):
    """
    Manually trigger retraining for ALL models

    Use this after significant feedback has been collected
    """
    try:
        result = retrain_all_models(db)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Retraining failed: {str(e)}")


@router.get("/models")
def list_models():
    """
    List all trained correction models

    Returns info about each model (size, last updated, etc.)
    """
    from app.ml.self_correct import MODEL_DIR, get_model_info

    if not MODEL_DIR.exists():
        return {"models": [], "count": 0}

    model_files = list(MODEL_DIR.glob("*_correction_v1.joblib"))

    models = []
    for model_file in model_files:
        action = model_file.stem.replace("_correction_v1", "")
        info = get_model_info(action)
        if info:
            models.append(info)

    return {"models": models, "count": len(models)}
