"use client";
import { useState } from "react";
import { useEconomy } from "./hooks/useEconomy";
import WeightTable from "./components/WeightTable";
import WeightForm from "./components/WeightForm";
import SummaryBar from "./components/SummaryBar";
import TrendChart from "./components/TrendChart";

export default function EconomyPage() {
  const { weights, saveWeight, deleteWeight, isLoading } = useEconomy();
  const [edit, setEdit] = useState<any | null>(null);

  return (
    <div className="mx-auto max-w-7xl p-6 space-y-6">
      {/* Hero Header */}
      <header className="relative overflow-hidden rounded-2xl p-8 bg-gradient-to-br from-indigo-600 via-fuchsia-600 to-cyan-500 text-white shadow-2xl">
        <div className="absolute inset-0 bg-white/10 blur-3xl rounded-full pointer-events-none" />
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Economy Admin Console</h1>
          <p className="text-white/90 text-lg">Säädä pistekertoimia, streak-bonuksia ja seuraa token-trendejä reaaliajassa.</p>
        </div>
      </header>

      {/* KPI Summary */}
      <SummaryBar />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weights Table */}
        <section className="lg:col-span-2 rounded-2xl border border-gray-200 bg-white shadow-lg">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">Piste-säännöt</h2>
            <button
              onClick={() =>
                setEdit({
                  event: "new_event",
                  points: 5,
                  multiplier: 1.0,
                  streak_bonus: 0,
                  active: true,
                })
              }
              className="text-sm px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 font-medium transition"
            >
              + Lisää sääntö
            </button>
          </div>
          <div className="p-6">
            {isLoading ? (
              <div className="text-sm text-gray-500">Ladataan...</div>
            ) : (
              <WeightTable
                weights={weights || []}
                onEdit={setEdit}
                onDelete={(event) => {
                  if (confirm(`Haluatko varmasti poistaa säännön "${event}"?`)) {
                    deleteWeight(event);
                  }
                }}
              />
            )}
          </div>
        </section>

        {/* Trend Chart */}
        <aside className="rounded-2xl border border-gray-200 bg-white shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Viikkotrendi (Mint/Burn)</h3>
          <TrendChart />
          <ul className="mt-4 space-y-2 text-sm text-gray-600">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              OCR onnistumiset ↑
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              Laskut ajallaan ↗
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500"></span>
              VAT on-time tavoite 90 %
            </li>
          </ul>
        </aside>
      </div>

      {/* Edit Modal */}
      {edit && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm grid place-items-center z-50 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div className="text-xl font-bold text-gray-800">Muokkaa sääntöä</div>
              <button onClick={() => setEdit(null)} className="text-sm text-gray-500 hover:text-gray-700">
                ✕ Sulje
              </button>
            </div>
            <div className="p-6">
              <WeightForm
                item={edit}
                onSave={(w) => {
                  saveWeight(w);
                  setEdit(null);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

