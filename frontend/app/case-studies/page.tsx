"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { TrendingDown, Clock, DollarSign, ArrowRight } from "lucide-react";

type Language = "fi" | "en" | "ru";

const content = {
  fi: {
    hero: {
      title: "Todellisia tuloksia älykkäällä automaatiolla",
      subtitle: "Katso miten Converto auttoi yrityksiä säästämään aikaa ja rahaa."
    },
    cases: [
      {
        company: "Fixu™",
        result: "–35 % manuaalityöstä",
        description: "Prosessien automatisointi ja laskutuksen keskitys.",
        metric: "35%",
        icon: "trending"
      },
      {
        company: "Fiksukasvu™",
        result: "+22 % nopeampi projektinhallinta",
        description: "Käyttöönotto 5 päivässä, tiimin näkyvyys parani.",
        metric: "22%",
        icon: "clock"
      },
      {
        company: "HerbSpot™",
        result: "–40 % hallintokuluja",
        description: "Yhdistetty verkkokauppa ja raportointi.",
        metric: "40%",
        icon: "dollar"
      }
    ],
    cta: {
      title: "Haluatko saman tuloksen?",
      button: "Ota yhteyttä"
    }
  },
  en: {
    hero: {
      title: "Real results from real businesses",
      subtitle: "See how Converto helped companies save time and money."
    },
    cases: [
      {
        company: "Fixu™",
        result: "–35% manual work",
        description: "Process automation and centralized billing.",
        metric: "35%",
        icon: "trending"
      },
      {
        company: "Fiksukasvu™",
        result: "+22% faster project management",
        description: "Deployed in 5 days, improved team visibility.",
        metric: "22%",
        icon: "clock"
      },
      {
        company: "HerbSpot™",
        result: "–40% admin costs",
        description: "Unified e-commerce and reporting.",
        metric: "40%",
        icon: "dollar"
      }
    ],
    cta: {
      title: "Want the same results?",
      button: "Contact us"
    }
  },
  ru: {
    hero: {
      title: "Реальные результаты реальных компаний",
      subtitle: "Узнайте, как Converto помог бизнесу сэкономить время и деньги."
    },
    cases: [
      {
        company: "Fixu™",
        result: "–35% ручной работы",
        description: "Автоматизация процессов и централизация счетов.",
        metric: "35%",
        icon: "trending"
      },
      {
        company: "Fiksukasvu™",
        result: "+22% быстрее управление проектами",
        description: "Внедрение за 5 дней, улучшена видимость команды.",
        metric: "22%",
        icon: "clock"
      },
      {
        company: "HerbSpot™",
        result: "–40% административных расходов",
        description: "Объединённая система e-commerce и отчётности.",
        metric: "40%",
        icon: "dollar"
      }
    ],
    cta: {
      title: "Хотите такой же результат?",
      button: "Свяжитесь с нами"
    }
  }
};

const icons = { trending: TrendingDown, clock: Clock, dollar: DollarSign };

export default function CaseStudiesPage() {
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

      {/* Hero */}
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

      {/* Case Studies */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          {t.cases.map((caseStudy, idx) => {
            const Icon = icons[caseStudy.icon as keyof typeof icons];
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-emerald-600">
                    {caseStudy.metric}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {caseStudy.company}
                </h3>
                <p className="text-lg font-semibold text-indigo-600 mb-3">
                  {caseStudy.result}
                </p>
                <p className="text-gray-600 leading-relaxed">
                  {caseStudy.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
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
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-600 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-2xl hover:shadow-3xl active:scale-95"
          >
            {t.cta.button}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Back to Home */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link href="/" className="text-indigo-600 hover:underline">
          ← {lang === "fi" ? "Takaisin etusivulle" : lang === "en" ? "Back to home" : "Назад на главную"}
        </Link>
      </div>
    </div>
  );
}

