import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export function useItem(id: string) {
  return useQuery({
    queryKey: ['items', id],
    queryFn: () => fetch(`/api/items/${id}`).then((r) => r.json()),
  })
}

export function useUpdateItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: { id: string; name: string }) =>
      fetch(`/api/items/${payload.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).then((r) => r.json()),
    onMutate: async (payload) => {
      await qc.cancelQueries({ queryKey: ['items', payload.id] })
      const prev = qc.getQueryData<any>(['items', payload.id])
      qc.setQueryData(['items', payload.id], { ...prev, name: payload.name })
      return { prev }
    },
    onError: (_err, payload, ctx) => {
      if (ctx?.prev) qc.setQueryData(['items', payload.id], ctx.prev)
    },
    onSettled: (_d, _e, payload) => {
      qc.invalidateQueries({ queryKey: ['items', payload.id] })
    },
  })
}


