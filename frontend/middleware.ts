import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // CSRF-suojaus POST-reiteille
  if (request.method === 'POST') {
    const origin = request.headers.get('origin')
    const host = request.headers.get('host')

    // Salli vain same-origin POST-pyynnöt
    if (!origin || !host) {
      return NextResponse.json({ error: 'Missing origin or host header' }, { status: 403 })
    }

    const originUrl = new URL(origin)
    if (originUrl.host !== host) {
      return NextResponse.json({ error: 'Cross-origin request blocked' }, { status: 403 })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/api/:path*',
  ],
}
