"use client"

import React, { useMemo, useState } from 'react'

export const runtime = 'edge'

type OCRData = {
  success?: boolean
  message?: string
  data?: any
  mock?: boolean
  mock_data?: any
}

export default function OCRPreviewPage() {
  const [file, setFile] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [result, setResult] = useState<OCRData | null>(null)
  const [loading, setLoading] = useState(false)

  const rawText = useMemo(() => {
    const payload = result?.data || result?.mock_data
    if (!payload) return ''
    if (typeof payload === 'string') return payload
    if (payload.raw_text) return String(payload.raw_text)
    try {
      return JSON.stringify(payload, null, 2)
    } catch {
      return String(payload)
    }
  }, [result])

  const highlighted = useMemo(() => {
    // highlight numbers and totals
    const text = rawText || ''
    const withTotals = text.replace(/(total|sum|amount|vat|alv)/gi, '<mark>$1</mark>')
    return withTotals.replace(/([0-9]+[\.,][0-9]{2})/g, '<span style="background:#FEF3C7">$1</span>')
  }, [rawText])

  const onSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    setImageUrl(URL.createObjectURL(f))
  }

  const onSubmit = async () => {
    if (!file) return
    setLoading(true)
    setResult(null)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/ocr/process', { method: 'POST', body: fd })
      const json = (await res.json()) as OCRData
      setResult(json)
    } catch (e) {
      setResult({ success: false, message: (e as Error).message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">OCR Preview</h1>
      <p className="text-sm text-gray-500">Lataa kuva, näe raakateksti ja korostetut summat.</p>

      <div className="flex items-center gap-3">
        <input type="file" accept="image/*" onChange={onSelect} />
        <button
          className="px-3 py-2 rounded-md bg-black text-white disabled:opacity-50"
          onClick={onSubmit}
          disabled={!file || loading}
        >
          {loading ? 'Käsitellään…' : 'Prosessoi OCR'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-lg border p-2 min-h-[360px] flex items-center justify-center bg-gray-50">
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageUrl} alt="preview" className="max-h-[520px] object-contain" />
          ) : (
            <span className="text-gray-500 text-sm">Esikatselukuva</span>
          )}
        </div>

        <div className="rounded-lg border p-3 min-h-[360px] bg-white overflow-auto">
          {rawText ? (
            <pre className="whitespace-pre-wrap text-sm" dangerouslySetInnerHTML={{ __html: highlighted }} />
          ) : (
            <span className="text-gray-500 text-sm">Raakateksti näkyy täällä</span>
          )}
        </div>
      </div>
    </div>
  )
}


