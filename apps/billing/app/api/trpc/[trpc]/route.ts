import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { appRouter } from '../../../../server/trpc'

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    onError({ error, path }) {
      console.error('tRPC billing', path, error.message)
    },
  })

export { handler as GET, handler as POST }


