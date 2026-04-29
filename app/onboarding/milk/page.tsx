'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft, CheckCircle2, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function MilkSubscriptionPage() {
    const router = useRouter();
    const [quantity, setQuantity] = useState(1);
    const [address, setAddress] = useState("");

    const handleContinue = () => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('is_new_customer', 'true');
            if (address) {
                localStorage.setItem('new_user_address', address);
            }
        }
        router.push('/vendor/dashboard');
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-12">
            <div className="px-6 py-8 flex items-center gap-4 bg-white shadow-sm sticky top-0 z-10">
                <button onClick={() => router.back()} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <h1 className="text-2xl font-black tracking-tight text-slate-800">Fresh Milk Setup</h1>
            </div>

            <div className="px-6 py-12 max-w-lg mx-auto space-y-8">
                <div className="bg-white p-8 rounded-3xl border-2 border-blue-100 shadow-sm space-y-6">
                    <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
                        <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center font-bold text-2xl">
                            A2
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-800">A2 Daily Milk</h2>
                            <p className="text-slate-500">Farm fresh morning delivery</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-sm font-bold text-slate-500 tracking-wide uppercase">Daily Quantity (Liters)</label>
                        <div className="flex items-center gap-6">
                            <button 
                                onClick={() => setQuantity(Math.max(0.5, quantity - 0.5))}
                                className="w-12 h-12 rounded-xl bg-slate-100 text-slate-600 font-bold text-xl hover:bg-slate-200 transition-colors"
                            >
                                -
                            </button>
                            <span className="text-3xl font-black w-16 text-center">{quantity}L</span>
                            <button 
                                onClick={() => setQuantity(quantity + 0.5)}
                                className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 font-bold text-xl hover:bg-blue-100 transition-colors"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-slate-50">
                        <label className="text-sm font-bold text-slate-500 tracking-wide uppercase">Delivery Address</label>
                        <textarea 
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Enter your full address (e.g. 17/3 Main Road, Tiruchendo...)"
                            className="w-full min-h-[80px] p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                        />
                    </div>

                    <ul className="space-y-3 pt-4">
                        <li className="flex items-center gap-3 text-slate-600">
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                            <span>Delivered by 7:00 AM daily</span>
                        </li>
                        <li className="flex items-center gap-3 text-slate-600">
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                            <span>Pause anytime when out of station</span>
                        </li>
                        <li className="flex items-center gap-3 text-slate-600">
                            <CalendarDays className="w-5 h-5 text-emerald-500" />
                            <span>Monthly billing cycle</span>
                        </li>
                    </ul>

                    <Button 
                        onClick={handleContinue}
                        className="w-full h-14 mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl text-lg shadow-lg shadow-blue-500/30 transition-all"
                    >
                        Complete Setup
                    </Button>
                </div>
            </div>
        </div>
    );
}
