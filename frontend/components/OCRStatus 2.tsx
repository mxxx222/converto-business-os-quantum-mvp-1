"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Scan = {
  id: string;
  merchant: string;
  total: number;
  category: string;
  created_at: string;
  confidence: number;
};

export default function OCRStatus({ tenant }: { tenant?: string }) {
  const [scans, setScans] = useState<Scan[]>([]);

  useEffect(() => {
    // Stub - replace with real API
    setScans([
      {
        id: "1",
        merchant: "K-Market Keskuskatu",
        total: 23.45,
        category: "ruoka",
        created_at: new Date().toISOString(),
        confidence: 0.95,
      },
      {
        id: "2",
        merchant: "Shell Länsitie",
        total: 67.80,
        category: "matka",
        created_at: new Date(Date.now() - 3600000).toISOString(),
        confidence: 0.88,
      },
    ]);
  }, [tenant]);

  return (
    <div className="rounded-2xl border p-4 bg-white/70 backdrop-blur shadow">
      <div className="text-sm font-medium text-gray-700 mb-3">📸 Viimeisimmät skannaukset</div>
      <AnimatePresence>
        {scans.length === 0 ? (
          <p className="text-sm text-gray-500">Ei vielä skannauksia.</p>
        ) : (
          <div className="space-y-2">
            {scans.slice(0, 5).map((scan) => (
              <motion.div
                key={scan.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100"
              >
                <div className="flex-1">
                  <div className="font-medium text-sm text-gray-800">{scan.merchant}</div>
                  <div className="text-xs text-gray-500">
                    {new Date(scan.created_at).toLocaleString("fi-FI")}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-800">{scan.total.toFixed(2)} €</div>
                  <div className="text-xs text-gray-500 capitalize">{scan.category}</div>
                </div>
                <div className="ml-3">
                  {scan.confidence >= 0.9 ? (
                    <span className="text-green-600">✓</span>
                  ) : scan.confidence >= 0.7 ? (
                    <span className="text-yellow-600">~</span>
                  ) : (
                    <span className="text-red-600">?</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
