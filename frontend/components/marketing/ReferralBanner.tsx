"use client";
import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function ReferralBanner({
  referUrl,
  rewardText = "Kutsu 3 kpl → -1 kk"
}: {
  referUrl: string;
  rewardText?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(referUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 md:p-5 flex flex-col md:flex-row md:items-center gap-3 shadow-lg">
      <div className="text-base md:text-lg font-semibold">
        🎁 Kutsu kaveri – saat palkkion
      </div>
      <div className="text-white/85 text-sm md:mx-2">{rewardText}</div>
      <div className="flex-1" />
      <div className="flex gap-2">
        <input
          className="w-56 md:w-72 rounded-lg bg-white/10 border border-white/20 px-3 py-2 text-sm text-white placeholder-white/50"
          value={referUrl}
          readOnly
        />
        <button
          onClick={handleCopy}
          className="rounded-lg bg-white text-blue-700 px-4 py-2 text-sm font-semibold hover:bg-white/90 active:scale-95 transition-all flex items-center gap-2"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Kopioitu!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Kopioi linkki
            </>
          )}
        </button>
      </div>
    </div>
  );
}

