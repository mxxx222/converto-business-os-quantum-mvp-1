"use client";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

type AuditRow = {
  ts: string;
  user_id: string | null;
  tenant_id: string | null;
  action: string;
  resource: string | null;
  outcome: "success" | "failure" | "denied";
  ip: string | null;
  user_agent: string | null;
  meta: any;
};

export default function AuditTrailClient({ isAdmin }: { isAdmin: boolean }) {
  const [rows, setRows] = useState<AuditRow[]>([]);
  const [range, setRange] = useState<"6h"|"12h"|"24h"|"48h">("24h");
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [live, setLive] = useState(false);
  const [paused, setPaused] = useState(false);
  const [scrollLock, setScrollLock] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const res = await fetch(`/api/audit/exports?range=${range}`, { headers: { Accept: "text/csv" } });
      const csv = await res.text();
      const lines = csv.trim().split("\n");
      const header = lines.shift();
      const cols = header?.split(",") ?? [];
      const data = lines.map((ln) => {
        const parts = ln.split(",");
        const obj: any = {};
        cols.forEach((c, i) => (obj[c] = parts[i] ?? ""));
        obj.meta = safeJson(obj.meta);
        return obj as AuditRow;
      });
      setRows(data);
      setLoading(false);
    };
    void load();
  }, [range]);

  useEffect(() => {
    if (!live) return;
    const evt = new EventSource(`/api/audit/stream?range=${parseInt(range)}&tenant=`);
    evt.onmessage = (e) => {
      if (paused) return;
      try {
        const row = JSON.parse(e.data);
        setRows((prev) => {
          const next = [row, ...prev];
          return next.slice(0, 2000);
        });
        if (!scrollLock) document.getElementById("audit-table-top")?.scrollIntoView({ behavior: "smooth", block: "start" });
      } catch {}
    };
    evt.addEventListener("ready", () => {});
    evt.addEventListener("error", () => {});
    return () => evt.close();
  }, [live, paused, scrollLock, range]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return rows;
    return rows.filter((r) =>
      [r.ts, r.user_id, r.tenant_id, r.action, r.resource, r.outcome, r.ip, r.user_agent, JSON.stringify(r.meta)]
        .join(" ")
        .toLowerCase()
        .includes(s)
    );
  }, [rows, q]);

  const downloadCSV = async () => {
    const res = await fetch(`/api/audit/exports?range=${range}`, { headers: { Accept: "text/csv" } });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit_${range}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported");
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-[#3B82F6]">Audit Trail</h1>
        <div className="flex items-center gap-2">
          <select className="bg-transparent border rounded px-2 py-1 text-sm" value={range} onChange={(e) => setRange(e.target.value as any)}>
            <option value="6h">6 h</option>
            <option value="12h">12 h</option>
            <option value="24h">24 h</option>
            <option value="48h">48 h</option>
          </select>
          <input className="bg-transparent border rounded px-2 py-1 text-sm w-56" placeholder="Suodata (action, tenant, ip, user)…" value={q} onChange={(e) => setQ(e.target.value)} />
          <button onClick={downloadCSV} className="text-sm px-3 py-1 rounded bg-[#2563EB]/40 hover:bg-[#2563EB]/60">Export CSV</button>
          <label className="flex items-center gap-1 text-xs"><input type="checkbox" checked={live} onChange={(e)=>setLive(e.target.checked)} /> Live</label>
          <label className="flex items-center gap-1 text-xs"><input type="checkbox" checked={paused} onChange={(e)=>setPaused(e.target.checked)} /> Pause</label>
          <label className="flex items-center gap-1 text-xs"><input type="checkbox" checked={scrollLock} onChange={(e)=>setScrollLock(e.target.checked)} /> Scroll lock</label>
        </div>
      </div>

      <div id="audit-table-top" />
      <div className="border border-[#1E3A8A]/40 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#0F172A]/80 text-gray-300">
            <tr>
              <Th>Time</Th>
              <Th>User</Th>
              <Th>Tenant</Th>
              <Th>Action</Th>
              <Th>Resource</Th>
              <Th>Outcome</Th>
              <Th>IP</Th>
              <Th>Agent</Th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} className="p-4 text-gray-500">Ladataan…</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={8} className="p-4 text-gray-500">Ei rivejä valitulla aikavälillä.</td></tr>
            ) : (
              filtered.slice(0, 500).map((r, i) => (
                <tr key={i} className="border-t border-[#1E3A8A]/20">
                  <Td>{new Date(r.ts).toLocaleString("fi-FI")}</Td>
                  <Td>{r.user_id || "—"}</Td>
                  <Td>{r.tenant_id || "—"}</Td>
                  <Td>{r.action}</Td>
                  <Td className="truncate max-w-[240px]" title={r.resource || ""}>{r.resource || "—"}</Td>
                  <Td>
                    <span className={`px-2 py-[2px] rounded text-xs ${r.outcome === 'success' ? 'bg-[#16A34A]/20 text-[#16A34A]' : r.outcome === 'denied' ? 'bg-[#F59E0B]/20 text-[#F59E0B]' : 'bg-[#F87171]/20 text-[#F87171]'}`}>{r.outcome}</span>
                  </Td>
                  <Td>{r.ip || "—"}</Td>
                  <Td className="truncate max-w-[280px]" title={r.user_agent || ""}>{r.user_agent || "—"}</Td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-500">Näytetään enintään 500 riviä UI:ssa. Lataa täysi CSV analyysiä varten.</p>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="text-left px-3 py-2 font-medium">{children}</th>;
}
function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-3 py-2 ${className}`}>{children}</td>;
}
function safeJson(s: string) {
  try { return JSON.parse(s); } catch { return {}; }
}


