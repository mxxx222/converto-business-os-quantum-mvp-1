import { NextResponse } from 'next/server'
import '../../../../telemetry/otel'
import '../../../../lib/metrics'
import { DEDUPE, getLastDedupeResetAt } from '../../../../lib/alerts-dedupe'

export async function GET() {
  const count = DEDUPE.size
  const lastResetAt = getLastDedupeResetAt()
  return NextResponse.json({ count, lastResetAt })
}


