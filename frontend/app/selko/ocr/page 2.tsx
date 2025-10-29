"use client";
import { useState } from "react";
import { OCRDropzone, OCRHotkeys, OCRPreview, OCRRecent } from "@/modules/ocr";
import { ProviderChip, PrivacyChip, LatencyChip, ConfidenceChip } from "@/components/StatusChips";
import { QuickReplies } from "@/components/QuickReplies";

export default function OCRPage() {
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState<any>(null);

  return (
    <div className="mx-auto max-w-6xl p-6 space-y-6">
      {/* Status Chips */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ProviderChip provider="OpenAI" />
          <PrivacyChip privacy="Private" />
          <LatencyChip latency="Fast" />
        </div>
        <ConfidenceChip confidence="94%" />
      </div>

      {/* Hero */}
      <header className="rounded-2xl p-8 bg-gradient-to-br from-indigo-600 via-fuchsia-600 to-cyan-500 text-white shadow-2xl">
        <h1 className="text-3xl font-bold mb-2">OCR AI – Kuitit</h1>
        <p className="text-white/90">
          Shift+O avaa skannauksen • Shift+S viimeisin • Shift+R uudelleen
        </p>
      </header>

      <OCRHotkeys />

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main area */}
        <div className="lg:col-span-2 space-y-6">
          {!open ? (
            <button
              className="px-6 py-3 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 font-medium text-lg"
              onClick={() => setOpen(true)}
            >
              📸 Avaa skannaus (tai paina Shift+O)
            </button>
          ) : (
            <OCRDropzone onDrop={(files) => console.log('Files dropped:', files)} />
          )}

          {result && (
            <OCRPreview image="placeholder.jpg" />
          )}
        </div>

        {/* Sidebar */}
        <aside>
          <OCRRecent recent={['Recent scan 1', 'Recent scan 2']} />
        </aside>
      </section>

      {/* Quick Replies (mobile) */}
      <div className="mt-3 md:hidden">
        <QuickReplies 
          replies={['📸 Kuitti', '🧾 ALV', '💾 Backup', '⚙️ Asetukset']}
          onReply={(reply) => console.log('Reply:', reply)}
        />
      </div>
    </div>
  );
}
