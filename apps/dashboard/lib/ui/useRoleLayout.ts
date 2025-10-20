"use client"
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

const AdminLayout = dynamic(() => import('../../app/(layouts)/layout.admin'), { ssr: false })
const UserLayout = dynamic(() => import('../../app/(layouts)/layout.user'), { ssr: false })
const AuditorLayout = dynamic(() => import('../../app/(layouts)/layout.auditor'), { ssr: false })

export function useRoleLayout() {
  const [role, setRole] = useState<string | null>(null)
  useEffect(() => {
    fetch('/api/auth/session')
      .then((r) => r.json())
      .then((s) => setRole((s.roles && s.roles[0]) || 'user'))
      .catch(() => setRole('user'))
  }, [])
  if (!role) return { Layout: ({ children }: any) => <>{children}</> }
  const Layout = role === 'admin' ? AdminLayout : role === 'auditor' ? AuditorLayout : UserLayout
  return { Layout }
}


