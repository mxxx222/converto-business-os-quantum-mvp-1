"use client";

import Link from "next/link";

export default function HomePage(): JSX.Element {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Converto Business OS</h1>
        <p className="text-lg text-gray-600 mb-8">AI-powered business management platform</p>
        <div className="space-x-4">
          <Link href="/dashboard" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
            Dashboard
          </Link>
          <Link href="/selko/ocr" className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700">
            OCR Kuittiskannaus
          </Link>
        </div>
      </div>
    </div>
  );
}
