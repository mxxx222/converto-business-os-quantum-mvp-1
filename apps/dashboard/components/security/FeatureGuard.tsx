'use client'
import { type ReactNode, useEffect, useState } from 'react'

export default function FeatureGuard({ feature, roles, children }: { feature: string; roles: string[]; children: ReactNode }) {
  const [ok, setOk] = useState(false)
  useEffect(() => {
    fetch('/api/auth/session')
      .then((r) => r.json())
      .then((s) => {
        const mat = (s?.features || {}) as Record<string, string[]>
        setOk((mat[feature] || []).some((r) => (roles || []).includes(r)))
      })
      .catch(() => setOk(false))
  }, [feature, roles])
  if (!ok) return null
  return <>{children}</>
}


