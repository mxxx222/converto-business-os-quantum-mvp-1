"use server"
import { revalidatePath } from 'next/cache'
import { LangGraphClient } from '@converto/langgraph-client'

const graph = new LangGraphClient({
  apiKey: process.env.LANGGRAPH_API_KEY || '',
  project: 'converto-businessos',
  baseUrl: process.env.LANGGRAPH_BASE_URL || undefined,
})

export async function runAITask({ tenantId, task }: { tenantId: string; task: string }) {
  const results = await graph.run(['VisionOCR', 'VATCalc', 'StripeInvoice'], { tenantId, task })
  revalidatePath('/copilot')
  return results
}


