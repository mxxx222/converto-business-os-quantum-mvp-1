"""
Machine Learning Module
Self-learning and self-correcting AI system
"""

from .feedback_loop import record_feedback, get_feedback_stats
from .self_correct import correct_prediction, apply_learned_corrections
from .retrain import retrain_model, schedule_retraining

__all__ = [
    "record_feedback",
    "get_feedback_stats",
    "correct_prediction",
    "apply_learned_corrections",
    "retrain_model",
    "schedule_retraining"
]

