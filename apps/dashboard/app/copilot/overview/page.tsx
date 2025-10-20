import CoPilotGlobalOverviewClient from './Client'

export default async function CoPilotGlobalOverviewPage() {
  const isAdmin = process.env.NODE_ENV !== 'production' && process.env.NEXT_PUBLIC_IS_ADMIN === 'true'
  return <CoPilotGlobalOverviewClient isAdmin={isAdmin} />
}


