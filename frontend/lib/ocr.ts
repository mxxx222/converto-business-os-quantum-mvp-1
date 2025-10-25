import type { ParsedReceipt, ParsedLine, VATRate } from "./types";

export async function parseTextToReceipt(txt: string): Promise<ParsedReceipt> {
  const date = /Päivä:\s*([0-9-]+)/i.exec(txt)?.[1] ?? new Date().toISOString().slice(0, 10);
  const supplier = /Toimittaja:\s*(.+)/i.exec(txt)?.[1]?.trim() ?? "Tuntematon";
  const lineRe = /Rivi:\s*(.+?)\s+(\d+)\s+([0-9.,]+)\s+ALV\s+([0-9.]+)/gi;
  const lines: ParsedLine[] = [];
  let m: RegExpExecArray | null;

  while ((m = lineRe.exec(txt))) {
    const [, desc, qtyStr, priceStr, vatStr] = m;
    const qty = Number(qtyStr);
    const net = Number(String(priceStr).replace(",", "."));
    const vatRate = Number(vatStr) as VATRate;
    const total = +(net * (1 + vatRate / 100)).toFixed(2);
    lines.push({ desc: desc.trim(), qty, net, vatRate, total });
  }

  const gross = lines.reduce((a, l) => a + l.total * l.qty, 0);
  return {
    date: new Date(date).toISOString().slice(0, 10),
    supplier,
    lines,
    currency: "EUR",
    grossTotal: +gross.toFixed(2),
  };
}
