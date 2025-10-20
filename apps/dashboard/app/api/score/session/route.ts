import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ score: 42, level: 3 })
}


