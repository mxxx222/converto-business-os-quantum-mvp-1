"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Gift, Loader2, CheckCircle, AlertCircle } from "lucide-react";

type Reward = {
  id: string;
  name: string;
  desc?: string;
  sponsor?: string;
  points_cost: number;
  stock: number;
  terms_url?: string;
};

type Props = {
  reward: Reward;
  tenant: string;
  user: string;
  onClose: () => void;
  onSuccess: () => void;
};

export default function RedeemModal({ reward, tenant, user, onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleRedeem() {
    setLoading(true);
    setError("");

    try {
      const base = process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000";
      const res = await fetch(`${base}/api/v1/rewards/redeem`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenant_id: tenant,
          user_id: user,
          reward_id: reward.id,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Lunastus epäonnistui");
      }

      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);
    } catch (e: any) {
      setError(e.message || "Verkkovirhe");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>

          {/* Header */}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm">
                <Gift className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{reward.name}</h2>
                {reward.sponsor && (
                  <p className="text-sm text-white/80">Sponsori: {reward.sponsor}</p>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {success ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-center py-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, rotate: 360 }}
                  transition={{ type: "spring", duration: 0.6 }}
                >
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Onneksi olkoon!</h3>
                <p className="text-gray-600">Palkinto lunastettu onnistuneesti</p>
              </motion.div>
            ) : (
              <>
                {/* Description */}
                {reward.desc && (
                  <p className="text-gray-700 mb-4">{reward.desc}</p>
                )}

                {/* Details */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                    <span className="text-sm font-medium text-gray-600">Hinta</span>
                    <span className="text-lg font-bold text-indigo-600">{reward.points_cost} CT</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                    <span className="text-sm font-medium text-gray-600">Varastossa</span>
                    <span className="text-sm font-semibold text-gray-900">{reward.stock} kpl</span>
                  </div>

                  {reward.terms_url && (
                    <a
                      href={reward.terms_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-indigo-600 hover:underline block"
                    >
                      Lue käyttöehdot →
                    </a>
                  )}
                </div>

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 mb-4"
                  >
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                    <p className="text-sm text-red-800">{error}</p>
                  </motion.div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={onClose}
                    disabled={loading}
                    className="flex-1 px-4 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 font-medium text-gray-700 transition-colors disabled:opacity-50"
                  >
                    Peruuta
                  </button>

                  <button
                    onClick={handleRedeem}
                    disabled={loading || reward.stock === 0}
                    className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 font-bold text-white shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Lunastetaan...
                      </>
                    ) : (
                      <>
                        <Gift className="w-5 h-5" />
                        Lunasta nyt
                      </>
                    )}
                  </button>
                </div>

                {reward.stock < 5 && reward.stock > 0 && (
                  <p className="text-xs text-orange-600 text-center mt-3">
                    ⚠️ Vain {reward.stock} kpl jäljellä!
                  </p>
                )}
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
