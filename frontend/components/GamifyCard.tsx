"use client";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url, { cache: "no-store" }).then(r => r.json());

export default function GamifyCard({ tenant, user }: { tenant?: string; user?: string }) {
  const base = process.env.NEXT_PUBLIC_API_BASE!;
  const params = new URLSearchParams();
  if (tenant) params.set("tenant_id", tenant);
  if (user) params.set("user_id", user);
  params.set("days", "7");
  const { data } = useSWR(`${base}/api/v1/gamify/summary?${params}`, fetcher, { refreshInterval: 20000 });
  const total = data?.total || 0;
  const series = (data?.series || []).slice(-7);
  const streak = data?.streak_days || 0;
  const streakBonus = data?.streak_bonus || 0;
  const nextLevel = 200;
  const progress = Math.min(100, (total / nextLevel) * 100);

  return (
    <div className="rounded-2xl border p-4 bg-white/70 backdrop-blur shadow">
      <div className="text-sm font-medium text-gray-600 mb-1">Gamify – Viikon pisteet</div>
      <div className="flex items-baseline gap-2 mb-2">
        <div className="text-2xl font-semibold">{total} p</div>
        {streak > 0 && <div className="text-sm text-orange-600 font-medium">🔥 {streak}d</div>}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-1.5 mb-3">
        <div className="bg-blue-600 h-1.5 rounded-full transition-all" style={{ width: `${progress}%` }} />
      </div>
      <div className="flex gap-1 items-end h-16 mb-3">
        {series.map((pts: number, i: number) => {
          const h = Math.max(4, Math.min(64, pts));
          return <div key={i} title={`${pts}p`} className="flex-1 bg-blue-400/70 rounded-sm" style={{ height: `${h}px` }} />;
        })}
      </div>
      <div className="text-xs text-gray-500 mb-2">
        OCR +10p • ALV +20p • Lasku ajoissa +15p
        {streakBonus > 0 && <span className="text-orange-600 font-medium ml-2">+ Streak bonus: {streakBonus}p</span>}
      </div>
      <div className="text-xs text-gray-700 font-medium">💡 Seuraava taso: {nextLevel}p (AI Guru)</div>
    </div>
  );
}


