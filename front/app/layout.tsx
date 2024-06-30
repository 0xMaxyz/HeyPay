import { Exo } from 'next/font/google'
import './globals.css'
import ClientRootLayout from './layoutClient'

const exo_font = Exo({ weight: ['400'], subsets: ['latin'] })
export const metadata = {
  title: 'HeyPay',
  description: 'Transfer crytpo easy to Email'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <script src="https://accounts.google.com/gsi/client" async></script>
      <ClientRootLayout>{children}</ClientRootLayout>
    </html>
  )
}
