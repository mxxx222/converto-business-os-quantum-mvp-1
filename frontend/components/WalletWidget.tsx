"use client";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url, { cache: "no-store" }).then(r => r.json());

export default function WalletWidget({ tenant, user }: { tenant?: string; user?: string }) {
  const base = process.env.NEXT_PUBLIC_API_BASE!;
  const t = tenant || "demo";
  const u = user || "user_demo";
  const { data } = useSWR(`${base}/api/v1/p2e/wallet?t=${t}&u=${u}`, fetcher, { refreshInterval: 15000 });
  const balance = data?.balance || 0;

  return (
    <div className="rounded-2xl border p-4 bg-gradient-to-br from-purple-50 to-white shadow">
      <div className="text-sm font-medium text-gray-600 mb-1">Token-saldo</div>
      <div className="text-3xl font-bold text-purple-700">{balance} CT</div>
      <div className="text-xs text-gray-500 mt-2">CT = Converto Tokens (off-chain)</div>
      <div className="text-xs text-gray-400 mt-1">Ansaitse tokeneita → Lunasta palkintoja</div>
    </div>
  );
}

