type Listener = (payload: any) => void

const listeners = new Map<string, Set<Listener>>()

export function subscribe(ns: string, fn: Listener) {
  const set = listeners.get(ns) ?? new Set<Listener>()
  set.add(fn)
  listeners.set(ns, set)
  return () => {
    set.delete(fn)
    if (set.size === 0) listeners.delete(ns)
  }
}

export function emit(ns: string, payload: any) {
  const set = listeners.get(ns)
  if (!set) return 0
  for (const fn of Array.from(set)) {
    try {
      fn(payload)
    } catch {}
  }
  return set.size
}


