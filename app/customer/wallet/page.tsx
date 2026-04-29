'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Wallet,
    ArrowUpRight,
    History,
    CreditCard,
    ChevronLeft,
    Plus,
    CheckCircle2,
    ShieldCheck,
    Clock
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useVendorAuth } from '@/lib/vendor-auth';

export default function WalletPage() {
    const router = useRouter();
    const { user, updateUser } = useVendorAuth();
    const balance = user?.walletBalance || 0;
    const [isRecharging, setIsRecharging] = useState(false);

    const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
    const [step, setStep] = useState<'select' | 'pay'>('select');

    const transactions = [
        { id: 'TXN-9982', type: 'recharge', amount: 500, date: 'Mar 28, 2024', status: 'success', method: 'UPI' },
        { id: 'ORD-1123', type: 'payment', amount: -32, date: 'Mar 30, 2024', status: 'success', method: 'Wallet' },
        { id: 'ORD-1122', type: 'payment', amount: -32, date: 'Mar 29, 2024', status: 'success', method: 'Wallet' },
        { id: 'TXN-9921', type: 'recharge', amount: 200, date: 'Mar 25, 2024', status: 'success', method: 'Card' },
    ];

    const handleSelectAmount = (amount: number) => {
        setSelectedAmount(amount);
        setStep('pay');
    };

    const handlePay = async () => {
        if (!selectedAmount) return;
        setIsRecharging(true);
        const toastId = toast.loading(`Initiating payment for ₹${selectedAmount}...`);

        try {
            await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate payment gateway
            await updateUser({ walletBalance: balance + selectedAmount });
            toast.success(`Payment Successful! ₹${selectedAmount} added.`, { id: toastId });
            setStep('select');
            setSelectedAmount(null);
        } catch (error) {
            toast.error("Payment failed. Please try again.", { id: toastId });
        } finally {
            setIsRecharging(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFDFF] font-sans text-slate-900 flex justify-center py-0 sm:py-8">
            <div className="w-full max-w-lg bg-white min-h-[92vh] sm:rounded-[3.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] relative flex flex-col overflow-hidden border border-slate-100/50">

                {/* Header */}
                <div className="px-7 py-8 flex items-center justify-between">
                    <button
                        onClick={() => router.back()}
                        className="w-11 h-11 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-all active:scale-90"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <h1 className="text-xl font-black text-slate-900 tracking-tight italic">My Wallet</h1>
                    <button className="w-11 h-11 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                        <ShieldCheck className="w-5 h-5 text-emerald-500" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto scrollbar-none pb-12 px-6">
                    <div className="space-y-10">

                        {/* 1. Main Balance Card - Premium Glass */}
                        <div className="relative pt-4">
                            <Card className="bg-gradient-to-br from-indigo-600 via-blue-600 to-indigo-700 border-none rounded-[2.5rem] p-8 shadow-2xl shadow-blue-200 relative overflow-hidden group">
                                <div className="relative z-10">
                                    <div className="flex items-center gap-2 text-blue-100/60 font-black text-[10px] uppercase tracking-[0.2em] mb-4">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                        Current Balance
                                    </div>
                                    <div className="flex items-baseline gap-1 mb-8">
                                        <span className="text-xl font-black text-blue-200 tracking-tighter">₹</span>
                                        <span className="text-5xl font-black text-white tabular-nums tracking-tighter">
                                            {balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex -space-x-3">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className="w-8 h-8 rounded-full border-2 border-indigo-600 bg-white/20 backdrop-blur-md" />
                                            ))}
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-blue-100/40 uppercase tracking-widest mb-1">Last Sync</p>
                                            <p className="text-xs font-bold text-white">Just now</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Background Orbs */}
                                <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute top-0 right-1/4 w-32 h-32 bg-indigo-400/20 rounded-full blur-2xl" />
                            </Card>
                        </div>

                        {/* 2. Quick Recharge Section */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between px-2">
                                <h2 className="text-lg font-black text-slate-900">Add Money</h2>
                                <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest bg-indigo-50 px-2 py-1 rounded">Flash Pay</span>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {[200, 500, 1000, 2000].map(amt => (
                                    <button
                                        key={amt}
                                        onClick={() => handleSelectAmount(amt)}
                                        disabled={isRecharging}
                                        className={cn(
                                            "h-16 rounded-2xl bg-white border shadow-sm flex flex-col items-center justify-center transition-all active:scale-95 group relative overflow-hidden",
                                            selectedAmount === amt ? "border-indigo-600 bg-indigo-50 ring-2 ring-indigo-100" : "border-slate-100 hover:bg-slate-50 hover:border-slate-200"
                                        )}
                                    >
                                        <span className={cn(
                                            "text-lg font-black tracking-tight",
                                            selectedAmount === amt ? "text-indigo-600" : "text-slate-900"
                                        )}>+ ₹{amt}</span>
                                        <div className="absolute right-0 bottom-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <ArrowUpRight className="w-3 h-3 text-emerald-500" />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 3. Transaction History */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between px-2">
                                <h2 className="text-lg font-black text-slate-900 font-black">History</h2>
                                <button className="text-[11px] font-black text-slate-400 uppercase tracking-widest uppercase mb-1 tracking-widest italic">View All</button>
                            </div>

                            <div className="space-y-3">
                                {transactions.map((tx, i) => (
                                    <div key={i} className="p-5 bg-slate-50/50 rounded-3xl border border-slate-100 flex items-center justify-between group hover:bg-white hover:shadow-md transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className={cn(
                                                "w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm",
                                                tx.type === 'recharge' ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"
                                            )}>
                                                {tx.type === 'recharge' ? <Plus className="w-6 h-6" /> : <CreditCard className="w-5 h-5" />}
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-black text-slate-900 capitalize">{tx.type}</h4>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{tx.date} • {tx.method}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className={cn(
                                                "text-base font-black tracking-tight",
                                                tx.amount > 0 ? "text-emerald-600" : "text-slate-900"
                                            )}>
                                                {tx.amount > 0 ? '+' : ''}₹{Math.abs(tx.amount)}
                                            </p>
                                            <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Success</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>

                {/* Bottom Sticky Action */}
                <div className="px-6 py-8 bg-white border-t border-slate-100/60 sticky bottom-0">
                    {step === 'select' ? (
                        <Button
                            onClick={() => handleSelectAmount(1000)}
                            className="w-full h-18 bg-slate-900 hover:bg-black text-white font-black rounded-[2.2rem] text-xl shadow-2xl shadow-slate-300 transition-all active:scale-[0.97] flex items-center justify-center gap-3"
                        >
                            <Wallet className="w-6 h-6" />
                            Refill Wallet
                        </Button>
                    ) : (
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between px-2 mb-2">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount to Pay</span>
                                    <span className="text-2xl font-black text-slate-900">₹{selectedAmount}</span>
                                </div>
                                <button
                                    onClick={() => { setStep('select'); setSelectedAmount(null); }}
                                    className="text-xs font-black text-rose-500 hover:text-rose-600 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                            <Button
                                onClick={handlePay}
                                disabled={isRecharging}
                                className="w-full h-18 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-[2.2rem] text-xl shadow-2xl shadow-indigo-300 transition-all active:scale-[0.97] flex items-center justify-center gap-3"
                            >
                                <CheckCircle2 className="w-6 h-6 text-white" />
                                {isRecharging ? 'Processing...' : `Pay ₹${selectedAmount}`}
                            </Button>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}