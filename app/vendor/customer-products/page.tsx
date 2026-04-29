'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, Calendar, Wallet, ChevronRight, Plus, Minus } from 'lucide-react';
import { useProducts } from '@/lib/products-context';
import { useAuth } from '@/lib/auth-context';
import { cn } from '@/lib/utils';
import { format, addDays } from 'date-fns';
import { toast } from 'sonner';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import Link from 'next/link';
import { PaymentDialog } from '@/components/payment/payment-dialog';

export default function CustomerProductsPage() {
    const router = useRouter();
    const { products, cart, updateCart } = useProducts();
    const { user, updateUser } = useAuth();
    const [isScheduling, setIsScheduling] = useState<string | null>(null);
    const activeProducts = products.filter(p => p.status === 'active');

    // Determine context based on user preference from onboarding
    const userRole = user?.role;
    const businessType = user?.businessType?.toLowerCase() || 'dairy';

    const getPreferredCategory = (type: string) => {
        if (type === 'milk' || type === 'dairy') return 'Dairy';
        if (type === 'rice' || type === 'grains') return 'Grains';
        if (type === 'gym' || type === 'fitness') return 'Gym';
        return type.charAt(0).toUpperCase() + type.slice(1);
    };

    const preferredCategory = getPreferredCategory(businessType);

    // Tab states
    const [activeTopTab, setActiveTopTab] = useState(preferredCategory);
    const [activeSideTab, setActiveSideTab] = useState('All');

    // Icons mapping for tabs
    const tabIcons: Record<string, string> = {
        'Dairy': '🥛',
        'Grains': '🌾',
        'Gym': '🏋️',
        'Exclusive': '✨',
        'default': '📦'
    };

    // Filter top tabs to only show the relevant one for customers
    const topTabs = (userRole === 'customer')
        ? [
            { id: preferredCategory, label: preferredCategory, icon: tabIcons[preferredCategory] || tabIcons.default }
        ]
        : [
            { id: 'Dairy', label: 'Dairy', icon: '🥛' },
            { id: 'Grains', label: 'Grains', icon: '🌾' },
            { id: 'Gym', label: 'Gym', icon: '🏋️' },
            { id: 'Exclusive', label: 'Exclusive', icon: '✨' }
        ];

    const sideTabs = activeTopTab === 'Grains' ? [
        { id: 'All', label: 'All', icon: '📦' },
        { id: 'Basmati Rice', label: 'Basmati Rice', icon: '🌾' },
        { id: 'Sona Masoori', label: 'Sona Masoori', icon: '🍚' },
        { id: 'Brown Rice', label: 'Brown Rice', icon: '🍛' },
        { id: 'Idli Rice', label: 'Idli Rice', icon: '🍲' },
    ] : activeTopTab === 'Dairy' ? [
        { id: 'All', label: 'All', icon: '📦' },
        { id: 'Milk', label: 'Milk', icon: '🥛' },
        { id: 'Daily Pro+', label: 'Daily Pro+', icon: '🥤' },
        { id: 'Curd & Paneer', label: 'Curd & Paneer', icon: '🧀' },
        { id: 'Ghee', label: 'Ghee', icon: '🍯' },
    ] : [
        { id: 'All', label: 'All', icon: '📦' },
    ];

    // Filter products
    const displayProducts = activeProducts.filter(p => {
        // Exclusive tab logic: Only show exclusive products
        if (activeTopTab === 'Exclusive') {
            return p.exclusive === true;
        }

        // Filter by top category
        if (p.category !== activeTopTab) return false;

        // Filter by side tab (mock search in name for now)
        if (activeSideTab !== 'All' && !p.name?.toLowerCase().includes(activeSideTab.toLowerCase())) return false;

        return true;
    });

    const tomorrowDate = format(addDays(new Date(), 1), 'do MMM');

    const handleAddToCart = (product: any) => {
        updateCart(product.id, (cart[product.id] || 0) + 1);
        toast.success(`${product.name} added to cart`, {
            duration: 1500,
            position: 'bottom-center'
        });
    };

    const handleUpdateQty = (productId: string, delta: number) => {
        const newQty = (cart[productId] || 0) + delta;
        updateCart(productId, newQty);
    };

    const handleSchedule = (productId: string) => {
        setIsScheduling(productId);
        toast.info("Scheduling feature", {
            description: "Opening delivery calendar for this product..."
        });
    };

    return (
        <div className="flex flex-col min-h-screen bg-white font-sans overflow-hidden max-w-lg mx-auto border-x border-slate-100 relative">

            {/* Top Navigation */}
            <div className="sticky top-0 z-30 bg-white">
                <div className="flex items-center justify-between px-6 py-4">
                    <h1 className="text-2xl font-medium tracking-tight text-slate-900">Products</h1>
                    <div className="flex items-center gap-3">
                        <Link href="/vendor/discover-plans">
                            <Button variant="outline" size="sm" className="h-8 text-[10px] font-black uppercase tracking-widest border-slate-200">
                                Discover Plans
                            </Button>
                        </Link>
                        <div className="flex items-center gap-2 bg-amber-100/60 text-amber-900 px-3 py-1.5 rounded-full font-bold text-sm">
                            <Wallet className="w-4 h-4" /> ₹0.00
                        </div>
                    </div>
                </div>

                {/* Top Tabs */}
                <div className="flex px-2 border-b border-slate-100 gap-1 overflow-x-auto scrollbar-none">
                    {topTabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTopTab(tab.id)}
                            className={cn(
                                "flex-1 min-w-[100px] flex gap-2 items-center justify-center p-3 text-sm font-semibold transition-all border-b-2",
                                activeTopTab === tab.id
                                    ? "text-slate-900 border-yellow-400 bg-yellow-50/20"
                                    : "text-slate-500 border-transparent hover:bg-slate-50"
                            )}
                        >
                            <span>{tab.icon}</span> {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Layout Area */}
            <div className="flex flex-1 overflow-hidden">

                {/* Left Sidebar */}
                <div className="w-[85px] bg-slate-50/60 overflow-y-auto scrollbar-none py-2 border-r border-slate-100 flex flex-col items-center">
                    {sideTabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveSideTab(tab.id)}
                            className={cn(
                                "w-full flex md:hidden items-center relative py-4 flex-col gap-2 transition-all",
                                activeSideTab === tab.id
                                    ? "bg-amber-50/70"
                                    : "hover:bg-slate-100/50"
                            )}
                        >
                            {activeSideTab === tab.id && (
                                <span className="absolute left-0 top-0 bottom-0 w-1 bg-amber-300 rounded-r-lg" />
                            )}
                            <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flexitems-center justify-center text-xl flex items-center justify-center">
                                {tab.icon}
                            </div>
                            <span className={cn(
                                "text-[10px] text-center font-bold px-1",
                                activeSideTab === tab.id ? "text-slate-900" : "text-slate-500"
                            )}>
                                {tab.label}
                            </span>
                        </button>
                    ))}

                    {/* Duplicate mapping without hidden logic for larger previews if needed */}
                    {sideTabs.map(tab => (
                        <button
                            key={`desk-${tab.id}`}
                            onClick={() => setActiveSideTab(tab.id)}
                            className={cn(
                                "hidden md:flex w-full items-center relative py-4 flex-col gap-2 transition-all",
                                activeSideTab === tab.id
                                    ? "bg-amber-50/70"
                                    : "hover:bg-slate-100/50"
                            )}
                        >
                            {activeSideTab === tab.id && (
                                <span className="absolute left-0 top-0 bottom-0 w-1 bg-amber-300 rounded-r-lg" />
                            )}
                            <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flexitems-center justify-center text-xl flex items-center justify-center">
                                {tab.icon}
                            </div>
                            <span className={cn(
                                "text-[10px] text-center font-bold px-1",
                                activeSideTab === tab.id ? "text-slate-900" : "text-slate-500"
                            )}>
                                {tab.label}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Products Grid */}
                <div className="flex-1 overflow-y-auto scrollbar-none pb-32">
                    <div className="p-4">
                        <h2 className="text-sm font-bold text-slate-800 mb-4">{displayProducts.length} Products</h2>

                        <div className="grid grid-cols-2 gap-3">
                            {displayProducts.length > 0 ? (
                                displayProducts.map(product => {
                                    // Extract price from first plan or default to 60
                                    const price = product.plans?.[0]?.price || 60;
                                    const oldPrice = product.compareAtPrice ? parseFloat(product.compareAtPrice) : Math.floor(price * 1.1);

                                    return (
                                        <div key={product.id} className="bg-slate-50/80 rounded-2xl flex flex-col overflow-hidden pb-4">
                                            {/* Product Image wrapper */}
                                            <div className="aspect-[4/3] w-full bg-gradient-to-br from-slate-100/50 to-slate-50 flex items-center justify-center p-3 relative">
                                                {product.imageUrl ? (
                                                    <div className="w-full h-full relative flex items-center justify-center">
                                                        <img src={product.imageUrl} alt={product.name} className="max-w-full max-h-full object-contain drop-shadow-md transition-transform hover:scale-105 duration-300" />
                                                        {/* Veg marking mimicking real indian products */}
                                                        <span className="absolute top-0 right-0 w-3.5 h-3.5 rounded-sm bg-white border border-green-600 flex items-center justify-center z-10 shadow-sm">
                                                            <span className="w-1.5 h-1.5 bg-green-600 rounded-full" />
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <div className="w-full h-full bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center overflow-hidden relative">
                                                        <span className="text-4xl">{product.category === 'Grains' ? '🌾' : '🥛'}</span>
                                                        <span className="absolute top-2 right-2 w-3 h-3 rounded-sm bg-white border border-green-600 flex items-center justify-center z-10 shadow-sm">
                                                            <span className="w-1.5 h-1.5 bg-green-600 rounded-full" />
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Details */}
                                            <div className="px-3 pt-3 flex-1 flex flex-col items-center text-center">
                                                <h3 className="font-black text-sm text-[#0a1128] line-clamp-2 leading-tight min-h-[36px]">
                                                    {product.name}
                                                </h3>
                                                {product.exclusive && (
                                                    <span className="bg-indigo-50 text-indigo-600 text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest border border-indigo-100 mt-1">Exclusive</span>
                                                )}
                                                <p className="text-[10px] text-slate-400 font-bold mb-4 mt-2 uppercase tracking-widest">
                                                    {product.size || product.category || '500 ML'}
                                                </p>

                                                <div className="mt-auto">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <div>
                                                            <div className="flex items-baseline gap-1.5">
                                                                <span className="font-black text-[#0a1128] text-xl">₹{price}</span>
                                                            </div>
                                                            {price < 50 && (
                                                                <p className="text-[8px] font-bold text-emerald-600 uppercase tracking-widest mt-0.5">Subscribe & Save</p>
                                                            )}
                                                        </div>
                                                        <button
                                                            onClick={() => handleAddToCart(product)}
                                                            className="w-10 h-10 rounded-2xl border-2 border-slate-100 flex items-center justify-center hover:bg-white hover:border-amber-300 hover:shadow-sm transition-all group/cal active:scale-90"
                                                        >
                                                            <Plus className="w-5 h-5 text-slate-600 group-hover/cal:text-amber-600" />
                                                        </button>
                                                    </div>

                                                    <div className="flex flex-col gap-2">
                                                        {cart[product.id] ? (
                                                            <div className="flex items-center justify-between bg-[#151921] text-white rounded-xl h-11 px-1 overflow-hidden shadow-sm">
                                                                <button
                                                                    onClick={() => handleUpdateQty(product.id, -1)}
                                                                    className="w-10 h-full flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all text-xl font-bold"
                                                                >
                                                                    −
                                                                </button>
                                                                <span className="font-black text-sm tracking-tighter">{cart[product.id]}</span>
                                                                <button
                                                                    onClick={() => handleUpdateQty(product.id, 1)}
                                                                    className="w-10 h-full flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all text-xl font-bold"
                                                                >
                                                                    +
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <button
                                                                onClick={() => handleAddToCart(product)}
                                                                className="w-full bg-[#151921] border-none hover:bg-black text-white font-black py-3 rounded-xl text-[13px] uppercase tracking-widest transition-all active:scale-[0.97] shadow-sm ml-0"
                                                            >
                                                                Add
                                                            </button>
                                                        )}
                                                        <p className="text-[9px] text-center text-slate-400 font-bold mt-1.5 uppercase tracking-widest">
                                                            Qty. for {tomorrowDate}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="col-span-2 py-10 text-center">
                                    <p className="text-sm font-medium text-slate-500">No products found for this category.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Banner & Navigation */}
            <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg z-40 bg-white">
                {/* Info banner */}
                <div className="bg-[#e8f3ef] border-t border-b border-[#d1e6df] py-3 px-4 flex justify-between items-center text-[10px] font-bold text-slate-700">
                    <div className="flex items-center gap-1.5">
                        <span className="text-sm">✨</span> TESTED FOR<br />SAFETY
                    </div>
                    <div className="w-px h-6 bg-slate-300/60" />
                    <div className="flex items-center gap-1.5 text-center">
                        <span className="text-sm">🚫</span> NO HARMFUL<br />ADDITIVES
                    </div>
                </div>

                {/* View Cart Sticky */}
                {Object.keys(cart).length > 0 && (
                    <div className="p-4 bg-white/80 backdrop-blur-md border-t border-slate-100">
                        <button
                            onClick={() => router.push('/customer/cart')}
                            className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl flex items-center justify-between px-6 shadow-xl shadow-emerald-100 animate-in slide-in-from-bottom-5 duration-500"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-sm">
                                    {Object.values(cart).reduce((a, b) => a + b, 0)}
                                </div>
                                <span className="uppercase tracking-[0.15em] text-xs">Items in cart</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-lg font-black tracking-tight">VIEW CART</span>
                                <ChevronRight className="w-5 h-5" />
                            </div>
                        </button>
                    </div>
                )}
            </div>

        </div>
    );
}