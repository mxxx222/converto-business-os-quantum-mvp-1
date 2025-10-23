"use client";
import { motion } from "framer-motion";
import {
  Shield,
  TrendingUp,
  FileText,
  Award,
  Sparkles,
  ArrowRight,
  BarChart3,
  Wallet,
  Camera,
  Calculator,
  Receipt
} from "lucide-react";
import Link from "next/link";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function Dashboard() {
  const features = [
    {
      icon: FileText,
      title: "OCR AI Kuitit",
      desc: "Skannaa kuitit sekunneissa – AI tunnistaa kaikki tiedot automaattisesti",
      color: "from-blue-500 to-cyan-500",
      link: "/selko/ocr"
    },
    {
      icon: Calculator,
      title: "ALV-laskuri",
      desc: "Automaattinen ALV-raportointi ja compliance-tarkistukset",
      color: "from-purple-500 to-pink-500",
      link: "/selko/vat"
    },
    {
      icon: Shield,
      title: "Quantum Shield",
      desc: "Tulevaisuuden turvallinen salaus ja data-suojaus",
      color: "from-emerald-500 to-teal-500",
      link: "/security"
    },
    {
      icon: TrendingUp,
      title: "Predictive Engine",
      desc: "AI-ennusteet kassavirralle ja kuluille seuraavaksi kuukaudeksi",
      color: "from-orange-500 to-red-500",
      link: "/analytics"
    },
    {
      icon: Award,
      title: "Gamify & Rewards",
      desc: "Ansaitse pisteitä ja lunasta palkintoja aktiivisuudesta",
      color: "from-fuchsia-500 to-purple-500",
      link: "/billing"
    },
    {
      icon: Wallet,
      title: "Play-to-Earn",
      desc: "Kerrytä Converto Tokeneita (CT) ja käytä niitä premium-ominaisuuksiin",
      color: "from-amber-500 to-yellow-500",
      link: "/billing"
    }
  ];

  const stats = [
    { label: "Skannattuja kuitteja", value: "247", change: "+12%" },
    { label: "Säästetty aikaa", value: "18h", change: "+8%" },
    { label: "ALV-tarkkuus", value: "99.8%", change: "0%" },
    { label: "Token-saldo", value: "128 CT", change: "+15" }
  ];

  const quickActions = [
    { icon: Camera, label: "Lataa kuitti", href: "/receipts/new", color: "from-blue-500 to-cyan-500" },
    { icon: Calculator, label: "ALV-laskuri", href: "/selko/vat", color: "from-purple-500 to-pink-500" },
    { icon: BarChart3, label: "Raportit", href: "/reports", color: "from-emerald-500 to-teal-500" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 opacity-90" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-pulse" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-400 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: "1s" }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 mb-6">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span className="text-sm font-medium text-white">Converto Business OS – Quantum Edition</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
              Automatisoi yrityksesi
              <br />
              <span className="bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
                AI:n voimalla
              </span>
            </h1>

            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              OCR-kuittiskannaus, ALV-automaatio, Gamification ja tulevaisuuden turva-arvaus – kaikki yhdessä järjestelmässä.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/selko/ocr">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group px-6 py-3 rounded-xl bg-white text-indigo-600 font-semibold shadow-xl hover:shadow-2xl transition-all flex items-center gap-2"
                >
                  Aloita skannaus
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>

              <Link href="/billing">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 rounded-xl bg-white/10 backdrop-blur-sm text-white font-semibold border-2 border-white/30 hover:bg-white/20 transition-all"
                >
                  Katso hinnoittelu
                </motion.button>
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16"
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={item}
                className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20"
              >
                <div className="text-sm text-white/80 mb-1">{stat.label}</div>
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-xs text-green-300 font-medium">{stat.change}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Quick Actions */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Pika-aloitus
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Aloita tärkeimmistä toiminnoista – kuittiskannaus, ALV-laskenta ja raportointi.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid md:grid-cols-3 gap-6 mb-16"
        >
          {quickActions.map((action, idx) => {
            const Icon = action.icon;
            return (
              <motion.div
                key={idx}
                variants={item}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all group"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{action.label}</h3>
                <Link href={action.href}>
                  <button className="w-full bg-gray-900 text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors">
                    Aloita
                  </button>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Viimeisimmät kuitit</h2>
            <Link href="/receipts" className="text-indigo-600 hover:text-indigo-700 font-medium">
              Näytä kaikki →
            </Link>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
                    <Receipt className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">K-Market</div>
                    <div className="text-xs text-gray-500">10.10.2025</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">45,20 €</div>
                  <div className="text-xs text-green-600">Käsitelty</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
