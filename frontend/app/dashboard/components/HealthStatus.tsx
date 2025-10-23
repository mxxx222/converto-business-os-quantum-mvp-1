"use client";
import React, { useEffect, useState } from "react";

type Health = { status?: string };

export default function HealthStatus() {
  const [health, setHealth] = useState<Health | null>(null);
  const [error, setError] = useState<string | null>(null);
  const base = process.env.NEXT_PUBLIC_API_BASE || "";

  useEffect(() => {
    const ctrl = new AbortController();
    async function run() {
      try {
        setError(null);
        const res = await fetch(`${base}/api/v2/health`, { signal: ctrl.signal });
        if (!res.ok) throw new Error(`${res.status}`);
        setHealth(await res.json());
      } catch (e: any) {
        setError(e?.message || "fetch failed");
      }
    }
    run();
    return () => ctrl.abort();
  }, [base]);

  const ok = health?.status === "ok";

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-gray-900">API Health</h3>
        <span className={`inline-flex items-center gap-2 text-sm ${ok ? "text-green-700" : "text-red-700"}`}>
          <span className={`w-2.5 h-2.5 rounded-full ${ok ? "bg-green-500" : "bg-red-500"}`} />
          {ok ? "Healthy" : "Unreachable"}
        </span>
      </div>
      <p className="text-gray-600 text-sm break-all">Base: {base || "(not set)"}</p>
      {error && <p className="text-sm text-red-600 mt-2">Error: {error}</p>}
    </div>
  );
}
