'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import DashboardNavigation from '@/components/dashboard/navigation';

export default function DashboardLayout({
    children,
}: {
    children: ReactNode;
}) {
    const { user, isLoading, isAuthenticated } = useAuth();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted && !isLoading && !isAuthenticated) {
            router.push('/vendor/auth');
        }
    }, [mounted, isAuthenticated, isLoading, router]);

    if (!mounted || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!isAuthenticated) return null;

    return (
        <div className="flex min-h-screen bg-background">
            <DashboardNavigation />
            <main className="flex-1 overflow-y-auto p-4 pt-20 md:p-8 md:pt-24">
                {children}
            </main>
        </div>
    );
}
