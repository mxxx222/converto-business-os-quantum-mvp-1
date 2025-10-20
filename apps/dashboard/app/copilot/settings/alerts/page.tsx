"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";

type Severity = "info" | "warn" | "critical";
type Config = {
  provider: "slack" | "webhook";
  threshold: Severity;
  suppressWindowSec: number;
  webhookUrl: string;
  quietHours?: { start: string; end: string };
  rateLimitPerMin?: number;
};

type Status = { count: number; lastResetAt: string | null };

export default function AlertSettingsPage() {
  const [cfg, setCfg] = useState<Config | null>(null);
  const [status, setStatus] = useState<Status | null>(null);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    fetch("/api/alerts/config").then((r) => r.json()).then(setCfg);
    const loadStatus = () => fetch("/api/alerts/status").then((r) => r.json()).then(setStatus);
    loadStatus();
    const t = setInterval(loadStatus, 10000);
    return () => clearInterval(t);
  }, []);

  if (!cfg) return <div className="p-6">Loading…</div>;

  const save = async () => {
    try { new URL(cfg.webhookUrl); } catch { toast.error("Invalid URL"); return; }
    setSaving(true);
    await fetch("/api/alerts/config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cfg),
    });
    setSaving(false);
    toast.success("Settings saved");
  };

  const test = async () => {
    await fetch("/api/alerts/test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ severity: "critical", message: "Test alert from settings", link: "/copilot/overview" }),
    });
    toast.success("Test alert sent");
  };

  const resetToEnv = async () => {
    if (!confirm("Reset palauttaa .env‑oletukset. Jatketaanko?")) return;
    setResetting(true);
    const res = await fetch("/api/alerts/config", { method: "DELETE" });
    const envCfg = await res.json();
    setCfg(envCfg);
    setResetting(false);
    toast.success("Config reset to env defaults");
  };

  const resetDedupe = async () => {
    const res = await fetch("/api/alerts/notify?reset=true", { method: "DELETE" });
    if (res.ok) { toast.success("Dedupe cache tyhjennetty"); } else { toast.error("Reset epäonnistui"); }
  };

  return (
    <motion.div className="p-6 max-w-2xl space-y-4">
      <h1 className="text-2xl font-semibold text-[#3B82F6]">Alert Settings</h1>

      {status && (
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="px-2 py-1 rounded bg-[#0F172A]/70 border border-[#1E3A8A]/40 text-gray-300">Operational status</span>
          <span className="px-2 py-1 rounded bg-[#0F172A]/70 border border-[#1E3A8A]/40 text-gray-300">Dedupe entries: {status.count}</span>
          <span className="px-2 py-1 rounded bg-[#0F172A]/70 border border-[#1E3A8A]/40 text-gray-300">Last reset: {status.lastResetAt ? new Date(status.lastResetAt).toLocaleString("fi-FI") : "—"}</span>
        </div>
      )}

      <div className="text-xs bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 px-3 py-2 rounded">
        Reset palauttaa .env‑oletukset, tallennetut asetukset poistuvat prosessimuistista.
        <div className="mt-1 text-[11px] text-yellow-300/80">Reset dedupe cache tyhjentää hälytysduplikaattien välimuistin välittömästi ilman palvelun restarttia.</div>
      </div>

      <div className="grid grid-cols-1 gap-3 bg-[#0F172A]/80 border border-[#1E3A8A]/40 p-4 rounded-xl">
        <label className="text-sm">
          Provider
          <select className="w-full mt-1 bg-transparent border rounded p-2" value={cfg.provider} onChange={(e) => setCfg({ ...cfg, provider: e.target.value as any })}>
            <option value="slack">Slack</option>
            <option value="webhook">Webhook</option>
          </select>
        </label>
        <label className="text-sm">
          Webhook URL
          <input className="w-full mt-1 bg-transparent border rounded p-2" value={cfg.webhookUrl} onChange={(e) => setCfg({ ...cfg, webhookUrl: e.target.value })} />
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-[#0F172A]/80 border border-[#1E3A8A]/40 p-4 rounded-xl">
        <label className="text-sm">
          Threshold
          <select className="w-full mt-1 bg-transparent border rounded p-2" value={cfg.threshold} onChange={(e) => setCfg({ ...cfg, threshold: e.target.value as Severity })}>
            <option value="info">info</option>
            <option value="warn">warn</option>
            <option value="critical">critical</option>
          </select>
        </label>
        <label className="text-sm">
          Suppress window (sec)
          <input type="number" min={0} max={3600} className="w-full mt-1 bg-transparent border rounded p-2" value={cfg.suppressWindowSec} onChange={(e) => setCfg({ ...cfg, suppressWindowSec: Number(e.target.value) })} />
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-[#0F172A]/80 border border-[#1E3A8A]/40 p-4 rounded-xl">
        <label className="text-sm">
          Quiet start (HH:MM)
          <input className="w-full mt-1 bg-transparent border rounded p-2" placeholder="22:00" value={cfg.quietHours?.start || ""} onChange={(e) => setCfg({ ...cfg, quietHours: { ...(cfg.quietHours || {}), start: e.target.value } })} />
        </label>
        <label className="text-sm">
          Quiet end (HH:MM)
          <input className="w-full mt-1 bg-transparent border rounded p-2" placeholder="07:00" value={cfg.quietHours?.end || ""} onChange={(e) => setCfg({ ...cfg, quietHours: { ...(cfg.quietHours || {}), end: e.target.value } })} />
        </label>
        <label className="text-sm">
          Rate limit / min
          <input type="number" min={0} className="w-full mt-1 bg-transparent border rounded p-2" value={cfg.rateLimitPerMin ?? 0} onChange={(e) => setCfg({ ...cfg, rateLimitPerMin: Number(e.target.value) })} />
        </label>
      </div>

      <div className="bg-[#0F172A]/80 border border-[#1E3A8A]/40 p-4 rounded-xl">
        <div className="text-sm text-gray-300 mb-3">Preview</div>
        <div className="text-xs bg-[#0B1220] border border-[#1E3A8A]/40 rounded p-3">[Slack] CRITICAL • tenant: T1 • p95 • z=4.2 • link: /copilot/tenants/T1</div>
      </div>

      <div className="flex gap-3 justify-end">
        <button onClick={test} className="px-3 py-1 text-sm rounded bg-[#2563EB]/40 hover:bg-[#2563EB]/60">Send test</button>
        <button onClick={resetToEnv} disabled={resetting} className="px-3 py-1 text-sm rounded bg-yellow-600/30 hover:bg-yellow-600/50">{resetting ? "Resetting…" : "Reset to env defaults"}</button>
        <button onClick={resetDedupe} className="px-3 py-1 text-sm rounded bg-[#9333EA]/30 hover:bg-[#9333EA]/50">Reset dedupe cache</button>
        <button onClick={save} disabled={saving} className="px-3 py-1 text-sm rounded bg-[#22C55E]/40 hover:bg-[#22C55E]/60">{saving ? "Saving…" : "Save"}</button>
      </div>
    </motion.div>
  )
}


