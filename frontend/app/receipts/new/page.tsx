"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Camera, Upload, X, Check } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NewReceiptPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  async function handleFile(f: File) {
    setFile(f);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(f);

    // Auto-scan
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", f);
      formData.append("tenant_id", "demo");
      formData.append("user_id", "user_demo");

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/v1/ocr/receipt`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("OCR failed");
      const data = await res.json();
      setResult(data.result || data);
    } catch (e: any) {
      alert("Virhe: " + e.message);
    } finally {
      setLoading(false);
    }
  }

  function handleSave() {
    // TODO: Save to backend
    alert("Kuitti tallennettu! (stub)");
    router.push("/");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
        <button onClick={() => router.back()} className="mb-4 text-white/80 hover:text-white">
          ← Takaisin
        </button>
        <h1 className="text-2xl font-bold mb-2">Lataa kuitti</h1>
        <p className="text-white/90">Ota kuva tai valitse tiedosto</p>
      </div>

      <div className="max-w-2xl mx-auto px-4 mt-6">
        {/* Upload Zone */}
        {!file && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-2 border-dashed border-indigo-300 rounded-2xl p-12 text-center bg-white/70 backdrop-blur"
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
            }}
            onDragOver={(e) => e.preventDefault()}
          >
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 rounded-full bg-indigo-100">
                <Upload className="w-12 h-12 text-indigo-600" />
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900 mb-2">
                  Raahaa kuitti tähän tai klikkaa valitaksesi
                </p>
                <p className="text-sm text-gray-600">Tuetut: JPG, PNG, PDF</p>
              </div>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => {
                  if (e.target.files?.[0]) handleFile(e.target.files[0]);
                }}
                className="hidden"
                id="file-input"
              />
              <label
                htmlFor="file-input"
                className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold cursor-pointer hover:bg-indigo-700 transition-colors"
              >
                Valitse tiedosto
              </label>
            </div>
          </motion.div>
        )}

        {/* Preview & Results */}
        {file && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4"
          >
            {/* Image Preview */}
            {preview && (
              <div className="bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
                <img src={preview} alt="Preview" className="w-full h-64 object-contain rounded-lg" />
              </div>
            )}

            {/* Loading */}
            {loading && (
              <div className="bg-white rounded-2xl shadow-lg p-8 text-center border border-gray-100">
                <div className="animate-spin w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4" />
                <p className="text-gray-600">Analysoidaan kuittia...</p>
              </div>
            )}

            {/* Results */}
            {result && !loading && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Kuitin tiedot</h3>
                  <div className="flex items-center gap-1 text-green-600">
                    <Check className="w-5 h-5" />
                    <span className="text-sm font-medium">Valmis</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Kauppias</label>
                    <input
                      type="text"
                      value={result.merchant || result.text || "Tuntematon"}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Päivämäärä</label>
                    <input
                      type="text"
                      value={result.date || new Date().toISOString().split("T")[0]}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Summa</label>
                    <input
                      type="text"
                      value={`${result.total || "0.00"} €`}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg font-bold"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">ALV %</label>
                    <input
                      type="text"
                      value={result.vat || "24"}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      readOnly
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setFile(null);
                      setPreview(null);
                      setResult(null);
                    }}
                    className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium text-gray-700 transition-colors"
                  >
                    Peruuta
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-bold shadow-lg transition-all"
                  >
                    Tallenna
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}

