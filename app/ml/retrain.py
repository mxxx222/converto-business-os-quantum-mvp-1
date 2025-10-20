"""
Model Retraining

Retrain correction models based on user feedback.
Run nightly via cron or manually.
"""

import os
import joblib
import numpy as np
from datetime import datetime
from pathlib import Path
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from shared_core.utils.db import engine
from app.ml.feedback_loop import FeedbackSample, get_recent_corrections


MODEL_DIR = Path("models")
MIN_SAMPLES = 10  # Minimum samples required to train


def retrain_model(action: str, db: Session) -> Dict[str, Any]:
    """
    Retrain correction model for specific action

    Args:
        action: Action type (e.g., "ocr_classify")
        db: Database session

    Returns:
        Training report
    """
    # Get training samples
    samples = db.query(FeedbackSample).filter(FeedbackSample.action == action).all()

    if len(samples) < MIN_SAMPLES:
        return {
            "status": "skipped",
            "reason": f"Not enough samples ({len(samples)} < {MIN_SAMPLES})",
            "samples_needed": MIN_SAMPLES - len(samples),
        }

    # Prepare training data
    X = []
    y = []

    for sample in samples:
        # Featurize
        features = _featurize(sample.feature_vector)
        X.append(features)

        # Label (use corrected_result if user corrected, else ai_result)
        label = sample.corrected_result if not sample.is_correct else sample.ai_result
        y.append(label)

    X = np.array(X)
    y = np.array(y)

    # Train model
    from sklearn.naive_bayes import MultinomialNB
    from sklearn.preprocessing import LabelEncoder

    # Encode labels (text → numbers)
    encoder = LabelEncoder()
    y_encoded = encoder.fit_transform(y)

    # Train
    model = MultinomialNB()
    model.fit(X, y_encoded)

    # Calculate accuracy on training set
    y_pred = model.predict(X)
    accuracy = (y_pred == y_encoded).mean()

    # Save model + encoder
    MODEL_DIR.mkdir(parents=True, exist_ok=True)
    model_path = MODEL_DIR / f"{action}_correction_v1.joblib"
    encoder_path = MODEL_DIR / f"{action}_encoder_v1.joblib"

    joblib.dump(model, model_path)
    joblib.dump(encoder, encoder_path)

    return {
        "status": "success",
        "action": action,
        "samples_trained": len(samples),
        "accuracy": float(accuracy),
        "model_path": str(model_path),
        "trained_at": datetime.now().isoformat(),
    }


def retrain_all_models(db: Session) -> Dict[str, Any]:
    """
    Retrain all correction models

    Args:
        db: Database session

    Returns:
        Report for all models
    """
    # Get all unique actions
    actions = db.query(FeedbackSample.action).distinct().all()
    actions = [a[0] for a in actions]

    results = {}

    for action in actions:
        try:
            result = retrain_model(action, db)
            results[action] = result
        except Exception as e:
            results[action] = {"status": "error", "error": str(e)}

    return {"status": "complete", "models": results, "timestamp": datetime.now().isoformat()}


def schedule_retraining(interval_hours: int = 24):
    """
    Schedule automatic retraining

    Args:
        interval_hours: Hours between retraining (default: 24)
    """
    from apscheduler.schedulers.background import BackgroundScheduler
    from sqlalchemy.orm import sessionmaker

    Session = sessionmaker(bind=engine)

    def retrain_job():
        """Background job to retrain models"""
        db = Session()
        try:
            print(f"[ML Retrain] Starting retraining at {datetime.now()}")
            result = retrain_all_models(db)
            print(f"[ML Retrain] Complete: {result}")

            # Log to PostHog (optional)
            try:
                from app.integrations.posthog_client import capture_event

                capture_event("ml_retrain_complete", result)
            except Exception:
                pass

        except Exception as e:
            print(f"[ML Retrain] Error: {e}")
        finally:
            db.close()

    scheduler = BackgroundScheduler()
    scheduler.add_job(retrain_job, trigger="interval", hours=interval_hours, id="ml_retrain")
    scheduler.start()

    print(f"[ML Retrain] Scheduled every {interval_hours} hours")

    return scheduler


def _featurize(feature_vector: Dict[str, Any]) -> np.ndarray:
    """
    Convert feature dict to numpy array

    Customize this per action type for better results.
    """
    features = []

    # Text features
    if "text" in feature_vector:
        text = str(feature_vector["text"])
        features.extend(
            [
                len(text),  # Text length
                text.count(" "),  # Word count
                sum(c.isdigit() for c in text),  # Numeric chars
                sum(c.isupper() for c in text),  # Uppercase chars
            ]
        )

    # Numeric features
    for key in ["amount", "total", "vat", "confidence"]:
        if key in feature_vector:
            features.append(float(feature_vector[key]))

    # Boolean features (convert to 0/1)
    for key in ["has_date", "has_vendor", "has_items"]:
        if key in feature_vector:
            features.append(1 if feature_vector[key] else 0)

    # If no features extracted, use a hash
    if not features:
        import hashlib

        feature_str = json.dumps(feature_vector, sort_keys=True)
        feature_hash = int(hashlib.sha256(feature_str.encode()).hexdigest()[:8], 16)
        features = [feature_hash % 1000]

    return np.array(features)


# CLI for manual retraining
if __name__ == "__main__":
    from sqlalchemy.orm import sessionmaker

    Session = sessionmaker(bind=engine)
    db = Session()

    print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    print("🧠 ML MODEL RETRAINING")
    print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    print("")

    result = retrain_all_models(db)

    print(f"Status: {result['status']}")
    print(f"Timestamp: {result['timestamp']}")
    print("")

    for action, model_result in result["models"].items():
        print(f"Action: {action}")
        print(f"  Status: {model_result['status']}")

        if model_result["status"] == "success":
            print(f"  Samples: {model_result['samples_trained']}")
            print(f"  Accuracy: {model_result['accuracy']:.1%}")
        elif model_result["status"] == "skipped":
            print(f"  Reason: {model_result['reason']}")
        else:
            print(f"  Error: {model_result.get('error', 'Unknown')}")

        print("")

    print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    print("✅ RETRAINING COMPLETE")
    print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")

    db.close()


import json
