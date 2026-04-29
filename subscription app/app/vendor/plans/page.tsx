'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Plus,
    ChevronRight,
    MoreHorizontal,
    Layers,
    Check,
    Zap,
    Star,
    MoreVertical,
    Briefcase,
    Edit,
    Trash2
} from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

import { useVendorAuth } from '@/lib/vendor-auth';

const initialPlansData = [
    {
        id: 'plan-milk-basic',
        name: 'Basic Milk Plan',
        price: '₹799',
        frequency: 'Month',
        type: 'Milk',
        description: 'Perfect for single users or small families.',
        features: ['1L Daily Milk Delivery', 'Fresh Quality Guarantee', 'Morning Delivery (7 AM)', 'Monthly Invoicing'],
        popular: false,
        color: '#1890ff'
    },
    {
        id: 'plan-milk-pro',
        name: 'Pro Milk Plan',
        price: '₹999',
        frequency: 'Month',
        type: 'Milk',
        description: 'Our most popular choice for standard households.',
        features: ['1.5L Daily Milk Delivery', 'VIP Delivery Slot (6 AM)', 'Weekend Bonus (Paneer/Curd)', 'Dedicated Support', 'Detailed Usage Analytics'],
        popular: true,
        color: '#722ed1'
    },
    {
        id: 'plan-rice-basic',
        name: 'Basic Rice Plan',
        price: '₹799',
        frequency: 'Month',
        type: 'Rice',
        description: 'Perfect for single users or small families.',
        features: ['5kg Weekly Rice Delivery', 'Fresh Quality Guarantee', 'Morning Delivery (7 AM)', 'Monthly Invoicing'],
        popular: false,
        color: '#1890ff'
    },
    {
        id: 'plan-rice-pro',
        name: 'Pro Rice Plan',
        price: '₹999',
        frequency: 'Month',
        type: 'Rice',
        description: 'Our most popular choice for standard households.',
        features: ['10kg Weekly Rice Delivery', 'VIP Delivery Slot (6 AM)', 'Weekend Bonus', 'Dedicated Support', 'Detailed Usage Analytics'],
        popular: true,
        color: '#722ed1'
    },
    {
        id: 'plan-enterprise',
        name: 'Family Pack',
        price: '₹1,999',
        frequency: 'Month',
        type: 'Milk',
        description: 'Built for large families with high requirements.',
        features: ['3L Daily Milk Delivery', 'Early Priority Slot (5 AM)', 'Unlimited Weekend Bundles', 'Personalized Billing Cycle', 'Custom Add-ons enabled'],
        popular: false,
        color: '#fa8c16'
    },
    {
        id: 'plan-rice-enterprise',
        name: 'Rice Family Pack',
        price: '₹1,999',
        frequency: 'Month',
        type: 'Rice',
        description: 'Built for large families with high requirements.',
        features: ['25kg Monthly Rice Delivery', 'Early Priority Slot (5 AM)', 'Unlimited Weekend Bundles', 'Personalized Billing Cycle', 'Custom Add-ons enabled'],
        popular: false,
        color: '#fa8c16'
    },
];

export default function VendorPlansPage() {
    const router = useRouter();
    const { user } = useVendorAuth();
    const [plans, setPlans] = useState(initialPlansData);
    const [open, setOpen] = useState(false);
    const [editingPlan, setEditingPlan] = useState<any>(null);

    // Persist data in localStorage
    useEffect(() => {
        const savedPlans = localStorage.getItem('vendor_plans');
        if (savedPlans) {
            try {
                setPlans(JSON.parse(savedPlans));
            } catch (e) {
                console.error("Failed to parse saved plans", e);
            }
        }
    }, []);

    useEffect(() => {
        if (plans !== initialPlansData) {
            localStorage.setItem('vendor_plans', JSON.stringify(plans));
        }
    }, [plans]);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        frequency: 'Month',
        features: ''
    });

    const isRiceVendor = user?.businessType === 'rice';
    const isMilkVendor = user?.businessType === 'milk';

    const filteredPlans = plans.filter(plan => {
        if (user?.businessType === 'both') return true;
        if (isRiceVendor) return plan.type === 'Rice';
        if (isMilkVendor) return plan.type === 'Milk';
        return true;
    });

    const handleOpenDialog = (plan: any = null) => {
        if (plan) {
            setEditingPlan(plan);
            setFormData({
                name: plan.name,
                description: plan.description,
                price: plan.price.replace(/[₹,]/g, ''),
                frequency: plan.frequency,
                features: plan.features.join('\n')
            });
        } else {
            setEditingPlan(null);
            setFormData({
                name: '',
                description: '',
                price: '',
                frequency: 'Month',
                features: ''
            });
        }
        setOpen(true);
    };

    const handleCreatePlan = () => {
        if (editingPlan) {
            // Update existing
            const updatedPlans = plans.map(p =>
                p.id === editingPlan.id
                    ? {
                        ...p,
                        name: formData.name,
                        description: formData.description,
                        price: `₹${formData.price}`,
                        frequency: formData.frequency,
                        features: formData.features.split('\n').filter(f => f.trim() !== ''),
                    }
                    : p
            );
            setPlans(updatedPlans);
        } else {
            // Create new
            const newPlan = {
                id: `plan-custom-${Date.now()}`,
                name: formData.name || "Custom Plan",
                price: `₹${formData.price || '0'}`,
                frequency: formData.frequency,
                type: isRiceVendor ? 'Rice' : 'Milk',
                description: formData.description || 'Custom crafted plan for your needs.',
                features: formData.features.split('\n').filter(f => f.trim() !== ''),
                popular: false,
                color: '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0') // Random color
            };
            setPlans([...plans, newPlan]);
        }

        setOpen(false);
        setEditingPlan(null);
        setFormData({ name: '', description: '', price: '', frequency: 'Month', features: '' });
    };

    const handleDeletePlan = (id: string) => {
        setPlans(plans.filter(p => p.id !== id));
    };

    return (
        <div className="space-y-6 pb-12">
            {/* Breadcrumbs & Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                        <span className="hover:text-blue-600 cursor-pointer" onClick={() => router.push('/vendor/dashboard')}>Dashboard</span>
                        <ChevronRight className="w-3 h-3" />
                        <span className="text-slate-900">Plans</span>
                    </div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Subscription Plans</h1>
                </div>
                <div className="flex items-center gap-3">
                    <Dialog open={open} onOpenChange={(val) => {
                        setOpen(val);
                        if (!val) setEditingPlan(null);
                    }}>
                        <DialogTrigger asChild>
                            <Button
                                onClick={() => handleOpenDialog()}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold gap-2 h-11 px-8 rounded-xl shadow-lg shadow-blue-600/20 active:scale-[0.98] transition-all"
                            >
                                <Plus className="w-4 h-4" /> Create New Plan
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none shadow-2xl rounded-[2rem]">
                            <div className="flex flex-col max-h-[90vh]">
                                <DialogHeader className="p-10 pb-4">
                                    <DialogTitle className="text-3xl font-black tracking-tight text-slate-900">
                                        {editingPlan ? 'Edit Configuration' : 'Design New Plan'}
                                    </DialogTitle>
                                    <DialogDescription className="text-slate-500 font-bold text-sm">
                                        {editingPlan ? 'Refine the parameters of your subscription tier.' : `Create a new subscription tier for your ${isRiceVendor ? 'rice' : 'milk'} delivery business.`}
                                    </DialogDescription>
                                </DialogHeader>

                                <div className="flex-1 overflow-y-auto px-10 py-2 custom-scrollbar">
                                    <div className="grid gap-8 py-4">
                                        <div className="grid gap-3">
                                            <Label htmlFor="planName" className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Plan Name</Label>
                                            <Input
                                                id="planName"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                placeholder={isMilkVendor ? "e.g. Monthly Standard Milk Pack" : "e.g. Premium Basmati Rice Pack"}
                                                className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all font-bold px-6"
                                            />
                                        </div>
                                        <div className="grid gap-3">
                                            <Label htmlFor="description" className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Description</Label>
                                            <Textarea
                                                id="description"
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                placeholder="Describe what makes this plan special..."
                                                className="rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all font-bold resize-none min-h-[120px] p-6"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="grid gap-3">
                                                <Label htmlFor="price" className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Monthly Price (₹)</Label>
                                                <Input
                                                    id="price"
                                                    type="number"
                                                    value={formData.price}
                                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                                    placeholder={isMilkVendor ? "799" : "999"}
                                                    className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all font-bold px-6"
                                                />
                                            </div>
                                            <div className="grid gap-3">
                                                <Label htmlFor="frequency" className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Billing Cycle</Label>
                                                <Select value={formData.frequency} onValueChange={(val) => setFormData({ ...formData, frequency: val })}>
                                                    <SelectTrigger id="frequency" className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all font-bold px-6">
                                                        <SelectValue placeholder="Cycle" />
                                                    </SelectTrigger>
                                                    <SelectContent className="rounded-xl border-slate-100">
                                                        <SelectItem value="Month" className="font-bold">Monthly</SelectItem>
                                                        <SelectItem value="Quarter" className="font-bold">Quarterly</SelectItem>
                                                        <SelectItem value="Year" className="font-bold">Yearly</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <div className="grid gap-3">
                                            <Label htmlFor="features" className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Key Features (One per line)</Label>
                                            <Textarea
                                                id="features"
                                                value={formData.features}
                                                onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                                                placeholder={isRiceVendor ? "5kg Weekly Rice\nDoorstep Delivery\nFree Sample of Brown Rice" : "2L Daily Milk\nEvening Delivery\nFree Ghee sample"}
                                                className="rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all font-bold resize-none h-32 p-6"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <DialogFooter className="p-10 pt-4">
                                    <Button
                                        type="button"
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black h-16 rounded-2xl shadow-xl shadow-blue-600/20 active:scale-[0.98] transition-all text-lg"
                                        onClick={handleCreatePlan}
                                    >
                                        {editingPlan ? 'Save Changes' : 'Activate New Plan'}
                                    </Button>
                                </DialogFooter>
                            </div>
                        </DialogContent>
                    </Dialog>
                    <Button variant="ghost" size="icon" className="border border-slate-200">
                        <MoreHorizontal className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Plan Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-6">
                {filteredPlans.map((plan) => (
                    <Card key={plan.id} className={cn(
                        "relative p-8 border-slate-100 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col",
                        plan.popular ? "ring-2 ring-blue-500 ring-offset-4" : ""
                    )}>
                        {plan.popular && (
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest shadow-lg">
                                Most Popular
                            </div>
                        )}

                        <div className="flex justify-between items-start mb-6">
                            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white" style={{ backgroundColor: plan.color }}>
                                <Layers className="w-6 h-6" />
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="text-slate-400 -mr-4">
                                        <MoreVertical className="w-4 h-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-40 rounded-xl border-slate-100 shadow-xl p-1">
                                    <DropdownMenuItem
                                        onClick={() => handleOpenDialog(plan)}
                                        className="gap-2 font-bold text-slate-600 focus:text-blue-600 focus:bg-blue-50 rounded-lg cursor-pointer"
                                    >
                                        <Edit className="w-4 h-4" /> Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => handleDeletePlan(plan.id)}
                                        className="gap-2 font-bold text-rose-600 focus:text-rose-600 focus:bg-rose-50 rounded-lg cursor-pointer"
                                    >
                                        <Trash2 className="w-4 h-4" /> Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-xl font-black text-slate-900 mb-2">{plan.name}</h3>
                            <p className="text-sm text-slate-400 font-medium leading-relaxed">{plan.description}</p>
                        </div>

                        <div className="mb-8 flex items-baseline gap-1">
                            <span className="text-4xl font-black text-slate-900 tracking-tighter italic">{plan.price}</span>
                            <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">/ {plan.frequency}</span>
                        </div>

                        <div className="space-y-4 mb-10 flex-1">
                            {plan.features.map((feature, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100">
                                        <Check className="w-3 h-3 text-blue-600" />
                                    </div>
                                    <span className="text-xs font-bold text-slate-600">{feature}</span>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-3">
                            <Button
                                onClick={() => handleOpenDialog(plan)}
                                className={cn(
                                    "w-full h-11 font-black rounded-lg transition-all",
                                    plan.popular ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-slate-900 hover:bg-black text-white"
                                )}
                            >
                                Edit Configuration
                            </Button>
                            <Button variant="ghost" className="w-full text-xs font-bold text-slate-400 uppercase tracking-widest">
                                View 14 Subscribers
                            </Button>
                        </div>
                    </Card>
                ))}

                {/* Add Plan Placeholder */}
                <div onClick={() => setOpen(true)}>
                    <Card className="border-2 border-dashed border-slate-200 bg-slate-50/50 hover:bg-white hover:border-blue-400 transition-all duration-300 h-full flex flex-col items-center justify-center p-8 text-center group cursor-pointer min-h-[400px]">
                        <div className="w-16 h-16 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-blue-500 group-hover:scale-110 transition-all mb-4">
                            <Plus className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-600 group-hover:text-slate-900">Add New Tier</h3>
                        <p className="text-sm text-slate-400 mt-2 max-w-[200px]">Design a new subscription protocol for your customers.</p>
                    </Card>
                </div>
            </div>

            {/* Analytics Insight */}
            <Card className="mt-12 p-8 bg-blue-600 text-white border-none shadow-xl shadow-blue-600/20 overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 -translate-x-4 translate-y-4">
                    <Zap className="w-64 h-64" />
                </div>
                <div className="relative z-10 max-w-2xl">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-xl bg-white/10 backdrop-blur-md">
                            <Briefcase className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-black uppercase tracking-[0.3em]">Strategy Hub</span>
                    </div>
                    <h2 className="text-2xl font-black mb-4">Optimize your revenue streams</h2>
                    <p className="text-blue-100 font-medium leading-relaxed">
                        Based on your current delivery density in Sector-5, implementing a "Density Discount" tier could increase your subscription count by up to 14% while reducing operational costs.
                    </p>
                    <div className="flex gap-4 mt-8">
                        <Button className="bg-white text-blue-600 hover:bg-blue-50 font-black px-8 h-12 rounded-xl">
                            Run Optimization
                        </Button>
                        <Button variant="ghost" className="text-white hover:bg-white/10 font-bold px-8 h-12 rounded-xl">
                            Contact Consultant
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}