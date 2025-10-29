"use client";
import { useState } from "react";
import { RefreshCw } from "lucide-react";

export default function LegalSyncButton({ onSync }: { onSync?: () => void }) {
  const [loading, setLoading] = useState(false);

  async function handleSync() {
    setLoading(true);
    try {
      const base = process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000";
      const res = await fetch(`${base}/api/v1/legal/sync`, { method: "POST" });
      if (!res.ok) throw new Error("Sync failed");
      const data = await res.json();
      alert(`✅ Synkronoitu ${data.total} sääntöä!`);
      if (onSync) onSync();
    } catch (e: any) {
      alert("❌ Virhe: " + e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleSync}
      disabled={loading}
      className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-md disabled:opacity-50"
    >
      <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
      {loading ? "Synkronoidaan..." : "Päivitä lakitietokanta"}
    </button>
  );
}
