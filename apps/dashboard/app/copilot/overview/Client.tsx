"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";

type Cfg = { threshold: "info"|"warn"|"critical"; suppressWindowSec: number; provider: "slack"|"webhook" };
type Status = { count: number; lastResetAt: string | null };

export default function CoPilotGlobalOverviewClient({ isAdmin }: { isAdmin: boolean }) {
  const [cfg, setCfg] = useState<Cfg | null>(null);
  const [status, setStatus] = useState<Status | null>(null);

  async function refreshStatus() {
    const s = await fetch("/api/alerts/status").then(r=>r.json());
    setStatus(s);
  }

  useEffect(() => {
    fetch("/api/alerts/config").then(r=>r.json()).then(setCfg);
    refreshStatus();
  }, []);

  const resetDedupe = async () => {
    const ok = (await fetch("/api/alerts/notify?reset=true", { method: "DELETE" })).ok;
    if (ok) { await refreshStatus(); toast.success("Dedupe cache tyhjennetty"); }
    else { toast.error("Reset epäonnistui"); }
  };

  return (
    <motion.div className="min-h-screen p-6 bg-gradient-to-b from-[#0F172A] via-[#111827] to-[#020617] text-gray-100" initial={{opacity:0}} animate={{opacity:1}}>
      <header className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-[#3B82F6]">Global Co-pilot Overview</h1>
      </header>

      {cfg && (
        <div className="mb-4 text-xs bg-[#0F172A]/70 border border-[#1E3A8A]/40 text-gray-300 px-3 py-2 rounded flex items-center">
          🔔 Hälytyskynnys: {cfg.threshold} • Suppress: {cfg.suppressWindowSec} s • Provider: {cfg.provider === 'slack' ? 'Slack' : 'Webhook'}
          {status?.count > 0 && (
            <span className="ml-2 px-2 py-[1px] text-[10px] rounded bg-[#16A34A]/30 text-[#16A34A]">Operational</span>
          )}
          {isAdmin && (
            <button onClick={resetDedupe} className="ml-2 px-2 py-[1px] text-[10px] rounded bg-[#9333EA]/30 text-[#E9D5FF] hover:bg-[#9333EA]/50">Reset dedupe</button>
          )}
        </div>
      )}

      <div className="text-sm text-gray-400">Lisää globaalit komponentit tähän (kartta, tenant‑listat jne.).</div>
    </motion.div>
  )
}


