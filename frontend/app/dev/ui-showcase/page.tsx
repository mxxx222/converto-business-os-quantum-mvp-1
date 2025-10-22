"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Copy, Check } from "lucide-react";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import LangSwitcher from "@/components/LangSwitcher";
import { useTheme } from "some-theme-provider";

type Language = "fi" | "en" | "ru";

export default function UIShowcase() {
  const [lang, setLang] = useState<Language>("fi");
  const [copied, setCopied] = useState<string | null>(null);
  const { theme } = useTheme();

  const copy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const CodeBlock = ({ code, id }: { code: string; id: string }) => (
    <div className="relative bg-gray-900 dark:bg-black rounded-xl p-4 overflow-x-auto">
      <button
        onClick={() => copy(code, id)}
        className="absolute top-2 right-2 p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
      >
        {copied === id ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-400" />}
      </button>
      <pre className="text-sm text-gray-100 font-mono">{code}</pre>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">🎨 Converto™ UI Showcase</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Interactive component library & design system</p>
            </div>
            <div className="flex items-center gap-4">
              <ThemeSwitcher />
              <LangSwitcher currentLang={lang} onLangChange={setLang} />
              <Link href="/" className="text-sm text-converto-blue hover:underline">
                ← Back to app
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">

        {/* Color Palette */}
        <section>
          <h2 className="text-3xl font-bold mb-6">Color Palette</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "Converto Blue", hex: "#0047FF", usage: "Primary CTA" },
              { name: "Sky Blue", hex: "#69B3FF", usage: "Hover, accent" },
              { name: "Graphite Gray", hex: "#444B5A", usage: "Text, headers" },
              { name: "Mist Gray", hex: "#F5F6FA", usage: "Surface, cards" },
              { name: "Fixu™ Green", hex: "#39FF14", usage: "Gamify, points" },
              { name: "Mint Green", hex: "#2ECC71", usage: "Success states" },
              { name: "Alert Red", hex: "#E74C3C", usage: "Errors" },
              { name: "Dark BG", hex: "#0D1117", usage: "Dark theme BG" },
            ].map((color) => (
              <div key={color.hex} className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                <div
                  className="h-20 rounded-lg mb-3"
                  style={{ backgroundColor: color.hex }}
                />
                <h3 className="font-semibold text-sm mb-1">{color.name}</h3>
                <p className="font-mono text-xs text-gray-600 dark:text-gray-400 mb-1">{color.hex}</p>
                <p className="text-xs text-gray-500 dark:text-gray-500">{color.usage}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Hero Component */}
        <section>
          <h2 className="text-3xl font-bold mb-6">Hero Component</h2>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-2xl p-12 text-center"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Yksi älykäs järjestelmä
              </h1>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Kaikki yrityksen toiminnot hallinnassa
              </p>
              <div className="flex gap-4 justify-center">
                <button className="px-8 py-3 bg-white text-indigo-600 rounded-xl font-bold hover:bg-gray-100 transition-all shadow-lg">
                  Aloita ilmaiseksi
                </button>
                <button className="px-8 py-3 bg-white/10 backdrop-blur border-2 border-white/30 text-white rounded-xl font-bold hover:bg-white/20 transition-all">
                  Tutustu alustaan
                </button>
              </div>
            </motion.div>
          </div>
          <CodeBlock
            id="hero"
            code={`<div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-2xl p-12">
  <h1 className="text-5xl font-bold">Yksi älykäs järjestelmä</h1>
  <p className="text-xl text-white/90">Kaikki hallinnassa</p>
  <button className="px-8 py-3 bg-white text-indigo-600 rounded-xl font-bold">
    Aloita ilmaiseksi
  </button>
</div>`}
          />
        </section>

        {/* Button States */}
        <section>
          <h2 className="text-3xl font-bold mb-6">Button States</h2>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
            <div className="flex flex-wrap gap-4">
              <button className="px-6 py-3 bg-converto-blue text-white rounded-xl font-bold hover:opacity-90 active:scale-95 transition-all focus:ring-2 focus:ring-converto-sky">
                Primary CTA
              </button>
              <button className="px-6 py-3 border-2 border-converto-blue text-converto-blue rounded-xl font-bold hover:bg-converto-blue hover:text-white transition-all focus:ring-2 focus:ring-converto-sky">
                Secondary
              </button>
              <button className="px-6 py-3 text-converto-blue font-bold hover:underline">
                Tertiary Link
              </button>
              <button className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-all">
                Neutral
              </button>
            </div>
          </div>
          <CodeBlock
            id="buttons"
            code={`<button className="px-6 py-3 bg-converto-blue text-white rounded-xl font-bold hover:opacity-90 active:scale-95 transition-all">
  Primary CTA
</button>`}
          />
        </section>

        {/* Gamify Panel Preview */}
        <section>
          <h2 className="text-3xl font-bold mb-6">Gamify Panel</h2>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
            <div className="max-w-md mx-auto">
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl p-6 border border-emerald-200 dark:border-emerald-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg">Gamify Panel</h3>
