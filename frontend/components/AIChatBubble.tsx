/**
 * AI Chat Bubble - Gated by subscription tier
 * Pro tier feature with quota tracking
 */

"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Sparkles, Crown } from "lucide-react";

interface AIChatBubbleProps {
  enabled?: boolean;
  quota?: { used: number; limit: number };
}

export default function AIChatBubble({ enabled = false, quota }: AIChatBubbleProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [input, setInput] = useState("");

  const quotaPercent = quota ? (quota.used / quota.limit) * 100 : 0;
  const quotaNearLimit = quotaPercent >= 90;

  if (!enabled) {
    // Show upgrade CTA
    return (
      <motion.div
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 left-6 z-50"
      >
        <button
          onClick={() => (window.location.href = "/billing")}
          className="flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg hover:shadow-xl transition-shadow"
        >
          <Crown className="w-5 h-5" />
          <span className="font-medium">Päivitä Pro-tilaukseen</span>
        </button>
      </motion.div>
    );
  }

  return (
    <>
      {/* Chat Bubble */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow"
        onClick={() => setOpen(!open)}
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed bottom-24 left-6 z-50 w-96 max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-2xl border border-gray-200"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-indigo-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <h3 className="font-semibold text-gray-900">Automaatioavustaja</h3>
                </div>
                {quota && (
                  <div className="text-xs text-gray-600">
                    {quota.used}/{quota.limit}
                  </div>
                )}
              </div>

              {/* Quota bar */}
              {quota && (
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all ${
                        quotaNearLimit ? "bg-red-500" : "bg-purple-500"
                      }`}
                      style={{ width: `${quotaPercent}%` }}
                    />
                  </div>
                  {quotaNearLimit && (
                    <p className="text-xs text-red-600 mt-1">
                      Kiintiö lähes täynnä. Päivitä pakettia →
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Messages */}
            <div className="h-96 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  <Sparkles className="w-12 h-12 mx-auto mb-2 text-purple-300" />
                  <p className="text-sm">Kysy mitä tahansa yrityksesi hallinnasta</p>
                  <p className="text-xs mt-1 text-gray-400">
                    Esim: "Paljonko minulla on ALV:ia tässä kuussa?"
                  </p>
                </div>
              )}

              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                      msg.role === "user"
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="Kirjoita kysymys..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && input.trim()) {
                      setMessages([...messages, { role: "user", content: input }]);
                      setInput("");
                      // TODO: Send to AI API
                    }
                  }}
                />
                <button
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                  disabled={!input.trim()}
                  onClick={() => {
                    if (input.trim()) {
                      setMessages([...messages, { role: "user", content: input }]);
                      setInput("");
                      // TODO: Send to AI API
                    }
                  }}
                >
                  →
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
