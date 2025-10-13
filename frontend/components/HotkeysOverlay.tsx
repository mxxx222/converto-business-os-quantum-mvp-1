/**
 * Hotkeys Overlay - Tooltip with all shortcuts
 * Triggered by Shift+?
 */

"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Keyboard } from "lucide-react";

const HOTKEYS = [
  { key: "⇧O", action: "OCR Kuittiskannaus", route: "/selko/ocr" },
  { key: "⇧V", action: "VAT Laskuri", route: "/vat" },
  { key: "⇧R", action: "Raportit", route: "/reports" },
  { key: "⇧B", action: "Laskutus", route: "/billing" },
  { key: "⇧D", action: "Dashboard", route: "/dashboard" },
  { key: "⇧L", action: "Legal", route: "/legal" },
  { key: "⇧S", action: "Asetukset", route: "/settings/notifications" },
  { key: "⇧?", action: "Näytä ohjeet", route: null }
];

export default function HotkeysOverlay() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      // Shift + ? or Shift + /
      if (event.shiftKey && (event.key === "?" || event.key === "/")) {
        event.preventDefault();
        setShow((prev) => !prev);
      }

      // Escape to close
      if (event.key === "Escape") {
        setShow(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
            onClick={() => setShow(false)}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-full max-w-md bg-white rounded-2xl shadow-2xl"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Keyboard className="w-5 h-5 text-indigo-600" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    Pikanäppäimet
                  </h2>
                </div>
                <button
                  onClick={() => setShow(false)}
                  className="p-1 hover:bg-white/50 rounded-lg transition"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Hotkeys List */}
            <div className="p-6 space-y-2 max-h-96 overflow-y-auto">
              {HOTKEYS.map((hotkey) => (
                <div
                  key={hotkey.key}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition"
                >
                  <span className="text-sm text-gray-700">{hotkey.action}</span>
                  <kbd className="px-3 py-1.5 bg-gray-100 border border-gray-300 rounded-lg text-sm font-mono font-semibold text-gray-800 shadow-sm">
                    {hotkey.key}
                  </kbd>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
              <p className="text-xs text-gray-600 text-center">
                Paina <kbd className="px-1.5 py-0.5 bg-gray-200 rounded text-xs">⇧?</kbd> milloin tahansa
                nähdäksesi tämän listan
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

