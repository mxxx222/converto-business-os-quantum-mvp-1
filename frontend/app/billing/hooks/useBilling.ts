import useSWR from "swr";

const fetcher = (url: string) => fetch(url, { cache: "no-store" }).then((r) => r.json());

export function useBilling(customerId: string) {
  const base = process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000";

  const { data: invoicesData, error: invoicesError } = useSWR(
    customerId ? `${base}/api/v1/billing/invoices?customer=${customerId}` : null,
    fetcher,
    { refreshInterval: 60000 }
  );

  const { data: subscriptionData, error: subscriptionError } = useSWR(
    customerId ? `${base}/api/v1/billing/subscription?customer=${customerId}` : null,
    fetcher,
    { refreshInterval: 30000 }
  );

  return {
    invoices: invoicesData || [],
    subscription: subscriptionData || null,
    loading: !invoicesData && !subscriptionData && !invoicesError && !subscriptionError,
    error: invoicesError || subscriptionError,
  };
}
