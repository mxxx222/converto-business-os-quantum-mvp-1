import { NextResponse } from "next/server";
import { listReceipts, approveReceipt, setProcessingMeta } from "@/lib/uploads";
import { getOCR } from "@/lib/ocr/provider";
import { parseTextToReceipt } from "@/lib/ocr";
import { assessQuality } from "@/lib/quality";

export const runtime = "nodejs";

export async function POST(): Promise<NextResponse> {
  const queued = listReceipts().filter(r => r.status === "queued");
  const primary = getOCR();
  const p = 3;
  const chunks = Array.from({ length: Math.ceil(queued.length / p) }, (_, i) => queued.slice(i * p, i * p + p));
  const results: Array<{ id: string; ok: boolean; provider: string; fallback: boolean; ms: number } | { ok: boolean; error: string }> = [];

  for (const chunk of chunks) {
    const part = await Promise.allSettled(chunk.map(async (r) => {
      const t0 = Date.now();
      try {
        const text = await primary.impl.extractText(Buffer.from([]));
        const parsed = await parseTextToReceipt(text);
        const ms = Date.now() - t0;
        approveReceipt(r.id, parsed);
        setProcessingMeta(r.id, { provider: primary.name, fallbackUsed: false, extractionMs: ms, at: new Date().toISOString() });
        const it = listReceipts().find(x => x.id === r.id);
        if (it) it.quality = assessQuality(parsed);
        return { id: r.id, ok: true, provider: primary.name, fallback: false, ms };
      } catch {
        if (primary.name !== "tesseract") {
          const { TesseractAdapter } = await import("@/lib/ocr/adapters/tesseract");
          const t1 = Date.now();
          const text = await new TesseractAdapter().extractText(Buffer.from([]));
          const parsed = await parseTextToReceipt(text);
          const ms = Date.now() - t1;
          approveReceipt(r.id, parsed);
          setProcessingMeta(r.id, { provider: "tesseract", fallbackUsed: true, extractionMs: ms, at: new Date().toISOString() });
          const it = listReceipts().find(x => x.id === r.id);
          if (it) it.quality = assessQuality(parsed);
          return { id: r.id, ok: true, provider: "tesseract", fallback: true, ms };
        }
        return { id: r.id, ok: false, provider: primary.name, fallback: false, ms: Date.now() - t0 };
      }
    }));
    for (const r of part) results.push(r.status === "fulfilled" ? r.value : { ok: false, error: String(r.reason) });
  }
  return NextResponse.json({ ok: true, results });
}
