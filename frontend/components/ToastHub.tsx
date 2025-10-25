"use client";
import { useEffect, useState } from "react";

type T = {
  id: number;
  message: string;
  timeout: number;
  actionLabel?: string;
  action?: () => void;
};

export default function ToastHub() {
  const [toasts, setToasts] = useState<T[]>([]);

  useEffect(() => {
    const onToast = (e: Event) => {
      const d = (e as CustomEvent).detail as Partial<T> & { message: string; timeout?: number };
      const t: T = {
        id: Date.now() + Math.random(),
        message: d.message,
        timeout: d.timeout ?? 2500,
        actionLabel: d.actionLabel,
        action: d.action,
      };
      setToasts((p) => [...p, t]);
      setTimeout(() => setToasts((p) => p.filter((x) => x.id !== t.id)), t.timeout);
    };
    window.addEventListener("toast", onToast);
    return () => window.removeEventListener("toast", onToast);
  }, []);

  if (!toasts.length) return null;

  return (
    <div className="fixed inset-x-0 bottom-4 z-[60] flex justify-center px-4 pointer-events-none">
      <div className="space-y-2 w-full max-w-md">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto rounded-xl border bg-white/95 dark:bg-neutral-900/90 dark:border-neutral-800 px-3 py-2 text-sm shadow flex items-center gap-3"
            role="status"
            aria-live="polite"
          >
            <span className="truncate">{t.message}</span>
            {t.actionLabel && t.action && (
              <button className="ml-auto rounded-lg border px-2 py-1 text-xs" onClick={t.action}>
                {t.actionLabel}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
