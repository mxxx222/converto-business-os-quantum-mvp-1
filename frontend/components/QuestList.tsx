"use client";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url, { cache: "no-store" }).then(r => r.json());

type Quest = {
  id: string;
  code: string;
  title: string;
  desc?: string;
  reward: number;
  period: string;
};

export default function QuestList({ tenant }: { tenant?: string }) {
  const base = process.env.NEXT_PUBLIC_API_BASE;
  const t = tenant || "demo";
  const { data } = useSWR(
    base ? `${base}/api/v1/p2e/quests?tenant_id=${t}` : null,
    fetcher,
    { refreshInterval: 30000, fallbackData: [] }
  );
  const quests: Quest[] = Array.isArray(data) ? data : [];

  return (
    <div className="rounded-2xl border p-4 bg-white/70 backdrop-blur shadow">
      <div className="text-sm font-medium text-gray-700 mb-3">🎯 Tehtävät & Palkinnot</div>
      {quests.length === 0 ? (
        <p className="text-sm text-gray-500">Ei tehtäviä saatavilla.</p>
      ) : (
        <div className="space-y-2">
          {quests.map((q) => (
            <div key={q.id} className="rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 p-3 border border-blue-100">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="font-medium text-gray-800">{q.title}</div>
                  {q.desc && <div className="text-xs text-gray-600 mt-1">{q.desc}</div>}
                  <div className="text-xs text-gray-500 mt-1 capitalize">{q.period}</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-emerald-600">+{q.reward} CT</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
