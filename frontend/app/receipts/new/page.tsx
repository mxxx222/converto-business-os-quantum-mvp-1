"use client";
import { useState, useRef } from "react";
import { Camera, Upload, FileText, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function NewReceiptPage() {
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      setProcessing(true);
      const response = await fetch('/api/v1/ocr/process', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Käsittely epäonnistui');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Tuntematon virhe');
    } finally {
      setUploading(false);
      setProcessing(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleCameraCapture = () => {
    // Simulate camera capture
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/qr" className="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Kuittiskannaus</h1>
              <p className="text-sm text-gray-500">Lataa kuitti käsiteltäväksi</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        {!result && !error && (
          <>
            {/* Upload Options */}
            <div className="space-y-4 mb-8">
              <div className="text-center">
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Valitse lataustapa
                </h2>
                <p className="text-gray-600 text-sm">
                  Voit ladata kuitin kameralla tai valitsemalla tiedoston
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={handleCameraCapture}
                  disabled={uploading || processing}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-6 rounded-2xl text-center hover:from-blue-600 hover:to-cyan-600 transition-all disabled:opacity-50"
                >
                  <Camera className="w-8 h-8 mx-auto mb-2" />
                  <div className="font-semibold">Kamera</div>
                </button>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading || processing}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-2xl text-center hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50"
                >
                  <Upload className="w-8 h-8 mx-auto mb-2" />
                  <div className="font-semibold">Tiedosto</div>
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {/* Processing State */}
            {(uploading || processing) && (
              <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {uploading ? 'Ladataan...' : 'Käsitellään...'}
                </h3>
                <p className="text-sm text-gray-600">
                  {uploading ? 'Kuittia ladataan palvelimelle' : 'AI lukee kuittitiedot...'}
                </p>
              </div>
            )}
          </>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center mb-6">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="font-semibold text-red-900 mb-2">Virhe käsittelyssä</h3>
            <p className="text-sm text-red-700 mb-4">{error}</p>
            <button
              onClick={() => {
                setError(null);
                setResult(null);
              }}
              className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700"
            >
              Yritä uudelleen
            </button>
          </div>
        )}

        {/* Success State */}
        {result && (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="font-semibold text-green-900 mb-2">Kuitti käsitelty!</h3>
              <p className="text-sm text-green-700">
                OCR on lukenut kuittitiedot onnistuneesti
              </p>
            </div>

            {/* Results */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">Kuitin tiedot</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Summa:</span>
                  <span className="font-semibold">{result.total_amount || 'N/A'} €</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">ALV:</span>
                  <span className="font-semibold">{result.vat_amount || 'N/A'} €</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Päivämäärä:</span>
                  <span className="font-semibold">{result.date || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Myyjä:</span>
                  <span className="font-semibold">{result.vendor || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  setResult(null);
                  setError(null);
                }}
                className="bg-gray-100 text-gray-700 px-4 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                Uusi kuitti
              </button>
              <Link href="/receipts">
                <button className="bg-blue-600 text-white px-4 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors w-full">
                  Tarkastele
                </button>
              </Link>
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="mt-8 bg-blue-50 rounded-2xl p-4">
          <h4 className="font-semibold text-blue-900 mb-2">💡 Vinkkejä parhaaseen tulokseen</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Varmista että kuitti on selkeä ja hyvin valaistu</li>
            <li>• Kuvassa ei saa olla varjoja tai heijastuksia</li>
            <li>• Teksti tulee olla lukukelpoista</li>
            <li>• Tuki: JPG, PNG, PDF-muodoille</li>
          </ul>
        </div>
      </div>
    </div>
  );
}