'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Package,
    CheckCircle2,
    Leaf,
    Milk,
    Star,
    ChevronRight,
    Truck
} from 'lucide-react';
import { useVendorAuth } from '@/lib/vendor-auth';
import { toast } from 'sonner';
import { MockPaymentModal } from '@/components/dashboard/mock-payment-modal';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

const availablePlans = [
    {
        id: 'PLAN-MILK-1L',
        name: 'Fresh Cow Milk (1L)',
        provider: 'Pure Dairy Farms',
        description: 'Farm-fresh, unadulterated cow milk delivered daily to your doorstep before 7 AM.',
        price: 1500,
        period: 'mo',
        type: 'Daily Delivery',
        icon: Milk,
        color: 'blue',
        popular: true,
        features: ['Daily Delivery before 7 AM', '100% Pure & Untouched', 'App-based pausing', 'No delivery charges']
    },
    {
        id: 'PLAN-MILK-A2-2L',
        name: 'Premium A2 Milk (2L)',
        provider: 'Pure Dairy Farms',
        description: 'Premium A2 cow milk rich in protein, directly sourced from grass-fed Desi cows.',
        price: 3200,
        period: 'mo',
        type: 'Daily Delivery',
        icon: Star,
        color: 'amber',
        popular: false,
        features: ['Daily Delivery before 7 AM', 'A2 Certified Pure', 'Glass bottle packaging', 'Priority support']
    },
    {
        id: 'PLAN-RICE-ORG-5KG',
        name: 'Organic Basmati Rice (5kg)',
        provider: 'Priya Rice Depot',
        description: 'Premium long-grain organic basmati rice, perfectly aged for biryanis and daily meals.',
        price: 850,
        period: 'mo',
        type: 'Monthly Delivery',
        icon: Leaf,
        color: 'emerald',
        popular: true,
        features: ['Delivered 1st of every month', 'Pesticide-free', 'Aged 24 months', 'Vacuum sealed packaging']
    },
    {
        id: 'PLAN-RICE-SONA-10KG',
        name: 'Sona Masoori Rice (10kg)',
        provider: 'Priya Rice Depot',
        description: 'High-quality, lightweight and aromatic medium-grain rice perfect for daily consumption.',
        price: 650,
        period: 'mo',
        type: 'Monthly Delivery',
        icon: Package,
        color: 'indigo',
        popular: false,
        features: ['Delivered 1st of every month', 'Premium quality sortex', 'Double polished', 'Free home delivery']
    }
];

export default function DiscoverPlansPage() {
    const router = useRouter();
    const { user } = useVendorAuth();

    // Payment Modal State
    const [isMockPaymentOpen, setIsMockPaymentOpen] = useState(false);
    const [mockPaymentAmount, setMockPaymentAmount] = useState(0);
    const [mockPaymentTitle, setMockPaymentTitle] = useState('');
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

    const handleSubscribeClick = (plan: typeof availablePlans[0]) => {
        setSelectedPlan(plan.id);
        setMockPaymentAmount(plan.price);
        setMockPaymentTitle(`Subscribe to ${plan.name}`);
        setIsMockPaymentOpen(true);
    };

    const handlePaymentSuccess = () => {
        toast.success('Successfully subscribed to the new plan!');
        setTimeout(() => {
            router.push('/vendor/subscriptions');
        }, 1500);
    };

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-12">
            <MockPaymentModal
                isOpen={isMockPaymentOpen}
                onClose={() => setIsMockPaymentOpen(false)}
                onSuccess={handlePaymentSuccess}
                amount={mockPaymentAmount}
                title={mockPaymentTitle}
            />

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                        <span className="hover:text-blue-600 cursor-pointer" onClick={() => router.push('/vendor/dashboard')}>Dashboard</span>
                        <ChevronRight className="w-3 h-3" />
                        <span className="text-slate-900">Discover</span>
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Discover Plans</h1>
                    <p className="text-base text-slate-500 font-medium mt-2">Browse and subscribe to fresh daily deliveries from our local vendors.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                {availablePlans.map((plan) => {
                    const Icon = plan.icon;
                    return (
                        <Card key={plan.id} className={`relative overflow-hidden border-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${plan.popular ? `border-${plan.color}-500 shadow-lg shadow-${plan.color}-500/10` : 'border-slate-100'}`}>
                            {plan.popular && (
                                <div className={`absolute top-0 right-0 bg-${plan.color}-500 text-white text-[10px] font-black uppercase tracking-widest py-1.5 px-4 rounded-bl-xl z-10`}>
                                    Most Popular
                                </div>
                            )}

                            <div className="p-8">
                                <div className="flex items-start gap-5 mb-6">
                                    <div className={`w-14 h-14 rounded-2xl bg-${plan.color}-50 flex items-center justify-center text-${plan.color}-600 shrink-0`}>
                                        <Icon className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-slate-900 leading-tight mb-1">{plan.name}</h3>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{plan.provider}</p>
                                    </div>
                                </div>

                                <p className="text-sm text-slate-600 font-medium leading-relaxed mb-8 min-h-[44px]">
                                    {plan.description}
                                </p>

                                <div className="flex items-baseline gap-1 mb-8">
                                    <span className="text-3xl font-black text-slate-900">₹{plan.price.toLocaleString('en-IN')}</span>
                                    <span className="text-sm font-bold text-slate-400">/{plan.period}</span>
                                </div>

                                <ul className="space-y-4 mb-8 min-h-[140px]">
                                    {plan.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start gap-3">
                                            <div className={`mt-0.5 rounded-full p-0.5 bg-${plan.color}-50 text-${plan.color}-500`}>
                                                <CheckCircle2 className="w-3.5 h-3.5" />
                                            </div>
                                            <span className="text-sm font-medium text-slate-700">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                                        <Truck className="w-4 h-4" /> {plan.type}
                                    </span>
                                    <Button
                                        onClick={() => handleSubscribeClick(plan)}
                                        className={`bg-${plan.color}-600 hover:bg-${plan.color}-700 text-white font-bold px-8 shadow-md hover:shadow-lg transition-all`}
                                    >
                                        Subscribe Now
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
