'use client';

import React, { useState } from 'react';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import {
    ChevronRight,
    Plus,
    BadgePercent,
    Calendar,
    Zap,
    Ticket,
    Copy,
    Trash2
} from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogTrigger,
} from "../../../components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../../components/ui/select";
import { useData } from '../../../../lib/data-context';
import { useVendorAuth } from '../../../lib/vendor-auth';
import { Coupon } from '../../../../types';
import { toast } from 'sonner';
import { cn } from '../../../lib/utils';
import { format } from 'date-fns';

export default function CouponsPage() {
    const { user } = useVendorAuth();
    const { mockCoupons: coupons, addDocument, deleteDocument, isLoading } = useData();
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        code: '',
        type: 'percentage' as 'percentage' | 'fixed',
        value: '',
        minAmount: '',
        expiry: ''
    });

    const handleCreateCoupon = async () => {
        if (!formData.code || !formData.value) {
            toast.error('Please fill in all required fields');
            return;
        }

        const newCoupon = {
            code: formData.code.toUpperCase(),
            type: formData.type,
            value: Number(formData.value),
            minAmount: Number(formData.minAmount) || 0,
            status: 'active',
            usageCount: 0,
            expiryDate: formData.expiry ? new Date(formData.expiry).toISOString() : null,
            orgId: user?.tenantId || 'anonymous'
        };

        try {
            await addDocument('coupons', newCoupon);
            setOpen(false);
            setFormData({ code: '', type: 'percentage', value: '', minAmount: '', expiry: '' });
            toast.success(`Coupon ${newCoupon.code} created successfully!`);
        } catch (error) {
            console.error('Error creating coupon:', error);
            toast.error('Failed to create coupon');
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success('Coupon code copied to clipboard');
    };

    const handleDeleteCoupon = async (id: string) => {
        try {
            await deleteDocument('coupons', id);
            toast.success('Coupon deleted');
        } catch (error) {
            console.error('Error deleting coupon:', error);
            toast.error('Failed to delete coupon');
        }
    };

    const generateCode = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 8; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setFormData({ ...formData, code });
    };

    if (isLoading) {
        return <div className="flex items-center justify-center h-full">Loading...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                        <span>Dashboard</span>
                        <ChevronRight className="w-3 h-3" />
                        <span className="text-slate-900">Coupons</span>
                    </div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Coupons & Offers</h1>
                </div>
                <div className="flex items-center gap-3">
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold gap-2 h-10 px-6 rounded-lg shadow-lg shadow-blue-600/20">
                                <Plus className="w-4 h-4" /> Create Coupon
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none shadow-2xl">
                            <div className="flex flex-col max-h-[90vh]">
                                <DialogHeader className="p-8 pb-4">
                                    <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mb-4">
                                        <BadgePercent className="w-6 h-6" />
                                    </div>
                                    <DialogTitle className="text-2xl font-black tracking-tight text-slate-900">Create New Coupon</DialogTitle>
                                    <DialogDescription className="text-slate-500 font-bold text-sm">
                                        Configure a new discount code for your customers.
                                    </DialogDescription>
                                </DialogHeader>

                                <div className="flex-1 overflow-y-auto px-8 py-2 custom-scrollbar">
                                    <div className="grid gap-8 py-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="code" className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Coupon Code</Label>
                                            <div className="relative">
                                                <Input
                                                    id="code"
                                                    placeholder="e.g. SUMMER50"
                                                    value={formData.code}
                                                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                                    className="h-12 rounded-xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all font-black uppercase tracking-widest pl-4"
                                                />
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={generateCode}
                                                    className="absolute right-2 top-1.5 h-9 px-3 text-[10px] font-black uppercase text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg"
                                                >
                                                    Generate
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="grid gap-2">
                                                <Label htmlFor="type" className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Discount Type</Label>
                                                <Select
                                                    defaultValue="percentage"
                                                    onValueChange={(value) => setFormData({ ...formData, type: value as 'percentage' | 'fixed' })}
                                                >
                                                    <SelectTrigger id="type" className="h-12 rounded-xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all font-bold">
                                                        <SelectValue placeholder="Type" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="percentage">Percentage (%)</SelectItem>
                                                        <SelectItem value="fixed">Fixed Amount (₹)</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="value" className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Value</Label>
                                                <Input
                                                    id="value"
                                                    type="number"
                                                    placeholder="20"
                                                    value={formData.value}
                                                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                                                    className="h-12 rounded-xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all font-bold"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="grid gap-2">
                                                <Label htmlFor="minAmount" className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Min. Order (₹)</Label>
                                                <Input
                                                    id="minAmount"
                                                    type="number"
                                                    placeholder="499"
                                                    value={formData.minAmount}
                                                    onChange={(e) => setFormData({ ...formData, minAmount: e.target.value })}
                                                    className="h-12 rounded-xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all font-bold"
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="expiry" className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Expiry Date</Label>
                                                <Input
                                                    id="expiry"
                                                    type="date"
                                                    value={formData.expiry}
                                                    onChange={(e) => setFormData({ ...formData, expiry: e.target.value })}
                                                    className="h-12 rounded-xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all font-bold"
                                                />
                                            </div>
                                        </div>

                                        <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 space-y-2">
                                            <div className="flex items-center gap-2 text-amber-900 font-black text-[10px] uppercase tracking-wider">
                                                <Zap className="w-3 h-3" /> Quick Settings
                                            </div>
                                            <p className="text-[11px] font-medium text-amber-700 leading-tight">
                                                This coupon will be applicable to all subscription plans by default.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <DialogFooter className="p-8 pt-4">
                                    <Button
                                        type="button"
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black h-14 rounded-2xl shadow-xl shadow-blue-600/20 active:scale-[0.98] transition-all text-base"
                                        onClick={handleCreateCoupon}
                                    >
                                        Launch Coupon
                                    </Button>
                                </DialogFooter>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {coupons.length === 0 ? (
                <Card className="p-12 border-slate-100 shadow-sm flex flex-col items-center justify-center text-center space-y-6">
                    <div className="w-20 h-20 rounded-[2.5rem] bg-blue-50 flex items-center justify-center text-blue-600 rotate-12">
                        <BadgePercent className="w-10 h-10" />
                    </div>
                    <div className="max-w-md">
                        <h3 className="text-xl font-black text-slate-900 mb-2">Engage your customers with offers</h3>
                        <p className="text-sm font-medium text-slate-400 leading-relaxed">
                            Create promo codes, seasonal discounts, and referral rewards to boost your subscription retention and acquisition.
                        </p>
                    </div>
                    <Button
                        className="font-bold h-11 px-8 rounded-xl bg-slate-900 hover:bg-black text-white"
                        onClick={() => setOpen(true)}
                    >
                        Define First Campaign
                    </Button>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {coupons.map((coupon) => (
                        <Card key={coupon.id} className="relative overflow-hidden border-slate-100 hover:border-blue-200 transition-all hover:shadow-xl hover:shadow-blue-500/5 group">
                            <div className="p-6 space-y-6">
                                <div className="flex items-start justify-between">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                        <Ticket className="w-6 h-6" />
                                    </div>
                                    <div className={cn(
                                        "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                                        coupon.status === 'active' ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"
                                    )}>
                                        {coupon.status}
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-xl font-black text-slate-900 tracking-tight">{coupon.code}</h3>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6 text-slate-300 hover:text-blue-600"
                                            onClick={() => copyToClipboard(coupon.code || '')}
                                        >
                                            <Copy className="w-3 h-3" />
                                        </Button>
                                    </div>
                                    <p className="text-sm font-bold text-slate-500">
                                        {coupon.type === 'percentage' ? `${coupon.value}% OFF` : `₹${coupon.value} OFF`}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-50">
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Used</p>
                                        <p className="text-sm font-bold text-slate-900">{coupon.usageCount} times</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Min Order</p>
                                        <p className="text-sm font-bold text-slate-900">₹{coupon.minAmount}</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-2">
                                    <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400">
                                        <Calendar className="w-3.5 h-3.5" />
                                        {coupon.expiryDate ? format(new Date(coupon.expiryDate), 'MMM dd, yyyy') : 'No expiry'}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-slate-300 hover:text-red-500 hover:bg-red-50"
                                            onClick={() => handleDeleteCoupon(coupon.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Decorative elements */}
                            <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-50/50 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}