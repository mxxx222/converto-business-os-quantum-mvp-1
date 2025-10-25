/**
 * Quick Actions FAB (Floating Action Button)
 * Opens bottom sheet with suggested actions
 */

"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap } from "lucide-react";

interface QuickAction {
  id: string;
  title: string;
  desc?: string;
  icon?: string;
  action: () => void;
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    id: "ocr",
    title: "Skannaa kuitti",
    desc: "Lisää uusi kuitti",
    icon: "📸",
    action: () => (window.location.href = "/selko/ocr"),
  },
  {
    id: "vat",
    title: "Laske ALV",
    desc: "Tarkista kuukauden ALV",
    icon: "🧮",
    action: () => (window.location.href = "/vat"),
  },
  {
    id: "report",
    title: "Lataa raportti",
    desc: "Viikkoraportti PDF/CSV",
    icon: "📊",
    action: () => (window.location.href = "/reports"),
  },
  {
    id: "billing",
    title: "Laskutus",
    desc: "Tarkista tilaus",
    icon: "💳",
    action: () => (window.location.href = "/billing"),
  },
];

export default function QuickActionsFAB() {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      {/* FAB Button */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow"
        onClick={() => setOpen(!open)}
      >
        <Zap className="w-6 h-6" />
      </motion.button>

      {/* Bottom Sheet */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/30"
              onClick={() => setOpen(false)}
            />

            {/* Sheet */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl"
            >
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-12 h-1 bg-gray-300 rounded-full" />
              </div>

              {/* Header */}
              <div className="px-6 pb-3">
                <h3 className="text-lg font-semibold text-gray-900">
                  ⚡ Pikatoiminnot
                </h3>
                <p className="text-sm text-gray-600">
                  Valitse toiminto tai pitkäpainallus lisätiedoille
                </p>
              </div>

              {/* Actions */}
              <div className="px-6 pb-6 space-y-2 max-h-[60vh] overflow-y-auto">
                {QUICK_ACTIONS.map((action) => (
                  <motion.button
                    key={action.id}
                    whileTap={{ scale: 0.98 }}
                    className="w-full text-left p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200"
                    onClick={() => {
                      setOpen(false);
                      action.action();
                    }}
                  >
                    <div className="flex items-center gap-3">
                      {action.icon && (
                        <span className="text-2xl">{action.icon}</span>
                      )}
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">
                          {action.title}
                        </div>
                        {action.desc && (
                          <div className="text-sm text-gray-600">
                            {action.desc}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Safe area (iOS) */}
              <div className="h-8 bg-white" />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
