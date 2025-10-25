"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { ThumbsUp, ThumbsDown } from "lucide-react";

interface FeedbackButtonsProps {
  action: string;
  featureVector: Record<string, any>;
  aiResult: string;
  aiConfidence: number;
  onFeedback?: (correct: boolean) => void;
}

export function FeedbackButtons({
  action,
  featureVector,
  aiResult,
  aiConfidence,
  onFeedback
}: FeedbackButtonsProps) {
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFeedback = async (correct: boolean) => {
    setLoading(true);
    setFeedback(correct ? "up" : "down");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE || ""}/api/v1/ml/feedback`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action,
            feature_vector: featureVector,
            ai_result: aiResult,
            ai_confidence: aiConfidence,
            corrected_result: aiResult, // Would come from edit form in real app
            is_correct: correct
          })
        }
      );

      const data = await response.json();

      if (data.status === "ok") {
        onFeedback?.(correct);

        // Show subtle success indicator
        if (!correct) {
          // AI was wrong - will retrain
          console.log("✅ Feedback recorded - AI will learn from this!");
        }
      }
    } catch (e) {
      console.error("Feedback failed:", e);
    } finally {
      setLoading(false);
    }
  };

  if (feedback) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-2 text-sm text-gray-600"
      >
        <span>{feedback === "up" ? "✓" : "✗"}</span>
        <span>Kiitos palautteesta!</span>
      </motion.div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-500 mr-2">Oikea tulos?</span>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => handleFeedback(true)}
        disabled={loading}
        className="p-2 rounded-lg hover:bg-green-50 text-green-600 transition-colors disabled:opacity-50"
        title="Kyllä, oikein"
      >
        <ThumbsUp className="w-4 h-4" />
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => handleFeedback(false)}
        disabled={loading}
        className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors disabled:opacity-50"
        title="Ei, korjaa"
      >
        <ThumbsDown className="w-4 h-4" />
      </motion.button>
    </div>
  );
}

interface FeedbackInlineProps {
  action: string;
  result: string;
  confidence: number;
  features: Record<string, any>;
}

export function FeedbackInline({
  action,
  result,
  confidence,
  features
}: FeedbackInlineProps) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex items-center gap-3">
        <div className="text-sm">
          <span className="font-medium text-gray-900">{result}</span>
          <span className="text-gray-500 ml-2">({Math.round(confidence * 100)}%)</span>
        </div>
      </div>

      <FeedbackButtons
        action={action}
        featureVector={features}
        aiResult={result}
        aiConfidence={confidence}
      />
    </div>
  );
}
