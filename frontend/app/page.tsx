import { redirect } from 'next/navigation'

export default function Home() {
  // Redirect root to premium dashboard
  redirect('/dashboard')
}


