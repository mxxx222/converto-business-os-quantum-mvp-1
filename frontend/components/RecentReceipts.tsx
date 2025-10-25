"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useCallback, useRef, useState } from "react";
import { toast } from "@/lib/toast";

export default function RecentReceipts() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ["receipts"], queryFn: api.getReceipts });
  const [dragOver, setDragOver] = useState(false);
  const [providerFilter, setProviderFilter] = useState<"all" | "vision" | "azure" | "tesseract">("all");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const m = useMutation({
    mutationFn: api.uploadReceipt,
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ["receipts"] });
      if (res?.duplicate) toast("Duplikaatti: sama kuitti on jo listalla.");
      else toast("Kuitti lisätty.");
    }
  });

  const proc = useMutation({
    mutationFn: (id: string) => api.processReceipt(id),
    retry: 1,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["receipts"] });
      toast("Analysoitu ja hyväksytty.");
    },
    onError: () => toast("Prosessointi epäonnistui.")
  });

  const procAll = useMutation({
    mutationFn: () => api.processAllReceipts(),
    retry: 0,
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ["receipts"] });
      const ok = res?.results?.filter((x: { ok: boolean }) => x.ok).length ?? 0;
      toast(`Analysoitu ${ok} kpl.`);
    },
    onError: () => toast("Batch epäonnistui.")
  });

  const del = useMutation({
    mutationFn: (id: string) => api.deleteReceipt(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ["receipts"] });
      const prev = qc.getQueryData<any>(["receipts"]);
      qc.setQueryData<any>(["receipts"], (old: any) => (old ?? []).filter((x: { id: string }) => x.id !== id));
      return { prev };
    },
    onError: (_e, _id, ctx) => {
      if (ctx?.prev) qc.setQueryData(["receipts"], ctx.prev);
      toast("Poisto epäonnistui.");
    },
    onSuccess: (_res, id) => {
      toast("Kuitti poistettu.", 5000, "Kumoa", async () => {
        try {
          await api.restoreReceipt(id);
          await qc.invalidateQueries({ queryKey: ["receipts"] });
          toast("Palautettu.");
        } catch {
          toast("Palautus epäonnistui.");
        }
      });
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["receipts"] })
  });

  const onFiles = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;
    Array.from(files).forEach(async (f) => {
      if (f.size > 6 * 1024 * 1024) return toast("Liian suuri tiedosto (>6MB).");
      if (!["image/", "application/pdf"].some(p => f.type.startsWith(p))) return toast("Vain kuvat tai PDF.");
      m.mutate(f);
    });
  }, [m]);

  const filtered = (data ?? []).filter(r => providerFilter === "all" ? true : r.processing?.provider === providerFilter);
  const queuedCount = (data ?? []).filter(r => r.status === "queued").length;

  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); onFiles(e.dataTransfer.files); }}
        className={["rounded-2xl border bg-white p-4 shadow-sm dark:bg-neutral-900 dark:border-neutral-800", dragOver ? "ring-2 ring-emerald-500" : ""].join(" ")}
      >
        <p className="text-sm text-neutral-500">Kuittien hallinta</p>
        <div className="mt-2 text-sm">Pudota kuva/PDF tähän tai{" "}
          <button className="underline" onClick={() => fileInputRef.current?.click()} type="button">valitse tiedosto</button>.
        </div>
        <input ref={fileInputRef} type="file" accept="image/*,application/pdf" className="hidden" onChange={e => onFiles(e.target.files)} />
        <div className="mt-2">
          <button type="button" className="rounded-xl border px-3 py-2 text-sm" onClick={() => { const i = document.createElement("input"); i.type = "file"; i.accept = "image/*"; /* @ts-expect-error */ i.capture = "environment"; i.onchange = () => onFiles(i.files); i.click(); }}>Avaa kamera</button>
        </div>
        {m.isPending && <div className="mt-3 text-xs text-neutral-500">Lähetetään…</div>}
        <div className="mt-1 text-xs text-neutral-500">Toimii offline: lisäykset jonoon ja synkka kun verkko palaa.</div>
      </div>

      <div className="rounded-2xl border bg-white p-4 shadow-sm dark:bg-neutral-900 dark:border-neutral-800">
        <div className="flex items-center justify-between">
          <p className="text-sm text-neutral-500">Viimeisimmät</p>
          <div className="flex items-center gap-2">
            <label className="text-xs text-neutral-500">Provider</label>
            <select className="text-xs rounded-lg border bg-transparent px-2 py-1" value={providerFilter} onChange={e => setProviderFilter(e.target.value as any)} aria-label="Suodata providerin mukaan">
              <option value="all">Kaikki</option>
              <option value="vision">Vision</option>
              <option value="azure">Azure</option>
              <option value="tesseract">Tesseract</option>
            </select>
            {queuedCount > 0 && (
              <button className="rounded-xl border px-3 py-1 text-xs" onClick={() => procAll.mutate()} disabled={procAll.isPending} title="Prosessoi kaikki jonossa olevat">
                Prosessoi kaikki ({queuedCount})
              </button>
            )}
          </div>
        </div>

        {(filtered.length === 0) ? (
          <div className="mt-2 text-sm text-neutral-500">Ei kuitteja</div>
        ) : (
          <ul className="mt-2 space-y-2 text-sm">
            {filtered.map(r => (
              <li key={r.id} className="flex items-start justify-between gap-3" tabIndex={0}
                onKeyDown={(e) => { if (e.key === "Enter" && r.status === "queued") proc.mutate(r.id); if (e.key === "Backspace") del.mutate(r.id); }}
                title={r.parsed ? `${r.parsed.supplier} • ${r.parsed.date} • ${r.parsed.currency} ${r.parsed.grossTotal.toFixed(2)}`
                  : `${new Date(r.createdAt).toLocaleString("fi-FI")} • ${(r.size / 1024).toFixed(1)} kB`}>
                <div className="min-w-0">
                  <div className="truncate font-medium">{r.filename}</div>
                  <div className="text-xs text-neutral-500">{new Date(r.createdAt).toLocaleString("fi-FI")} • {(r.size / 1024).toFixed(1)} kB • {r.status}</div>
                  {r.parsed && <div className="mt-1 text-xs text-neutral-600 dark:text-neutral-300">{r.parsed.supplier} • {r.parsed.date} • {r.parsed.currency} {r.parsed.grossTotal.toFixed(2)}</div>}
                </div>
                <div className="shrink-0 flex gap-2 items-center">
                  {r.processing && (
                    <span className={["text-xs rounded-lg border px-2 py-1", r.processing.provider === "tesseract" ? "border-amber-500 text-amber-700" : "border-emerald-500 text-emerald-700"].join(" ")}
                      title={`Provider: ${r.processing.provider}${r.processing.fallbackUsed ? " (fallback)" : ""}`}>
                      {r.processing.provider}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );