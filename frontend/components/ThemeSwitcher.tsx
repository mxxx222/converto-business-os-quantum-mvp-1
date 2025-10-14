"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, systemTheme } = useTheme();
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const active = theme === "system" ? systemTheme : theme;

  return (
    <div className="inline-flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
      <button
        onClick={() => setTheme("light")}
        className={`px-2 py-1 text-xs rounded transition-all ${
          active === "light"
            ? "bg-white dark:bg-gray-700 shadow-sm font-medium"
            : "hover:bg-gray-200 dark:hover:bg-gray-700"
        }`}
        aria-label="Light mode"
      >
        ☀️
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={`px-2 py-1 text-xs rounded transition-all ${
          active === "dark"
            ? "bg-white dark:bg-gray-700 shadow-sm font-medium"
            : "hover:bg-gray-200 dark:hover:bg-gray-700"
        }`}
        aria-label="Dark mode"
      >
        🌙
      </button>
      <button
        onClick={() => setTheme("system")}
        className={`px-2 py-1 text-xs rounded transition-all ${
          theme === "system"
            ? "bg-white dark:bg-gray-700 shadow-sm font-medium"
            : "hover:bg-gray-200 dark:hover:bg-gray-700"
        }`}
        aria-label="System theme"
      >
        🖥️
      </button>
    </div>
  );
}

