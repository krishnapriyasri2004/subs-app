'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useVendorAuth } from '@/lib/vendor-auth';
import { useRouter, usePathname } from 'next/navigation';
import { VendorSidebar } from '@/components/vendor/sidebar';
import { VendorHeader } from '@/components/vendor/header';
import { ProductsProvider } from '@/lib/products-context';

export default function VendorLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { isAuthenticated, isLoading, user } = useVendorAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isAuthPage = pathname?.startsWith('/vendor/auth');

  useEffect(() => {
    if (mounted && !isLoading && !isAuthenticated && !isAuthPage) {
      router.push('/vendor/auth');
    }
  }, [mounted, isAuthenticated, isLoading, router, isAuthPage]);

  if (!mounted) return null;

  if (isAuthPage) {
    return <div className="min-h-screen bg-background">{children}</div>;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div suppressHydrationWarning className="flex h-screen bg-[#f8fafc] print:h-auto print:bg-white print:block">
      <VendorSidebar />
      <div className="flex-1 flex flex-col overflow-hidden print:overflow-visible print:block">
        <VendorHeader />
        <main className="flex-1 overflow-auto p-8 print:p-0 print:overflow-visible print:block">
          <ProductsProvider>
            {children}
          </ProductsProvider>
        </main>
      </div>
    </div>
  );
}
