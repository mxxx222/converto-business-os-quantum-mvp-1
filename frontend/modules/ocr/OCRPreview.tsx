"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Check, X, Edit2, Calendar, DollarSign, Tag, TrendingUp } from "lucide-react";

type OCRData = {
  merchant?: string;
  date?: string;
  total?: number;
  vat?: number | { rate?: number; amount?: number };
  currency?: string;
  category?: string;
  budget_line?: string;
  items?: Array<{ name?: string; qty?: number; unit_price?: number; vat_rate?: number }>;
};

type Props = {
  data: OCRData;
  onConfirm: (data: OCRData) => void;
  onCancel?: () => void;
};

export default function OCRPreview({ data, onConfirm, onCancel }: Props) {
  const [form, setForm] = useState<OCRData>(data || {});
  const [editing, setEditing] = useState(false);

  function set(key: keyof OCRData, value: any) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  if (!data) {
    return null;
  }

  const vatValue = typeof form.vat === "object" ? form.vat?.rate || 0 : form.vat || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-gray-200 bg-white shadow-lg overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">Kuitin esikatselu</h3>
            <p className="text-sm text-gray-600">Tarkista ja muokkaa tiedot ennen tallennusta</p>
          </div>
          <button
            onClick={() => setEditing(!editing)}
            className="px-4 py-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 text-sm font-medium text-gray-700 flex items-center gap-2 transition-colors"
          >
            <Edit2 className="w-4 h-4" />
            {editing ? "Lopeta muokkaus" : "Muokkaa"}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {/* Merchant */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Tag className="w-4 h-4 text-indigo-600" />
              Kauppias
            </label>
            {editing ? (
              <input
                type="text"
                value={form.merchant || ""}
                onChange={(e) => set("merchant", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            ) : (
              <div className="px-3 py-2 bg-gray-50 rounded-lg text-gray-900 font-medium">
                {form.merchant || "—"}
              </div>
            )}
          </div>

          {/* Date */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Calendar className="w-4 h-4 text-indigo-600" />
              Päivämäärä
            </label>
            {editing ? (
              <input
                type="date"
                value={form.date || ""}
                onChange={(e) => set("date", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            ) : (
              <div className="px-3 py-2 bg-gray-50 rounded-lg text-gray-900 font-medium">
                {form.date || "—"}
              </div>
            )}
          </div>

          {/* Total */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <DollarSign className="w-4 h-4 text-indigo-600" />
              Summa
            </label>
            {editing ? (
              <input
                type="number"
                step="0.01"
                value={form.total || ""}
                onChange={(e) => set("total", parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            ) : (
              <div className="px-3 py-2 bg-gray-50 rounded-lg text-gray-900 font-bold">
                {form.total?.toFixed(2) || "0.00"} {form.currency || "EUR"}
              </div>
            )}
          </div>

          {/* VAT */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              ALV %
            </label>
            {editing ? (
              <input
                type="number"
                step="0.1"
                value={vatValue}
                onChange={(e) => set("vat", parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            ) : (
              <div className="px-3 py-2 bg-gray-50 rounded-lg text-gray-900 font-medium">
                {vatValue} %
              </div>
            )}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Tag className="w-4 h-4 text-indigo-600" />
              Kategoria
            </label>
            {editing ? (
              <select
                value={form.category || ""}
                onChange={(e) => set("category", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">Valitse...</option>
                <option value="Groceries">Ruokaostokset</option>
                <option value="Fuel">Polttoaine</option>
                <option value="Tools">Työkalut</option>
                <option value="Meals">Ateriat</option>
                <option value="General">Yleinen</option>
              </select>
            ) : (
              <div className="px-3 py-2 bg-gray-50 rounded-lg text-gray-900 font-medium">
                {form.category || "—"}
              </div>
            )}
          </div>

          {/* Budget Line */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              Budjettirivi
            </label>
            {editing ? (
              <input
                type="text"
                value={form.budget_line || ""}
                onChange={(e) => set("budget_line", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            ) : (
              <div className="px-3 py-2 bg-gray-50 rounded-lg text-gray-900 font-medium">
                {form.budget_line || "—"}
              </div>
            )}
          </div>
        </div>

        {/* Items */}
        {form.items && form.items.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Tuotteet ({form.items.length})</h4>
            <div className="rounded-lg border border-gray-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium text-gray-700">Tuote</th>
                    <th className="px-4 py-2 text-center font-medium text-gray-700">Määrä</th>
                    <th className="px-4 py-2 text-right font-medium text-gray-700">Hinta</th>
                    <th className="px-4 py-2 text-right font-medium text-gray-700">ALV %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {form.items.map((item, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-gray-900">{item.name || "—"}</td>
                      <td className="px-4 py-2 text-center text-gray-900">{item.qty || 1}</td>
                      <td className="px-4 py-2 text-right text-gray-900 font-medium">
                        {item.unit_price?.toFixed(2) || "0.00"} €
                      </td>
                      <td className="px-4 py-2 text-right text-gray-600">{item.vat_rate || 0}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          {onCancel && (
            <button
              onClick={onCancel}
              className="flex-1 px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-colors flex items-center justify-center gap-2"
            >
              <X className="w-5 h-5" />
              Peruuta
            </button>
          )}
          <button
            onClick={() => onConfirm(form)}
            className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
          >
            <Check className="w-5 h-5" />
            Vahvista ja tallenna
          </button>
        </div>
      </div>
    </motion.div>
  );
}
