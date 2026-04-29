'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, ListTree, Loader2, Edit2, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useData } from '@/lib/data-context';
import { useVendorAuth } from '@/lib/vendor-auth';

type PriceList = {
    id: string;
    name: string;
    description: string;
    type: string;
};

export default function PriceListsPage() {
    const { user } = useVendorAuth();
    const { mockCoupons: coupons, mockTenants, isLoading } = useData();
    const isPlatformAdmin = user?.role === 'super_admin' || user?.role === 'admin';

    if (isLoading) {
        return <div className="flex items-center justify-center p-20"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Discount lists</h1>
                    <p className="text-sm text-slate-500">View and manage promotional coupons across the platform</p>
                </div>
            </div>

            {coupons.length === 0 ? (
                <Card className="p-12 text-center border-dashed border-2 bg-slate-50/50">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">No Active Coupons</h3>
                    <p className="text-slate-500 max-w-sm mx-auto">
                        There are no promotional coupons currently active on the platform.
                    </p>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {coupons.map((coupon) => {
                        const vendor = mockTenants?.find(t => t.id === coupon.orgId);
                        
                        return (
                            <Card key={coupon.id} className="p-6 border-slate-200 shadow-sm relative group overflow-hidden bg-white hover:border-indigo-200 transition-all">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex flex-col items-start gap-2">
                                        <span className={cn(
                                            "text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full",
                                            coupon.status === 'active' ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"
                                        )}>
                                            {coupon.status}
                                        </span>
                                        {isPlatformAdmin && (
                                            <span className="bg-slate-900 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">
                                                {vendor?.name || 'Platform'}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <h3 className="font-black text-slate-900 text-xl tracking-tight mb-1">{coupon.code}</h3>
                                <p className="text-sm font-bold text-slate-500 mb-4">
                                    {coupon.type === 'percentage' ? `${coupon.value}% OFF` : `₹${coupon.value} OFF`}
                                </p>
                                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-50">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Min Order: ₹{coupon.minAmount}</span>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Used: {coupon.usageCount}</span>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');
