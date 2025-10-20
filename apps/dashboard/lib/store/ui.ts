import { create } from 'zustand'

type UIState = {
  modal: string | null
  filters: Record<string, string>
  setModal: (m: string | null) => void
  setFilter: (k: string, v: string) => void
}

export const useUI = create<UIState>((set) => ({
  modal: null,
  filters: {},
  setModal: (modal) => set({ modal }),
  setFilter: (k, v) => set((s) => ({ filters: { ...s.filters, [k]: v } })),
}))


