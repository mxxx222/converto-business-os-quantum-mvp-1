"use client";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url, { cache: "no-store" }).then(r => r.json());

export default function GamifyCard({ tenant }: { tenant?: string }) {
  const base = process.env.NEXT_PUBLIC_API_BASE!;
  const qs = tenant ? `?tenant_id=${encodeURIComponent(tenant)}` : "";
  const { data } = useSWR(`${base}/api/v1/gamify/summary${qs}`, fetcher, { refreshInterval: 20000 });
  const total = data?.total || 0;
  const series = (data?.series || []).slice(-7);
  return (
    <div className="rounded-2xl border p-4 bg-white/70 backdrop-blur">
      <div className="text-sm font-medium text-gray-600">Gamify – Viikon pisteet</div>
      <div className="mt-1 text-2xl font-semibold">{total} p</div>
      <div className="mt-3 flex gap-1 items-end h-16">
        {series.map((d: any, i: number) => (
          <div key={i} title={`${d.day}: ${d.points}p`} className="flex-1 bg-black/10" style={{ height: Math.max(4, Math.min(56, d.points)) }} />
        ))}
      </div>
      <div className="mt-3 text-xs text-gray-500">OCR-kuvat ajoissa → +10p, ALV ajoissa → +20p</div>
    </div>
  );
}


