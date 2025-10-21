import { NextResponse } from 'next/server';
import { ensureSecurityAlertListener } from '../../../lib/security-alert-listener';

export async function GET(): Promise<NextResponse> {
  if (process.env.DATABASE_URL) {
    await ensureSecurityAlertListener(process.env.DATABASE_URL);
  }
  return NextResponse.json({ ok: true }, { status: 200 });
}
