"use client";
import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "@/lib/useTranslations";
import LangSwitcher from "./LangSwitcher";
import ThemeSwitcher from "./ThemeSwitcher";

type Language = "fi" | "en" | "ru";

export default function GlobalNavbar() {
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState<Language>("fi");
  const t = useTranslations(lang).nav;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-bold text-2xl text-black hover:text-gray-700 transition-colors">
          Converto™
        </Link>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-black focus:outline-none text-2xl"
          aria-label="Toggle menu"
        >
          {open ? "✕" : "☰"}
        </button>

        {/* Links */}
        <div
          className={`${
            open ? "flex" : "hidden"
          } md:flex flex-col md:flex-row gap-6 md:gap-8 items-center text-sm font-medium text-black absolute md:relative top-full left-0 right-0 md:top-auto bg-white md:bg-transparent p-6 md:p-0 border-b md:border-0 shadow-lg md:shadow-none`}
        >
          <Link href="/features" className="hover:text-gray-600 transition-colors">
            {t.features}
          </Link>
          <Link href="/case-studies" className="hover:text-gray-600 transition-colors">
            {t.caseStudies}
          </Link>
          <Link href="/pricing" className="hover:text-gray-600 transition-colors">
            {t.pricing}
          </Link>
          <Link href="/docs" className="hover:text-gray-600 transition-colors">
            {t.docs}
          </Link>
          <Link href="/about" className="hover:text-gray-600 transition-colors">
            {t.about}
          </Link>
          <Link href="/contact" className="hover:text-gray-600 transition-colors">
            {t.contact}
          </Link>

          {/* CTA - Converto Blue */}
          <Link
            href="/auth"
            className="px-5 py-2.5 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl active:scale-95"
            style={{
              backgroundColor: "#0047FF",
              color: "#FFFFFF",
            }}
          >
            {t.start}
          </Link>

          {/* Theme Switcher */}
          <ThemeSwitcher />

          {/* Lang Switcher */}
          <LangSwitcher currentLang={lang} onLangChange={setLang} />
        </div>
      </div>
    </nav>
  );
}

