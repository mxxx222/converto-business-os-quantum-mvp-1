"use client";
import { motion } from "framer-motion";
import useSWR from "swr";
import { Flame, Trophy, Zap, TrendingUp, Star } from "lucide-react";

const fetcher = (url: string) => fetch(url, { cache: "no-store" }).then(r => r.json());

export default function GamifyCard({ tenant, user }: { tenant?: string; user?: string }) {
  const base = process.env.NEXT_PUBLIC_API_BASE;
  const params = new URLSearchParams();
  if (tenant) params.set("tenant_id", tenant);
  if (user) params.set("user_id", user);
  params.set("days", "7");
  const { data } = useSWR(
    base ? `${base}/api/v1/gamify/summary?${params}` : null,
    fetcher,
    { refreshInterval: 20000, fallbackData: { total: 0, series: [], streak_days: 0, streak_bonus: 0 } }
  );
  
  const total = data?.total || 0;
  const series = Array.isArray(data?.series) ? data.series.slice(-7) : [];
  const streak = data?.streak_days || 0;
  const streakBonus = data?.streak_bonus || 0;
  const nextLevel = 200;
  const progress = Math.min(100, (total / nextLevel) * 100);

  const days = ["Ma", "Ti", "Ke", "To", "Pe", "La", "Su"];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative overflow-hidden rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6 shadow-xl"
    >
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 animate-pulse" />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-indigo-600 text-white">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-700">Gamify Status</div>
              <div className="text-xs text-gray-500">Viikon suoritus</div>
            </div>
          </div>
          
          {/* Streak Badge */}
          {streak > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500 text-white font-bold shadow-lg"
            >
              <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                <Flame className="w-4 h-4" />
              </motion.div>
              <span>{streak} päivää</span>
            </motion.div>
          )}
        </div>

        {/* Points Display */}
        <div className="mb-4">
          <div className="flex items-baseline gap-2 mb-2">
            <motion.div
              key={total}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
            >
              {total}
            </motion.div>
            <div className="text-lg text-gray-600">pistettä</div>
          </div>
          
          {/* Progress Bar */}
          <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-full"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent animate-pulse" />
          </div>
          
          <div className="flex items-center justify-between mt-2 text-xs text-gray-600">
            <span>{total} / {nextLevel} pistettä</span>
            <div className="flex items-center gap-1 font-semibold text-indigo-600">
              <Star className="w-3 h-3" />
              <span>Seuraava: AI Guru</span>
            </div>
          </div>
        </div>

        {/* Weekly Chart */}
        <div className="mb-4">
          <div className="text-xs font-medium text-gray-600 mb-2">Viikon aktiviteetti</div>
          <div className="flex items-end justify-between gap-1.5 h-24">
            {series.map((pts: number, i: number) => {
              const h = Math.max(8, (pts / Math.max(...series, 1)) * 100);
              const isToday = i === series.length - 1;
              return (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="group relative flex-1 flex flex-col items-center"
                >
                  <div
                    className={`w-full rounded-t-lg transition-all ${
                      isToday
                        ? "bg-gradient-to-t from-pink-500 to-purple-500 shadow-lg"
                        : pts > 0
                        ? "bg-gradient-to-t from-indigo-400 to-indigo-500"
                        : "bg-gray-200"
                    } group-hover:scale-105 group-hover:shadow-xl`}
                    style={{ height: "100%" }}
                  />
                  <div className="text-[10px] text-gray-500 mt-1">{days[i]}</div>
                  
                  {/* Tooltip */}
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-gray-900 text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    {pts}p
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Zap className="w-3.5 h-3.5 text-yellow-500" />
            <span>OCR +10p • ALV +20p • Lasku ajoissa +15p</span>
          </div>
          
          {streakBonus > 0 && (
            <motion.div
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-orange-100 border border-orange-300"
            >
              <Flame className="w-4 h-4 text-orange-600" />
              <span className="text-xs font-medium text-orange-800">
                Streak-bonus: +{streakBonus}p tällä viikolla! 🔥
              </span>
            </motion.div>
          )}

          <div className="flex items-center gap-2 text-xs font-medium text-indigo-600">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Jatka hyvin – olet top 15% aktiiveimmista!</span>
          </div>
        </div>
      </div>

      {/* Floating Particles */}
      <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-indigo-400 animate-ping opacity-75" />
      <div className="absolute bottom-6 left-6 w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse opacity-75" style={{ animationDelay: "0.5s" }} />
    </motion.div>
  );
}
