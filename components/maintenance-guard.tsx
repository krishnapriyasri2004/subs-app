'use client';

import React from 'react';
import { useData } from '@/lib/data-context';
import { useAuth } from '@/lib/auth-context';
import { ShieldAlert, Clock, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { usePathname } from 'next/navigation';

export default function MaintenanceGuard({ children }: { children: React.ReactNode }) {
    const { globalSettings, isLoading: dataLoading } = useData();
    const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth();
    const pathname = usePathname();

    const isMaintenanceMode = globalSettings?.maintenanceMode;
    const isSuperAdmin = user?.role === 'super_admin';

    // Routes that should ALWAYS be accessible (Auth, Landing, etc.)
    const isAuthRoute = pathname?.includes('/auth') || pathname === '/onboarding' || pathname === '/portal';

    // If maintenance is on, user is logged in, and user is NOT a super admin, show the lock screen
    // EXCEPT if they are on an auth route trying to log in/out
    if (isAuthenticated && isMaintenanceMode && !isSuperAdmin && !isAuthRoute && !authLoading && !dataLoading) {
        return (
            <div className="fixed inset-0 z-[9999] bg-[#020617] flex items-center justify-center p-6 text-center overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />

                {/* Decorative Elements */}
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-indigo-500/10 rounded-full blur-[120px] animate-pulse delay-700" />

                <div className="relative max-w-2xl w-full">
                    <div className="mb-10 inline-flex items-center justify-center w-24 h-24 rounded-[2.5rem] bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 animate-in-zoom">
                        <ShieldAlert className="w-12 h-12" />
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white mb-6 animate-in-up">
                        System <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Maintenance</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-slate-400 mb-12 font-medium leading-relaxed max-w-lg mx-auto animate-in-up delay-100">
                        The platform is currently undergoing a scheduled infrastructure update.
                        We apologize for the interruption and will be back online shortly.
                    </p>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-4 animate-in-up delay-200">
                        <Button
                            onClick={() => window.location.reload()}
                            className="h-14 px-8 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-lg shadow-xl shadow-indigo-500/20 gap-3 transition-transform hover:scale-[1.02] active:scale-95"
                        >
                            <RefreshCcw className="w-5 h-5" /> Refresh
                        </Button>

                        <Button
                            onClick={() => {
                                logout();
                                window.location.href = '/vendor/auth';
                            }}
                            variant="outline"
                            className="h-14 px-8 rounded-2xl border-slate-700 text-slate-300 font-bold text-lg hover:bg-slate-800 transition-all hover:text-white"
                        >
                            Sign Out / Switch Account
                        </Button>
                    </div>

                    <div className="mt-20 pt-10 border-t border-slate-800/50 flex flex-wrap justify-center gap-8 opacity-40 grayscale pointer-events-none animate-in-fade delay-300">
                        <img src="/logo.png" alt="Subtrack" className="h-6 w-auto brightness-0 invert" />
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">Secure Node 04</span>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">Tier-4 Data Center</span>
                    </div>
                </div>

                {/* CSS for animations */}
                <style jsx global>{`
                    @keyframes fade { from { opacity: 0; } to { opacity: 1; } }
                    @keyframes up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                    @keyframes zoom { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
                    .animate-in-fade { animation: fade 0.8s ease forwards; }
                    .animate-in-up { opacity: 0; animation: up 0.8s ease forwards; }
                    .animate-in-zoom { opacity: 0; animation: zoom 0.8s ease forwards; }
                    .delay-100 { animation-delay: 0.1s; }
                    .delay-200 { animation-delay: 0.2s; }
                    .delay-300 { animation-delay: 0.3s; }
                    .delay-700 { animation-delay: 0.7s; }
                `}</style>
            </div>
        );
    }

    return <>{children}</>;
}