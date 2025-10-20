import { initTRPC } from '@trpc/server'
import { z } from 'zod'

const t = initTRPC.create()

export const appRouter = t.router({
  policies: t.router({
    list: t.procedure.query(async () => [{ id: 'pol_1', title: 'Privacy' }]),
    get: t.procedure.input(z.string()).query(async ({ input }) => ({ id: input, title: 'Privacy' })),
  }),
})

export type AppRouter = typeof appRouter


