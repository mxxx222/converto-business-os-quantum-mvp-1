'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useCoPilotStore, type Suggestion } from '../state/copilotStore'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || ''

async function fetchSuggestions(context: Record<string, unknown> | null, uiContext?: string): Promise<Suggestion[]> {
  try {
    const qs = uiContext ? `?context=${encodeURIComponent(uiContext)}` : ''
    const res = await fetch(`${API_BASE}/api/v1/ai/suggestions${qs}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ context, uiContext })
    })
    if (!res.ok) throw new Error('Failed suggestions')
    return await res.json()
  } catch (_) {
    // Fallback static suggestions
    return [
      { id: 's1', title: 'Luo lasku tästä kuitista', action: 'create_invoice' },
      { id: 's2', title: 'Kategorisoi kulut automaattisesti', action: 'categorize' },
      { id: 's3', title: 'Täsmäytä tiliotteeseen', action: 'reconcile' }
    ]
  }
}

type Props = {
  className?: string
  context?: string
}

export function CoPilotDrawer({ className, context: uiContext }: Props) {
  const { isOpen, toggle, context, setSuggestions, lastSuggestions } = useCoPilotStore()
  const queryClient = useQueryClient()

  const queryKey = useMemo(() => ['copilot-suggestions', uiContext, context], [uiContext, context])

  const { data, isLoading, refetch } = useQuery({
    queryKey,
    queryFn: () => fetchSuggestions(context, uiContext),
    staleTime: 30_000
  })

  const [connected, setConnected] = useState(false)

  // Server-Sent Events for realtime suggestion updates
  useEffect(() => {
    if (!isOpen) return
    const qs = uiContext ? `?context=${encodeURIComponent(uiContext)}` : ''
    const url = `${API_BASE}/api/v1/ai/stream${qs}`

    let closed = false
    try {
      const evt = new EventSource(url)
      evt.onopen = () => setConnected(true)
      evt.onmessage = (e) => {
        try {
          const incoming: Suggestion[] = JSON.parse(e.data)
          setSuggestions(incoming)
          queryClient.setQueryData(queryKey, incoming)
        } catch (_) {
          // ignore malformed frames
        }
      }
      evt.onerror = () => {
        setConnected(false)
        evt.close()
        if (!closed) {
          // fallback to refetch if stream drops
          refetch().catch(() => {})
        }
      }
      return () => {
        closed = true
        setConnected(false)
        evt.close()
      }
    } catch (_) {
      setConnected(false)
      // best-effort refresh
      refetch().catch(() => {})
    }
  }, [isOpen, uiContext, context, queryClient, queryKey, refetch, setSuggestions])

  const suggestions: Suggestion[] = data ?? lastSuggestions

  return (
    <>
      <button
        onClick={toggle}
        className="fixed right-4 bottom-4 z-40 rounded-full bg-black text-white px-4 py-2 shadow-lg"
        aria-expanded={isOpen}
      >
        Co-pilot
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.aside
            key="copilot"
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 30 }}
            className={`fixed top-0 right-0 h-full w-[380px] max-w-[85vw] bg-white shadow-2xl z-50 border-l border-gray-200 ${className ?? ''}`}
            role="dialog"
            aria-label="Co-pilot Drawer"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold">Co-pilot</h2>
                <span className={`inline-flex items-center gap-1 text-xs ${connected ? 'text-green-600' : 'text-gray-500'}`}>
                  <span className={`h-2 w-2 rounded-full ${connected ? 'bg-green-500' : 'bg-gray-400'}`} />
                  {connected ? 'Yhteys aktiivinen' : 'Offline'}
                </span>
              </div>
              <button onClick={toggle} className="text-sm text-gray-600 hover:text-black">Sulje</button>
            </div>

            <div className="p-4 space-y-4 overflow-y-auto h-[calc(100%-52px)]">
              <section>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Ehdotukset</h3>
                {isLoading && <div className="text-sm text-gray-500">Haetaan ehdotuksia…</div>}
                <ul className="space-y-2">
                  {suggestions.map((s) => (
                    <li key={s.id}>
                      <button
                        className="w-full text-left rounded border px-3 py-2 hover:bg-gray-50"
                        onClick={() => handleSuggestion(s)}
                      >
                        {s.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Prompt Templates</h3>
                <div className="grid grid-cols-1 gap-2">
                  {['Luo tarjous', 'Muuta laskuksi', 'Arkistoi dokumentti'].map((t, i) => (
                    <button key={i} className="rounded border px-3 py-2 hover:bg-gray-50" onClick={() => handleTemplate(t)}>
                      {t}
                    </button>
                  ))}
                </div>
              </section>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}

function handleSuggestion(s: Suggestion) {
  // In a real app, dispatch events over event bus or call server actions
  if (s.action === 'create_invoice') {
    // navigate or open modal
    // noop placeholder
  }
}

function handleTemplate(template: string) {
  // Save or execute template via API
  // noop placeholder
}

