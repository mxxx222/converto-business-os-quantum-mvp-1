import { NextResponse, type NextRequest } from 'next/server'
import { verifyJWT } from './lib/auth/jwt'
import { getTenantSecurity } from './lib/tenant-security-cache'

export const config = {
  matcher: [
    '/((?!_next|favicon.ico|api/auth/passkey-init|api/auth/passkey-verify|api/auth/totp-qr|api/auth/totp-verify|api/health|public).*)',
  ],
}

export async function middleware(req: NextRequest) {
  const cookieName = process.env.COOKIE_NAME || 'converto.sid'
  const cookie = req.cookies.get(cookieName)?.value
  if (!cookie) return NextResponse.redirect(new URL('/login', req.url))

  const claims = await verifyJWT(cookie).catch(() => null)
  if (!claims) return NextResponse.redirect(new URL('/login', req.url))

  const tenantId = req.headers.get('x-tenant-id') || (claims as any).tid
  if (!tenantId || tenantId !== (claims as any).tid) {
    return NextResponse.redirect(new URL('/403', req.url))
  }

  // Tenant security lock check (Redis-backed)
  const sec = await getTenantSecurity((claims as any).tid)
  if (sec?.locked_until && new Date(sec.locked_until) > new Date()) {
    return NextResponse.json({ error: 'tenant_locked', until: sec.locked_until }, { status: 423 })
  }

  const res = NextResponse.next()
  res.headers.set('x-user-id', String((claims as any).sub))
  res.headers.set('x-tenant-id', String((claims as any).tid))
  res.headers.set('x-roles', ((claims as any).roles || []).join(','))
  return res
}


