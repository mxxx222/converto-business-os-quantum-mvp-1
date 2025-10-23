import { apiClient } from '../../../lib/api'
import UsageChart from '../../../components/UsageChart'

export const runtime = 'edge'

const TOKEN_COST_EUR_PER_1K = 0.003
const OCR_COST_EUR_PER_SCAN = 0.02

export default async function CostDashboard({ tenantId = 'tenant_demo' }: { tenantId?: string }) {
  const [seriesRes, usageRes] = await Promise.all([
    apiClient.getUsageTimeseries(tenantId, 30),
    apiClient.getTenantUsage(tenantId),
  ])
  const series = seriesRes.data?.series || []
  const limits = usageRes.data?.limits || {}

  const euroSeries = series.map((p: { date: string; ai_tokens: number; ocr_scans: number }) => ({
    date: p.date,
    eur: (p.ai_tokens / 1000) * TOKEN_COST_EUR_PER_1K + p.ocr_scans * OCR_COST_EUR_PER_SCAN,
    ocr_scans: p.ocr_scans,
    ai_tokens: p.ai_tokens,
  }))

  const monthlyEstimate = euroSeries.reduce((a, b) => a + b.eur, 0)
  const tokenLimit = limits['ai_tokens_per_month'] ?? 0
  const ocrLimit = limits['ocr_scans_per_month'] ?? 0

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-lg border p-4">
          <div className="text-sm text-gray-500">Monthly Cost (est.)</div>
          <div className="text-2xl font-semibold">€{monthlyEstimate.toFixed(2)}</div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-sm text-gray-500">Tokens vs Limit</div>
          <div className="text-xl">{usageRes.data?.usage?.ai_tokens_per_month ?? 0} / {tokenLimit > 0 ? tokenLimit : '∞'}</div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-sm text-gray-500">OCR Scans vs Limit</div>
          <div className="text-xl">{usageRes.data?.usage?.ocr_scans_per_month ?? 0} / {ocrLimit > 0 ? ocrLimit : '∞'}</div>
        </div>
      </div>

      <div className="rounded-lg border p-4">
        <UsageChart data={series.map((s) => ({ date: s.date, ocr_scans: s.ocr_scans, ai_tokens: s.ai_tokens }))} />
      </div>
    </div>
  )
}
