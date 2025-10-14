"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Book, Code, Zap, ArrowRight, ExternalLink } from "lucide-react";

type Language = "fi" | "en" | "ru";

const content = {
  fi: {
    hero: {
      title: "Liitä Converto osaksi omaa järjestelmääsi",
      subtitle: "REST API, Webhookit ja valmiit integraatiot Netvisor, Shopify ja Stripe."
    },
    sections: [
      {
        icon: "book",
        title: "Dokumentaatio",
        description: "Täydellinen API-dokumentaatio ja integraatio-oppaat.",
        link: "docs.converto.fi"
      },
      {
        icon: "code",
        title: "REST & Webhook API",
        description: "Yhdistä Converto mihin tahansa järjestelmään REST API:lla tai Webhookeilla."
      },
      {
        icon: "zap",
        title: "Sandbox-ympäristö",
        description: "Testaa integraatiot turvallisesti ennen tuotantokäyttöä."
      }
    ],
    integrations: {
      title: "Valmiit integraatiot",
      items: ["Netvisor", "Shopify", "Stripe", "Zoho"]
    },
    cta: {
      title: "Aloita integraatio jo tänään",
      button: "Lue dokumentaatio"
    }
  },
  en: {
    hero: {
      title: "Integrate Converto into your system",
      subtitle: "REST API, Webhooks and ready integrations with Netvisor, Shopify and Stripe."
    },
    sections: [
      {
        icon: "book",
        title: "Documentation",
        description: "Complete API documentation and integration guides.",
        link: "docs.converto.fi"
      },
      {
        icon: "code",
        title: "REST & Webhook API",
        description: "Connect Converto to any system using REST API or Webhooks."
      },
      {
        icon: "zap",
        title: "Sandbox environment",
        description: "Test integrations safely before production deployment."
      }
    ],
    integrations: {
      title: "Ready integrations",
      items: ["Netvisor", "Shopify", "Stripe", "Zoho"]
    },
    cta: {
      title: "Start integrating today",
      button: "Read documentation"
    }
  },
  ru: {
    hero: {
      title: "Подключите Converto к вашей системе",
      subtitle: "REST API, Webhooks и готовые интеграции с Netvisor, Shopify и Stripe."
    },
    sections: [
      {
        icon: "book",
        title: "Документация",
        description: "Полная документация API и руководства по интеграции.",
        link: "docs.converto.fi"
      },
      {
        icon: "code",
        title: "REST & Webhook API",
        description: "Подключите Converto к любой системе через REST API или Webhooks."
      },
      {
        icon: "zap",
        title: "Sandbox-среда",
        description: "Безопасное тестирование интеграций перед продакшеном."
      }
    ],
    integrations: {
      title: "Готовые интеграции",
      items: ["Netvisor", "Shopify", "Stripe", "Zoho"]
    },
    cta: {
      title: "Начните интеграцию уже сегодня",
      button: "Читать документацию"
    }
  }
};

const icons = { book: Book, code: Code, zap: Zap };

export default function DocsPage() {
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

      {/* Sections */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {t.sections.map((section, idx) => {
            const Icon = icons[section.icon as keyof typeof icons];
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mb-4">
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {section.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  {section.description}
                </p>
                {section.link && (
                  <a
                    href={`https://${section.link}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-indigo-600 hover:underline font-medium"
                  >
                    {section.link}
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Integrations */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            {t.integrations.title}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {t.integrations.items.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-center p-4 rounded-xl bg-gray-50 border border-gray-200 font-semibold text-gray-700"
              >
                {item}
              </div>
            ))}
          </div>
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
          <a
            href="https://docs.converto.fi"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-600 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-2xl hover:shadow-3xl active:scale-95"
          >
            {t.cta.button}
            <ArrowRight className="w-5 h-5" />
          </a>
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

