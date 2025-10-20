import { NextResponse } from 'next/server'

export async function isAdminFromRequest(req?: Request): Promise<boolean> {
  try {
    if (req) {
      const role = (req.headers.get('x-user-role') || '').toLowerCase()
      if (role === 'admin') return true
    }
  } catch {}
  if (process.env.NODE_ENV !== 'production' && process.env.NEXT_PUBLIC_IS_ADMIN === 'true') return true
  return false
}

export function setDevAdminHeader(res: NextResponse, isAdmin: boolean) {
  if (process.env.NODE_ENV !== 'production' && isAdmin) {
    res.headers.set('X-Admin', 'true')
  }
  return res
}


