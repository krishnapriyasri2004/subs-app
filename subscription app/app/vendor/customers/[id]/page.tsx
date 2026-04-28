'use client';

import React, { useState } from 'react';
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

export default function CustomerDetailPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState('Overview');
    const [useBillingForShipping, setUseBillingForShipping] = useState(true);

    // State for form fields
    const [customerData, setCustomerData] = useState({
        name: params.id === '1' ? 'Ganesh Kumar' : 'Customer Profile',
        phone: '9876543210',
        company: 'Ganesh Enterprises',
        address1: '456 MG Road',
        address2: '',
        city: 'Bangalore',
        state: 'Karnataka',
        zip: '560001'
    });

    const tabs = [
        { name: 'Overview', icon: User },
        { name: 'Subscriptions', icon: CreditCard },
        { name: 'Invoices', icon: FileText },
        { name: 'Payments', icon: CreditCard },
        { name: 'Notes', icon: StickyNote },
    ];

    const handleSave = () => {
        toast.success('Customer record updated successfully!', {
            description: `Changes for ${customerData.name} have been saved.`,
            duration: 3000,
        });

        // Simulating persistence
        try {
            const savedCustomers = localStorage.getItem('vendor_customers');
            let listToUpdate = savedCustomers ? JSON.parse(savedCustomers) : [];

            // Fallback to initial data if localStorage is empty
            if (listToUpdate.length === 0) {
                listToUpdate = [
                    { id: 'CUST-301', name: 'Anjali Sharma', avatar: 'AS', email: 'anjali@example.com', phone: '+91 98765 43210', address: 'Delhi, India', status: 'Active', ltv: '₹15,400' },
                    { id: 'CUST-302', name: 'Vikram Singh', avatar: 'VS', email: 'vikram@example.com', phone: '+91 88765 12345', address: 'Mumbai, India', status: 'Active', ltv: '₹12,200' },
                    { id: 'CUST-303', name: 'Suresh Raina', avatar: 'SR', email: 'suresh@example.com', phone: '+91 78765 00000', address: 'Chennai, India', status: 'Inactive', ltv: '₹8,400' },
                    { id: 'CUST-304', name: 'Priya Patel', avatar: 'PP', email: 'priya@example.com', phone: '+91 99876 54321', address: 'Bangalore, India', status: 'Active', ltv: '₹22,100' },
                    { id: 'CUST-305', name: 'Rohit Sharma', avatar: 'RS', email: 'rohit@example.com', phone: '+91 99000 11223', address: 'Mumbai, India', status: 'Active', ltv: '₹5,600' },
                ];
            }

            const updatedCustomers = listToUpdate.map((c: any) =>
                c.id === params.id ? {
                    ...c,
                    name: customerData.name,
                    phone: customerData.phone,
                    address: `${customerData.city}, India`
                } : c
            );
            localStorage.setItem('vendor_customers', JSON.stringify(updatedCustomers));

            setIsEditing(false);

            // Redirect back after success toast
            setTimeout(() => {
                router.push('/vendor/customers');
            }, 1500);
        } catch (e) {
            console.error("Failed to save to localStorage", e);
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
                            <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-600 tracking-widest text-[10px]">CUST-{params.id}</span>
                            <span className="w-1 h-1 rounded-full bg-slate-300" />
                            <span className="hover:text-blue-600 cursor-pointer flex items-center gap-1 transition-colors">
                                ganeshkumar@example.com <ChevronDown className="w-3 h-3" />
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
                                        <option value="Bangalore">Bangalore</option>
                                        <option value="Mumbai">Mumbai</option>
                                        <option value="Delhi">Delhi</option>
                                        <option value="Chennai">Chennai</option>
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
                                        <option value="Karnataka">Karnataka</option>
                                        <option value="Maharashtra">Maharashtra</option>
                                        <option value="Tamil Nadu">Tamil Nadu</option>
                                        <option value="Delhi NCR">Delhi NCR</option>
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                                <p className="text-sm font-black text-slate-500 uppercase tracking-widest text-[11px]">Postal Code:</p>
                                <Input
                                    placeholder="560001"
                                    value={customerData.zip}
                                    onChange={(e) => setCustomerData({ ...customerData, zip: e.target.value })}
                                    className={cn(
                                        "h-11 border-slate-200 focus:border-blue-500 rounded-xl text-sm font-bold",
                                        !isEditing && "bg-slate-50 border-transparent cursor-not-allowed"
                                    )}
                                    readOnly={!isEditing}
                                />
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
