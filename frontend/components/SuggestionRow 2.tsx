/**
 * Suggestion Row - Context-aware action chips
 * Horizontal scroll on mobile, sticky on desktop
 */

"use client";
import { motion } from "framer-motion";
import { useSfx } from "@/hooks/useSfx";

interface Suggestion {
  id: string;
  title: string;
  desc?: string;
  icon?: string;
  action: () => void;
  priority: number;
}

interface SuggestionRowProps {
  suggestions?: Suggestion[];
}

export default function SuggestionRow({ suggestions }: SuggestionRowProps) {
  const { play } = useSfx();

  // Default suggestions (can be overridden by props)
  const defaultSuggestions: Suggestion[] = [
    {
      id: "scan_receipt",
      title: "Skannaa kuitti",
      desc: "Puuttuvia kuitteja tältä viikolta",
      icon: "📸",
      action: () => (window.location.href = "/selko/ocr"),
      priority: 10,
    },
    {
      id: "check_vat",
      title: "Tarkista ALV",
      desc: "Määräpäivä lähestyy",
      icon: "🧮",
      action: () => (window.location.href = "/vat"),
      priority: 8,
    },
    {
      id: "send_notion",
      title: "Synkronoi Notion",
      desc: "3 uutta tapahtumaa",
      icon: "📓",
      action: () => alert("Syncing to Notion..."),
      priority: 6,
    },
  ];

  const items = suggestions || defaultSuggestions;
  const sorted = items.sort((a, b) => b.priority - a.priority).slice(0, 5);

  if (sorted.length === 0) return null;

  return (
    <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-200 py-3">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-2 overflow-x-auto snap-x snap-mandatory hide-scrollbar">
          {sorted.map((suggestion) => (
            <motion.button
              key={suggestion.id}
              whileTap={{ scale: 0.95 }}
              className="flex-shrink-0 snap-start flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 hover:shadow-md transition-all"
              onClick={() => {
                play("click");
                suggestion.action();
              }}
            >
              {suggestion.icon && (
                <span className="text-xl">{suggestion.icon}</span>
              )}
              <div className="text-left">
                <div className="text-sm font-semibold text-gray-900">
                  {suggestion.title}
                </div>
                {suggestion.desc && (
                  <div className="text-xs text-gray-600 hidden sm:block">
                    {suggestion.desc}
                  </div>
                )}
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
