"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Zap,
  Shield,
  BarChart3,
  Plug,
  Eye,
  Check,
  ArrowRight,
} from "lucide-react";
import landingData from "@/lib/i18n/landing.json";
import LogosBar from "@/components/marketing/LogosBar";
import Testimonials from "@/components/marketing/Testimonials";
import TrustBadges from "@/components/marketing/TrustBadges";

type Language = "fi" | "en" | "ru";

const icons: React.ComponentType[] = [Zap, Shield, BarChart3, Plug, Eye];

export default function PremiumLanding() {
  const [lang, setLang] = useState<Language>("fi");
  const t = landingData[lang];

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
      <section className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white">
        <div className="max-w-6xl mx-auto px-4 py-20 sm:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
              {t.hero.title}
            </h1>
            <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              {t.hero.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth"
                className="px-8 py-4 bg-white text-indigo-600 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-2xl hover:shadow-3xl active:scale-95"
              >
                {t.hero.cta_primary}
              </Link>
              <Link
                href="/dashboard"
                className="px-8 py-4 bg-white/10 backdrop-blur border-2 border-white/30 text-white rounded-xl font-bold text-lg hover:bg-white/20 transition-all active:scale-95"
              >
                {t.hero.cta_secondary}
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-pink-300 rounded-full blur-3xl" />
        </div>
      </section>

      {/* Customer Logos */}
      <LogosBar />

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {t.features.title}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t.features.subtitle}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {t.features.items.map((feature, idx) => {
            const Icon = icons[idx % icons.length];
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* Pricing Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {t.pricing.title}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t.pricing.subtitle}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {t.pricing.plans.map((plan, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className={`bg-white rounded-2xl p-8 shadow-lg border ${
                  idx === 1
                    ? "border-indigo-600 ring-4 ring-indigo-100 scale-105"
                    : "border-gray-200"
                }`}
              >
                {idx === 1 && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-indigo-600 text-white text-sm font-bold rounded-full">
                    {lang === "fi"
                      ? "Suosituin"
                      : lang === "en"
                      ? "Popular"
                      : "Популярный"}
                  </div>
                )}
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <div className="text-3xl font-bold text-indigo-600 mb-6">
                  {plan.price}
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/auth"
                  className={`block w-full text-center px-6 py-3 rounded-xl font-bold transition-all ${
                    idx === 1
                      ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg"
                      : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                  }`}
                >
                  {t.hero.cta_primary}
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 text-lg">{t.pricing.cta}</p>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <TrustBadges />

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center