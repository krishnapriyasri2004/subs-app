'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    ChevronRight,
    ChevronDown,
    CheckCircle2,
    Mail,
    User,
    CreditCard,
    FileText,
    StickyNote
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useData } from '@/lib/data-context';

export default function CustomerDetailPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const { mockCustomers, updateDocument } = useData();
    const [isSaving, setIsSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState('Overview');
    const [useBillingForShipping, setUseBillingForShipping] = useState(true);

    // State for form fields
    const [customerData, setCustomerData] = useState({
        name: 'Loading...',
        phone: '',
        company: '',
        address1: '',
        address2: '',
        city: 'Coimbatore',
        state: 'Tamil Nadu',
        zip: '641001',
        email: '',
        walletBalance: 0
    });

    useEffect(() => {
        const found = mockCustomers.find((c: any) => c.id === params.id);
        if (found) {
            setCustomerData({
                name: found.name || '',
                phone: found.phone?.replace('+91 ', '') || '',
                company: found.companyName || (found.name + ' Enterprises'),
                address1: found.address || '',
                address2: '',
                city: found.city || found.address?.split(',')[1]?.trim() || 'Coimbatore',
                state: found.state || 'Tamil Nadu',
                zip: found.zipCode || found.postalCode || '641001',
                email: found.email || '',
                walletBalance: found.walletBalance || 0
            });
        }
    }, [params.id, mockCustomers]);

    const tabs = [
        { name: 'Overview', icon: User },
        { name: 'Subscriptions', icon: CreditCard },
        { name: 'Invoices', icon: FileText },
        { name: 'Payments', icon: CreditCard },
        { name: 'Notes', icon: StickyNote },
    ];

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateDocument('customers', params.id, {
                name: customerData.name,
                phone: customerData.phone,
                companyName: customerData.company,
                address: customerData.address1,
                city: customerData.city,
                state: customerData.state,
                postalCode: customerData.zip,
                email: customerData.email,
                walletBalance: customerData.walletBalance
            });

            toast.success('Customer record updated successfully!');
            setIsEditing(false);
            router.push('/vendor/customers');
        } catch (e) {
            console.error("Failed to update customer", e);
            toast.error("Failed to update record");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6 pb-20 max-w-5xl mx-auto font-sans animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Breadcrumbs & Header */}
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                    <span className="hover:text-blue-600 cursor-pointer" onClick={() => router.push('/vendor/dashboard')}>Dashboard</span>
                    <ChevronRight className="w-3 h-3" />
                    <span className="hover:text-blue-600 cursor-pointer" onClick={() => router.push('/vendor/customers')}>Customers</span>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-slate-900 tracking-tight">{customerData.name}</span>
                </div>

                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-3xl overflow-hidden border-4 border-white shadow-xl relative">
                        <Image
                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                            alt="Customer Profile"
                            fill
                            className="object-cover"
                            sizes="80px"
                            priority
                        />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tighter">{customerData.name}</h1>
                        <div className="flex items-center gap-3 mt-2 text-xs font-bold text-slate-400">
                            <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-600 tracking-widest text-[10px]">{params.id}</span>
                            <span className="w-1 h-1 rounded-full bg-slate-300" />
                            <span className="hover:text-blue-600 cursor-pointer flex items-center gap-1 transition-colors">
                                {customerData.email || 'customer@example.com'} <ChevronDown className="w-3 h-3" />
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs System */}
            <div className="flex items-center gap-8 border-b border-slate-100 mt-10">
                {tabs.map((tab) => (
                    <button
                        key={tab.name}
                        onClick={() => setActiveTab(tab.name)}
                        className={cn(
                            "pb-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative flex items-center gap-2",
                            activeTab === tab.name
                                ? "text-blue-600"
                                : "text-slate-400 hover:text-slate-600"
                        )}
                    >
                        <tab.icon className="w-3.5 h-3.5" />
                        {tab.name}
                        {activeTab === tab.name && (
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600" />
                        )}
                    </button>
                ))}
            </div>

            {/* Tab Content: Overview */}
            {activeTab === 'Overview' && (
                <div className="space-y-6 pt-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="flex items-center gap-3 mb-4 select-none group cursor-pointer" onClick={() => setUseBillingForShipping(!useBillingForShipping)}>
                        <div
                            className={cn(
                                "w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all",
                                useBillingForShipping ? "bg-blue-600 border-blue-600" : "bg-white border-slate-200"
                            )}
                        >
                            {useBillingForShipping && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                        </div>
                        <span className="text-xs font-bold text-slate-600 group-hover:text-slate-900 transition-colors">Use the same shipping info as billing info</span>
                    </div>

                    <Card className="border-slate-100 shadow-sm overflow-hidden bg-white">
                        <div className="p-5 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
                            <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Shipping Info</h3>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-[10px] font-black uppercase text-blue-600"
                                onClick={() => setIsEditing(!isEditing)}
                            >
                                {isEditing ? 'Cancel Edit' : 'Edit Details'}
                            </Button>
                        </div>

                        <div className="p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                                <p className="text-sm font-black text-slate-500 uppercase tracking-widest text-[11px]">Phone Number:</p>
                                <div className="flex gap-2">
                                    <div className="w-24 relative">
                                        <Input value="+(91)" readOnly className="h-11 border-slate-200 bg-slate-50 rounded-xl text-sm pr-8 font-bold" />
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    </div>
                                    <Input
                                        placeholder="9876543210"
                                        value={customerData.phone}
                                        onChange={(e) => setCustomerData({ ...customerData, phone: e.target.value })}
                                        className={cn(
                                            "flex-1 h-11 border-slate-200 focus:border-blue-500 rounded-xl text-sm font-medium",
                                            !isEditing && "bg-slate-50 border-transparent cursor-not-allowed"
                                        )}
                                        readOnly={!isEditing}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                                <p className="text-sm font-black text-slate-500 uppercase tracking-widest text-[11px]">Company Name:</p>
                                <Input
                                    placeholder="Ganesh Enterprises"
                                    value={customerData.company}
                                    onChange={(e) => setCustomerData({ ...customerData, company: e.target.value })}
                                    className={cn(
                                        "h-11 border-slate-200 focus:border-blue-500 rounded-xl text-sm font-medium",
                                        !isEditing && "bg-slate-50 border-transparent cursor-not-allowed"
                                    )}
                                    readOnly={!isEditing}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                                <p className="text-sm font-black text-slate-500 uppercase tracking-widest text-[11px]">Address 1:</p>
                                <Input
                                    placeholder="456 MG Road"
                                    value={customerData.address1}
                                    onChange={(e) => setCustomerData({ ...customerData, address1: e.target.value })}
                                    className={cn(
                                        "h-11 border-slate-200 focus:border-blue-500 rounded-xl text-sm font-medium",
                                        !isEditing && "bg-slate-50 border-transparent cursor-not-allowed"
                                    )}
                                    readOnly={!isEditing}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                                <p className="text-sm font-black text-slate-500 uppercase tracking-widest text-[11px]">Address 2:</p>
                                <Input
                                    placeholder="- optional"
                                    value={customerData.address2}
                                    onChange={(e) => setCustomerData({ ...customerData, address2: e.target.value })}
                                    className={cn(
                                        "h-11 border-slate-200 focus:border-blue-500 rounded-xl text-sm font-medium italic",
                                        !isEditing && "bg-slate-50 border-transparent cursor-not-allowed"
                                    )}
                                    readOnly={!isEditing}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                                <p className="text-sm font-black text-slate-500 uppercase tracking-widest text-[11px]">City:</p>
                                <div className="relative">
                                    <select
                                        className={cn(
                                            "w-full h-11 border border-slate-200 rounded-xl text-sm px-4 appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium",
                                            !isEditing && "bg-slate-50 border-transparent cursor-not-allowed"
                                        )}
                                        value={customerData.city}
                                        onChange={(e) => setCustomerData({ ...customerData, city: e.target.value })}
                                        disabled={!isEditing}
                                    >
                                        <option value="Coimbatore">Coimbatore</option>
                                        <option value="Namakkal">Namakkal</option>
                                        <option value="Salem">Salem</option>
                                        <option value="Erode">Erode</option>
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                                <p className="text-sm font-black text-slate-500 uppercase tracking-widest text-[11px]">State:</p>
                                <div className="relative">
                                    <select
                                        className={cn(
                                            "w-full h-11 border border-slate-200 rounded-xl text-sm px-4 appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium",
                                            !isEditing && "bg-slate-50 border-transparent cursor-not-allowed"
                                        )}
                                        value={customerData.state}
                                        onChange={(e) => setCustomerData({ ...customerData, state: e.target.value })}
                                        disabled={!isEditing}
                                    >
                                        <option value="Tamil Nadu">Tamil Nadu</option>
                                        <option value="Kerala">Kerala</option>
                                        <option value="Karnataka">Karnataka</option>
                                        <option value="Andhra Pradesh">Andhra Pradesh</option>
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                                <p className="text-sm font-black text-slate-500 uppercase tracking-widest text-[11px]">Postal Code:</p>
                                <Input
                                    placeholder="641001"
                                    value={customerData.zip}
                                    onChange={(e) => setCustomerData({ ...customerData, zip: e.target.value })}
                                    className={cn(
                                        "h-11 border-slate-200 focus:border-blue-500 rounded-xl text-sm font-bold",
                                        !isEditing && "bg-slate-50 border-transparent cursor-not-allowed"
                                    )}
                                    readOnly={!isEditing}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center pt-4 border-t border-slate-50">
                                <p className="text-sm font-black text-amber-600 uppercase tracking-widest text-[11px]">Wallet Balance (₹):</p>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                                    <Input
                                        type="number"
                                        placeholder="0.00"
                                        value={customerData.walletBalance}
                                        onChange={(e) => setCustomerData({ ...customerData, walletBalance: parseFloat(e.target.value) || 0 })}
                                        className={cn(
                                            "h-11 border-amber-200 focus:border-amber-500 rounded-xl text-sm pl-8 pr-4 font-black transition-all",
                                            !isEditing ? "bg-amber-50/20 border-transparent cursor-not-allowed" : "bg-white"
                                        )}
                                        readOnly={!isEditing}
                                    />
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            )}

            {/* Footer Actions */}
            <div className="flex justify-end gap-3 pt-10 border-t border-slate-100 mt-12">
                <Button variant="outline" className="h-12 px-10 font-bold border-slate-200 rounded-xl hover:bg-slate-50" onClick={() => router.back()}>
                    Discard Changes
                </Button>
                <Button
                    className="h-12 px-10 font-black bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xl shadow-blue-600/30 transition-all hover:-translate-y-0.5 active:scale-95"
                    onClick={handleSave}
                >
                    Save Record
                </Button>
            </div>
        </div>
    );
}