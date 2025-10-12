"use client";
import { motion } from "framer-motion";
import { Edit2, Trash2, CheckCircle, XCircle } from "lucide-react";

type Weight = {
  event: string;
  points: number;
  multiplier: number;
  streak_bonus: number;
  active: boolean;
};

type Props = {
  weights: Weight[];
  onEdit: (weight: Weight) => void;
  onDelete: (event: string) => void;
};

export default function WeightTable({ weights, onEdit, onDelete }: Props) {
  if (weights.length === 0) {
    return (
      <div className="text-center py-8 text-sm text-gray-500">
        Ei vielä pistemäärittelyjä. Lisää ensimmäinen sääntö.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tapahtuma
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Pisteet
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Kerroin
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Streak
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tila
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Toiminnot
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {weights.map((w, i) => (
            <motion.tr
              key={w.event}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="hover:bg-gray-50 transition-colors"
            >
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${w.active ? "bg-green-500" : "bg-gray-300"}`} />
                  <span className="text-sm font-medium text-gray-900">{w.event}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-center">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800">
                  {w.points}p
                </span>
              </td>
              <td className="px-4 py-3 text-center">
                <span className="text-sm text-gray-900">×{w.multiplier.toFixed(1)}</span>
              </td>
              <td className="px-4 py-3 text-center">
                {w.streak_bonus > 0 ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-orange-800">
                    +{w.streak_bonus}p
                  </span>
                ) : (
                  <span className="text-xs text-gray-400">—</span>
                )}
              </td>
              <td className="px-4 py-3 text-center">
                {w.active ? (
                  <div className="inline-flex items-center gap-1 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-xs font-medium">Aktiivinen</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-1 text-gray-400">
                    <XCircle className="w-4 h-4" />
                    <span className="text-xs font-medium">Pois käytöstä</span>
                  </div>
                )}
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => onEdit(w)}
                    className="p-2 rounded-lg hover:bg-indigo-50 text-indigo-600 transition-colors"
                    title="Muokkaa"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(w.event)}
                    className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                    title="Poista"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
