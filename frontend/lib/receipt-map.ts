import type { InvoiceItem, InvoiceDirection, VATRate, ParsedReceipt } from "./types";

export function receiptToInvoiceItems(r: ParsedReceipt, direction: InvoiceDirection = "purchase"): InvoiceItem[] {
  return r.lines.map((ln, i) => {
    const id = `${r.date}-${i}`;
    const net = +(ln.net * ln.qty).toFixed(2);
    const total = +(ln.total * ln.qty).toFixed(2);
    return { id, date: r.date, net, vatRate: ln.vatRate as VATRate, total, direction };
  });
}
