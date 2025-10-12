"use client";
import { useState } from "react";

export default function OCRDropzone({ onResult }: { onResult: (r: any) => void }) {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function upload(file: File) {
    setLoading(true);
    setErr("");
    const form = new FormData();
    form.append("file", file);
    form.append("tenant_id", "t_demo");
    form.append("user_id", "u_demo");
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/v1/ocr/scan`, {
        method: "POST",
        body: form,
      });
      
      if (!res.ok) {
        setErr(await res.text());
        setLoading(false);
        return;
      }
      
      const data = await res.json();
      setLoading(false);
      onResult(data.result);
    } catch (e: any) {
      setErr(e.message);
      setLoading(false);
    }
  }

  return (
    <div
      className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center bg-white hover:bg-gray-50 hover:border-indigo-400 transition cursor-pointer"
      onDrop={(e) => {
        e.preventDefault();
        if (e.dataTransfer.files[0]) upload(e.dataTransfer.files[0]);
      }}
      onDragOver={(e) => e.preventDefault()}
    >
      <div className="text-4xl mb-3">📸</div>
      <p className="text-gray-600 mb-3">
        {loading ? "Analysoidaan..." : "Raahaa kuitti tähän tai klikkaa valitaksesi"}
      </p>
      <input
        type="file"
        accept="image/*,.pdf"
        className="text-sm"
        onChange={(e) => {
          if (e.target.files?.[0]) upload(e.target.files[0]);
        }}
      />
      {!!err && <div className="text-red-600 text-sm mt-3">{err}</div>}
    </div>
  );
}

