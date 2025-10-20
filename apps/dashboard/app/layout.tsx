import Providers from './providers'
import NotificationProvider from './providers/notifications'
import { ScoreProvider } from '../lib/score/context'
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
          <NotificationProvider>
            {process.env.NEXT_PUBLIC_SCORE_ENABLED === 'true' ? (
              <ScoreProvider>
                <div className="max-w-6xl mx-auto px-4">
                  <TopNav />
                  {children}
                </div>
                <CoPilotDrawer />
              </ScoreProvider>
            ) : (
              <>
                <div className="max-w-6xl mx-auto px-4">
                  <TopNav />
                  {children}
                </div>
                <CoPilotDrawer />
              </>
            )}
          </NotificationProvider>
        </Providers>
      </body>
    </html>
  )
}

