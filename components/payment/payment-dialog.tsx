'use client';

import React, { useState } from 'react';
import {
    Dialog,
    DialogContent
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Wallet, Smartphone, CreditCard, CheckCircle2, ChevronRight, X, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface PaymentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    amount: number;
    productName: string;
    onSuccess: () => void;
    onDone?: () => void;
}

type PaymentMethod = 'upi' | 'wallet' | 'card';

export function PaymentDialog({ open, onOpenChange, amount, productName, onSuccess, onDone }: PaymentDialogProps) {
    const [method, setMethod] = useState<PaymentMethod>('upi');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    
    // Persist values locally so they don't reset to 0 when the cart is cleared in the background
    const [displayAmount, setDisplayAmount] = useState(amount);
    const [displayName, setDisplayName] = useState(productName);

    // Sync values only when NOT in success state
    React.useEffect(() => {
        if (!isSuccess && open) {
            setDisplayAmount(amount);
            setDisplayName(productName);
        }
    }, [amount, productName, isSuccess, open]);

    // Reset success state when dialog closes
    React.useEffect(() => {
        if (!open) {
            const timer = setTimeout(() => setIsSuccess(false), 300);
            return () => clearTimeout(timer);
        }
    }, [open]);

    const handlePayment = async () => {
        setIsProcessing(true);
        const loadingToast = toast.loading(`Processing payment...`);
        
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            toast.dismiss(loadingToast);
            toast.success("Payment successful!");
            
            setIsSuccess(true);
            onSuccess();
        } catch (error) {
            toast.dismiss(loadingToast);
            toast.error("Payment failed. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden bg-white border-none shadow-2xl rounded-[2.5rem] z-[100]">
                {!isSuccess ? (
                    <div className="flex flex-col">
                        {/* Header Section */}
                        <div className="bg-gradient-to-br from-[#151921] to-[#2d3648] p-8 text-white relative">
                            <button 
                                onClick={() => onOpenChange(false)}
                                className="absolute top-6 right-6 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all active:scale-95 z-50 text-white"
                            >
                                <X className="w-4 h-4" />
                            </button>

                            <div className="space-y-1 mb-6">
                                <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">Secure Checkout</p>
                                <h2 className="text-3xl font-black tracking-tight">{displayName}</h2>
                            </div>

                            <div className="flex items-baseline gap-1 bg-white/10 w-fit px-4 py-2 rounded-2xl border border-white/5">
                                <span className="text-white/60 font-bold text-lg">₹</span>
                                <span className="text-4xl font-black tabular-nums">{displayAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                            </div>
                        </div>

                        {/* Selection Area */}
                        <div className="p-8 space-y-6 bg-white">
                            <div className="space-y-4">
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Payment Method</h3>
                                
                                <div className="grid gap-3">
                                    <button
                                        onClick={() => setMethod('upi')}
                                        className={cn(
                                            "flex items-center justify-between p-4 rounded-2xl border-2 transition-all active:scale-[0.98]",
                                            method === 'upi' ? "border-indigo-600 bg-indigo-50/50" : "border-slate-100 hover:border-slate-200"
                                        )}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                                                <Smartphone className="w-5 h-5" />
                                            </div>
                                            <div className="text-left">
                                                <p className="text-sm font-black text-slate-900">UPI Pay</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase">GPay, PhonePe, Paytm</p>
                                            </div>
                                        </div>
                                        {method === 'upi' && <div className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center"><CheckCircle2 className="w-3.5 h-3.5 text-white" /></div>}
                                    </button>

                                    <button
                                        onClick={() => setMethod('wallet')}
                                        className={cn(
                                            "flex items-center justify-between p-4 rounded-2xl border-2 transition-all active:scale-[0.98]",
                                            method === 'wallet' ? "border-amber-500 bg-amber-50/50" : "border-slate-100 hover:border-slate-200"
                                        )}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
                                                <Wallet className="w-5 h-5" />
                                            </div>
                                            <div className="text-left">
                                                <p className="text-sm font-black text-slate-900">Wallet Credits</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase">Balance: ₹2,400.00</p>
                                            </div>
                                        </div>
                                        {method === 'wallet' && <div className="w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center"><CheckCircle2 className="w-3.5 h-3.5 text-white" /></div>}
                                    </button>

                                    <button
                                        onClick={() => setMethod('card')}
                                        className={cn(
                                            "flex items-center justify-between p-4 rounded-2xl border-2 transition-all active:scale-[0.98]",
                                            method === 'card' ? "border-slate-800 bg-slate-50" : "border-slate-100 hover:border-slate-200"
                                        )}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                                                <CreditCard className="w-5 h-5" />
                                            </div>
                                            <div className="text-left">
                                                <p className="text-sm font-black text-slate-900">Credit Card</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase">Visa, Master, RuPay</p>
                                            </div>
                                        </div>
                                        {method === 'card' && <div className="w-5 h-5 bg-slate-800 rounded-full flex items-center justify-center"><CheckCircle2 className="w-3.5 h-3.5 text-white" /></div>}
                                    </button>
                                </div>
                            </div>

                            <div className="pt-2">
                                <Button 
                                    onClick={handlePayment}
                                    disabled={isProcessing}
                                    className="w-full h-16 bg-[#151921] hover:bg-black text-white font-black rounded-2xl text-lg flex items-center justify-between px-8 shadow-xl shadow-slate-200 active:scale-95 transition-all disabled:opacity-50"
                                >
                                    <span className="uppercase tracking-[0.2em] text-[11px]">Confirm Payment</span>
                                    <div className="flex items-center gap-4">
                                        <p className="text-base tracking-tighter">₹{displayAmount.toFixed(2)}</p>
                                        <ChevronRight className="w-5 h-5" />
                                    </div>
                                </Button>
                            </div>
                            
                            <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-2 flex items-center justify-center gap-2">
                                🔐 SSL Secured • 256-Bit Encrypted
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="p-10 pb-12 flex flex-col items-center text-center space-y-6 bg-white">
                        <div className="w-24 h-24 bg-emerald-100 rounded-[2.5rem] flex items-center justify-center animate-bounce">
                            <CheckCircle2 className="w-12 h-12 text-emerald-600" />
                        </div>
                        
                        <div className="space-y-1">
                            <h2 className="text-3xl font-black tracking-tight text-slate-900">Payment Success!</h2>
                            <p className="text-slate-500 font-medium">Your transaction for {displayName} was successful.</p>
                        </div>

                        <div className="w-full bg-slate-50 rounded-3xl p-5 border border-slate-100 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-indigo-600 border border-indigo-50">
                                <Wallet className="w-6 h-6" />
                            </div>
                            <div className="text-left flex-1">
                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Total Paid</p>
                                <p className="text-lg font-black text-slate-900 leading-none">₹{displayAmount.toFixed(2)}</p>
                            </div>
                        </div>

                        <Button 
                            onClick={() => {
                                onOpenChange(false);
                                onDone?.();
                            }}
                            className="w-full h-14 bg-[#151921] hover:bg-black text-white font-black rounded-2xl shadow-xl shadow-slate-200 active:scale-95 transition-all text-sm uppercase tracking-[0.2em]"
                        >
                            Done
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
