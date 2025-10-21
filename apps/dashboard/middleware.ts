import { NextResponse, type NextRequest } from 'next/server'
import { verifyJWT } from './lib/auth/jwt'
import { getTenantTheme } from './lib/theme/theme-utils'

export const config = {
  matcher: [
    '/((?!_next|favicon.ico|manifest.json|sw.js|icon-192.png|icon-512.png|robots.txt|coming-soon|privacy-policy|terms|contact|blog|thanks|api/subscribe|api/pilot-signup|api/ocr/upload|api/receipts|api/auth/passkey-init|api/auth/passkey-verify|api/auth/totp-qr|api/auth/totp-verify|api/health|public|styleguide).*)',
  ],
}

export async function middleware(req: NextRequest) {
  // i18n: optional locale redirect (gated)
  if (process.env.NEXT_PUBLIC_I18N_ENABLED === 'true') {
    const pathname = req.nextUrl.pathname
    if (!pathname.startsWith('/_next') && !pathname.startsWith('/api') && pathname !== '/favicon.ico') {
      const locales = ['fi', 'en', 'sv', 'ru', 'et']
      const hasLocale = locales.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`))
      if (!hasLocale) {
        const cookie = req.cookies.get('lang')?.value
        const target = cookie && locales.includes(cookie) ? cookie : 'fi'
        return NextResponse.redirect(new URL(`/${target}${pathname}`, req.url))
      }
    }
  }

  const cookieName: string = process.env.COOKIE_NAME || 'converto.sid'
  const cookie = req.cookies.get(cookieName)?.value
  if (!cookie) return NextResponse.redirect(new URL('/login', req.url))

  const claims = await verifyJWT(cookie).catch(() => null)
  if (!claims) return NextResponse.redirect(new URL('/login', req.url))

  const tenantId: string | undefined = req.headers.get('x-tenant-id') || claims.tid
  if (!tenantId || tenantId !== claims.tid) {
    return NextResponse.redirect(new URL('/403', req.url))
  }

  // Get tenant theme and add to headers
  const tenantTheme = getTenantTheme(tenantId)

  const res = NextResponse.next()
  res.headers.set('x-user-id', String(claims.sub))
  res.headers.set('x-tenant-id', String(claims.tid))
  res.headers.set('x-roles', (claims.roles || []).join(','))
  res.headers.set('x-tenant-theme', JSON.stringify(tenantTheme))
  return res
}
