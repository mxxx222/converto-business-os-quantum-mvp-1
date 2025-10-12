"use client";
import { formatDate, formatCurrency } from "../utils/format";

type Invoice = {
  id: string;
  created: number;
  status: string;
  amount_due: number;
  currency: string;
  pdf?: string;
};

export default function BillingHistory({ invoices }: { invoices: Invoice[] }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-800">Laskuhistoria</h3>
        <a
          href={`${process.env.NEXT_PUBLIC_API_BASE}/api/v1/ocr/results.csv?tenant_id=demo`}
          className="text-sm text-indigo-600 hover:underline font-medium"
        >
          Lataa CSV
        </a>
      </div>
      {invoices.length === 0 ? (
        <p className="text-sm text-gray-500 py-4">Ei vielä laskuja.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50 text-gray-600">
                <th className="py-3 px-4 text-left font-semibold">Päivämäärä</th>
                <th className="py-3 px-4 text-left font-semibold">Status</th>
                <th className="py-3 px-4 text-left font-semibold">Summa</th>
                <th className="py-3 px-4 text-left font-semibold">PDF</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv, i) => (
                <tr key={inv.id} className={`border-b hover:bg-gray-50 transition ${i % 2 ? "bg-gray-50/40" : ""}`}>
                  <td className="py-3 px-4">{formatDate(inv.created)}</td>
                  <td className="py-3 px-4 capitalize">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                        inv.status === "paid" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-medium">{formatCurrency(inv.amount_due, inv.currency)}</td>
                  <td className="py-3 px-4">
                    {inv.pdf ? (
                      <a href={inv.pdf} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline font-medium">
                        Avaa
                      </a>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

