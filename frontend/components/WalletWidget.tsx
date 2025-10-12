"use client";
import { motion } from "framer-motion";
import useSWR from "swr";
import { Wallet, Coins, TrendingUp, Sparkles } from "lucide-react";

const fetcher = (url: string) => fetch(url, { cache: "no-store" }).then(r => r.json());

export default function WalletWidget({ tenant, user }: { tenant?: string; user?: string }) {
  const base = process.env.NEXT_PUBLIC_API_BASE!;
  const t = tenant || "demo";
  const u = user || "user_demo";
  const { data } = useSWR(`${base}/api/v1/p2e/wallet?t=${t}&u=${u}`, fetcher, { refreshInterval: 15000 });
  const balance = data?.balance || 0;

  // Simulate recent change for demo
  const recentChange = Math.floor(Math.random() * 20) - 5;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-500 via-fuchsia-500 to-pink-500 p-6 shadow-2xl"
    >
      {/* Animated Shine Effect */}
      <motion.div
        animate={{
          x: ["-100%", "200%"],
        }}
        transition={{
          repeat: Infinity,
          duration: 3,
          ease: "linear",
        }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
      />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-white/20 backdrop-blur-sm">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <div className="text-white">
              <div className="text-sm font-semibold">Token Wallet</div>
              <div className="text-xs opacity-90">Converto Tokens</div>
            </div>
          </div>
          
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          >
            <Sparkles className="w-6 h-6 text-yellow-300" />
          </motion.div>
        </div>

        {/* Balance */}
        <div className="mb-4">
          <motion.div
            key={balance}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-baseline gap-2"
          >
            <div className="text-5xl font-bold text-white drop-shadow-lg">
              {balance.toLocaleString()}
            </div>
            <div className="text-xl text-white/90 font-medium">CT</div>
          </motion.div>
          
          {/* Recent Change Indicator */}
          {recentChange !== 0 && (
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className={`inline-flex items-center gap-1 mt-2 px-2 py-1 rounded-full text-xs font-medium ${
                recentChange > 0 ? "bg-green-500/30 text-green-100" : "bg-red-500/30 text-red-100"
              }`}
            >
              <TrendingUp className={`w-3 h-3 ${recentChange < 0 ? "rotate-180" : ""}`} />
              <span>{recentChange > 0 ? "+" : ""}{recentChange} viimeisten 24h aikana</span>
            </motion.div>
          )}
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20">
            <div className="flex items-center gap-2 mb-1">
              <Coins className="w-4 h-4 text-yellow-300" />
              <div className="text-xs text-white/80">Ansaittu yhteensä</div>
            </div>
            <div className="text-lg font-bold text-white">{(balance + 50).toLocaleString()}</div>
          </div>
          
          <div className="p-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-green-300" />
              <div className="text-xs text-white/80">Rank</div>
            </div>
            <div className="text-lg font-bold text-white">#42</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-4 pt-4 border-t border-white/20">
          <div className="text-xs text-white/80 mb-2">Tokenit ovat off-chain</div>
          <div className="text-xs text-white/90 font-medium">
            💎 Ansaitse lisää: Skannaa kuitteja, maksa laskut ajallaan, pidä streak päällä!
          </div>
        </div>
      </div>

      {/* Floating Coin Animation */}
      <motion.div
        animate={{
          y: [0, -10, 0],
          rotate: [0, 360],
        }}
        transition={{
          repeat: Infinity,
          duration: 3,
          ease: "easeInOut",
        }}
        className="absolute top-4 right-4 w-8 h-8 rounded-full bg-yellow-400 shadow-lg opacity-20"
      />
    </motion.div>
  );
}
