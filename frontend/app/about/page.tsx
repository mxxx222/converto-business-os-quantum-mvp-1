"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Target, Shield, Zap, ArrowRight } from "lucide-react";

type Language = "fi" | "en" | "ru";

const content = {
  fi: {
    hero: {
      title: "Miksi Converto syntyi",
      subtitle: "Converto Solutions Oy rakentaa älykkäitä, automatisoituja ratkaisuja, jotka tekevät liiketoiminnasta läpinäkyvää ja tehokasta."
    },
    values: {
      title: "Arvomme",
      items: [
        { icon: "target", title: "Selkeys", description: "Yksinkertaistamme monimutkaisia prosesseja." },
        { icon: "shield", title: "Luotettavuus", description: "EU-tason tietosuoja ja jatkuva saatavuus." },
        { icon: "zap", title: "Automaatio", description: "Vapautamme aikaa tärkeille asioille." }
      ]
    },
    structure: {
      title: "Holding-rakenne",
      description: "Bulgaria/Liettua (IP-yhtiö) + Suomi (operointi). Kansainvälinen infrastruktuuri, paikallinen asiantuntemus."
    },
    cta: {
      title: "Ota yhteyttä tai liity kumppaniksi",
      button: "Ota yhteyttä"
    }
  },
  en: {
    hero: {
      title: "Why Converto was created",
      subtitle: "Converto Solutions builds intelligent, automated solutions that make business operations transparent and efficient."
    },
    values: {
      title: "Our values",
      items: [
        { icon: "target", title: "Clarity", description: "We simplify complex processes." },
        { icon: "shield", title: "Reliability", description: "EU-level data protection and continuous availability." },
        { icon: "zap", title: "Automation", description: "We free up time for what matters." }
      ]
    },
    structure: {
      title: "Holding structure",
      description: "Bulgaria/Lithuania (IP company) + Finland (operations). International infrastructure, local expertise."
    },
    cta: {
      title: "Contact us or become a partner",
      button: "Contact us"
    }
  },
  ru: {
    hero: {
      title: "Почему был создан Converto",
      subtitle: "Converto Solutions создаёт умные автоматизированные решения, которые делают бизнес прозрачным и эффективным."
    },
    values: {
      title: "Наши ценности",
      items: [
        { icon: "target", title: "Ясность", description: "Мы упрощаем сложные процессы." },
        { icon: "shield", title: "Надёжность", description: "Защита данных уровня ЕС и непрерывная доступность." },
        { icon: "zap", title: "Автоматизация", description: "Мы освобождаем время для важных дел." }
      ]
    },
    structure: {
      title: "Холдинговая структура",
      description: "Болгария/Литва (IP-компания) + Финляндия (операции). Международная инфраструктура, местная экспертиза."
    },
    cta: {
      title: "Свяжитесь с нами или станьте партнёром",
      button: "Связаться"
    }
  }
};

const icons = { target: Target, shield: Shield, zap: Zap };

export default function AboutPage() {
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

      {/* Values */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
          {t.values.title}
        </h2>
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {t.values.items.map((value, idx) => {
            const Icon = icons[value.icon as keyof typeof icons];
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all text-center"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-600">
                  {value.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Structure */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {t.structure.title}
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            {t.structure.description}
          </p>
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
