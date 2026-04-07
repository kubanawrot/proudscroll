import { createHmac, timingSafeEqual } from 'node:crypto'
import type { H3Event } from 'h3'

const COOKIE = 'ps_admin'

export function makeToken(password: string, secret: string) {
  return createHmac('sha256', secret).update(password).digest('hex')
}

export function setAdminCookie(event: H3Event, token: string) {
  setCookie(event, COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
    secure: process.env.NODE_ENV === 'production',
  })
  // Non-httpOnly marker so the client middleware can detect auth state
  setCookie(event, 'ps_admin_ui', '1', {
    httpOnly: false,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
    secure: process.env.NODE_ENV === 'production',
  })
}

export function clearAdminCookie(event: H3Event) {
  deleteCookie(event, COOKIE)
  deleteCookie(event, 'ps_admin_ui')
}

export function verifyAdminCookie(event: H3Event): boolean {
  const config = useRuntimeConfig()
  const cookie = getCookie(event, COOKIE)
  if (!cookie) return false

  const expected = makeToken(config.adminPassword!, config.adminSecret!)
  try {
    return timingSafeEqual(Buffer.from(cookie), Buffer.from(expected))
  } catch {
    return false
  }
}
