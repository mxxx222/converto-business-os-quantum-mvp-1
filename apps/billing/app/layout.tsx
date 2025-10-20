import Providers from './providers'
import NotificationProvider from './providers/notifications'
import dynamic from 'next/dynamic'

const CoPilotDrawer = dynamic(() => import('@converto/ui/copilot/CoPilotDrawer').then(m => m.CoPilotDrawer), { ssr: false })

export const metadata = {
  title: 'Converto Billing',
  description: 'Billing (SSG + ISR)'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <NotificationProvider>
            {children}
            <CoPilotDrawer context="billing" />
          </NotificationProvider>
        </Providers>
      </body>
    </html>
  )
}

