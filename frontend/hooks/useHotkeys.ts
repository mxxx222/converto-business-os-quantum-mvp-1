/**
 * Global Hotkeys Hook
 * Keyboard shortcuts for quick navigation
 */

"use client";
import { useEffect } from "react";

export function useHotkeys() {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      // Only trigger if Shift is pressed and no input is focused
      if (!event.shiftKey) return;
      
      const target = event.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
        return;
      }

      const key = event.key.toLowerCase();

      switch (key) {
        case "o":
          event.preventDefault();
          window.location.href = "/selko/ocr";
          break;

        case "v":
          event.preventDefault();
          window.location.href = "/vat";
          break;

        case "r":
          event.preventDefault();
          window.location.href = "/reports";
          break;

        case "b":
          event.preventDefault();
          window.location.href = "/billing";
          break;

        case "d":
          event.preventDefault();
          window.location.href = "/dashboard";
          break;

        case "l":
          event.preventDefault();
          window.location.href = "/legal";
          break;

        case "s":
          event.preventDefault();
          window.location.href = "/settings/notifications";
          break;

        case "?":
        case "/":
          event.preventDefault();
          showHotkeysHelp();
          break;
      }
    }

    function showHotkeysHelp() {
      alert(`
Converto Hotkeys:

⇧ O - OCR Kuittiskannaus
⇧ V - VAT Laskuri
⇧ R - Raportit
⇧ B - Laskutus
⇧ D - Dashboard
⇧ L - Legal
⇧ S - Asetukset
⇧ ? - Näytä ohjeet
      `.trim());
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
}

