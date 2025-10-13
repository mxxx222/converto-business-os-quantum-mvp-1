"use client";
import { motion } from "framer-motion";
import { 
  Shield, 
  Zap, 
  TrendingUp, 
  FileText, 
  Award, 
  Sparkles,
  ArrowRight,
  BarChart3,
  Wallet
} from "lucide-react";
import Link from "next/link";
import GamifyCard from "@/components/GamifyCard";
import WalletWidget from "@/components/WalletWidget";
import RewardsList from "@/components/RewardsList";
import { ProviderChip, PrivacyChip, LatencyChip, ConfidenceChip } from "@/components/StatusChips";
import { QuickReplies } from "@/components/CommandPalette";

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
  const tenant = "demo";
  const user = "user_demo";

  const features = [
    {
      icon: FileText,
      title: "OCR AI Kuitit",
      desc: "Skannaa kuitit sekunneissa – AI tunnistaa kaikki tiedot automaattisesti",
      color: "from-blue-500 to-cyan-500",
      link: "/selko/ocr"
    },
    {
      icon: BarChart3,
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Status Chips - Desktop */}
      <div className="hidden md:block bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ProviderChip showLatency={true} />
              <PrivacyChip />
            </div>
            <ConfidenceChip confidence={0.92} />
          </div>
        </div>
      </div>

      {/* Quick Actions - Mobile */}
      <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3">
        <QuickReplies />
      </div>

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
            {stats.map((stat, i) => (
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

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Kaikki mitä tarvitset yhdessä paikassa
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Integroidut työkalut, jotka säästävät aikaa ja rahaa – AI-ohjattu automaatio joka askeleella.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <Link key={feature.title} href={feature.link}>
                <motion.div
                  variants={item}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
                >
                  {/* Gradient Background on Hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity`} />

                  <div className="relative z-10">
                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color} text-white mb-4 shadow-lg`}>
                      <Icon className="w-6 h-6" />
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-indigo-600 group-hover:to-purple-600 transition-all">
                      {feature.title}
                    </h3>

                    <p className="text-gray-600 text-sm mb-4">
                      {feature.desc}
                    </p>

                    <div className="flex items-center text-indigo-600 font-medium text-sm group-hover:translate-x-2 transition-transform">
                      Avaa
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </div>
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </motion.div>
      </section>

      {/* Gamification Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ansaitse käyttäessä 🎮
          </h2>
          <p className="text-lg text-gray-600">
            Joka toiminto palkitsee – kerää pisteitä, lunasta palkintoja ja kilpaile muiden kanssa!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <GamifyCard tenant={tenant} user={user} />
          </div>
          <div className="space-y-6">
            <WalletWidget tenant={tenant} user={user} />
          </div>
        </div>

        <div className="mt-6">
          <RewardsList tenant={tenant} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-12 text-center shadow-2xl"
        >
          <div className="absolute inset-0 bg-grid-white/10" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Valmis aloittamaan?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Liity yli 500 suomalaisyrittäjän joukkoon, jotka ovat automatisoineet kirjanpitonsa.
            </p>
            <Link href="/billing">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-xl bg-white text-indigo-600 font-bold text-lg shadow-xl hover:shadow-2xl transition-all"
              >
                Valitse suunnitelma
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
