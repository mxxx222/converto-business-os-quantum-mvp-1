"use client";

import { useState } from "react";

export default function ThemeSwitcher(): JSX.Element {
  const [theme, setTheme] = useState<string>("light");

  return (
    <div className="inline-flex items-center gap-1 bg-gray-100 rounded-lg p-1">
      <button
        onClick={() => setTheme("light")}
        className={`px-2 py-1 text-xs rounded transition-all ${
          theme === "light" ? "bg-white shadow-sm font-medium" : "hover:bg-gray-200"
        }`}
        aria-label="Light mode"
      >
        ☀️
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={`px-2 py-1 text-xs rounded transition-all ${
          theme === "dark" ? "bg-white shadow-sm font-medium" : "hover:bg-gray-200"
        }`}
        aria-label="Dark mode"
      >
        🌙
      </button>
    </div>
  );
}
