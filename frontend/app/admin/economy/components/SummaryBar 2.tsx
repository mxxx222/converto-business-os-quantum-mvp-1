"use client";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, Zap, Users, Award, Activity } from "lucide-react";

export default function SummaryBar() {
  // Stub KPIs – wire to /api/v1/gamify/admin/kpis later
  const kpi = [
    { label: "Token-inflaatio", value: "+2.1%", subtext: "/viikko", trend: "up", color: "emerald", Icon: TrendingUp },
    { label: "Redeem-aste", value: "34%", subtext: "käyttäjistä", trend: "neutral", color: "blue", Icon: Award },
    { label: "Aktiivit (streak ≥3d)", value: "62%", subtext: "päivittäin", trend: "up", color: "purple", Icon: Users },
    { label: "Avg. CT / käyttäjä", value: "128", subtext: "tokenia", trend: "up", color: "fuchsia", Icon: Zap },
  ];

  const trendIcon = (t: string) => {
    if (t === "up") return <TrendingUp className="w-3 h-3" />;
    if (t === "down") return <TrendingDown className="w-3 h-3" />;
    return <Minus className="w-3 h-3" />;
  };

  const trendColor = (t: string) => {
    if (t === "up") return "text-emerald-600 bg-emerald-50";
    if (t === "down") return "text-red-600 bg-red-50";
    return "text-gray-600 bg-gray-50";
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpi.map((x, i) => {
        const { Icon } = x;
        return (
          <motion.div
            key={x.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300"
          >
            {/* Gradient Accent */}
            <div className={`absolute inset-0 bg-gradient-to-br from-${x.color}-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />

            <div className="relative p-5">
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2 rounded-lg bg-${x.color}-50 text-${x.color}-600`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 ${trendColor(x.trend)}`}>
                  {trendIcon(x.trend)}
                </div>
              </div>

              <div className="text-xs uppercase tracking-wider text-gray-500 font-medium mb-1">{x.label}</div>
              <div className="text-2xl font-bold text-gray-900 mb-0.5">{x.value}</div>
              <div className="text-xs text-gray-500">{x.subtext}</div>
            </div>

            {/* Shimmer Effect on Hover */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </motion.div>
        );
      })}
    </div>
  );
}
