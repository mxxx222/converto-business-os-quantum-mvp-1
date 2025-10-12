export function formatDate(ts: number | string) {
  return new Date(Number(ts) * 1000).toLocaleDateString("fi-FI");
}

export function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat("fi-FI", { style: "currency", currency }).format(amount / 100);
}

