"""
Self-Correction Engine

Uses learned feedback to correct AI predictions in real-time.
"""

import os
import joblib
import numpy as np
from typing import Dict, Any, Tuple, Optional
from pathlib import Path


MODEL_DIR = Path("models")
CORRECTION_THRESHOLD = 0.85  # Only apply corrections with >85% confidence


def correct_prediction(
    action: str,
    features: Dict[str, Any],
    initial_result: str,
    ai_confidence: float
) -> Tuple[str, Optional[float]]:
    """
    Apply learned corrections to AI prediction
    
    Args:
        action: Type of action (e.g., "ocr_classify")
        features: Input features
        initial_result: AI's initial prediction
        ai_confidence: AI's confidence score
        
    Returns:
        (corrected_result, correction_confidence)
        If no correction needed, returns (initial_result, None)
    """
    model_path = MODEL_DIR / f"{action}_correction_v1.joblib"
    
    # Check if model exists
    if not model_path.exists():
        # No model yet - return initial result
        return initial_result, None
    
    try:
        # Load correction model
        model = joblib.load(model_path)
        
        # Featurize input
        X = _featurize(features)
        
        # Predict correction
        suggested = model.predict([X])[0]
        
        # Get confidence
        proba = model.predict_proba([X])
        correction_confidence = float(proba.max())
        
        # Only apply if different and high confidence
        if suggested != initial_result and correction_confidence > CORRECTION_THRESHOLD:
            return suggested, correction_confidence
        
        # No correction needed
        return initial_result, None
        
    except Exception as e:
        print(f"[SelfCorrect] Error applying correction: {e}")
        return initial_result, None


def apply_learned_corrections(
    action: str,
    predictions: list,
    features_list: list
) -> list:
    """
    Apply corrections to batch of predictions
    
    Args:
        action: Action type
        predictions: List of AI predictions
        features_list: List of feature dicts (same length as predictions)
        
    Returns:
        List of corrected predictions
    """
    corrected = []
    
    for pred, features in zip(predictions, features_list):
        corrected_pred, confidence = correct_prediction(
            action=action,
            features=features,
            initial_result=pred,
            ai_confidence=0.0  # Not used in batch mode
        )
        corrected.append(corrected_pred)
    
    return corrected


def _featurize(features: Dict[str, Any]) -> np.ndarray:
    """
    Convert feature dict to numpy array
    
    This is a simple bag-of-words style featurization.
    Customize per action type for better results.
    """
    # Example: simple numeric features
    feature_values = []
    
    # Common features
    if "text_length" in features:
        feature_values.append(features["text_length"])
    
    if "word_count" in features:
        feature_values.append(features["word_count"])
    
    if "numeric_count" in features:
        feature_values.append(features["numeric_count"])
    
    # Convert to numpy array
    if not feature_values:
        # Fallback: hash the entire feature dict
        feature_str = json.dumps(features, sort_keys=True)
        feature_hash = int(hashlib.sha256(feature_str.encode()).hexdigest()[:8], 16)
        feature_values = [feature_hash % 1000]  # Normalize to 0-1000
    
    return np.array(feature_values).reshape(1, -1)


def get_model_info(action: str) -> Optional[Dict[str, Any]]:
    """
    Get info about correction model
    
    Args:
        action: Action type
        
    Returns:
        Model metadata or None if model doesn't exist
    """
    model_path = MODEL_DIR / f"{action}_correction_v1.joblib"
    
    if not model_path.exists():
        return None
    
    try:
        model = joblib.load(model_path)
        
        # Get model stats
        stat = model_path.stat()
        
        return {
            "action": action,
            "model_type": type(model).__name__,
            "file_size_kb": stat.st_size / 1024,
            "last_modified": datetime.fromtimestamp(stat.st_mtime).isoformat(),
            "exists": True
        }
    except Exception as e:
        return {
            "action": action,
            "exists": False,
            "error": str(e)
        }


# Import statements at top
import json
import hashlib
from datetime import datetime

