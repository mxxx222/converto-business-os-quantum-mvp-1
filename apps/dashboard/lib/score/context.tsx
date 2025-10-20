"use client"
import { createContext, useContext } from 'react'
import { useQuery } from '@tanstack/react-query'

const ScoreCtx = createContext<{ score: number; level: number } | null>(null)

export function ScoreProvider({ children }: { children: React.ReactNode }) {
  const { data } = useQuery({
    queryKey: ['score', 'session'],
    queryFn: () => fetch('/api/score/session').then((r) => r.json()),
    staleTime: 60000,
  })
  return (
    <ScoreCtx.Provider value={data ?? { score: 0, level: 1 }}>{children}</ScoreCtx.Provider>
  )
}

export const useScore = () => useContext(ScoreCtx)!


