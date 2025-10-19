"use client";
import { useState } from "react";

export default function TestPage() {
  const [n, setN] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Tailwind Test</h1>
        <button
          onClick={() => setN(n + 1)}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all shadow-lg"
        >
          Klikattu {n}×
        </button>
        <p className="mt-4 text-sm text-gray-600">
          Jos näet gradientit ja pyöristetyt kulmat → Tailwind toimii! ✅
        </p>
      </div>
    </div>
  );
}
