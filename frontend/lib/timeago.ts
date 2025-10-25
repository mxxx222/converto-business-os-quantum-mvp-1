export function timeago(iso: string): string {
  const s: number = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return `${s}s sitten`;
  const m: number = Math.floor(s / 60);
  if (m < 60) return `${m}m sitten`;
  const h: number = Math.floor(m / 60);
  if (h < 24) return `${h}h sitten`;
  const d: number = Math.floor(h / 24);
  return `${d}pv sitten`;
}
