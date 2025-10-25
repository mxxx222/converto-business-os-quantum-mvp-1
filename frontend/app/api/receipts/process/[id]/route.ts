import { NextResponse } from "next/server";
import { getBuffer, approveReceipt, setProcessingMeta, listReceipts } from "@/lib/uploads";
import { parseTextToReceipt } from "@/lib/ocr";
import { getOCR } from "@/lib/ocr/provider";
import { assessQuality } from "@/lib/quality";

export const runtime = "nodejs";

export async function POST(_: Request, { params }: { params: { id: string } }): Promise<NextResponse> {
  const recBuf = getBuffer(params.id);
  if (!recBuf) return NextResponse.json({ error: "not found" }, { status: 404 });

  const primary = getOCR();
  let provider = primary.name;
  let fallbackUsed = false;

  const t0 = Date.now();
  try {
    const text = await primary.impl.extractText(recBuf);
    const parsed = await parseTextToReceipt(text);
    const ms = Date.now() - t0;
    approveReceipt(params.id, parsed);
    setProcessingMeta(params.id, { provider, fallbackUsed: false, extractionMs: ms, at: new Date().toISOString() });
    const it = listReceipts().find(r => r.id === params.id);
    if (it) it.quality = assessQuality(parsed);
    return NextResponse.json({ ok: true, provider, fallbackUsed: false, parsed, status: "reviewed", quality: it?.quality });
  } catch {
    if (primary.name !== "tesseract") {
      const { TesseractAdapter } = await import("@/lib/ocr/adapters/tesseract");
      const t1 = Date.now();
      const text = await new TesseractAdapter().extractText(recBuf);
      const parsed = await parseTextToReceipt(text);
      const ms = Date.now() - t1;
      provider = "tesseract";
      fallbackUsed = true;
      approveReceipt(params.id, parsed);
      setProcessingMeta(params.id, { provider, fallbackUsed: true, extractionMs: ms, at: new Date().toISOString() });
      const it = listReceipts().find(r => r.id === params.id);
      if (it) it.quality = assessQuality(parsed);
      return NextResponse.json({ ok: true, provider, fallbackUsed: true, parsed, status: "reviewed", quality: it?.quality });
    }
    return NextResponse.json({ error: "ocr failed" }, { status: 500 });
  }
}
