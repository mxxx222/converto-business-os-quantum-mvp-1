"use client";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url, { cache: "no-store" }).then(r => r.json());

export function useBilling(customerId: string) {
  const base = process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000";
  const { data: invoices, isLoading: invoicesLoading } = useSWR(
    `${base}/api/v1/billing/invoices?customer=${customerId}`,
    fetcher,
    { refreshInterval: 30000 }
  );
  const { data: subscription, isLoading: subLoading } = useSWR(
    `${base}/api/v1/billing/subscription?customer=${customerId}`,
    fetcher,
    { refreshInterval: 30000 }
  );
  return { invoices: invoices || [], subscription, loading: invoicesLoading || subLoading };
}

