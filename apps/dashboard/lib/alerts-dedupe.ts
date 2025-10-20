export const DEDUPE = new Map<string, number>()

let LAST_RESET_AT: string | null = null
import { incResetCounter } from './metrics'

export function clearDedupe() {
  DEDUPE.clear()
  LAST_RESET_AT = new Date().toISOString()
  // increment history counter
  incResetCounter()
}

export function getLastDedupeResetAt() {
  return LAST_RESET_AT
}


