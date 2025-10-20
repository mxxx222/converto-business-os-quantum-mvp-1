"use client"
import { useEffect } from 'react'
import { useNotify } from '../../lib/notify/store'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export default function NotificationProvider({ children }: { children: React.ReactNode }) {
  const push = useNotify((s) => s.push)
  const qc = useQueryClient()

  useEffect(() => {
    const es = new EventSource('/api/events')
    es.onmessage = (e) => {
      try {
        const ev = JSON.parse(e.data)
        push({ id: crypto.randomUUID(), type: ev.type || 'info', msg: ev.msg || '' })
        if (ev.invalidateKeys) {
          try {
            ev.invalidateKeys.forEach((k: any) => qc.invalidateQueries({ queryKey: k }))
          } catch {}
        }
        if (ev.msg) {
          ;(toast as any)[ev.type || 'info'](ev.msg)
        }
      } catch {}
    }
    return () => es.close()
  }, [push, qc])

  return <>{children}</>
}


