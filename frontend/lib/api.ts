import type { ReceiptMeta } from "./types";

export const api = {
  async getReceipts(): Promise<ReceiptMeta[]> {
    const r = await fetch("/api/receipts", { cache: "no-store" });
    const j = await r.json();
    return j.items ?? [];
  },
  async getInvoices(): Promise<ReceiptMeta[]> {
    return this.getReceipts();
  },
  async uploadReceipt(file: File): Promise<{ meta: ReceiptMeta; duplicate: boolean }> {
    const fd = new FormData();
    fd.set("file", file, file.name);
    const r = await fetch("/api/receipts/upload", { method: "POST", body: fd });
    if (!r.ok) throw new Error("upload failed");
    const j = await r.json();
    return { meta: j.meta as ReceiptMeta, duplicate: Boolean(j.duplicate) };
  },
  async processReceipt(id: string): Promise<any> {
    const r = await fetch(`/api/receipts/process/${id}`, { method: "POST" });
    if (!r.ok) throw new Error("process failed");
    return r.json();
  },
  async processAllReceipts(): Promise<any> {
    const r = await fetch(`/api/receipts/process-all`, { method: "POST" });
    if (!r.ok) throw new Error("process-all failed");
    return r.json();
  },
  async deleteReceipt(id: string): Promise<any> {
    const r = await fetch(`/api/receipts/${id}`, { method: "DELETE" });
    if (!r.ok) throw new Error("delete failed");
    return r.json();
  },
  async restoreReceipt(id: string): Promise<any> {
    const r = await fetch(`/api/receipts/${id}/restore`, { method: "POST" });
    if (!r.ok) throw new Error("restore failed");
    return r.json();
  },
};
