import crypto from "node:crypto";
import type { ReceiptMeta, ParsedReceipt, ProcessingMeta } from "./types";

const store: ReceiptMeta[] = [];
const trash = new Map<string, { meta: ReceiptMeta; buf?: Buffer; ts: number }>();

export function listReceipts() {
  return store.slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function findByHash(sha256: string) {
  return store.find(s => s.sha256 === sha256) ?? null;
}

export async function addReceipt(file: File): Promise<ReceiptMeta> {
  const buf = Buffer.from(await file.arrayBuffer());
  const sha256 = crypto.createHash("sha256").update(buf).digest("hex");
  const existing = store.find(s => s.sha256 === sha256);
  if (existing) return existing;
  const id = sha256.slice(0, 12);
  const meta: ReceiptMeta = {
    id,
    filename: file.name ?? "upload",
    size: buf.length,
    sha256,
    createdAt: new Date().toISOString(),
    status: "queued"
  };
  // @ts-ignore keep buffer in dev
  meta.__buf = buf;
  store.push(meta);
  return meta;
}

export function removeReceipt(id: string) {
  const idx = store.findIndex(s => s.id === id);
  if (idx === -1) return null;
  const [meta] = store.splice(idx, 1);
  // @ts-ignore
  const buf: Buffer | undefined = meta.__buf;
  trash.set(id, { meta, buf, ts: Date.now() });
  return meta;
}

export function restoreReceipt(id: string) {
  const rec = trash.get(id);
  if (!rec) return null;
  trash.delete(id);
  // @ts-ignore
  if (rec.buf) rec.meta.__buf = rec.buf;
  store.push(rec.meta);
  return rec.meta;
}

export function setParsed(id: string, parsed: ParsedReceipt, meta?: any) {
  const it = store.find(s => s.id === id);
  if (!it) return;
  it.status = "parsed";
  it.parsed = parsed;
  // @ts-ignore
  it.meta = meta ?? it.meta;
}

export function setStatus(id: string, status: ReceiptMeta["status"]) {
  const it = store.find(s => s.id === id);
  if (it) it.status = status;
}

export function setProcessingMeta(id: string, meta: ProcessingMeta) {
  const it = store.find(s => s.id === id);
  if (it) it.processing = meta;
}

export function approveReceipt(id: string, parsed: ParsedReceipt) {
  const it = store.find(s => s.id === id);
  if (!it) return false;
  it.parsed = parsed;
  it.status = "reviewed";
  return true;
}

export function getBuffer(id: string): Buffer | null {
  const it = store.find(s => s.id === id);
  return it?.__buf ?? null;
}

export function purgeTrash(olderThanMs = 10 * 60 * 1000) {
  const now = Date.now();
  for (const [id, v] of trash.entries())
    if (now - v.ts > olderThanMs) trash.delete(id);
}
