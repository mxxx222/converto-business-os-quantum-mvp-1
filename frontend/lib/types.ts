// VAT-kannat ja invoice
export type VATRate = 0 | 10 | 14 | 24 | 25.5;
export type InvoiceDirection = "purchase" | "sale";

export interface InvoiceItem {
  id: string;
  date: string;
  net: number;
  vatRate: VATRate;
  total: number;
  direction: InvoiceDirection;
}

// OCR-prosessointimetat ja laatu
export interface ProcessingMeta {
  provider: "vision" | "azure" | "tesseract";
  fallbackUsed: boolean;
  extractionMs: number;
  at: string;
}

export interface QualityMeta {
  score: number;
  checks: {
    dateOk: boolean;
    supplierOk: boolean;
    totalsOk: boolean;
    vatRatesOk: boolean;
  };
}

// Kuitti
export type ReceiptStatus = "queued" | "parsed" | "reviewed" | "rejected";

export interface ParsedLine {
  desc: string;
  qty: number;
  net: number;
  vatRate: VATRate;
  total: number;
}

export interface ParsedReceipt {
  date: string;
  supplier: string;
  lines: ParsedLine[];
  currency: "EUR";
  grossTotal: number;
}

export interface ReceiptMeta {
  id: string;
  filename: string;
  size: number;
  sha256: string;
  createdAt: string;
  status: ReceiptStatus;
  parsed?: ParsedReceipt;
  processing?: ProcessingMeta;
  quality?: QualityMeta;
}
