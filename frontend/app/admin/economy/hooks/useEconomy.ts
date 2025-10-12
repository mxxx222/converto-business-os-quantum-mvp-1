import useSWR from "swr";

const fetcher = (url: string) => fetch(url, { cache: "no-store" }).then((r) => r.json());

type Weight = {
  event: string;
  points: number;
  multiplier: number;
  streak_bonus: number;
  active: boolean;
};

export function useEconomy() {
  const base = process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000";

  const { data, error, mutate } = useSWR<Weight[]>(
    `${base}/api/v1/economy/weights`,
    fetcher,
    { refreshInterval: 30000 }
  );

  async function saveWeight(weight: Weight) {
    try {
      const res = await fetch(`${base}/api/v1/economy/weights`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(weight),
      });

      if (!res.ok) {
        throw new Error("Failed to save weight");
      }

      mutate(); // Refresh data
      return true;
    } catch (e) {
      console.error("Save weight error:", e);
      return false;
    }
  }

  async function deleteWeight(event: string) {
    try {
      const res = await fetch(`${base}/api/v1/economy/weights/${encodeURIComponent(event)}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete weight");
      }

      mutate(); // Refresh data
      return true;
    } catch (e) {
      console.error("Delete weight error:", e);
      return false;
    }
  }

  return {
    weights: data || [],
    isLoading: !data && !error,
    error,
    saveWeight,
    deleteWeight,
    refresh: mutate,
  };
}
