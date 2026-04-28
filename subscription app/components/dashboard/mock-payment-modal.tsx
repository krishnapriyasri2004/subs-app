'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, ShieldCheck, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

interface MockPaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    amount?: number;
    title?: string;
}

export function MockPaymentModal({ isOpen, onClose, onSuccess, amount = 1999, title = "Secure Checkout" }: MockPaymentModalProps) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [step, setStep] = useState<'details' | 'processing' | 'success'>('details');

    const handlePay = () => {
        setIsProcessing(true);
        setStep('processing');

        // Simulate network request
        setTimeout(() => {
            setStep('success');
            toast.success('Payment completed successfully!');

            setTimeout(() => {
                setIsProcessing(false);
                setStep('details');
                onSuccess();
                onClose();
            }, 1500);
        }, 2000);
    };

    // Reset state when opened
    React.useEffect(() => {
        if (isOpen) {
            setStep('details');
            setIsProcessing(false);
        }
    }, [isOpen]);

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            if (!isProcessing && !open) onClose();
        }}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-emerald-500" />
                        {title}
                    </DialogTitle>
                    <DialogDescription>
                        This is a simulated payment gateway for testing purposes.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-6">
                    {step === 'details' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-lg border border-slate-100">
                                <span className="text-sm font-medium text-slate-600">Total Amount</span>
                                <span className="text-xl font-black text-slate-900">₹{amount.toLocaleString('en-IN')}</span>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Saved Card</label>
                                    <div className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg bg-white">
                                        <div className="bg-slate-100 p-1.5 rounded">
                                            <CreditCard className="w-5 h-5 text-slate-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900">•••• •••• •••• 4242</p>
                                            <p className="text-[10px] text-slate-500 font-medium">Expires 09/2026</p>
                                        </div>
                                        <div className="ml-auto">
                                            <div className="w-4 h-4 rounded-full border-[5px] border-blue-600"></div>
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    className="w-full h-12 text-base font-bold bg-blue-600 hover:bg-blue-700 text-white"
                                    onClick={handlePay}
                                >
                                    Pay ₹{amount.toLocaleString('en-IN')} Now
                                </Button>
                            </div>
                        </div>
                    )}

                    {step === 'processing' && (
                        <div className="flex flex-col items-center justify-center py-12 space-y-4">
                            <div className="relative">
                                <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-75"></div>
                                <div className="relative bg-blue-500 w-16 h-16 rounded-full flex items-center justify-center shadow-lg">
                                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                                </div>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mt-4">Processing Payment</h3>
                            <p className="text-sm text-slate-500">Please do not close this window...</p>
                        </div>
                    )}

                    {step === 'success' && (
                        <div className="flex flex-col items-center justify-center py-12 space-y-4">
                            <div className="bg-emerald-500 w-16 h-16 rounded-full flex items-center justify-center shadow-lg, shadow-emerald-200 animate-in zoom-in duration-300">
                                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-black text-slate-900 mt-4">Payment Successful!</h3>
                            <p className="text-sm text-emerald-600 font-medium bg-emerald-50 px-3 py-1 rounded-full">
                                Transaction ID: TXN-{Math.floor(Math.random() * 1000000)}
                            </p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
