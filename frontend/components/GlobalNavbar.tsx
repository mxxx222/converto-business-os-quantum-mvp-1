"use client";
import { useState } from "react";
import LangSwitcher from "./LangSwitcher";
import { useTranslations } from "@/lib/useTranslations";

export default function Navbar({ lang = "fi" }: { lang?: string }) {
  const [open, setOpen] = useState<boolean>(false);
  const t = useTranslations(lang).nav;
  const link = (p: string): string => `/${lang}${p}`;

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href={link("")} className="font-bold text-xl text-black">Converto</a>
        <button onClick={() => setOpen(!open)} className="sm:hidden text-black">☰</button>
        <div className={`${open ? "block" : "hidden"} sm:flex gap-8 items-center text-sm text-black`}>
          <a href={link("/features")} className="hover:text-gray-700">{t.features}</a>
          <a href={link("/pricing")} className="hover:text-gray-700">{t.pricing}</a>
          <a href={link("/docs")} className="hover:text-gray-700">{t.docs}</a>
          <a href={link("/case-studies")} className="hover:text-gray-700">{t.case}</a>
          <a href={link("/about")} className="hover:text-gray-700">{t.about}</a>
          <a href={link("/contact")} className="hover:text-gray-700">{t.contact}</a>
          <a href="https://app.converto.fi/sign-up" className="px-5 py-2 rounded-md font-semibold" style={{ backgroundColor: "var(--cta-bg)", color: "var(--cta-text)" }}>
            {t.start}
          </a>
          <LangSwitcher />
        </div>
      </div>
    </nav>
  );
}
