"use client"

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'

type Point = { date: string; ocr_scans: number; ai_tokens: number }

export default function UsageChart({ data }: { data: Point[] }) {
  return (
    <div style={{ width: '100%', height: 360 }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 16, right: 24, left: 8, bottom: 8 }}>
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
          <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
          <Tooltip />
          <Legend />
          <Line yAxisId="left" type="monotone" dataKey="ocr_scans" stroke="#0ea5e9" name="OCR scans" dot={false} strokeWidth={2} />
          <Line yAxisId="right" type="monotone" dataKey="ai_tokens" stroke="#84cc16" name="AI tokens" dot={false} strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

