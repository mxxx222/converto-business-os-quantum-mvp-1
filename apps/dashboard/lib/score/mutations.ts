import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useAddPoints() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (delta: number) =>
      fetch('/api/score/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ delta }),
      }).then((r) => r.json()),
    onMutate: async (delta) => {
      await qc.cancelQueries({ queryKey: ['score', 'session'] })
      const prev = qc.getQueryData<any>(['score', 'session'])
      qc.setQueryData(['score', 'session'], (o: any) => ({ ...(o || {}), score: (o?.score || 0) + delta }))
      return { prev }
    },
    onError: (_e, _d, ctx) => {
      if (ctx?.prev) qc.setQueryData(['score', 'session'], ctx.prev)
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ['score', 'session'] }),
  })
}


