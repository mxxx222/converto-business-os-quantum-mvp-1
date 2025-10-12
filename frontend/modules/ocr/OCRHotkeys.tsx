"use client";
import { useEffect } from "react";

export default function OCRHotkeys({ onOpen }: { onOpen: () => void }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.shiftKey && e.key.toLowerCase() === "o") {
        e.preventDefault();
        onOpen();
      }
      if (e.shiftKey && e.key.toLowerCase() === "s") {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent("ocr-show-latest"));
      }
      if (e.shiftKey && e.key.toLowerCase() === "r") {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent("ocr-rescan"));
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onOpen]);
  
  return null;
}

