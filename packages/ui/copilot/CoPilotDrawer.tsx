'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useCoPilotStore, type Suggestion } from '../state/copilotStore'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || ''

async function fetchSuggestions(context: Record<string, unknown> | null): Promise<Suggestion[]> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/ai/suggestions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ context })
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
}

export function CoPilotDrawer({ className }: Props) {
  const { isOpen, toggle, context, setSuggestions, lastSuggestions } = useCoPilotStore()

  const queryKey = useMemo(() => ['copilot-suggestions', context], [context])

  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: () => fetchSuggestions(context),
    staleTime: 30_000
  })

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
              <h2 className="text-lg font-semibold">Co-pilot</h2>
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

