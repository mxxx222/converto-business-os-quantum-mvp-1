import Providers from './providers'
import dynamic from 'next/dynamic'

const CoPilotDrawer = dynamic(() => import('@converto/ui/copilot/CoPilotDrawer').then(m => m.CoPilotDrawer), { ssr: false })

export const metadata = {
  title: 'Converto Receipts',
  description: 'Receipts (SSG + ISR)'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
          <CoPilotDrawer context="receipts" />
        </Providers>
      </body>
    </html>
  )
}

