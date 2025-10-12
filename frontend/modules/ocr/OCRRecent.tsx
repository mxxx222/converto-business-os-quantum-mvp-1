"use client";
import useSWR from "swr";

const f = (u: string) => fetch(u).then((r) => r.json());

export default function OCRRecent() {
  const { data } = useSWR(
    `${process.env.NEXT_PUBLIC_API_BASE}/api/v1/ocr/recent?tenant_id=t_demo`,
    f,
    { refreshInterval: 10000 }
  );
  const items = data?.items || [];

  return (
    <div className="rounded-2xl border border-gray-200 p-4 bg-white shadow">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Viimeisimmät skannaukset</h3>
        <span className="text-xs text-gray-500">{items.length} kpl</span>
      </div>
      <ul className="space-y-2 text-sm">
        {items.map((r: any) => (
          <li key={r.id} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
            <div>
              <div className="font-medium text-gray-800">{r.data?.merchant || "–"}</div>
              <div className="text-xs text-gray-500">{r.data?.date || "–"}</div>
            </div>
            <span className="text-gray-700 font-medium">{r.data?.total ? `${r.data.total} €` : ""}</span>
          </li>
        ))}
        {!items.length && <li className="text-gray-500 py-2">Ei vielä kuitteja.</li>}
      </ul>
    </div>
  );
}

