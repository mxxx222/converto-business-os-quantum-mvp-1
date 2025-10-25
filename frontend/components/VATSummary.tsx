"use client";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { detectMismatches, vatLiability } from "@/lib/vat";
import { receiptToInvoiceItems } from "@/lib/receipt-map";
import { useMemo, useState } from "react";

export default function VATSummary(): JSX.Element {
  const { data: invoices } = useQuery({ queryKey: ["invoices"], queryFn: api.getReceipts });
  const { data: receipts } = useQuery({ queryKey: ["receipts"], queryFn: api.getReceipts });
  const baseItems = invoices ?? [];
  const approvedItems = useMemo(() => {
    const approved = (receipts ?? []).filter(r => r.status === "reviewed" && r.parsed);
    return approved.flatMap(r => receiptToInvoiceItems(r.parsed!, "purchase"));
  }, [receipts]);

  const baseLiab = useMemo(() => vatLiability(baseItems), [baseItems]);
  const combinedLiab = useMemo(() => vatLiability([...baseItems, ...approvedItems]), [baseItems, approvedItems]);
  const delta = +(combinedLiab - baseLiab).toFixed(2);

  const mismatches = useMemo(() => detectMismatches(baseItems), [baseItems]);
  const [fixed, setFixed] = useState<boolean>(false);

  return (
    <div className="space-y-3">
      <div className="rounded-2xl border bg-white p-4 shadow-sm dark:bg-neutral-900 dark:border-neutral-800">
        <p className="text-sm text-neutral-500">ALV-velka (perus – laskut)</p>
        <div className="mt-1 text-2xl font-semibold">€ {baseLiab.toFixed(2)}</div>
      </div>
      <div className="rounded-2xl border bg-white p-4 shadow-sm dark:bg-neutral-900 dark:border-neutral-800">
        <div className="flex items-center justify-between">
          <p className="text-sm text-neutral-500">ALV-ennakko (sis. hyväksytyt kuitit)</p>
          <span className="text-xs rounded-lg border px-2 py-1">{approvedItems.length} riviä</span>
        </div>
        <div className="mt-1 text-2xl font-semibold">€ {combinedLiab.toFixed(2)}</div>
        <div className={`mt-1 text-xs ${delta <= 0 ? "text-emerald-600" : "text-rose-600"}`}>Δ € {delta.toFixed(2)} ({delta <= 0 ? "vähenee" : "kasvaa"})</div>
      </div>
      <div className="rounded-2xl border bg-white p-4 shadow-sm dark:bg-neutral-900 dark:border-neutral-800">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Siirtymävirheet</h2>
          <button className="rounded-xl border px-3 py-2 text-sm" onClick={() => setFixed(true)} disabled={fixed || mismatches.length === 0}>Massakorjaus</button>
        </div>
        {mismatches.length === 0 ? (
          <p className="text-sm text-neutral-500 mt-2">Ei havaittuja virheitä</p>
        ) : (
          <ul className="mt-2 space-y-1 text-sm">
            {mismatches.map(m => (
              <li key={m.id} className="flex justify-between">
                <span>{m.id} • {m.date} • {m.vatRate}%</span>
                <span>→ 24%/25.5% sääntö</span>
              </li>
            ))}
          </ul>
        )}
        {fixed && (
          <div className="mt-2 rounded-lg bg-emerald-50 text-emerald-900 p-2 text-sm" role="status" aria-live="polite">
            Korjattu! (demo-tila – sovella reducerilla oikeasti)
          </div>
        )}
      </div>
    </div>
  );
}
