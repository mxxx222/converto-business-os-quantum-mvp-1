"use client";
import { useState } from "react";

export default function OCRPreview({ data, onConfirm }: { data: any; onConfirm: (d: any) => void }) {
  const [form, setForm] = useState<any>(data || {});
  
  if (!data) return null;

  function set(path: string, val: any) {
    const next = { ...form };
    (next as any)[path] = val;
    setForm(next);
  }

  return (
    <div className="rounded-2xl border border-gray-200 p-5 bg-white shadow">
      <h3 className="font-semibold text-lg mb-4">Esikatselu & muokkaus</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <label className="text-sm">
          <div className="text-gray-600 mb-1 font-medium">Kauppa</div>
          <input
            className="w-full border border-gray-300 rounded-lg p-2"
            value={form.merchant || ""}
            onChange={(e) => set("merchant", e.target.value)}
          />
        </label>
        <label className="text-sm">
          <div className="text-gray-600 mb-1 font-medium">Päiväys</div>
          <input
            type="date"
            className="w-full border border-gray-300 rounded-lg p-2"
            value={form.date || ""}
            onChange={(e) => set("date", e.target.value)}
          />
        </label>
        <label className="text-sm">
          <div className="text-gray-600 mb-1 font-medium">Summa €</div>
          <input
            type="number"
            step="0.01"
            className="w-full border border-gray-300 rounded-lg p-2"
            value={form.total || ""}
            onChange={(e) => set("total", parseFloat(e.target.value))}
          />
        </label>
        <label className="text-sm">
          <div className="text-gray-600 mb-1 font-medium">ALV %</div>
          <input
            type="number"
            className="w-full border border-gray-300 rounded-lg p-2"
            value={form.vat?.rate || form.vat || ""}
            onChange={(e) => set("vat", e.target.value)}
          />
        </label>
        <label className="text-sm">
          <div className="text-gray-600 mb-1 font-medium">Kategoria</div>
          <input
            className="w-full border border-gray-300 rounded-lg p-2"
            value={form.category || ""}
            onChange={(e) => set("category", e.target.value)}
          />
        </label>
        <label className="text-sm">
          <div className="text-gray-600 mb-1 font-medium">Budjettirivi</div>
          <input
            className="w-full border border-gray-300 rounded-lg p-2"
            value={form.budget_line || ""}
            onChange={(e) => set("budget_line", e.target.value)}
          />
        </label>
      </div>
      <div className="mt-5 flex justify-end gap-3">
        <button
          className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
          onClick={() => location.reload()}
        >
          Peruuta
        </button>
        <button
          className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 font-medium"
          onClick={() => onConfirm(form)}
        >
          ✅ Vahvista
        </button>
      </div>
    </div>
  );
}

