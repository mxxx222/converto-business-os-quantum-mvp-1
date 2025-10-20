import { initTRPC } from '@trpc/server'
import { z } from 'zod'

const t = initTRPC.create()

export const appRouter = t.router({
  receipts: t.router({
    list: t.procedure.query(async () => [{ id: 'rcp_1', total: 12.34 }]),
    get: t.procedure.input(z.string()).query(async ({ input }) => ({ id: input, total: 12.34 })),
  }),
})

export type AppRouter = typeof appRouter


