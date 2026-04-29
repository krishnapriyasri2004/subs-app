import type { Metadata } from 'next'
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { VendorAuthProvider } from '@/lib/vendor-auth'
import { DataProvider } from '@/lib/data-context'
import { ProductsProvider } from '@/lib/products-context'
import { cn } from '@/lib/utils'
import MaintenanceGuard from '@/components/maintenance-guard'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const plusJakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-jakarta', display: 'swap' })

export const metadata: Metadata = {
  title: 'Subtrack - Professional Subscription Management',
  description: "Scale your recurring revenue with Subtrack's high-performance dashboard.",
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
        <VendorAuthProvider>
          <DataProvider>
            <ProductsProvider>
              <MaintenanceGuard>
                {children}
              </MaintenanceGuard>
            </ProductsProvider>
          </DataProvider>
        </VendorAuthProvider>
      </body>
    </html>
  )
}