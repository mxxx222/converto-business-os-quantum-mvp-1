"use client";
import { motion } from "framer-motion";
import { Receipt, Calculator, FileText, TrendingUp, Camera } from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  // Mock data - wire to API later
  const stats = [
    { label: "Menot tässä kk", value: "2 450 €", change: "+12%", color: "red" },
    { label: "Tulot tässä kk", value: "8 900 €", change: "+8%", color: "green" },
    { label: "ALV maksettava", value: "420 €", change: "24%", color: "blue" },
    { label: "Kuitteja odottaa", value: "3 kpl", change: "", color: "orange" },
  ];

  const quickActions = [
    { icon: Camera, label: "Lataa kuitti", href: "/receipts/new", color: "from-blue-500 to-cyan-500" },
    { icon: Calculator, label: "ALV-laskuri", href: "/vat", color: "from-purple-500 to-pink-500" },
    { icon: FileText, label: "Raportit", href: "/reports", color: "from-emerald-500 to-teal-500" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 pb-8">
        <h1 className="text-2xl font-bold mb-2">Converto Selko</h1>
        <p className="text-white/90">Kuittiskannaus ja ALV-laskuri yrittäjille</p>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-4">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-xl shadow-lg p-4 border border-gray-100"
            >
              <div className="text-xs text-gray-500 mb-1">{stat.label}</div>
              <div className="text-xl font-bold text-gray-900">{stat.value}</div>
              {stat.change && <div className="text-xs text-green-600 mt-1">{stat.change}</div>}
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {quickActions.map((action, i) => {
            const Icon = action.icon;
            return (
              <Link key={action.label} href={action.href}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className={`bg-gradient-to-br ${action.color} text-white rounded-2xl p-6 shadow-xl cursor-pointer`}
                >
                  <Icon className="w-8 h-8 mb-3" />
                  <div className="text-lg font-bold">{action.label}</div>
                </motion.div>
              </Link>
            );
          })}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Viimeisimmät kuitit</h2>
            <Link href="/receipts" className="text-sm text-indigo-600 hover:underline">
              Näytä kaikki →
            </Link>
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                    <Receipt className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">K-Market</div>
                    <div className="text-xs text-gray-500">10.10.2025</div>
                  </div>
                </div>
                <div className="text-sm font-bold text-gray-900">45,20 €</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fixed Bottom Bar (Mobile) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 md:hidden shadow-2xl">
        <Link href="/receipts/new">
          <button className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold shadow-lg flex items-center justify-center gap-2">
            <Camera className="w-5 h-5" />
            Lataa kuitti
          </button>
        </Link>
      </div>
    </div>
  );
}
