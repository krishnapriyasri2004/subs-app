'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, CreditCard, FileText, UserCircle, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/ui/logo';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';

export function PortalHeader({ orgSlug }: { orgSlug: string }) {
    const pathname = usePathname();
    const { logout } = useAuth();

    // Convert url slug to readable name
    const orgName = orgSlug.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase());

    const navItems = [
        { name: 'Dashboard', href: `/portal/${orgSlug}`, icon: LayoutDashboard },
        { name: 'My Subscriptions', href: `/portal/${orgSlug}/subscriptions`, icon: CreditCard },
        { name: 'Invoices', href: `/portal/${orgSlug}/invoices`, icon: FileText },
        { name: 'Profile', href: `/portal/${orgSlug}/profile`, icon: UserCircle },
    ];

    return (
        <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 flex items-center gap-3">
                            <Logo variant="dark" />
                            <div className="hidden sm:block h-6 w-px bg-slate-200 mx-2" />
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-600 hidden sm:block">
                                {orgName}
                            </span>
                        </div>
                        <nav className="hidden md:ml-8 md:flex md:space-x-8">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors",
                                            isActive
                                                ? "border-indigo-500 text-indigo-600"
                                                : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700"
                                        )}
                                    >
                                        <item.icon className="w-4 h-4 mr-2" />
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" className="text-xs font-semibold uppercase tracking-wider text-slate-500 hover:text-slate-800 hover:bg-slate-100 flex items-center gap-2" onClick={logout}>
                            <LogOut className="w-4 h-4 shrink-0" />
                            <span className="hidden sm:inline">Logout</span>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden border-t border-slate-100 bg-slate-50">
                <div className="flex justify-around py-2 px-2 overflow-x-auto custom-scrollbar">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex flex-col items-center p-2 rounded-lg min-w-[70px] transition-colors",
                                    isActive
                                        ? "text-indigo-600 bg-indigo-50"
                                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                                )}
                            >
                                <item.icon className="w-5 h-5 mb-1" />
                                <span className="text-[10px] font-semibold">{item.name}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </header>
    );
}
