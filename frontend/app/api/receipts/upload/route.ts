import { NextResponse } from "next/server";
import { addReceipt, findByHash } from "@/lib/uploads";
import crypto from "node:crypto";

const MAX_SIZE = 6 * 1024 * 1024;
const ALLOWED: string[] = ["image/", "application/pdf"];

export const runtime = "nodejs";

export async function POST(req: Request): Promise<Response> {
  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "file required" }, { status: 400 });

  const size: number = file.size ?? 0;
  const type: string = file.type ?? "";
  if (size === 0 || size > MAX_SIZE) return NextResponse.json({ error: "invalid size" }, { status: 413 });
  if (!ALLOWED.some(p => type.startsWith(p))) return NextResponse.json({ error: "invalid type" }, { status: 415 });

  const buf: Buffer = Buffer.from(await file.arrayBuffer());
  const sha256: string = crypto.createHash("sha256").update(buf).digest("hex");
  const existing = findByHash(sha256);
  if (existing) return NextResponse.json({ ok: true, meta: existing, duplicate: true });

  const f = new File([buf], file.name, { type: file.type });
  const meta = await addReceipt(f);
  return NextResponse.json({ ok: true, meta, duplicate: false });
}
