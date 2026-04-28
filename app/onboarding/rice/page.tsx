'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft, CheckCircle2, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function RiceSubscriptionPage() {
    const router = useRouter();
    const [quantity, setQuantity] = useState(25);
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
                <h1 className="text-2xl font-black tracking-tight text-slate-800">Premium Rice Setup</h1>
            </div>

            <div className="px-6 py-12 max-w-lg mx-auto space-y-8">
                <div className="bg-white p-8 rounded-3xl border-2 border-amber-100 shadow-sm space-y-6">
                    <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
                        <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center font-bold text-2xl">
                            🍚
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-800">Aged Basmati Rice</h2>
                            <p className="text-slate-500">Monthly scheduled delivery</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-sm font-bold text-slate-500 tracking-wide uppercase">Monthly Bag Size (Kg)</label>
                        <div className="flex items-center gap-6">
                            <button 
                                onClick={() => setQuantity(Math.max(5, quantity - 5))}
                                className="w-12 h-12 rounded-xl bg-slate-100 text-slate-600 font-bold text-xl hover:bg-slate-200 transition-colors"
                            >
                                -
                            </button>
                            <span className="text-3xl font-black w-20 text-center">{quantity}Kg</span>
                            <button 
                                onClick={() => setQuantity(quantity + 5)}
                                className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 font-bold text-xl hover:bg-amber-100 transition-colors"
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
                            className="w-full min-h-[80px] p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
                        />
                    </div>

                    <ul className="space-y-3 pt-4">
                        <li className="flex items-center gap-3 text-slate-600">
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                            <span>1-Year Aged Premium Quality</span>
                        </li>
                        <li className="flex items-center gap-3 text-slate-600">
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                            <span>Direct source from local farms</span>
                        </li>
                        <li className="flex items-center gap-3 text-slate-600">
                            <Truck className="w-5 h-5 text-emerald-500" />
                            <span>Free doorstep delivery</span>
                        </li>
                    </ul>

                    <Button 
                        onClick={handleContinue}
                        className="w-full h-14 mt-6 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-2xl text-lg shadow-lg shadow-amber-500/30 transition-all"
                    >
                        Complete Setup
                    </Button>
                </div>
            </div>
        </div>
    );
}
