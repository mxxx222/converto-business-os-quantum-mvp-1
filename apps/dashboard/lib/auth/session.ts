import { cookies } from 'next/headers'

const NAME = process.env.COOKIE_NAME || 'converto.sid'
const DOMAIN = process.env.COOKIE_DOMAIN

export function setSessionCookie(token: string, maxAge = 60 * 15) {
  cookies().set(NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge,
    path: '/',
    domain: DOMAIN,
  })
}

export function clearSessionCookie() {
  cookies().set(NAME, '', { httpOnly: true, secure: true, maxAge: 0, path: '/', domain: DOMAIN })
}


