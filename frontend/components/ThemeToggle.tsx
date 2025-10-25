"use client";

import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { Sun, Moon, Monitor } from "lucide-react";

export default function ThemeToggle(): JSX.Element {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const themes: { name: string; label: string; icon: React.ComponentType }[] = [
    { name: "neotech", label: "NeoTech", icon: Monitor },
    { name: "nordic", label: "Nordic", icon: Sun },
    { name: "system", label: "System", icon: Moon },
  ];

  return (
    <div className="flex items-center space-x-2">
      {themes.map(({ name, label, icon: Icon }) => (
        <button
          key={name}
          onClick={() => setTheme(name)}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
            theme === name
              ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
              : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          }`}
        >
          <Icon className="w-4 h-4" />
          <span className="text-sm font-medium">{label}</span>
        </button>
      ))}
    </div>
  );
}
