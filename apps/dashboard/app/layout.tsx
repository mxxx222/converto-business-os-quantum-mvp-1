import Providers from './providers'
import { CoPilotDrawer } from '@converto/ui'
import TopNav from './components/TopNav'

export const metadata = {
  title: 'Converto Dashboard',
  description: 'Dashboard (Edge SSR)'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="max-w-6xl mx-auto px-4">
            <TopNav />
            {children}
          </div>
          <CoPilotDrawer />
        </Providers>
      </body>
    </html>
  )
}

