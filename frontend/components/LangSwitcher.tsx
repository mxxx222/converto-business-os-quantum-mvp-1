"use client";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";

type Language = "fi" | "en" | "ru";

interface LangSwitcherProps {
  currentLang?: Language;
  onLangChange?: (lang: Language) => void;
}

export default function LangSwitcher({ currentLang = "fi", onLangChange }: LangSwitcherProps) {
  const [lang, setLang] = useState<Language>(currentLang);
  const router = useRouter();
  const pathname = usePathname();

  const langs: { code: Language; label: string; flag: string }[] = [
    { code: "fi", label: "Suomi", flag: "🇫🇮" },
    { code: "en", label: "English", flag: "🇬🇧" },
    { code: "ru", label: "Русский", flag: "🇷🇺" }
  ];

  const handleChange = (newLang: Language) => {
    setLang(newLang);
    onLangChange?.(newLang);

    // Navigate to the same path but with new language
    const currentPath = pathname.replace(/^\/(fi|en|ru)/, '');
    const newPath = `/${newLang}${currentPath}`;
    router.push(newPath);
  };

  return (
    <div className="flex items-center gap-2">
      {langs.map(({ code, flag }) => (
        <button
          key={code}
          onClick={() => handleChange(code)}
          className={`px-2 py-1 text-sm rounded transition-all ${
            code === lang
              ? "bg-gray-900 text-white font-bold"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          title={langs.find(l => l.code === code)?.label}
        >
          {flag}
        </button>
      ))}
    </div>
  );
}
