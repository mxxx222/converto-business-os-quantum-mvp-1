/**
 * Next Best Action Widget
 * Smart suggestions for user's next task (domino effect)
 */

"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface ActionTip {
  id: string;
  title: string;
  kbd?: string;
  action: () => void;
  reason: string;
  priority: number;
}

export default function NextBestAction() {
  const [tip, setTip] = useState<ActionTip | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSuggestion() {
      try {
        // Fetch impact summary to determine next action
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE || ""}/api/v1/impact/summary`);
        const summary = await response.json();

        // Smart action suggestions based on usage patterns
        const candidates: ActionTip[] = [
          {
            id: "ocr",
            title: "Skannaa uusin kuitti",
            kbd: "⇧O",
            reason: "Puuttuvia kuitteja tällä viikolla",
            action: () => (window.location.href = "/selko/ocr"),
            priority: 10
          },
          {
            id: "vat",
            title: "Tarkista ALV-yhteenveto",
            kbd: "⇧V",
            reason: "ALV-kauden loppu lähestyy",
            action: () => (window.location.href = "/vat"),
            priority: 8
          },
          {
            id: "report",
            title: "Lataa viikkoraportti",
            kbd: "⇧R",
            reason: "Raporttia ei lähetetty 7 päivään",
            action: () => (window.location.href = "/reports"),
            priority: 6
          },
          {
            id: "billing",
            title: "Tarkista laskutustilanne",
            kbd: "⇧B",
            reason: "Uusia laskuja käsiteltävänä",
            action: () => (window.location.href = "/billing"),
            priority: 7
          }
        ];

        // Select highest priority action (in production: use ML/heuristics)
        const selected = candidates.sort((a, b) => b.priority - a.priority)[0];
        setTip(selected);
      } catch (error) {
        console.error("Failed to fetch action suggestion:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSuggestion();
  }, []);

  if (loading) {
    return (
      <div className="glass rounded-2xl p-4 animate-pulse">
        <div className="h-16 bg-white/10 rounded"></div>
      </div>
    );
  }

  if (!tip) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-5 flex items-center justify-between"
    >
      <div className="flex-1">
        <div className="text-sm text-white/70 mb-1">💡 Seuraava askel</div>
        <div className="text-white text-lg font-semibold mb-1">{tip.title}</div>
        <div className="text-white/60 text-sm">{tip.reason}</div>
      </div>

      <button
        onClick={tip.action}
        className="ml-4 px-5 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-medium transition-all flex items-center gap-2"
      >
        Suorita
        {tip.kbd && (
          <kbd className="px-2 py-1 text-xs bg-black/30 rounded font-mono">
            {tip.kbd}
          </kbd>
        )}
      </button>
    </motion.div>
  );
}

