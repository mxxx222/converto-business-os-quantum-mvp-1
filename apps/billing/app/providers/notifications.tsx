"use client"
import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export default function NotificationProvider({ children }: { children: React.ReactNode }) {
  const qc = useQueryClient()

  useEffect(() => {
    const windowMs = 2000
    const maxToasts = 3
    const recent: number[] = []
    const es = new EventSource('/api/events?namespace=billing')
    es.onmessage = (e) => {
      try {
        const ev = JSON.parse(e.data)
        if (ev.invalidateKeys) {
          try {
            ev.invalidateKeys.forEach((k: any) => qc.invalidateQueries({ queryKey: k }))
          } catch {}
        }
        if (ev.msg) {
          const now = Date.now()
          while (recent.length && now - recent[0] > windowMs) recent.shift()
          if (recent.length < maxToasts) {
            recent.push(now)
            ;(toast as any)[ev.type || 'info'](ev.msg)
          }
        }
      } catch {}
    }
    return () => es.close()
  }, [qc])

  return <>{children}</>
}


