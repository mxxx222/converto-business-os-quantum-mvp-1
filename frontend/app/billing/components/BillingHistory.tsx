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
    <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
      <h3 className="text-lg font-semibold mb-3">Laskuhistoria</h3>
      {invoices.length === 0 ? (
        <p className="text-sm text-gray-500">Ei vielä laskuja.</p>
      ) : (
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-b text-gray-600">
              <th className="py-2">Päivämäärä</th>
              <th>Status</th>
              <th>Summa</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id} className="border-b hover:bg-gray-50">
                <td className="py-2">{formatDate(inv.created)}</td>
                <td className="capitalize">{inv.status}</td>
                <td>{formatCurrency(inv.amount_due, inv.currency)}</td>
                <td>
                  {inv.pdf && (
                    <a href={inv.pdf} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">
                      PDF
                    </a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

