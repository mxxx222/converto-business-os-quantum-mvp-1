"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

interface Command {
  id: string;
  label: string;
  icon: string;
  action: () => void;
  keywords: string[];
  category: string;
}

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const router = useRouter();

  // Define commands
  const commands: Command[] = [
    {
      id: "new-receipt",
      label: "Uusi kuitti",
      icon: "📸",
      action: () => router.push("/selko/ocr"),
      keywords: ["kuitti", "receipt", "scan", "skannaa"],
      category: "Toiminnot"
    },
    {
      id: "vat-report",
      label: "ALV-raportti",
      icon: "🧾",
      action: () => router.push("/vat"),
      keywords: ["alv", "vat", "raportti", "report"],
      category: "Raportit"
    },
    {
      id: "backup",
      label: "Varmuuskopio",
      icon: "💾",
      action: () => fetch("/api/v1/standalone/backup/run", { method: "POST" }),
      keywords: ["backup", "varmuuskopio"],
      category: "Järjestelmä"
    },
    {
      id: "provider-openai",
      label: "Vaihda OpenAI:hin",
      icon: "🤖",
      action: () => switchProvider("openai"),
      keywords: ["openai", "cloud", "ai"],
      category: "Asetukset"
    },
    {
      id: "provider-ollama",
      label: "Vaihda Ollama (local)",
      icon: "🦙",
      action: () => switchProvider("ollama"),
      keywords: ["ollama", "local", "paikallinen"],
      category: "Asetukset"
    },
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "📊",
      action: () => router.push("/dashboard"),
      keywords: ["dashboard", "home", "etusivu"],
      category: "Navigointi"
    },
    {
      id: "billing",
      label: "Laskutus",
      icon: "💳",
      action: () => router.push("/billing"),
      keywords: ["billing", "laskutus", "subscription"],
      category: "Navigointi"
    },
    {
      id: "settings",
      label: "Asetukset",
      icon: "⚙️",
      action: () => router.push("/settings"),
      keywords: ["settings", "asetukset", "config"],
      category: "Navigointi"
    }
  ];

  const switchProvider = (provider: string): void => {
    // This would need backend support to change provider
    alert(`Vaihtaminen ${provider}:iin tulossa pian!`);
    setIsOpen(false);
  };

  // Filter commands based on search
  const filteredCommands = commands.filter(cmd =>
    cmd.label.toLowerCase().includes(search.toLowerCase()) ||
    cmd.keywords.some(k => k.toLowerCase().includes(search.toLowerCase()))
  );

  // Group by category
  const groupedCommands = filteredCommands.reduce((acc, cmd) => {
    if (!acc[cmd.category]) acc[cmd.category] = [];
    acc[cmd.category].push(cmd);
    return acc;
  }, {} as Record<string, Command[]>);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // ⌘K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }

      if (!isOpen) return;

      // Escape
      if (e.key === "Escape") {
        setIsOpen(false);
        setSearch("");
        setSelectedIndex(0);
      }

      // Arrow navigation
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, filteredCommands.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
      }

      // Enter
      if (e.key === "Enter") {
        e.preventDefault();
        const cmd = filteredCommands[selectedIndex];
        if (cmd) {
          cmd.action();
          setIsOpen(false);
          setSearch("");
          setSelectedIndex(0);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Palette */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl z-50 px-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
              {/* Search Input */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🔍</span>
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setSelectedIndex(0);
                    }}
                    placeholder="Hae komentoa..."
                    className="flex-1 outline-none text-lg"
                    autoFocus
                  />
                  <kbd className="px-2 py-1 text-xs bg-gray-100 rounded border border-gray-300">
                    ESC
                  </kbd>
                </div>
              </div>

              {/* Commands List */}
              <div className="max-h-96 overflow-y-auto">
                {Object.entries(groupedCommands).map(([category, cmds]) => (
                  <div key={category}>
                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 bg-gray-50">
                      {category}
                    </div>
                    {cmds.map((cmd, idx) => {
                      const globalIndex = filteredCommands.indexOf(cmd);
                      const isSelected = globalIndex === selectedIndex;

                      return (
                        <motion.button
                          key={cmd.id}
                          whileHover={{ scale: 0.99 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            cmd.action();
                            setIsOpen(false);
                            setSearch("");
                            setSelectedIndex(0);
                          }}
                          className={`w-full px-4 py-3 flex items-center gap-3 transition-colors ${
                            isSelected ? "bg-indigo-50 border-l-2 border-indigo-600" : "hover:bg-gray-50"
                          }`}
                        >
                          <span className="text-2xl">{cmd.icon}</span>
                          <span className="flex-1 text-left font-medium text-gray-900">
                            {cmd.label}
                          </span>
                          {isSelected && (
                            <kbd className="px-2 py-1 text-xs bg-white rounded border border-gray-300">
                              ↵
                            </kbd>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                ))}

                {filteredCommands.length === 0 && (
                  <div className="px-4 py-12 text-center text-gray-500">
                    <p className="text-xl mb-2">🤔</p>
                    <p>Ei tuloksia haulle "{search}"</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white rounded border border-gray-300">↑↓</kbd>
                  <span>Navigoi</span>
                </div>
                <div className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white rounded border border-gray-300">↵</kbd>
                  <span