"use client";
import { useEffect, useState } from "react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url, { cache: "no-store" }).then(r => r.json());

export default function GamifyWidget({ tenant }: { tenant?: string }) {
  const base = process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000";
  const qs = tenant ? `?tenant_id=${encodeURIComponent(tenant)}` : "";
  const { data } = useSWR(`${base}/api/v1/gamify/summary${qs}`, fetcher, { refreshInterval: 20000 });
  const [bonus, setBonus] = useState(0);

  useEffect(() => {
    // demo: +20p bonus when user visits billing
    const b = Math.floor(Math.random() * 20);
    setBonus(b);
  }, []);

  const points = (data?.total || 0) + bonus;
  const nextLevel = 200;
  const progress = Math.min(100, (points / nextLevel) * 100);

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-200 rounded-xl shadow-sm p-4">
      <h3 className="font-semibold mb-1">Gamify Status</h3>
      <p className="text-sm text-gray-600 mb-3">Säästöseikkailija</p>
      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
        <div className="bg-indigo-600 h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
      </div>
      <p className="text-xs text-gray-500 mb-3">Pisteet: {points} / {nextLevel}</p>
      <div className="text-sm text-indigo-700 font-medium">💡 Seuraava taso: "AI Guru" (200p)</div>
      {bonus > 0 && <p className="text-xs text-green-600 mt-2">+{bonus}p Billing-bonus tästä vierailusta!</p>}
    </div>
  );
}
