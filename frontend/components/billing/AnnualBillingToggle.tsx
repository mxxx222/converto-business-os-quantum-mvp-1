"use client";
import { useState } from "react";

export default function AnnualBillingToggle({
  onChange,
}: {
  onChange: (annual: boolean) => void;
}) {
  const [annual, setAnnual] = useState(true);

  const toggle = () => {
    const newValue = !annual;
    setAnnual(newValue);
    onChange(newValue);
  };

  return (
    <div className="inline-flex items-center gap-3 bg-gray-100 dark:bg-gray-800 rounded-full p-1">
      <button
        onClick={() => {
          setAnnual(false);
          onChange(false);
        }}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
          !annual
            ? "bg-white dark:bg-gray-700 shadow-sm"
            : "text-gray-600 dark:text-gray-400"
        }`}
      >
        Kuukausittain
      </button>
      <button
        onClick={() => {
          setAnnual(true);
          onChange(true);
        }}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
          annual
            ? "bg-white dark:bg-gray-700 shadow-sm"
            : "text-gray-600 dark:text-gray-400"
        }`}
      >
        Vuosittain
        <span className="ml-2 rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 px-2 py-0.5 text-xs font-semibold">
          Säästä 2 kk
        </span>
      </button>
    </div>
  );
}
