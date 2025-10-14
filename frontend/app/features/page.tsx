"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Zap, DollarSign, Shield, Plug, Eye, ArrowRight } from "lucide-react";

type Language = "fi" | "en" | "ru";

const content = {
  fi: {
    hero: {
      title: "Yksi järjestelmä – monta hyötyä",
      subtitle: "Hallinta, laskutus ja raportointi ilman monimutkaisuutta."
    },
    features: [
      {
        icon: "zap",
        title: "Älykäs automaatio",
        description: "Poistaa rutiinit ja vähentää virheitä – laskut ja tehtävät etenevät automaattisesti."
      },
      {
        icon: "dollar",
        title: "Laskutus ja raportointi",
        description: "Kaikki maksut ja asiakkaat samassa järjestelmässä. Helppo seurata ja raportoida."
      },
      {
        icon: "shield",
        title: "Tiimien pääsynhallinta",
        description: "Roolipohjainen käyttöoikeus ja audit trail kaikille toiminnoille."
      },
      {
        icon: "plug",
        title: "Integraatiot",
        description: "Toimii Netvisorin, Zoho:n, Shopifyn ja Stripen kanssa."
      },
      {
        icon: "eye",
        title: "Reaaliaikainen näkymä",
        description: "Näe koko liiketoiminnan tila yhdellä silmäyksellä."
      }
    ],
    cta: {
      title: "Aloita ilmaiseksi ja testaa 7 päivää",
      button: "Aloita ilmaiseksi"
    }
  },
  en: {
    hero: {
      title: "One system – multiple benefits",
      subtitle: "Built for clarity, performance, and intelligent automation."
    },
    features: [
      {
        icon: "zap",
        title: "Smart automation",
        description: "Removes repetitive work and errors — invoices and tasks flow automatically."
      },
      {
        icon: "dollar",
        title: "Billing and reporting",
        description: "Manage all clients and payments in one dashboard with instant reports."
      },
      {
        icon: "shield",
        title: "Team access control",
        description: "Role-based permissions and full audit trail for all actions."
      },
      {
        icon: "plug",
        title: "Integrations",
        description: "Works seamlessly with Netvisor, Zoho, Shopify, and Stripe."
      },
      {
        icon: "eye",
        title: "Real-time insight",
        description: "Monitor your entire business in a single view."
      }
    ],
    cta: {
      title: "Start for free and test for 7 days",
      button: "Start for free"
    }
  },
  ru: {
    hero: {
      title: "Одна система – множество преимуществ",
      subtitle: "Автоматизация, безопасность и интеграции."
    },
    features: [
      {
        icon: "zap",
        title: "Умная автоматизация",
        description: "Устраняет рутину и ошибки, задачи выполняются автоматически."
      },
      {
        icon: "dollar",
        title: "Счета и отчёты",
        description: "Все клиенты и платежи на одной панели с мгновенными отчётами."
      },
      {
        icon: "shield",
        title: "Управление доступом",
        description: "Разграничение прав и аудит всех действий команды."
      },
      {
        icon: "plug",
        title: "Интеграции",
        description: "Работает с Netvisor, Zoho, Shopify и Stripe."
      },
      {
        icon: "eye",
        title: "Мониторинг в реальном времени",
        description: "Весь бизнес под контролем в одном окне."
      }
    ],
    cta: {
      title: "Начните бесплатно и тестируйте 7 дней",
      button: "Начать бесплатно"
    }
  }
};

const icons = {
  zap: Zap,
  dollar: DollarSign,
  shield: Shield,
  plug: Plug,
  eye: Eye
};

export default function FeaturesPage() {
  const [lang, setLang] = useState<Language>("fi");
  const t = content[lang];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Language Selector */}
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        {(["fi", "en", "ru"] as Language[]).map((l) => (
          <button
            key={l}
            onClick={() => setLang(l)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              lang === l
                ? "bg-indigo-600 text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            {l.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-bold mb-4"
          >
            {t.hero.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/90 max-w-3xl mx-auto"
          >
            {t.hero.subtitle}
          </motion.p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {t.features.map((feature, idx) => {
            const Icon = icons[feature.icon as keyof typeof icons];
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all hover:scale-105"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mb-4">
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold mb-6"
          >
            {t.cta.title}
          </motion.h2>
          <Link
            href="/auth"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-600 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-2xl hover:shadow-3xl active:scale-95"
          >
            {t.cta.button}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Back to Home */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link
          href="/"
          className="text-indigo-600 hover:underline flex items-center gap-2"
        >
          ← {lang === "fi" ? "Takaisin etusivulle" : lang === "en" ? "Back to home" : "Назад на главную"}
        </Link>
      </div>
    </div>
  );
}

