import type { InvoiceItem } from "./types";

export function vatLiability(items: InvoiceItem[]): number {
  return items.reduce((sum, item) => {
    const vatAmount = item.total - item.net;
    return sum + vatAmount;
  }, 0);
}

export function detectMismatches(items: InvoiceItem[]): Array<{ id: string; date: string; vatRate: number }> {
  const mismatches: Array<{ id: string; date: string; vatRate: number }> = [];

  items.forEach(item => {
    // Check for common VAT rate mismatches
    if (item.vatRate === 14 && (item.date.includes('2024') || item.date.includes('2025'))) {
      mismatches.push({
        id: item.id,
        date: item.date,
        vatRate: item.vatRate
      });
    }
  });

  return mismatches;
}
