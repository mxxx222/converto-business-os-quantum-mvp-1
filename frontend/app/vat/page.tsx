"use client";
import { useState } from "react";
import { UnifiedHeader } from "@/components/UnifiedHeader";
import { motion } from "framer-motion";
import { Calculator, TrendingDown, TrendingUp } from "lucide-react";
import { ProviderChip, PrivacyChip, LatencyChip, ConfidenceChip } from "@/components/StatusChips";
import { QuickReplies } from "@/components/QuickReplies";

export default function VATPage() {
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));

  // Mock data - wire to API
  const vat = {
    sales_24: 5000,
    sales_14: 1200,
    sales_10: 800,
    purchases_24: 2000,
    purchases_14: 500,
    purchases_10: 300,
    vat_payable: 1234,
  };

  const rows = [
    { rate: "24%", sales: vat.sales_24, purchases: vat.purchases_24, vat: (vat.sales_24 * 0.24 - vat.purchases_24 * 0.24) },
    { rate: "14%", sales: vat.sales_14, purchases: vat.purchases_14, vat: (vat.sales_14 * 0.14 - vat.purchases_14 * 0.14) },
    { rate: "10%", sales: vat.sales_10, purchases: vat.purchases_10, vat: (vat.sales_10 * 0.10 - vat.purchases_10 * 0.10) },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">
        <div className="flex items-center gap-3 mb-2">
          <Calculator className="w-8 h-8" />
          <h1 className="text-2xl font-bold">ALV-laskuri</h1>
        </div>
        <p className="text-white/90">Kuukauden ALV-yhteenveto</p>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-6">
        {/* Status Chips */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ProviderChip />
            <PrivacyChip />
            <LatencyChip />
          </div>
          <ConfidenceChip value={97} />
        </div>
        {/* Month Selector */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6 border border-gray-100">
          <label className="text-sm font-medium text-gray-700 mb-2 block">Valitse kuukausi</label>
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        {/* Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-gray-100"
        >
          <div className="text-center mb-6">
            <div className="text-sm text-gray-500 mb-2">ALV maksettava</div>
            <div className="text-4xl font-bold text-indigo-600">{vat.vat_payable.toFixed(2)} €</div>
          </div>

          {/* Breakdown Table */}
          <table className="w-full text-sm">
            <thead className="border-b border-gray-200">
              <tr>
                <th className="text-left py-2 text-gray-600">Verokannat</th>
                <th className="text-right py-2 text-gray-600">Myynti</th>
                <th className="text-right py-2 text-gray-600">Ostot</th>
                <th className="text-right py-2 text-gray-600">ALV</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.rate} className="border-b border-gray-100">
                  <td className="py-3 font-medium">{row.rate}</td>
                  <td className="py-3 text-right text-gray-900">{row.sales.toFixed(2)} €</td>
                  <td className="py-3 text-right text-gray-600">{row.purchases.toFixed(2)} €</td>
                  <td className="py-3 text-right font-bold text-indigo-600">{row.vat.toFixed(2)} €</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button className="px-4 py-3 bg-white border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            Lataa PDF
          </button>
          <button className="px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all">
            Lähetä kirjanpitäjälle
          </button>
        </div>

        {/* Quick Replies (mobile) */}
        <div className="mt-3 md:hidden">
          <QuickReplies
            items={[
              { label: "📸 Kuitti", href: "/selko/ocr" },
              { label: "🧾 ALV", href: "/vat" },
              { label: "📤 CSV", href: "/reports" },
              { label: "⚙️ Asetukset", href: "/settings/notifications" },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
