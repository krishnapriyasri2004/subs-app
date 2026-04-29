'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Search, Bell, MessageSquare, ChevronDown, Clock, CheckCircle2, Menu } from 'lucide-react';
import { useVendorAuth } from '@/lib/vendor-auth';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MessageDialog } from '@/components/vendor/message-dialog';
import { NotificationDialog } from '@/components/vendor/notification-dialog';

export function VendorHeader() {
    const { user } = useVendorAuth();
    const [selectedMessage, setSelectedMessage] = useState<any>(null);
    const [isMessageOpen, setIsMessageOpen] = useState(false);
    
    const [selectedNotification, setSelectedNotification] = useState<any>(null);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);

    const handleMessageClick = (msg: any) => {
        setSelectedMessage(msg);
        setIsMessageOpen(true);
    };

    const handleNotificationClick = (notif: any) => {
        setSelectedNotification(notif);
        setIsNotificationOpen(true);
    };

    return (
        <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-4 md:px-8 shrink-0 relative z-40 print:hidden">
            <div className="flex-1 max-w-xl relative flex items-center gap-3">
                <button 
                  className="p-2 -ml-2 text-black hover:text-slate-800 transition-colors"
                  onClick={() => document.dispatchEvent(new CustomEvent('toggle-mobile-sidebar'))}
                >
                    <Menu className="w-5 h-5" />
                </button>
            </div>

            <div className="flex items-center gap-6">
                <div className="flex items-center gap-4">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="p-2.5 rounded-xl hover:bg-slate-50 text-slate-400 transition-colors relative group outline-none">
                                <MessageSquare className="w-5 h-5 group-hover:text-blue-500 transition-colors" />
                                <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-blue-500 rounded-full border border-white" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-80 p-2 border-slate-100 rounded-2xl shadow-xl">
                            <DropdownMenuLabel className="flex items-center justify-between px-2 py-2">
                                <span className="text-xs font-black uppercase tracking-widest text-slate-900">Messages</span>
                                <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded-full">2 New</span>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-slate-50" />
                            <div className="flex flex-col gap-1 mt-1 max-h-[300px] overflow-y-auto custom-scrollbar">
                                {[
                                    { name: 'Ganesh Kumar', time: '10m ago', msg: 'Need help upgrading my subscription plan.', read: false },
                                    { name: 'Anjali Verma', time: '1h ago', msg: 'Can you hold my deliveries for next week?', read: false },
                                    { name: 'Support Team', time: '2d ago', msg: 'Your account review has been completed.', read: true },
                                ].map((item, i) => (
                                    <DropdownMenuItem 
                                        key={i} 
                                        onClick={() => handleMessageClick(item)}
                                        className="flex flex-col items-start gap-1 p-3 cursor-pointer rounded-xl focus:bg-slate-50"
                                    >
                                        <div className="flex items-center justify-between w-full">
                                            <span className={`text-sm font-bold ${item.read ? 'text-slate-600' : 'text-slate-900'}`}>{item.name}</span>
                                            <span className="text-[10px] font-bold text-slate-400">{item.time}</span>
                                        </div>
                                        <p className="text-xs text-slate-500 line-clamp-1 font-medium">{item.msg}</p>
                                    </DropdownMenuItem>
                                ))}
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="p-2.5 rounded-xl hover:bg-slate-50 text-slate-400 transition-colors relative group outline-none">
                                <Bell className="w-5 h-5 group-hover:text-blue-500 transition-colors" />
                                <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white animate-pulse" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-80 p-2 border-slate-100 rounded-2xl shadow-xl">
                            <DropdownMenuLabel className="flex items-center justify-between px-2 py-2">
                                <span className="text-xs font-black uppercase tracking-widest text-slate-900">Notifications</span>
                                <Button variant="link" className="h-auto p-0 text-[10px] font-bold text-slate-400 hover:text-blue-600">Mark all as read</Button>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-slate-50" />
                            <div className="flex flex-col gap-1 mt-1 max-h-[300px] overflow-y-auto custom-scrollbar">
                                {[
                                    { title: 'Payment Failed', desc: 'Subscription SUB-012 payment of ₹999 failed.', time: 'Just now', type: 'error', icon: <div className="w-2 h-2 rounded-full bg-rose-500 shrink-0" /> },
                                    { title: 'New Customer', desc: 'Rahul Sharma has signed up for Pro Plan.', time: '2 hours ago', type: 'success', icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> },
                                    { title: 'System Update', desc: 'Scheduled maintenance will occur tonight.', time: '5 hours ago', type: 'info', icon: <Clock className="w-3.5 h-3.5 text-blue-500 shrink-0" /> },
                                ].map((item, i) => (
                                    <DropdownMenuItem 
                                        key={i} 
                                        onClick={() => handleNotificationClick(item)}
                                        className="flex items-start gap-3 p-3 cursor-pointer rounded-xl focus:bg-slate-50"
                                    >
                                        <div className="mt-1">{item.icon}</div>
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-xs font-bold text-slate-900">{item.title}</span>
                                            <span className="text-[11px] font-medium text-slate-500 leading-tight">{item.desc}</span>
                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">{item.time}</span>
                                        </div>
                                    </DropdownMenuItem>
                                ))}
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div className="h-8 w-px bg-slate-100" />

                <div className="flex items-center gap-4 group cursor-pointer hover:bg-slate-50 p-1.5 pr-3 rounded-2xl transition-all">
                    <div className="text-right flex flex-col items-end">
                        <div className="flex items-center gap-1.5">
                            <span className="text-xs font-black text-slate-900 leading-none">Welcome, {user?.name || (user?.email === 'admin@vendor.com' ? 'admin@vendor.com' : 'Admin')}</span>
                            <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-blue-500 transition-colors" />
                        </div>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mt-0.5">{user?.role || 'Admin'}</span>
                    </div>
                    <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center overflow-hidden shadow-sm shadow-blue-600/10 relative">
                        <Image
                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                            alt="Profile"
                            fill
                            className="object-cover"
                            sizes="40px"
                        />
                    </div>
                </div>
            </div>
            <MessageDialog 
                isOpen={isMessageOpen}
                onClose={() => setIsMessageOpen(false)}
                customerName={selectedMessage?.name || ''}
                initialMessage={selectedMessage?.msg || ''}
            />
            <NotificationDialog
                isOpen={isNotificationOpen}
                onClose={() => setIsNotificationOpen(false)}
                notification={selectedNotification}
            />
        </header>
    );
}