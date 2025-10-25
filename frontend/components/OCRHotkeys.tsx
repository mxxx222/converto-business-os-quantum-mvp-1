"use client";
import { useEffect } from "react";

type HotkeyAction = "scan" | "show_last" | "rescan" | "export" | "report" | "analyze";

export default function OCRHotkeys({ onAction }: { onAction: (action: HotkeyAction) => void }) {
  useEffect(() => {
    function handler(e: KeyboardEvent): void {
      // Shift + O → Open scan
      if (e.shiftKey && e.key.toLowerCase() === "o") {
        e.preventDefault();
        onAction("scan");
      }
      // Shift + S → Show last
      if (e.shiftKey && e.key.toLowerCase() === "s") {
        e.preventDefault();
        onAction("show_last");
      }
      // Shift + R → Rescan
      if (e.shiftKey && e.key.toLowerCase() === "r") {
        e.preventDefault();
        onAction("rescan");
      }
      // Shift + E → Export
      if (e.shiftKey && e.key.toLowerCase() === "e") {
        e.preventDefault();
        onAction("export");
      }
      // Shift + N → Notify/Report
      if (e.shiftKey && e.key.toLowerCase() === "n") {
        e.preventDefault();
        onAction("report");
      }
      // Ctrl/Cmd + Shift + A → Analyze month
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "a") {
        e.preventDefault();
        onAction("analyze");
      }
    }

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onAction]);

  return (
    <div className="fixed bottom-4 left-4 bg-black/80 backdrop-blur text-white text-xs p-3 rounded-lg shadow-lg">
      <div className="font-semibold mb-1">⌨️ Pikanäppäimet:</div>
      <div className="space-y-0.5 opacity-80">
        <div>Shift+O → Skannaa</div>
        <div>Shift+S → Viimeisin</div>
        <div>Shift+R → Uudelleen</div>
        <div>Shift+E → Vie CSV</div>
        <div>Shift+N → Raportti</div>
        <div>⌘/Ctrl+Shift+A → Analysoi kk</div>
      </div>
    </div>
  );
}
