import Providers from './providers'
import { CoPilotDrawer } from '@converto/ui'

export const metadata = {
  title: 'Converto Dashboard',
  description: 'Dashboard (Edge SSR)'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
          <CoPilotDrawer />
        </Providers>
      </body>
    </html>
  )
}

