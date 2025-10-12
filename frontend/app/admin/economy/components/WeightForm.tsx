"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Save, X } from "lucide-react";

type Weight = {
  event: string;
  points: number;
  multiplier: number;
  streak_bonus: number;
  active: boolean;
};

type Props = {
  item: Weight;
  onSave: (weight: Weight) => void;
  onCancel?: () => void;
};

export default function WeightForm({ item, onSave, onCancel }: Props) {
  const [form, setForm] = useState<Weight>(item);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave(form);
  }

  function set(key: keyof Weight, value: any) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      {/* Event Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tapahtuman nimi
        </label>
        <input
          type="text"
          value={form.event}
          onChange={(e) => set("event", e.target.value)}
          required
          placeholder="esim. ocr.upload"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        <p className="text-xs text-gray-500 mt-1">
          Käytä pistenotaatiota, esim. <code>ocr.success</code>, <code>vat.on_time</code>
        </p>
      </div>

      {/* Points */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Peruspisteet
        </label>
        <input
          type="number"
          value={form.points}
          onChange={(e) => set("points", parseInt(e.target.value))}
          required
          min="0"
          step="1"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        <p className="text-xs text-gray-500 mt-1">
          Montako pistettä tapahtuma antaa (ennen kerrointa)
        </p>
      </div>

      {/* Multiplier */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Kerroin
        </label>
        <input
          type="number"
          value={form.multiplier}
          onChange={(e) => set("multiplier", parseFloat(e.target.value))}
          required
          min="0"
          max="10"
          step="0.1"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        <p className="text-xs text-gray-500 mt-1">
          1.0 = normaali, 2.0 = tuplaa pisteet, 0.5 = puolita
        </p>
      </div>

      {/* Streak Bonus */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Streak-bonus
        </label>
        <input
          type="number"
          value={form.streak_bonus}
          onChange={(e) => set("streak_bonus", parseInt(e.target.value))}
          required
          min="0"
          step="1"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        <p className="text-xs text-gray-500 mt-1">
          Lisäpisteet per 7 päivän streak (0 = ei bonusta)
        </p>
      </div>

      {/* Active Toggle */}
      <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-50 border border-gray-200">
        <input
          type="checkbox"
          id="active"
          checked={form.active}
          onChange={(e) => set("active", e.target.checked)}
          className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
        />
        <label htmlFor="active" className="text-sm font-medium text-gray-700 cursor-pointer">
          Aktiivinen (pisteet lasketaan)
        </label>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t border-gray-200">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-colors flex items-center justify-center gap-2"
          >
            <X className="w-4 h-4" />
            Peruuta
          </button>
        )}
        <button
          type="submit"
          className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" />
          Tallenna
        </button>
      </div>
    </motion.form>
  );
}
