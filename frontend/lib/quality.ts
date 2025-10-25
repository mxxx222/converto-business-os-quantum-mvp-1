import type { ParsedReceipt, VATRate } from "./types";

const ALLOWED: VATRate[] = [0, 10, 14, 24, 25.5];

export function assessQuality(pr: ParsedReceipt) -> { score: number; checks: { dateOk: boolean; supplierOk: boolean; totalsOk: boolean; vatRatesOk: boolean } } {
  const dateOk = !Number.isNaN(new Date(pr.date).getTime());
  const supplierOk = pr.supplier?.trim().length >= 2;
  const sum = pr.lines.reduce((a, l) => a + l.total * l.qty, 0);
  const totalsOk = Math.abs(sum - pr.grossTotal) < 0.02;
  const vatRatesOk = pr.lines.every(l => ALLOWED.includes(l.vatRate));
  const score = (dateOk ? 20 : 0) + (supplierOk ? 15 : 0) + (totalsOk ? 50 : 0) + (vatRatesOk ? 15 : 0);
  return { score, checks: { dateOk, supplierOk, totalsOk, vatRatesOk } };
}
