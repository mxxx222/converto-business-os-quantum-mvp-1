import { initTRPC } from '@trpc/server'
import { z } from 'zod'

const t = initTRPC.create()

export const appRouter = t.router({
  invoices: t.router({
    list: t.procedure.query(async () => [{ id: 'inv_1', total: 123 }]),
    get: t.procedure.input(z.string()).query(async ({ input }) => ({ id: input, total: 123 })),
  }),
})

export type AppRouter = typeof appRouter


