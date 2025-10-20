import { create } from 'zustand'

type Note = { id: string; type: 'success' | 'error' | 'info'; msg: string }

type NotifyState = {
  notes: Note[]
  push: (n: Note) => void
  clear: () => void
}

export const useNotify = create<NotifyState>((set) => ({
  notes: [],
  push: (n) => set((s) => ({ notes: [n, ...s.notes].slice(0, 200) })),
  clear: () => set({ notes: [] }),
}))


