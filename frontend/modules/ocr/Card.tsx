"use client";
import { useState } from "react";

export default function OCRCard(){
  const [file, setFile] = useState<File|null>(null);
  const [out, setOut] = useState<any>(null);
  const [busy, setBusy] = useState(false);
  const onUpload = async () => {
    if(!file) return;
    setBusy(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/v1/ocr/scan`, { method: "POST", body: fd });
    const j = await res.json();
    setOut(j);
    setBusy(false);
  };
  return (
    <div style={{padding:16,border:"1px solid #eee",borderRadius:12}}>
      <div style={{fontWeight:600}}>OCR Scanner</div>
      <input type="file" accept="image/*" onChange={e=>setFile(e.target.files?.[0]||null)} />
      <button onClick={onUpload} disabled={!file||busy} style={{marginLeft:8}}>Upload</button>
      {out ? <pre style={{marginTop:12,whiteSpace:"pre-wrap"}}>{out.text}</pre> : null}
    </div>
  );
}



