"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type Step = { id: string; label: string; href?: string };

const DEFAULT_STEPS: Step[] = [
  { id: "scan-receipt", label: "Skannaa ensimmäinen kuitti", href: "/selko/ocr" },
  { id: "accept-entry", label: "Hyväksy kirjauksen esikatselu", href: "/dashboard" },
  { id: "vat-check", label: "Tarkista ALV-yhteenveto", href: "/vat" },
  { id: "export", label: "Lataa CSV/PDF-raportti", href: "/reports" },
  { id: "integration", label: "Yhdistä Zettle/POS (valinnainen)", href: "/settings/integrations" },
  { id: "referral", label: "Jaa referral-linkki", href: "/billing" },
];

export default function Checklist({
  storageKey = "converto_checklist_v1",
  steps = DEFAULT_STEPS,
}: {
  storageKey?: string;
  steps?: Step[];
}) {
  const [done, setDone] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const s = localStorage.getItem(storageKey);
    if (s) setDone(JSON.parse(s));
  }, [storageKey]);

  function toggle(id: string) {
    const n = { ...done, [id]: !done[id] };
    setDone(n);
    localStorage.setItem(storageKey, JSON.stringify(n));
  }

  const progress = Math.round(
    (100 * Object.values(done).filter(Boolean).length) / steps.length
  );

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
          ✨ Käyttöönotto
        </h3>
        <span className="text-sm font-semibold text-converto-blue">
          {progress}%
        </span>
      </div>

      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full mb-6 overflow-hidden">
        <div
          className="h-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <ul className="space-y-3">
        {steps.map((s) => (
          <li key={s.id} className="flex items-center gap-3">
            <button
              onClick={() => toggle(s.id)}
              className={`h-6 w-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                done[s.id]
                  ? "bg-emerald-500 border-emerald-600 text-white"
                  : "border-gray-300 dark:border-gray-600 hover:border-converto-blue"
              }`}
            >
              {done[s.id] && "✓"}
            </button>
            {s.href ? (
              <Link
                href={s.href}
                className="text-sm text-gray-700 dark:text-gray-300 hover:text-converto-blue hover:underline flex-1"
              >
                {s.label}
              </Link>
            ) : (
              <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">
                {s.label}
              </span>
            )}
          </li>
        ))}
      </ul>

      {progress === 100 && (
        <div className="mt-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 p-4 text-center">
          <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
            🎉 Loistavaa! Olet valmis!
          </p>
        </div>
      )}
    </div>
  );
}
