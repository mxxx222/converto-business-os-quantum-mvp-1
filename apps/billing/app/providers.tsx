'use client'

import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { trpc } from '../lib/trpc'
import { httpBatchLink } from '@trpc/client'

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 3,
            retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
            staleTime: 30000,
            refetchOnWindowFocus: false,
          },
          mutations: { retry: 1 },
        },
      }),
  )
  const [trpcClient] = useState(() => trpc.createClient({ links: [httpBatchLink({ url: '/api/trpc' })] }))
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
        {process.env.NODE_ENV !== 'production' ? (
          <ReactQueryDevtools initialIsOpen={false} />
        ) : null}
      </QueryClientProvider>
    </trpc.Provider>
  )
}

