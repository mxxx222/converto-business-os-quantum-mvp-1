export const QP = {
  short: { staleTime: 5_000, gcTime: 30_000 },
  medium: { staleTime: 60_000, gcTime: 5 * 60_000 },
  long: { staleTime: 5 * 60_000, gcTime: 30 * 60_000 },
} as const


