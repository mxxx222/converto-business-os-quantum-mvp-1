"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type HealthStatus = "ok" | "warn" | "error";

type BackupInfo = {
  exists: boolean;
  file?: string;
  size_mb?: number;
  age_hours?: number;
};

type Health = {
  status: HealthStatus;
  metrics: Record<string, number>;
  last_backup: BackupInfo | null;
  notes: string[];
  checked_at: string;
};

export default function DataHealthCard() {
  const [health, setHealth] = useState<Health | null>(null);
  const [loading, setLoading] = useState(true);
  const [backing, setBacking] = useState(false);

  useEffect(() => {
    loadHealth();
  }, []);

  const loadHealth = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE || ""}/api/v1/standalone/health`
      );
      const data = await res.json();
      setHealth(data);
    } catch (e) {
      console.error("Health check failed:", e);
    } finally {
      setLoading(false);
    }
  };

  const runBackup = async () => {
    setBacking(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE || ""}/api/v1/standalone/backup/run`,
        { method: "POST" }
      );
      const data = await res.json();

      if (data.status === "ok") {
        alert("✅ Varmuuskopio luotu onnistuneesti!");
        loadHealth(); // Refresh
      } else {
        alert(`❌ Varmuuskopio epäonnistui:\n${data.log || "Unknown error"}`);
      }
    } catch (e) {
      alert(`❌ Virhe: ${e}`);
    } finally {
      setBacking(false);
    }
  };

  const getBadgeStyle = (status: HealthStatus) => {
    switch (status) {
      case "ok":
        return "bg-green-100 text-green-800 border-green-200";
      case "warn":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "error":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatBackupTime = (ageHours?: number) => {
    if (!ageHours) return "—";
    if (ageHours < 1) return "< 1h sitten";
    if (ageHours < 24) return `${Math.round(ageHours)}h sitten`;
    const days = Math.round(ageHours / 24);
    return `${days} pv sitten`;
  };

  if (loading) {
    return (
      <div className="rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-200 p-6 shadow-sm">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <span className="text-xl">💾</span>
          </div>
          <h3 className="font-semibold text-gray-900">Data Health</h3>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium border ${getBadgeStyle(
            health?.status || "ok"
          )}`}
        >
          {health?.status?.toUpperCase() || "—"}
        </span>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm"
        >
          <div className="text-xs text-gray-500 mb-1">📸 Kuitit</div>
          <div className="text-2xl font-bold text-gray-900">
            {health?.metrics?.receipts ?? "—"}
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm"
        >
          <div className="text-xs text-gray-500 mb-1">📄 Laskut</div>
          <div className="text-2xl font-bold text-gray-900">
            {health?.metrics?.invoices ?? "—"}
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm"
        >
          <div className="text-xs text-gray-500 mb-1">⚖️ Lakisäännöt</div>
          <div className="text-2xl font-bold text-gray-900">
            {health?.metrics?.legal_rules ?? "—"}
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm"
        >
          <div className="text-xs text-gray-500 mb-1">🎮 Gamify (7pv)</div>
          <div className="text-2xl font-bold text-gray-900">
            {health?.metrics?.gamify_events ?? "—"}
          </div>
        </motion.div>
      </div>

      {/* Backup Status */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-medium text-gray-700">
            Viimeisin varmuuskopio
          </div>
          {health?.last_backup?.exists && (
            <div className="text-xs text-gray-500">
              {health.last_backup.size_mb} MB
            </div>
          )}
        </div>
        <div className="text-lg font-semibold text-gray-900">
          {health?.last_backup?.exists
            ? formatBackupTime(health.last_backup.age_hours)
            : "Ei varmuuskopioita"}
        </div>
      </div>

      {/* Notes/Warnings */}
      {health?.notes && health.notes.length > 0 && (
        <div className="mb-4 space-y-2">
          {health.notes.map((note, i) => (
            <div
              key={i}
              className="flex items-start gap-2 text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg p-3"
            >
              <span className="text-base">⚠️</span>
              <span>{note}</span>
            </div>
          ))}
        </div>
      )}

      {/* Action Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={runBackup}
        disabled={backing}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-medium hover:from-indigo-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
      >
        {backing ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="animate-spin h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Luodaan...
          </span>
        ) : (
          "💾 Ota varmuuskopio nyt"
        )}
      </motion.button>

      {/* Last checked */}
      <div className="mt-3 text-xs text-center text-gray-400">
        Tarkistettu: {health?.checked_at ? new Date(health.checked_at).toLocaleTimeString("fi-FI") : "—"}
      </div>
    </motion.div>
  );
}
