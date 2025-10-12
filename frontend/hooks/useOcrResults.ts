"use client";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url, { cache: "no-store" }).then(r => r.json());

export function useOcrResults(tenant?: string) {
  const base = process.env.NEXT_PUBLIC_API_BASE!;
  const qs = tenant ? `?tenant_id=${encodeURIComponent(tenant)}` : "";
  const { data, error, isLoading, mutate } = useSWR(`${base}/api/v1/ocr/results${qs}`, fetcher, { refreshInterval: 15000 });
  return { data: (data ?? []) as any[], error, isLoading, mutate };
}


