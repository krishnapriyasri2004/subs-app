'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

interface RazorpayButtonProps {
    amount: number;
    invoiceId: string;
    onSuccess?: () => void;
    className?: string;
    text?: string;
}

export function RazorpayButton({ amount, invoiceId, onSuccess, className, text = "Pay Now" }: RazorpayButtonProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handlePayment = async () => {
        setIsLoading(true);

        try {
            // Mock opening Razorpay checkout
            toast.loading("Initializing secure payment gateway...", { id: "checkout" });
            await new Promise(resolve => setTimeout(resolve, 1500));
            toast.dismiss("checkout");

            // Mock successful payment
            const paymentSuccess = new Promise(resolve => setTimeout(resolve, 1000));
            toast.promise(paymentSuccess, {
                loading: "Processing payment...",
                success: `Successfully paid ₹${amount.toLocaleString('en-IN')} for ${invoiceId}!`,
                error: "Payment failed to process."
            });

            await paymentSuccess;

            if (onSuccess) {
                onSuccess();
            }
        } catch (error) {
            toast.error("Failed to initialize payment gateway.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            className={className || "font-bold shadow-sm"}
            onClick={handlePayment}
            disabled={isLoading}
        >
            {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CreditCard className="w-4 h-4 mr-2" />}
            {text}
        </Button>
    );
}
