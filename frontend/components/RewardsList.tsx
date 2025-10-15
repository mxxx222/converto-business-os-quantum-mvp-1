"use client";
import { useState } from "react";
import useSWR from "swr";
import RedeemModal from "./RedeemModal";

const fetcher = (url: string) => fetch(url, { cache: "no-store" }).then(r => r.json());

type Reward = {
  id: string;
  name: string;
  desc?: string;
  sponsor?: string;
  points_cost: number;
  stock: number;
  terms_url?: string;
};

export default function RewardsList({ tenant }: { tenant?: string }) {
  const base = process.env.NEXT_PUBLIC_API_BASE;
  const t = tenant || "demo";
  const { data, error, mutate } = useSWR(
    base ? `${base}/api/v1/rewards/catalog?tenant_id=${t}` : null,
    fetcher,
    { refreshInterval: 30000, fallbackData: [] }
  );
  const rewards: Reward[] = Array.isArray(data) ? data : [];
  const [selected, setSelected] = useState<Reward | null>(null);

  const handleRedeemSuccess = () => {
    mutate(); // Refresh catalog after redeem
    setSelected(null);
  };

  return (
    <div className="rounded-2xl border p-4 bg-white/70 backdrop-blur shadow">
      <div className="text-sm font-medium text-gray-700 mb-3">🎁 Palkintokatalog</div>
      {rewards.length === 0 ? (
        <p className="text-sm text-gray-500">Ei palkintoja saatavilla.</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          {rewards.map((r) => (
            <div
              key={r.id}
              className="rounded-xl bg-gradient-to-br from-white to-gray-50 p-4 border border-gray-200 flex flex-col justify-between shadow-sm hover:shadow-md transition"
            >
              <div>
                <div className="font-semibold text-gray-800">{r.name}</div>
                {r.desc && <div className="text-xs text-gray-600 mt-1">{r.desc}</div>}
                {r.sponsor && (
                  <div className="text-xs text-emerald-600 font-medium mt-2">Sponsor: {r.sponsor}</div>
                )}
                <div className="text-xs text-gray-400 mt-1">Varastossa: {r.stock} kpl</div>
              </div>
              <button
                onClick={() => setSelected(r)}
                className="mt-3 py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-sm font-medium text-white transition"
              >
                Lunasta ({r.points_cost} CT)
              </button>
            </div>
          ))}
        </div>
      )}
      {selected && (
        <RedeemModal
          reward={selected}
          tenant={t}
          user="user_demo"
          onClose={() => setSelected(null)}
          onSuccess={handleRedeemSuccess}
        />
      )}
    </div>
  );
}

