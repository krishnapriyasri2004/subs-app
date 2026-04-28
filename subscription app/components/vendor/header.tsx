'use client';

import React from 'react';
import Image from 'next/image';
import { Search, Bell, MessageSquare, ChevronDown } from 'lucide-react';
import { useVendorAuth } from '@/lib/vendor-auth';
import { toast } from 'sonner';

export function VendorHeader() {
    const { user } = useVendorAuth();

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const query = (e.target as HTMLInputElement).value;
            if (query) {
                toast.info(`Global search for "${query}" initiated...`);
            }
        }
    };

    return (
        <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-8 shrink-0 relative z-40 print:hidden">
            <div className="flex-1 max-w-xl relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search for customers, invoices..."
                    onKeyDown={handleSearch}
                    className="w-full h-11 bg-slate-50 border-none rounded-2xl pl-12 pr-4 text-sm focus:ring-1 focus:ring-blue-100 placeholder:text-slate-400 font-medium transition-all"
                />
            </div>

            <div className="flex items-center gap-6">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => toast.info('Direct messages feature coming soon!')}
                        className="p-2.5 rounded-xl hover:bg-slate-50 text-slate-400 transition-colors relative group"
                    >
                        <MessageSquare className="w-5 h-5 group-hover:text-blue-500 transition-colors" />
                        <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-blue-500 rounded-full border border-white" />
                    </button>
                    <button 
                        onClick={() => toast.info('No new system notifications.')}
                        className="p-2.5 rounded-xl hover:bg-slate-50 text-slate-400 transition-colors relative group"
                    >
                        <Bell className="w-5 h-5 group-hover:text-blue-500 transition-colors" />
                        <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
                    </button>
                </div>

                <div className="h-8 w-px bg-slate-100" />

                <div className="flex items-center gap-4 group cursor-pointer hover:bg-slate-50 p-1.5 pr-3 rounded-2xl transition-all">
                    <div className="text-right flex flex-col items-end">
                        <div className="flex items-center gap-1.5">
                            <span className="text-xs font-black text-slate-900 leading-none">Welcome, {user?.name || 'Admin'}</span>
                            <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-blue-500 transition-colors" />
                        </div>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mt-0.5">{user?.role || 'Vendor'}</span>
                    </div>
                    <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center overflow-hidden shadow-sm shadow-blue-600/10 relative text-xs font-black text-blue-600">
                        {user?.name ? user.name.charAt(0) : 'A'}
                    </div>
                </div>
            </div>
        </header>
    );
}
