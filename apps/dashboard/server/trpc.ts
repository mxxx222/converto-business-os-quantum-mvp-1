import { initTRPC } from '@trpc/server'
import { z } from 'zod'

const t = initTRPC.create()

async function getItem(id: string) {
  // placeholder mock
  return { id, name: `Item ${id}` }
}

async function updateItem(input: { id: string; name: string }) {
  // placeholder mock update
  return { ok: true, ...input }
}

export const appRouter = t.router({
  item: t.router({
    get: t.procedure.input(z.string()).query(({ input }) => getItem(input)),
    update: t.procedure
      .input(z.object({ id: z.string(), name: z.string() }))
      .mutation(({ input }) => updateItem(input)),
  }),
})

export type AppRouter = typeof appRouter


