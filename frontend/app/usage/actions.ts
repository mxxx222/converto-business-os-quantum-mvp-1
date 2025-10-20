'use server'

import { apiClient } from '@/frontend/lib/api'

export async function fetchUsage(tenantId: string = 'tenant_demo') {
  const [usage, series, pricing] = await Promise.all([
    apiClient.getTenantUsage(tenantId),
    apiClient.getUsageTimeseries(tenantId, 30),
    apiClient.getAdaptivePricing(tenantId),
  ])
  return { usage: usage.data, series: series.data, pricing: pricing.data }
}

