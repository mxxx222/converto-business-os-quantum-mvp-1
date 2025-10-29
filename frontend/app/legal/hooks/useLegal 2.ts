"use client";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useLegal(domain?: string) {
  const base = process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000";
  const url = domain
    ? `${base}/api/v1/legal/rules?domain=${domain}`
    : `${base}/api/v1/legal/rules`;

  const { data, error, mutate } = useSWR(url, fetcher, { refreshInterval: 60000 });

  return {
    rules: data || [],
    loading: !data && !error,
    error,
    refresh: mutate,
  };
}
