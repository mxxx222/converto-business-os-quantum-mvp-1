"use client";
import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";

type ScanResult = {
  status: string;
  data?: any;
  entry_id?: string;
  classification?: any;
  points_awarded?: number;
};

export default function OCRDropzone({ onScanComplete }: { onScanComplete?: (result: ScanResult) => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFile = useCallback((file: File) => {
    setFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  async function scan(autoConfirm: boolean = false) {
    if (!file) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("auto_confirm", String(autoConfirm));

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/v1/ocr-ai/scan`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_DEV_JWT || ""}`,
        },
      });

      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setResult(data);
      onScanComplete?.(data);
    } catch (e: any) {
      alert("Virhe: " + e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <motion.div
        className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center bg-white/80 hover:bg-gray-50 hover:border-indigo-400 transition cursor-pointer"
        whileHover={{ scale: 1.01 }}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        {preview ? (
          <div className="space-y-3">
            <img src={preview} alt="Preview" className="mx-auto max-h-48 rounded-lg shadow" />
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => scan(false)}
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 font-medium"
              >
                {loading ? "Analysoidaan..." : "📸 Analysoi"}
              </button>
              <button
                onClick={() => scan(true)}
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 font-medium"
              >
                ✅ Hyväksy & Tallenna
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="text-4xl mb-3">📸</div>
            <p className="text-gray-600 mb-2">Raahaa kuitti tähän tai klikkaa valitaksesi</p>
            <input
              type="file"
              accept="image/*"
              onChange={handleChange}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="inline-block px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer font-medium"
            >
              Valitse kuva
            </label>
            <p className="text-xs text-gray-400 mt-3">Tuetut: JPG, PNG • Max 10 MB</p>
          </div>
        )}
      </motion.div>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-green-50 to-white rounded-2xl border border-green-200 p-5 shadow"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="text-lg font-semibold text-green-800">
              {result.status === "confirmed" ? "✅ Tallennettu!" : "📋 Esikatselu"}
            </div>
            {result.points_awarded && (
              <div className="text-sm font-medium text-green-600">+{result.points_awarded}p</div>
            )}
          </div>
          <div className="space-y-2 text-sm">
            <p><strong>Kauppa:</strong> {result.data?.merchant || result.entry?.merchant}</p>
            <p><strong>Summa:</strong> {result.data?.total || result.entry?.total} {result.data?.currency || "EUR"}</p>
            <p><strong>Kategoria:</strong> {result.classification?.category || result.data?.category}</p>
            <p><strong>ALV:</strong> {result.classification?.vat_class || result.data?.vat_rate}%</p>
            <p><strong>Budjettirivi:</strong> {result.classification?.budget_line}</p>
          </div>
          {result.classification?.suggestions && result.classification.suggestions.length > 0 && (
            <div className="mt-3 space-y-1">
              {result.classification.suggestions.map((s: string, i: number) => (
                <div key={i} className="text-xs text-gray-600">{s}</div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}

