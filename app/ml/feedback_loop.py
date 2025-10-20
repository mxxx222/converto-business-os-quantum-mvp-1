"""
Feedback Loop - Collect User Corrections

Records all user feedback to build training data for ML models.
"""

import json
from datetime import datetime
from typing import Dict, Any, Optional
from sqlalchemy import Column, Integer, String, JSON, DateTime, Boolean, Float
from sqlalchemy.orm import Session
from shared_core.utils.db import Base, engine


class FeedbackSample(Base):
    """
    Training samples from user corrections

    Example:
    - User corrects OCR result → record
    - User confirms VAT rate → record
    - User fixes classification → record
    """

    __tablename__ = "feedback_samples"

    id = Column(Integer, primary_key=True, index=True)

    # What was being done
    action = Column(String, index=True)  # e.g., "ocr_classify", "vat_calculate"
    feature_vector = Column(JSON)  # Input features as dict

    # What the AI predicted
    ai_result = Column(String)  # AI's prediction
    ai_confidence = Column(Float)  # AI's confidence (0-1)

    # What the user corrected to
    corrected_result = Column(String)  # User's correction
    is_correct = Column(Boolean)  # True if AI was right

    # Metadata
    user_id = Column(String, index=True, nullable=True)
    tenant_id = Column(String, index=True, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)

    # Context
    context = Column(JSON, nullable=True)  # Additional context


# Create table
Base.metadata.create_all(bind=engine)


def record_feedback(
    db: Session,
    action: str,
    feature_vector: Dict[str, Any],
    ai_result: str,
    ai_confidence: float,
    corrected_result: str,
    is_correct: bool,
    user_id: Optional[str] = None,
    tenant_id: Optional[str] = None,
    context: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    """
    Record user feedback on AI prediction

    Args:
        db: Database session
        action: Type of action (e.g., "ocr_classify")
        feature_vector: Input features as dict
        ai_result: What AI predicted
        ai_confidence: AI's confidence score
        corrected_result: What user corrected to
        is_correct: True if AI was right
        user_id: Optional user ID
        tenant_id: Optional tenant ID
        context: Optional additional context

    Returns:
        Status dict
    """
    sample = FeedbackSample(
        action=action,
        feature_vector=feature_vector,
        ai_result=ai_result,
        ai_confidence=ai_confidence,
        corrected_result=corrected_result,
        is_correct=is_correct,
        user_id=user_id,
        tenant_id=tenant_id,
        context=context or {},
    )

    db.add(sample)
    db.commit()
    db.refresh(sample)

    return {
        "status": "ok",
        "sample_id": sample.id,
        "correct": is_correct,
        "will_retrain": not is_correct,  # Retrain if incorrect
    }


def get_feedback_stats(db: Session, action: Optional[str] = None) -> Dict[str, Any]:
    """
    Get feedback statistics

    Args:
        db: Database session
        action: Optional filter by action type

    Returns:
        Statistics dict
    """
    query = db.query(FeedbackSample)

    if action:
        query = query.filter(FeedbackSample.action == action)

    samples = query.all()

    if not samples:
        return {"total_samples": 0, "correct": 0, "incorrect": 0, "accuracy": 0.0}

    correct = sum(1 for s in samples if s.is_correct)
    incorrect = len(samples) - correct

    return {
        "total_samples": len(samples),
        "correct": correct,
        "incorrect": incorrect,
        "accuracy": correct / len(samples) if samples else 0.0,
        "by_action": _get_action_breakdown(samples),
    }


def _get_action_breakdown(samples: list) -> Dict[str, Dict[str, Any]]:
    """Group stats by action type"""
    breakdown = {}

    for sample in samples:
        action = sample.action
        if action not in breakdown:
            breakdown[action] = {"total": 0, "correct": 0, "incorrect": 0}

        breakdown[action]["total"] += 1
        if sample.is_correct:
            breakdown[action]["correct"] += 1
        else:
            breakdown[action]["incorrect"] += 1

    # Calculate accuracy
    for action, stats in breakdown.items():
        stats["accuracy"] = stats["correct"] / stats["total"] if stats["total"] > 0 else 0.0

    return breakdown


def get_recent_corrections(db: Session, action: Optional[str] = None, limit: int = 100) -> list:
    """
    Get recent user corrections for retraining

    Args:
        db: Database session
        action: Optional filter by action
        limit: Max samples to return

    Returns:
        List of samples (most recent first)
    """
    query = db.query(FeedbackSample)

    if action:
        query = query.filter(FeedbackSample.action == action)

    # Only incorrect predictions (need to learn from mistakes)
    query = query.filter(FeedbackSample.is_correct == False)

    # Most recent first
    query = query.order_by(FeedbackSample.created_at.desc())

    return query.limit(limit).all()
