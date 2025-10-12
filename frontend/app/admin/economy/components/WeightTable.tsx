"use client";

type Weight = {
  event: string;
  points: number;
  multiplier: number;
  streak_bonus: number;
  active: boolean;
};

export default function WeightTable({ weights, onEdit, onDelete }: { weights: Weight[]; onEdit: (w: Weight) => void; onDelete: (event: string) => void }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-gray-50 text-gray-600">
            <th className="py-3 px-4 text-left font-semibold">Event</th>
            <th className="py-3 px-4 text-left font-semibold">Points</th>
            <th className="py-3 px-4 text-left font-semibold">Multiplier</th>
            <th className="py-3 px-4 text-left font-semibold">Streak Bonus</th>
            <th className="py-3 px-4 text-left font-semibold">Active</th>
            <th className="py-3 px-4"></th>
          </tr>
        </thead>
        <tbody>
          {weights.map((w) => (
            <tr key={w.event} className="border-b hover:bg-gray-50 transition">
              <td className="py-3 px-4 font-medium text-gray-800">{w.event}</td>
              <td className="py-3 px-4 text-gray-700">{w.points}</td>
              <td className="py-3 px-4 text-gray-700">×{w.multiplier}</td>
              <td className="py-3 px-4 text-gray-700">+{w.streak_bonus}</td>
              <td className="py-3 px-4">{w.active ? <span className="text-green-600">✅</span> : <span className="text-gray-400">❌</span>}</td>
              <td className="py-3 px-4 flex gap-2">
                <button onClick={() => onEdit(w)} className="text-indigo-600 hover:text-indigo-800 text-xs font-medium">
                  Edit
                </button>
                <button onClick={() => onDelete(w.event)} className="text-red-600 hover:text-red-800 text-xs font-medium">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

