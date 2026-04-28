'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Sun, Bird, Smartphone } from 'lucide-react';
import { Logo } from '@/components/ui/logo';
import { Button } from '@/components/ui/button';

import { useVendorAuth } from '@/lib/vendor-auth';
import { openWhatsApp } from '@/lib/whatsapp';

export default function WelcomePage() {
    const router = useRouter();
    const { user } = useVendorAuth();

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-between p-6">
            {/* Top Header Section */}
            <div className="w-full max-w-sm pt-12 text-center space-y-2 relative">
                <div className="absolute top-0 right-4 text-slate-300">
                    <Sun className="w-16 h-16 animate-pulse" />
                </div>
                <div className="absolute top-10 left-0 text-slate-300">
                    <Bird className="w-6 h-6" />
                </div>
                <div className="absolute top-16 left-8 text-slate-300">
                    <Bird className="w-4 h-4" />
                </div>

                <h1 className="text-4xl font-black text-slate-900 leading-tight pt-10 px-4">
                    Your Subscription <br /> <span className="text-blue-600">Dashboard</span> is Ready
                </h1>
            </div>

            {/* Illustration Section */}
            <div className="flex-1 flex items-center justify-center w-full max-w-lg relative transition-all duration-700">
                <div className="absolute inset-0 bg-blue-50/50 rounded-full scale-105 blur-3xl animate-pulse" />
                <div className="relative w-full aspect-square">
                    <Image
                        src="/images/onboarding/dashboard-ready.png"
                        alt="Subscription Dashboard Preview"
                        fill
                        className="object-contain"
                        priority
                    />
                </div>
            </div>

            {/* Footer Content */}
            <div className="w-full max-w-sm space-y-8 pb-12 text-center">
                <div className="space-y-3 px-6">
                    <p className="text-slate-500 font-bold text-lg leading-relaxed">
                        Experience the easiest way to track deliveries and manage payments.
                    </p>
                </div>

                {/* Actions */}
                <div className="space-y-4">
                    <Button
                        onClick={() => {
                            if (user?.role === 'tenant_owner') {
                                router.push('/onboarding');
                            } else {
                                router.push('/onboarding/address');
                            }
                        }}
                        className="w-full h-14 bg-black hover:bg-zinc-800 text-white font-bold rounded-2xl text-lg shadow-lg hover:shadow-black/10 transition-all active:scale-[0.98]"
                    >
                        Get Started
                    </Button>


                </div>
            </div>
        </div>
    );
}