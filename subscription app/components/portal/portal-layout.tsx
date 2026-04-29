'use client';

import React, { useEffect, useState } from 'react';
import { PortalHeader } from './portal-header';
import { useAuth } from '@/lib/auth-context';
import { ShieldAlert, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface PortalLayoutProps {
    children: React.ReactNode;
    orgSlug: string;
}

export function PortalLayout({ children, orgSlug }: PortalLayoutProps) {
    const { user, login } = useAuth();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        // Simulating checking session
        const timer = setTimeout(() => {
            setIsChecking(false);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    if (isChecking) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
        );
    }

    if (!user || user.role !== 'customer') {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md border border-slate-200 text-center space-y-6">
                    <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ShieldAlert className="w-8 h-8 text-red-500" />
                    </div>
                    <h1 className="text-2xl font-black text-slate-900">Secure Access Portal</h1>
                    <p className="text-slate-500 text-sm">You need to sign in with a registered customer account to access the {orgSlug} portal.</p>

                    <div className="pt-4 space-y-3">
                        {/* Dummy login trigger for prototype */}
                        <Button
                            className="w-full h-11 text-sm font-bold bg-[#1890ff] hover:bg-[#096dd9] rounded-sm text-white"
                            onClick={() => login('customer@user.com', 'password123')}
                        >
                            Sign In as Customer
                        </Button>
                        <Link href="/login" className="block text-xs font-semibold text-slate-400 hover:text-slate-600">
                            Create an account
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <PortalHeader orgSlug={orgSlug} />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 animate-in fade-in duration-500">
                {children}
            </main>
            <footer className="w-full py-6 text-center text-slate-400 text-xs font-medium">
                <p>Powered by Zoho Subscriptions Clone</p>
                <p className="mt-1">Customer Portal &copy; {new Date().getFullYear()}</p>
            </footer>
        </div>
    );
}
