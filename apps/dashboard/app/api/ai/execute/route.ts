import { NextResponse } from 'next/server'
import { runAITask } from '../../../actions/aiTasks'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const tenantId = body?.tenantId || 'default'
    const task = body?.task || 'generic'
    const results = await runAITask({ tenantId, task })
    return NextResponse.json({ ok: true, results })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'execute failed' }, { status: 500 })
  }
}


