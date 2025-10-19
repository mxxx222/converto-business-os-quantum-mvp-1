"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, MapPin, Send } from "lucide-react";

type Language = "fi" | "en" | "ru";

const content = {
  fi: {
    hero: {
      title: "Ota yhteyttä",
      subtitle: "Vastaamme 24 tunnin sisällä."
    },
    form: {
      name: "Nimi",
      email: "Sähköposti",
      type: "Aihe",
      types: [
        { value: "sales", label: "Myynti" },
        { value: "support", label: "Tuki" },
        { value: "partnership", label: "Yhteistyö" }
      ],
      message: "Viesti",
      button: "Lähetä viesti"
    },
    info: {
      company: "Converto Solutions Oy",
      address: "Puutarhakatu 11, Turku / Sofia / Vilnius",
      email: "contact@converto.fi"
    }
  },
  en: {
    hero: {
      title: "Contact us",
      subtitle: "We'll respond within 24 hours."
    },
    form: {
      name: "Name",
      email: "Email",
      type: "Subject",
      types: [
        { value: "sales", label: "Sales" },
        { value: "support", label: "Support" },
        { value: "partnership", label: "Partnership" }
      ],
      message: "Message",
      button: "Send message"
    },
    info: {
      company: "Converto Solutions Ltd",
      address: "Puutarhakatu 11, Turku / Sofia / Vilnius",
      email: "contact@converto.fi"
    }
  },
  ru: {
    hero: {
      title: "Свяжитесь с нами",
      subtitle: "Ответим в течение 24 часов."
    },
    form: {
      name: "Имя",
      email: "Email",
      type: "Тема",
      types: [
        { value: "sales", label: "Продажи" },
        { value: "support", label: "Поддержка" },
        { value: "partnership", label: "Партнёрство" }
      ],
      message: "Сообщение",
      button: "Отправить"
    },
    info: {
      company: "Converto Solutions Ltd",
      address: "Puutarhakatu 11, Turku / Sofia / Vilnius",
      email: "contact@converto.fi"
    }
  }
};

export default function ContactPage() {
  const [lang, setLang] = useState<Language>("fi");
  const [formData, setFormData] = useState({ name: "", email: "", type: "sales", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const t = content[lang];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Send to API
    console.log("Form submitted:", formData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

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
            className="text-xl text-white/90"
          >
            {t.hero.subtitle}
          </motion.p>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.form.name}
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.form.email}
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.form.type}
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  {t.form.types.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.form.message}
                </label>
                <textarea
                  required
                  rows={6}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <button
                type="submit"
                disabled={submitted}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all disabled:opacity-50 active:scale-95"
              >
                {submitted ? "✓ " + (lang === "fi" ? "Lähetetty!" : lang === "en" ? "Sent!" : "Отправлено!") : t.form.button}
                {!submitted && <Send className="w-5 h-5" />}
              </button>
            </form>
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-8"
          >
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{t.info.company}</h3>
                  <p className="text-gray-600">{t.info.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Email</h3>
                  <a href={`mailto:${t.info.email}`} className="text-indigo-600 hover:underline">
                    {t.info.email}
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
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
