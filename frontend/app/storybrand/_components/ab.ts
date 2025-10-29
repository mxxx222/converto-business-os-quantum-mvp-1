export function abVariant(): 'A' | 'B' {
  if (typeof window === 'undefined') return 'A'
  const k = 'sb_ab_v'
  const v = localStorage.getItem(k)
  if (v === 'A' || v === 'B') return v as 'A' | 'B'
  const pick = Math.random() < 0.5 ? 'A' : 'B'
  localStorage.setItem(k, pick)
  return pick
}
