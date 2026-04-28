'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft, Droplets, Wheat, Dumbbell, Store, ShoppingBag, Loader2, Waves, UtensilsCrossed, Star, Monitor } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { cn } from '@/lib/utils';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

const ICONS: Record<string, any> = {
    'milk': Droplets,
    'dairy': Droplets,
    'rice': Wheat,
    'grains': Wheat,
    'gym': Dumbbell,
    'fitness': Dumbbell,
    'water': Waves,
    'food': UtensilsCrossed,
    'tech': Monitor,
    'dell': Monitor,
    'default': Store
};

const COLORS: Record<string, string> = {
    'milk': 'blue',
    'dairy': 'blue',
    'rice': 'amber',
    'grains': 'amber',
    'gym': 'rose',
    'fitness': 'rose',
    'water': 'sky',
    'food': 'orange',
    'tech': 'indigo',
    'default': 'slate'
};

const LABELS: Record<string, { title: string, desc: string }> = {
    'milk': { title: 'Fresh Milk', desc: 'Daily morning delivery of farm-fresh milk' },
    'rice': { title: 'Premium Rice', desc: 'Monthly supply of high-quality aged rice' },
    'gym': { title: 'Gym & Fitness', desc: 'Monthly membership and personal training' },
    'water': { title: 'Water Supply', desc: 'Clean daily drinking water delivery' },
    'food': { title: 'Food & Tiffin', desc: 'Healthy home-cooked meals delivered' },
    'tech': { title: 'Tech & Electronics', desc: 'Computer services and gadget subscriptions' },
    'default': { title: 'General Service', desc: 'Regular subscription for periodic services' }
};

export default function SubscriptionTypePage() {
    const router = useRouter();
    const { updateUser } = useAuth();
    const [selected, setSelected] = useState<string | null>(null);
    const [vendorTypes, setVendorTypes] = useState<string[]>(['milk', 'rice', 'gym', 'tech']);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchIndustries = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "tenants"));
                const types = new Set<string>(['milk', 'rice', 'gym']);

                const normalize = (t: string) => {
                    const low = t.toLowerCase();
                    if (low === 'dairy' || low === 'milk delivery') return 'milk';
                    if (low === 'grains' || low === 'agriculture' || low === 'farming') return 'rice';
                    if (low === 'fitness' || low === 'gym membership') return 'gym';
                    if (low === 'tech' || low.includes('dell')) return 'tech';
                    return low;
                };

                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    const type = normalize(data.industryType || data.businessType || data.name || '');
                    if (type) {
                        types.add(type);
                    }
                });
                setVendorTypes(Array.from(types));

            } catch (error) {
                console.error("Error fetching industries:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchIndustries();

        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    const handleSelect = async (type: string) => {
        setSelected(type);
        try {
            await updateUser({ businessType: type });
            router.push('/vendor/discover-plans');
        } catch (error) {
            console.error('Failed to update preference:', error);
            router.push('/vendor/discover-plans');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20 flex flex-col">
            <div className="px-6 py-8 flex items-center gap-4 bg-white shadow-sm sticky top-0 z-10 transition-all">
                <button onClick={() => router.back()} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                    <ChevronLeft className="w-6 h-6 text-slate-600" />
                </button>
                <div className="flex-1">
                    <h1 className="text-2xl font-black tracking-tight text-slate-800">Explore Services</h1>
                    <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">Powered by Subtrack</p>
                </div>
            </div>

            <div className="flex-1 px-6 py-12 max-w-6xl mx-auto space-y-16">
                {/* Categories Section */}
                <div className="text-center space-y-4 max-w-2xl mx-auto">
                    <h2 className="text-4xl font-black text-slate-900 leading-tight">What are you subscribing to?</h2>
                    <p className="text-slate-500 text-lg font-medium">Select a category to see local providers in your area.</p>
                </div>

                {isLoading && vendorTypes.length <= 4 ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Scanning local ecosystem...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {vendorTypes.map((type) => {
                            const Icon = ICONS[type] || ICONS.default;
                            const color = COLORS[type] || COLORS.default;
                            const label = LABELS[type] || LABELS.default;

                            return (
                                <div
                                    key={type}
                                    onClick={() => handleSelect(type)}
                                    className={cn(
                                        "group relative flex flex-col items-center gap-6 p-10 bg-white rounded-[2rem] border-2 shadow-sm transition-all cursor-pointer overflow-hidden",
                                        selected === type
                                            ? `border-${color}-500 ring-4 ring-${color}-50`
                                            : `border-slate-100 hover:border-${color}-300 hover:shadow-xl hover:-translate-y-2`
                                    )}
                                >
                                    <div className={cn(
                                        "w-24 h-24 rounded-3xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-3",
                                        selected === type ? `bg-${color}-100` : `bg-${color}-50 group-hover:bg-${color}-100`
                                    )}>
                                        <Icon className={cn("w-12 h-12", `text-${color}-500`)} />
                                    </div>
                                    <div className="space-y-2 text-center">
                                        <h3 className="text-2xl font-black text-slate-800 capitalize">
                                            {label.title !== 'General Service' ? label.title : type}
                                        </h3>
                                        <p className="text-slate-500 font-medium leading-relaxed">{label.desc}</p>
                                    </div>
                                    
                                    {/* Decorative element */}
                                    <div className={cn(
                                        "absolute -bottom-6 -right-6 w-20 h-20 rounded-full opacity-0 group-hover:opacity-10 transition-opacity",
                                        `bg-${color}-500`
                                    )} />
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}