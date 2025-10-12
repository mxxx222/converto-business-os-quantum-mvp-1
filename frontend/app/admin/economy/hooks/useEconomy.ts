"use client";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url, { cache: "no-store" }).then(r => r.json());

export function useEconomy() {
  const base = process.env.NEXT_PUBLIC_API_BASE!;
  const { data, mutate, isLoading } = useSWR(`${base}/api/v1/economy/weights`, fetcher);

  async function saveWeight(w: any) {
    await fetch(`${base}/api/v1/economy/weights/${w.event}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(w),
    });
    mutate();
  }

  async function deleteWeight(event: string) {
    await fetch(`${base}/api/v1/economy/weights/${event}`, { method: "DELETE" });
    mutate();
  }

  return { weights: data || [], saveWeight, deleteWeight, isLoading };
}

