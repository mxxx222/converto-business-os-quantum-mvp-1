"use client";
import { useMemo, useState } from "react";
import { Calculator } from "lucide-react";

export default function ROICalculator() {
  const [hourly, setHourly] = useState(45);
  const [hoursSaved, setHoursSaved] = useState(6);
  const [plan, setPlan] = useState<"start" | "pro" | "quantum">("pro");

  const planPrice = { start: 21, pro: 44, quantum: 109 }[plan];
  const monthlyValue = useMemo(() => hourly * hoursSaved, [hourly, hoursSaved]);
  const net = useMemo(() => monthlyValue - planPrice, [monthlyValue, planPrice]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <Calculator className="w-6 h-6 text-converto-blue" />
        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          💰 Säästölaskuri
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <label className="text-sm">
          <span className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
            Tuntihinta (€/h)
          </span>
          <input
            type="number"
            value={hourly}
            onChange={(e) => setHourly(+e.target.value)}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-converto-blue focus:border-transparent"
          />
        </label>

        <label className="text-sm">
          <span className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
            Säästetyt tunnit/kk
          </span>
          <input
            type="number"
            value={hoursSaved}
            onChange={(e) => setHoursSaved(+e.target.value)}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-converto-blue focus:border-transparent"
          />
        </label>

        <label className="text-sm">
          <span className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
            Paketti
          </span>
          <select
            value={plan}
            onChange={(e) => setPlan(e.target.value as any)}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-converto-blue focus:border-transparent"
          >
            <option value="start">Start (21 €)</option>
            <option value="pro">Pro (44 €)</option>
            <option value="quantum">Quantum (109 €)</option>
          </select>
        </label>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-700">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Aika-arvo/kk</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {monthlyValue.toFixed(0)} €
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Kustannus</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              -{planPrice} €
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Nettohyöty</p>
            <p
              className={`text-2xl font-bold ${
                net >= 0
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-rose-600 dark:text-rose-400"
              }`}
            >
              {net >= 0 ? "+" : ""}{net.toFixed(0)} €
            </p>
          </div>
        </div>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
          💡 {net >= 0 ? `Säästät ${net.toFixed(0)}€ joka kuukausi!` : "Kokeile suurempaa tuntimäärää"}
        </p>
      </div>
    </div>
  );
}

