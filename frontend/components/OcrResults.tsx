"use client";
import { useOcrResults } from "@/hooks/useOcrResults";
import { useMemo } from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export default function OcrResults({ tenant }: { tenant?: string }) {
  const { data, isLoading } = useOcrResults(tenant);

  const chartData = useMemo(() => (data ?? []).slice(0, 30).reverse().map((r: any) => ({
    id: r.id,
    date: new Date(r.created_at).toLocaleDateString(),
    wh: r.wh,
    watts: r.rated_watts,
    conf: Math.round((r.confidence ?? 0) * 100),
  })), [data]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Tulokset" value={data?.length ?? 0} />
        <Stat label="Kesk. teho (W)" value={avg(data, "rated_watts")} />
        <Stat label="Kesk. energia (Wh)" value={avg(data, "wh")} />
        <Stat label="Luottamus (%)" value={avgPct(data, "confidence")} />
      </div>

      <div className="rounded-2xl border p-4 bg-white/70 backdrop-blur">
        <div className="mb-2 text-sm font-medium text-gray-500">Viimeisimmät analyysit</div>
        <div className="h-64">
          {isLoading ? (
            <div className="animate-pulse h-full rounded-lg bg-gray-100" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopOpacity={0.3}/>
                    <stop offset="95%" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" hide />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="wh" strokeOpacity={1} fillOpacity={1} fill="url(#g1)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {(data ?? []).slice(0, 12).map((r: any) => (
          <div key={r.id} className="rounded-2xl border p-4 bg-white/70 backdrop-blur">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold">{r.device_type || "Laite"}</div>
              <span className="text-xs text-gray-500">{new Date(r.created_at).toLocaleString()}</span>
            </div>
            <div className="mt-2 text-sm text-gray-600">{r.brand_model || "—"}</div>
            <div className="mt-3 flex gap-4 text-sm">
              <Badge label="W" value={r.rated_watts} />
              <Badge label="Wh" value={r.wh} />
              <Badge label="Conf" value={`${Math.round((r.confidence ?? 0)*100)}%`} />
            </div>
            <a
              href={`${process.env.NEXT_PUBLIC_API_BASE}/api/v1/ocr/results/${r.id}`}
              target="_blank" rel="noreferrer"
              className="mt-3 inline-block text-xs underline text-blue-600"
            >
              Näytä raakadata
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number|string }) {
  return (
    <div className="rounded-2xl border p-4 bg-white/70 backdrop-blur">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="mt-1 text-2xl font-semibold">{formatNum(value)}</div>
    </div>
  );
}
function Badge({ label, value }: { label: string; value: any }) {
  return (
    <div className="rounded-full border px-2 py-1 bg-white text-gray-700">
      <span className="font-medium">{label}</span>&nbsp;{String(value ?? "—")}
    </div>
  );
}
function avg(list: any[] = [], key: string) {
  if (!list.length) return 0;
  const vals = list.map((x:any)=>x[key]).filter((n:number)=>Number.isFinite(n));
  if (!vals.length) return 0;
  return Math.round(vals.reduce((a:number,b:number)=>a+b,0)/vals.length);
}
function avgPct(list: any[] = [], key: string) {
  if (!list.length) return 0;
  const vals = list.map((x:any)=>x[key]).filter((n:number)=>Number.isFinite(n));
  if (!vals.length) return 0;
  return Math.round(100*vals.reduce((a:number,b:number)=>a+b,0)/vals.length);
}
function formatNum(v:any){ return typeof v==="number" ? v.toLocaleString("fi-FI") : v; }


