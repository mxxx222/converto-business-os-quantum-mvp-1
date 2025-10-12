"use client";
import { useState } from "react";

type Weight = {
  event: string;
  points: number;
  multiplier: number;
  streak_bonus: number;
  active: boolean;
};

export default function WeightForm({ item, onSave }: { item: Weight; onSave: (w: Weight) => void }) {
  const [w, setW] = useState(item);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave(w);
      }}
    >
      <div className="grid grid-cols-2 gap-4">
        <label className="text-sm">
          <div className="text-gray-600 mb-1 font-medium">Event</div>
          <input
            value={w.event}
            onChange={(e) => setW({ ...w, event: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="e.g. ocr.success"
          />
        </label>
        <label className="text-sm">
          <div className="text-gray-600 mb-1 font-medium">Points</div>
          <input
            type="number"
            value={w.points}
            onChange={(e) => setW({ ...w, points: +e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </label>
        <label className="text-sm">
          <div className="text-gray-600 mb-1 font-medium">Multiplier</div>
          <input
            type="number"
            step="0.1"
            value={w.multiplier}
            onChange={(e) => setW({ ...w, multiplier: +e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </label>
        <label className="text-sm">
          <div className="text-gray-600 mb-1 font-medium">Streak Bonus</div>
          <input
            type="number"
            value={w.streak_bonus}
            onChange={(e) => setW({ ...w, streak_bonus: +e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </label>
        <label className="flex items-center gap-2 text-sm col-span-2">
          <input type="checkbox" checked={w.active} onChange={(e) => setW({ ...w, active: e.target.checked })} className="w-4 h-4" />
          <span className="text-gray-700">Active</span>
        </label>
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <button type="submit" className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 font-medium transition">
          Tallenna
        </button>
      </div>
    </form>
  );
}

