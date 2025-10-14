"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import Link from "next/link";
import { 
  Zap, DollarSign, Shield, Award, Copy, Check,
  Sun, Moon, Laptop 
} from "lucide-react";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import LangSwitcher from "@/components/LangSwitcher";

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
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <Award className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    Converto Wallet
                  </h3>
                  <span className="text-2xl font-bold" style={{ color: "#39FF14" }}>
                    335p
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  = 3.35 € hyvitystä seuraavaan laskuun
                </p>
                <button 
                  className="w-full py-3 rounded-xl font-bold transition-all active:scale-95"
                  style={{ backgroundColor: "#39FF14", color: "#000" }}
                >
                  Lunasta pisteet
                </button>
              </div>
            </div>
          </div>
          <CodeBlock
            id="gamify"
            code={`<div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6">
  <h3>Converto Wallet</h3>
  <span style={{ color: "#39FF14" }}>335p</span>
  <button style={{ backgroundColor: "#39FF14", color: "#000" }}>
    Lunasta pisteet
  </button>
</div>`}
          />
        </section>

        {/* Status Chips */}
        <section>
          <h2 className="text-3xl font-bold mb-6">Status Chips</h2>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
            <div className="flex flex-wrap gap-3">
              <span className="px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-sm font-medium flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Active
              </span>
              <span className="px-3 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-sm font-medium">
                🤖 openai (112ms)
              </span>
              <span className="px-3 py-1.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-sm font-medium">
                🇫🇮 Local Intelligence 🔒
              </span>
              <span className="px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium">
                ⚡ 112ms
              </span>
            </div>
          </div>
          <CodeBlock
            id="chips"
            code={`<span className="px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
  ✓ Active
</span>`}
          />
        </section>

        {/* Card Patterns */}
        <section>
          <h2 className="text-3xl font-bold mb-6">Card Patterns</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all hover:scale-105"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-converto-blue to-converto-sky flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2">Feature {i}</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Premium card with hover effects and gradient icons.
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Typography Scale */}
        <section>
          <h2 className="text-3xl font-bold mb-6">Typography Scale</h2>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 space-y-4">
            <h1 className="text-5xl font-bold">H1 - 48px Bold</h1>
            <h2 className="text-4xl font-bold">H2 - 36px Bold</h2>
            <h3 className="text-2xl font-semibold">H3 - 24px Semibold</h3>
            <p className="text-base">Body - 16px Regular</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Caption - 14px Regular</p>
            <p className="text-xs text-gray-500 dark:text-gray-500">Small - 12px Regular</p>
          </div>
        </section>

        {/* Motion Demo */}
        <section>
          <h2 className="text-3xl font-bold mb-6">Motion & Animation</h2>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
            <div className="grid md:grid-cols-3 gap-6">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="p-6 bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-xl cursor-pointer"
              >
                <h4 className="font-bold mb-2">Hover Scale</h4>
                <p className="text-sm text-white/80">scale: 1.05</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-xl"
              >
                <h4 className="font-bold mb-2">Fade In + Slide</h4>
                <p className="text-sm text-white/80">300ms ease</p>
              </motion.div>
              <motion.div
                whileTap={{ scale: 0.95 }}
                className="p-6 bg-gradient-to-br from-emerald-500 to-teal-500 text-white rounded-xl cursor-pointer"
              >
                <h4 className="font-bold mb-2">Press Scale</h4>
                <p className="text-sm text-white/80">scale: 0.95</p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Design Tokens */}
        <section>
          <h2 className="text-3xl font-bold mb-6">Design Tokens (CSS Variables)</h2>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
            <div className="grid md:grid-cols-2 gap-4 font-mono text-sm">
              {[
                { token: "--accent", value: "#0047FF (light) / #69B3FF (dark)" },
                { token: "--accent-hover", value: "#0032B8 (light) / #89C8FF (dark)" },
                { token: "--bg", value: "#FFFFFF (light) / #0D1117 (dark)" },
                { token: "--surface", value: "#F5F6FA (light) / #161B22 (dark)" },
                { token: "--text-primary", value: "#0F1115 (light) / #F5F6FA (dark)" },
                { token: "--text-secondary", value: "#444B5A (light) / #A0A7B4 (dark)" },
              ].map((token) => (
                <div key={token.token} className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <code className="text-converto-blue">{token.token}</code>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{token.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Accessibility */}
        <section>
          <h2 className="text-3xl font-bold mb-6">Accessibility</h2>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>WCAG AA Compliance</strong>
                  <p className="text-sm text-gray-600 dark:text-gray-400">All text meets 4.5:1 contrast ratio</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Focus Rings</strong>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Visible on all interactive elements</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Reduced Motion</strong>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Respects prefers-reduced-motion</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Keyboard Navigation</strong>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Full keyboard support</p>
                </div>
              </li>
            </ul>
          </div>
        </section>

        {/* Links */}
        <section className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Explore More</h2>
          <p className="text-xl text-white/90 mb-8">
            Complete UI documentation and component library
          </p>
          <div className="flex gap-4 justify-center">
            <Link 
              href="/dev/ui-theme-audit" 
              className="px-6 py-3 bg-white text-indigo-600 rounded-xl font-bold hover:bg-gray-100 transition-all"
            >
              Theme Audit
            </Link>
            <Link 
              href="/" 
              className="px-6 py-3 bg-white/10 backdrop-blur border-2 border-white/30 text-white rounded-xl font-bold hover:bg-white/20 transition-all"
            >
              Back to App
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}

