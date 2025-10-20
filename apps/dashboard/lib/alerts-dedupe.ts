export const DEDUPE = new Map<string, number>()

let LAST_RESET_AT: string | null = null

export function clearDedupe() {
  DEDUPE.clear()
  LAST_RESET_AT = new Date().toISOString()
}

export function getLastDedupeResetAt() {
  return LAST_RESET_AT
}


