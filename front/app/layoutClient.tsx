'use client'
import { SnackbarProvider } from 'notistack'
import { Exo } from 'next/font/google'
import NavBar from './Components/NavBar'
import RainbowComponent from './rainbow'


const exo_font = Exo({ weight: ['400'], subsets: ['latin'] })

export default function ClientRootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
      <SnackbarProvider>
        <body className={exo_font.className}>
          <RainbowComponent>
            <NavBar/>
            {children}
          </RainbowComponent>
        </body>
      </SnackbarProvider>
  )
}
