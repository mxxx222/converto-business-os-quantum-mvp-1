import AuditTrailClient from './Client'

export default async function AuditTrailPage() {
  const isAdmin = process.env.NODE_ENV !== 'production' && process.env.NEXT_PUBLIC_IS_ADMIN === 'true'
  if (!isAdmin) {
    return <div className="p-6 text-sm text-red-400">Access denied. Admin only.</div>
  }
  return <AuditTrailClient isAdmin={isAdmin} />
}


