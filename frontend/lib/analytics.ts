export const track = (event: string, params?: Record<string, any>): void => {
  if (typeof window === 'undefined') return
  // turvakerros: älä vuoda PII:tä vahingossa
  const safe = params ? JSON.parse(JSON.stringify(params)) : undefined
  // rajoita kenttiä jos tarpeen
  (window as any).gtag?.('event', event, safe)
}

export function persistUtmFromUrl(): void {
  if (typeof window === 'undefined') return
  const p = new URLSearchParams(window.location.search)
  const fields = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']
  const utm = Object.fromEntries(fields.map(k => [k, p.get(k) || '']).filter(([_, v]) => v))
  if (Object.keys(utm).length) localStorage.setItem('utm', JSON.stringify(utm))
}

export function getUtm(): Record<string, string> | null {
  if (typeof window === 'undefined') return null
  try {
    return JSON.parse(localStorage.getItem('utm') || 'null')
  } catch {
    return null
  }
}
