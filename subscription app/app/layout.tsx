import type { Metadata } from 'next'
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { VendorAuthProvider } from '@/lib/vendor-auth'
import { cn } from '@/lib/utils'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const plusJakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-jakarta' })

export const metadata: Metadata = {
  title: 'SubScale - Professional Subscription Management',
  description: 'Scale your recurring revenue with SubScale’s high-performance dashboard.',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        inter.variable,
        plusJakarta.variable
      )}>
        <VendorAuthProvider>{children}</VendorAuthProvider>
      </body>
    </html>
  )
}
