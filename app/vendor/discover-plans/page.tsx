'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
    Package,
    CheckCircle2,
    Leaf,
    Milk,
    Star,
    ChevronRight,
    Truck,
    Dumbbell,
    Waves,
    UtensilsCrossed
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useVendorAuth } from '@/lib/vendor-auth';
import { toast } from 'sonner';
import { MockPaymentModal } from '@/components/dashboard/mock-payment-modal';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { useData } from '@/lib/data-context';

export default function DiscoverPlansPage() {
    const router = useRouter();
    const { user } = useVendorAuth();
    const { mockBusinessPlans: firestorePlans, isLoading, addDocument } = useData();

    // Filter plans based on user preference
    const businessType = user?.businessType?.toLowerCase();

    const getPreferred = (t: string | undefined) => {
        if (!t) return null;
        const low = t.toLowerCase();
        if (low === 'milk' || low === 'dairy') return 'dairy';
        if (low === 'rice' || low === 'grains') return 'grains';
        if (low === 'gym' || low === 'fitness') return 'gym';
        return low;
    };

    const pref = getPreferred(businessType);

    const filteredFirestorePlans = firestorePlans.filter(plan => {
        const category = (plan.category || '').toLowerCase();
        const name = (plan.name || '').toLowerCase();
        const providerType = (plan.providerType || '').toLowerCase();

        if (!pref) return true;

        const isGymSub = pref === 'gym' || pref === 'fitness';
        const isDairySub = pref === 'dairy' || pref === 'milk';
        const isGrainsSub = pref === 'grains' || pref === 'rice';

        // Match if:
        // 1. The plan's category matches exactly
        // 2. The provider's industry matches (for mis-tagged plans)
        // 3. The name/category contains keywords
        if (isGymSub) {
            // Priority 1: Match by the Vendor's actual industry tag
            if (providerType === 'gym' || providerType === 'fitness') return true;

            // Priority 2: Match by the Vendor's Business Name (e.g., "Life Gym")
            const providerName = (plan.provider || '').toLowerCase();
            if (providerName.includes('gym') || providerName.includes('fit')) return true;

            // Priority 3: Match by keywords in the plan itself
            const keywordMatch = category.includes('gym') || category.includes('fit') ||
                name.includes('gym') || name.includes('fit');
            return keywordMatch;
        }

        if (isDairySub) {
            return category.includes('milk') || category.includes('dairy') ||
                name.includes('milk') || name.includes('dairy') ||
                providerType === 'milk' || providerType === 'dairy';
        }

        if (isGrainsSub) {
            return category.includes('rice') || category.includes('grains') ||
                name.includes('rice') || name.includes('grains') ||
                providerType === 'rice' || providerType === 'grains';
        }

        return category.includes(pref);
    });

    // Only show everything if the filtered list is REALLY empty and we want a fallback
    // But for a better UX, Let's keep it strict so the user sees what they asked for
    const finalPlansToDisplay = filteredFirestorePlans;

    // Map plans to include icons and UI properties if they aren't in Firestore
    const getPlanUI = (plan: any) => {
        const category = (plan.category || '').toLowerCase();
        const name = (plan.name || '').toLowerCase();

        if (category === 'milk' || name.includes('milk') || category === 'dairy') {
            return {
                icon: Milk,
                color: name.includes('premium') || name.includes('a2') ? 'amber' : 'blue',
                type: 'Daily Delivery'
            };
        }
        if (category === 'rice' || name.includes('rice') || category === 'grains') {
            return {
                icon: name.includes('organic') ? Leaf : Package,
                color: name.includes('organic') ? 'emerald' : 'indigo',
                type: 'Monthly Delivery'
            };
        }
        if (category === 'gym' || category === 'fitness' || name.includes('gym') || name.includes('fitness')) {
            return {
                icon: Dumbbell,
                color: 'rose',
                type: 'Membership'
            };
        }
        if (category === 'water' || name.includes('water')) {
            return {
                icon: Waves,
                color: 'sky',
                type: 'Daily Delivery'
            };
        }
        if (category === 'food' || category === 'tiffin' || name.includes('food')) {
            return {
                icon: UtensilsCrossed,
                color: 'orange',
                type: 'Daily Delivery'
            };
        }
        return {
            icon: Star,
            color: 'slate',
            type: 'Subscription'
        };
};

    const availablePlans = finalPlansToDisplay.map(plan => ({
        ...plan,
        ...getPlanUI(plan),
        provider: plan.provider || 'Local Vendor',
        period: plan.interval === 'monthly' ? 'mo' : plan.interval === 'yearly' ? 'yr' : 'mo',
        popular: plan.name?.toLowerCase().includes('premium') || plan.name?.toLowerCase().includes('organic')
    }));

    // Payment Modal State
    const [isMockPaymentOpen, setIsMockPaymentOpen] = useState(false);
    const [mockPaymentAmount, setMockPaymentAmount] = useState(0);
    const [mockPaymentTitle, setMockPaymentTitle] = useState('');
    const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
    const [subscribedPlans, setSubscribedPlans] = useState<string[]>([]);

    useEffect(() => {
        if (!user) return;
        const fetchSubscriptions = async () => {
            try {
                const targetTenantId = user.tenantId || 'tenant-1';
                const subsRef = collection(db, `tenants/${targetTenantId}/subscriptions`);
                const q = query(subsRef, where('customerId', '==', user.id || 'cust-9921'));
                const snapshot = await getDocs(q);
                const plans = snapshot.docs.map(doc => doc.data().planId);
                setSubscribedPlans(plans);
            } catch (error) {
                console.error("Error fetching subscriptions from Firebase:", error);
            }
        };
        fetchSubscriptions();
    }, [user]);

    const handlePlanAction = (plan: any) => {
        if (subscribedPlans.includes(plan.id)) {
            router.push('/vendor/subscriptions');
            return;
        }
        setSelectedPlanId(plan.id);
        setMockPaymentAmount(plan.price);
        setMockPaymentTitle(`Subscribe to ${plan.name}`);
        setIsMockPaymentOpen(true);
    };

    const handlePaymentSuccess = async () => {
        if (selectedPlanId && user) {
            try {
                const planDetails = availablePlans.find(p => p.id === selectedPlanId);
                if (!planDetails) return;

                const targetTenantId = user.tenantId || 'tenant-1';

                // Use addDocument from DataContext to ensure global mirroring
                await addDocument('subscriptions', {
                    customerId: user.id || 'cust-9921',
                    customerEmail: user.email,
                    tenantId: targetTenantId,
                    planId: planDetails.id,
                    plan: planDetails.name,
                    name: planDetails.name,
                    provider: planDetails.provider,
                    totalAmount: planDetails.price,
                    price: `₹${planDetails.price.toLocaleString('en-IN')}`,
                    color: planDetails.color,
                    status: 'active',
                    period: planDetails.period,
                    quantity: 1,
                    usage: 50,
                    nextBilling: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                });

                setSubscribedPlans(prev => [...prev, selectedPlanId]);
                toast.success('Successfully subscribed to the new plan!');
                setTimeout(() => {
                    router.push('/vendor/dashboard');
                }, 1500);
            } catch (error) {
                console.error("Error saving subscription:", error);
                toast.error("Failed to save subscription");
            }
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

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

            {availablePlans.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                    <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-900">No plans available yet</h3>
                    <p className="text-slate-500">Wait for vendors to create subscription plans.</p>
                </div>
            ) : (
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
                                        <span className="text-3xl font-black text-slate-900">₹{plan.price?.toLocaleString('en-IN')}</span>
                                        <span className="text-sm font-bold text-slate-400">/{plan.period}</span>
                                    </div>

                                    <ul className="space-y-4 mb-8 min-h-[140px]">
                                        {plan.features?.map((feature: string, idx: number) => (
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
                                            onClick={() => handlePlanAction(plan)}
                                            variant={subscribedPlans.includes(plan.id) ? "outline" : "default"}
                                            className={subscribedPlans.includes(plan.id) ? `border-${plan.color}-200 text-${plan.color}-600 hover:bg-${plan.color}-50 font-bold px-8 transition-all` : `bg-${plan.color}-600 hover:bg-${plan.color}-700 text-white font-bold px-8 shadow-md hover:shadow-lg transition-all`}
                                        >
                                            {subscribedPlans.includes(plan.id) ? 'View' : 'Subscribe Now'}
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}