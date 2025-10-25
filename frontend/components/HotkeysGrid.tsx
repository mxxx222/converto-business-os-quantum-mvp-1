/**
 * Mobile-first Hotkeys Grid
 * Premium suggestion blocks with haptic feedback
 */

"use client";
import { motion } from "framer-motion";
import {
  Receipt,
  Calculator,
  Share2,
  Calendar,
  FileText,
  Send,
  CheckCircle,
  Sparkles
} from "lucide-react";
import { useSfx } from "@/hooks/useSfx";

interface HotkeyAction {
  id: string;
  label: string;
  icon: React.ElementType;
  action: string;
  kbd?: string;
  color?: string;
}

const HOTKEY_ACTIONS: HotkeyAction[] = [
  {
    id: "ocr",
    label: "Skannaa kuitti",
    icon: Receipt,
    action: "ocr.upload",
    kbd: "⇧O",
    color: "from-blue-500 to-indigo-600"
  },
  {
    id: "vat",
    label: "Laske ALV",
    icon: Calculator,
    action: "vat.calc",
    kbd: "⇧V",
    color: "from-green-500 to-emerald-600"
  },
  {
    id: "notion",
    label: "Lähetä Notioniin",
    icon: Sparkles,
    action: "notion.upsert",
    color: "from-purple-500 to-pink-600"
  },
  {
    id: "share",
    label: "Jaa WhatsApp",
    icon: Share2,
    action: "wa.share",
    color: "from-emerald-500 to-teal-600"
  },
  {
    id: "task",
    label: "Lisää kalenteriin",
    icon: Calendar,
    action: "notion.calendar",
    kbd: "⇧C",
    color: "from-orange-500 to-red-600"
  },
  {
    id: "report",
    label: "Viikkoraportti",
    icon: FileText,
    action: "reports.weekly",
    kbd: "⇧R",
    color: "from-cyan-500 to-blue-600"
  },
  {
    id: "send",
    label: "Lähetä lasku",
    icon: Send,
    action: "invoice.send",
    color: "from-violet-500 to-purple-600"
  },
  {
    id: "confirm",
    label: "Merkitse maksetuksi",
    icon: CheckCircle,
    action: "invoice.paid",
    color: "from-lime-500 to-green-600"
  }
];

interface HotkeysGridProps {
  onAction: (actionId: string) => void;
  context?: "dashboard" | "ocr" | "billing";
}

export default function HotkeysGrid({ onAction, context = "dashboard" }: HotkeysGridProps) {
  const { play } = useSfx();

  const handleAction = (actionId: string) => {
    // Haptic feedback (mobile)
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }

    // Sound effect
    play("click");

    // Execute action
    onAction(actionId);
  };

  const handleLongPress = (actionId: string) => {
    // Stronger haptic for long press
    if (navigator.vibrate) {
      navigator.vibrate([10, 50, 10]);
    }

    // Show options menu
    onAction(`${actionId}-options`);
  };

  // Filter actions based on context
  const contextActions = HOTKEY_ACTIONS.filter(action => {
    if (context === "ocr") {
      return ["ocr", "notion", "share", "vat"].includes(action.id);
    }
    if (context === "billing") {
      return ["send", "confirm", "share", "report"].includes(action.id);
    }
    return true; // dashboard shows all
  });

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {contextActions.map((item) => (
        <motion.button
          key={item.id}
          whileTap={{ scale: 0.98 }}
          whileHover={{ scale: 1.02 }}
          className="relative rounded-2xl p-4 bg-white/80 backdrop-blur-lg border border-white/20 hover:shadow-lg transition-all group overflow-hidden"
          onClick={() => handleAction(item.id)}
          onContextMenu={(e) => {
            e.preventDefault();
            handleLongPress(item.id);
          }}
        >
          {/* Gradient background on hover */}
          <div className={`absolute inset-0 bg-gradient-to-br ${item.color || "from-gray-400 to-gray-600"} opacity-0 group-hover:opacity-10 transition-opacity`} />

          {/* Icon */}
          <div className="flex items-start justify-between mb-2">
            <item.icon className="w-6 h-6 text-gray-700 group-hover:text-gray-900" />
            {item.kbd && (
              <kbd className="hidden md:block text-xs px-1.5 py-0.5 bg-gray-100 rounded font-mono text-gray-600">
                {item.kbd}
              </kbd>
            )}
          </div>

          {/* Label */}
          <div className="text-sm font-medium text-gray-800 text-left">
            {item.label}
          </div>
        </motion.button>
      ))}
    </div>
  );
}
