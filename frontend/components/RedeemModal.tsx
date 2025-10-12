"use client";
import { useState } from "react";
import { motion } from "framer-motion";

type RedeemModalProps = {
  reward: {
    id: string;
    name: string;
    desc?: string;
    points_cost: number;
  };
  tenant: string;
  user: string;
  onClose: () => void;
  onSuccess?: () => void;
};

export default function RedeemModal({ reward, tenant, user, onClose, onSuccess }: RedeemModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRedeem() {
    setLoading(true);
    setError(null);
    try {
      const base = process.env.NEXT_PUBLIC_API_BASE!;
      const res = await fetch(`${base}/api/v1/rewards/redeem`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenant_id: tenant,
          user_id: user,
          reward_id: reward.id,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || "Lunastus epäonnistui");
      }
      alert(data.message || `Palkinto lunastettu! Uusi saldo: ${data.new_balance} CT`);
      onSuccess?.();
      onClose();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl"
      >
        <h3 className="text-xl font-bold mb-2 text-gray-800">Lunasta palkinto</h3>
        <p className="text-sm mb-1 text-gray-700 font-medium">{reward.name}</p>
        {reward.desc && <p className="text-xs text-gray-500 mb-4">{reward.desc}</p>}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-3 mb-4">
          <p className="text-sm text-gray-700">
            Tämä maksaa <span className="font-bold text-indigo-700">{reward.points_cost} CT</span>
          </p>
          <p className="text-xs text-gray-500 mt-1">Saldosi vähenee lunastuksen jälkeen.</p>
        </div>
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
        <div className="flex gap-3">
          <button
            onClick={handleRedeem}
            disabled={loading}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white py-3 px-4 rounded-lg font-medium transition"
          >
            {loading ? "Lunastetaan..." : `Lunasta (${reward.points_cost} CT)`}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
          >
            Peruuta
          </button>
        </div>
      </motion.div>
    </div>
  );
}

