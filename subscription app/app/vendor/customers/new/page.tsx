'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    ChevronRight,
    ArrowLeft,
    ChevronDown,
    User,
    MapPin,
    CheckCircle2,
    Plus,
    X,
    CheckCircle
} from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export default function NewCustomerPage() {
    const router = useRouter();
    const [copyToShipping, setCopyToShipping] = useState(true);
    const [isBillingExpanded, setIsBillingExpanded] = useState(true);

    return (
        <div className="space-y-8 pb-20 max-w-5xl mx-auto">
            {/* Breadcrumbs & Header */}
            <div>
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">
                    <span className="hover:text-blue-600 cursor-pointer transition-colors" onClick={() => router.push('/vendor/dashboard')}>DASHBOARD</span>
                    <ChevronRight className="w-3 h-3 text-slate-300" />
                    <span className="hover:text-blue-600 cursor-pointer transition-colors" onClick={() => router.push('/vendor/customers')}>CUSTOMERS</span>
                    <ChevronRight className="w-3 h-3 text-slate-300" />
                    <span className="text-slate-900">ADD CUSTOMER</span>
                </div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">Add Customer</h1>
            </div>

            <div className="space-y-6">
                {/* Section: Customer Details */}
                <Card className="border-slate-200/60 shadow-xl shadow-slate-200/20 rounded-2xl overflow-hidden bg-white">
                    <div className="p-6 border-b border-slate-100 bg-slate-50/30">
                        <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Customer Details</h3>
                    </div>
                    <div className="p-10 space-y-6 max-w-3xl">
                        {/* Full Name */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                            <label className="text-sm font-bold text-slate-500">Full Name</label>
                            <div className="md:col-span-2">
                                <Input
                                    placeholder="Ganesh Kumar"
                                    className="h-12 border-slate-200 focus:border-blue-500 rounded-xl text-sm px-4 bg-white transition-all shadow-sm"
                                />
                            </div>
                        </div>

                        {/* Account Number */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                            <label className="text-sm font-bold text-slate-500">Account Number</label>
                            <div className="md:col-span-2">
                                <Input
                                    placeholder="Auto-generated"
                                    disabled
                                    className="h-12 border-slate-100 bg-slate-50/50 rounded-xl text-sm px-4 text-slate-400 font-medium"
                                />
                            </div>
                        </div>

                        {/* Email Address */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                            <label className="text-sm font-bold text-slate-500">Email Address</label>
                            <div className="md:col-span-2 relative">
                                <Input
                                    placeholder="ganeshkumar@example.com"
                                    className="h-12 border-slate-200 focus:border-blue-500 rounded-xl text-sm px-4 pr-16 bg-white transition-all shadow-sm"
                                />
                                <button className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[10px] font-black text-blue-600 hover:text-blue-700 uppercase tracking-widest transition-colors">
                                    <Plus className="w-3 h-3" /> Add
                                </button>
                            </div>
                        </div>

                        {/* Additional Email */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                            <label className="text-sm font-bold text-slate-500 flex items-center gap-1.5">
                                Additional Email
                                <div className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center text-[10px] text-slate-400 font-bold italic shadow-sm">?</div>
                            </label>
                            <div className="md:col-span-2">
                                <Input
                                    placeholder="Add"
                                    className="h-12 border-slate-200 focus:border-blue-500 rounded-xl text-sm px-4 bg-white transition-all shadow-sm"
                                />
                            </div>
                        </div>

                        {/* Account Status */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                            <label className="text-sm font-bold text-slate-500">Account Status</label>
                            <div className="md:col-span-2">
                                <Select defaultValue="active">
                                    <SelectTrigger className="h-12 border-slate-200 rounded-xl text-sm px-4 focus:ring-0 focus:border-blue-500 bg-white shadow-sm">
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="inactive">Inactive</SelectItem>
                                        <SelectItem value="suspended">Suspended</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Preferred Language */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                            <label className="text-sm font-bold text-slate-500">Preferred Language</label>
                            <div className="md:col-span-2">
                                <Select defaultValue="english">
                                    <SelectTrigger className="h-12 border-slate-200 rounded-xl text-sm px-4 focus:ring-0 focus:border-blue-500 bg-white shadow-sm">
                                        <SelectValue placeholder="Select language" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="english">English</SelectItem>
                                        <SelectItem value="tamil">Tamil</SelectItem>
                                        <SelectItem value="hindi">Hindi</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* PAN Number */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                            <label className="text-sm font-bold text-slate-500">PAN Number</label>
                            <div className="md:col-span-2">
                                <Input
                                    placeholder="+(91) 9876543210"
                                    className="h-12 border-slate-200 focus:border-blue-500 rounded-xl text-sm px-4 bg-white transition-all shadow-sm"
                                />
                            </div>
                        </div>

                        {/* GSTIN */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                            <label className="text-sm font-bold text-slate-500">GSTIN</label>
                            <div className="md:col-span-2 relative flex items-center gap-3">
                                <div className="relative flex-1">
                                    <Input
                                        placeholder="29ABCDE1234F1125"
                                        className="h-12 border-slate-200 focus:border-blue-500 rounded-xl text-sm px-4 pr-10 bg-white transition-all shadow-sm"
                                    />
                                    <X className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 hover:text-slate-500 cursor-pointer transition-colors" />
                                </div>
                                <div className="flex items-center gap-2 p-1.5 px-3 bg-emerald-50 border border-emerald-100/50 rounded-lg shrink-0">
                                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest whitespace-nowrap">GSTI1fen</span>
                                </div>
                                <div className="flex items-center gap-1 text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-pointer hover:text-blue-600 transition-all p-1">
                                    Np <ChevronDown className="w-3 h-3" />
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Section: Billing Info (Accordion Style) */}
                <Card className="border-slate-200/60 shadow-xl shadow-slate-200/20 rounded-2xl overflow-hidden bg-white">
                    <div
                        onClick={() => setIsBillingExpanded(!isBillingExpanded)}
                        className="p-6 border-b border-slate-100 flex items-center justify-between cursor-pointer hover:bg-slate-50/50 transition-colors group"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                                <ChevronDown className={cn("w-4 h-4 text-blue-600 transition-transform duration-300", !isBillingExpanded && "-rotate-90")} />
                            </div>
                            <h3 className="text-xs font-black text-blue-600 uppercase tracking-widest">Billing Info</h3>
                        </div>
                    </div>

                    {isBillingExpanded && (
                        <div className="p-10 space-y-6 max-w-3xl">
                            <h4 className="text-base font-bold text-slate-800 mb-2">Billing Info</h4>

                            {/* Phone Number */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                                <label className="text-sm font-bold text-slate-500">Phone Number:</label>
                                <div className="md:col-span-2 flex gap-3">
                                    <div className="w-24 relative">
                                        <div className="h-12 border border-slate-200 bg-slate-50 rounded-xl flex items-center px-4 justify-between cursor-default">
                                            <span className="text-sm font-bold text-slate-900">+(91)</span>
                                            <ChevronDown className="w-3 h-3 text-slate-400" />
                                        </div>
                                    </div>
                                    <Input
                                        placeholder="98765432210"
                                        className="flex-1 h-12 border-slate-200 focus:border-blue-500 rounded-xl text-sm px-4 bg-white transition-all shadow-sm"
                                    />
                                </div>
                            </div>

                            {/* Company Name */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                                <label className="text-sm font-bold text-slate-500">Company Name:</label>
                                <div className="md:col-span-2">
                                    <Input
                                        placeholder="Ganesh Enterprises"
                                        className="h-12 border-slate-200 focus:border-blue-500 rounded-xl text-sm px-4 bg-white transition-all shadow-sm"
                                    />
                                </div>
                            </div>

                            {/* Address 1 */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                                <label className="text-sm font-bold text-slate-500">Address 1:</label>
                                <div className="md:col-span-2">
                                    <Input
                                        placeholder="456 MG Road"
                                        className="h-12 border-slate-200 focus:border-blue-500 rounded-xl text-sm px-4 bg-white transition-all shadow-sm"
                                    />
                                </div>
                            </div>

                            {/* Address 2 */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                                <label className="text-sm font-bold text-slate-500">Address 2 (Optional)</label>
                                <div className="md:col-span-2">
                                    <Input
                                        placeholder="- optional"
                                        className="h-12 border-slate-200 focus:border-blue-500 rounded-xl text-sm px-4 bg-white transition-all shadow-sm"
                                    />
                                </div>
                            </div>

                            {/* City */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                                <label className="text-sm font-bold text-slate-500">City</label>
                                <div className="md:col-span-2">
                                    <Select defaultValue="bangalore">
                                        <SelectTrigger className="h-12 border-slate-200 rounded-xl text-sm px-4 focus:ring-0 focus:border-blue-500 bg-white shadow-sm">
                                            <SelectValue placeholder="Select city" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="bangalore">Bangalore</SelectItem>
                                            <SelectItem value="mumbai">Mumbai</SelectItem>
                                            <SelectItem value="chennai">Chennai</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* State */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                                <label className="text-sm font-bold text-slate-500">State</label>
                                <div className="md:col-span-2">
                                    <Select defaultValue="karnataka">
                                        <SelectTrigger className="h-12 border-slate-200 rounded-xl text-sm px-4 focus:ring-0 focus:border-blue-500 bg-white shadow-sm">
                                            <SelectValue placeholder="Select state" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="karnataka">Karnataka</SelectItem>
                                            <SelectItem value="maharashtra">Maharashtra</SelectItem>
                                            <SelectItem value="tamilnadu">Tamil Nadu</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Postal Code */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                                <label className="text-sm font-bold text-slate-500">Postal Code</label>
                                <div className="md:col-span-2">
                                    <Input
                                        placeholder="560001"
                                        className="h-12 border-slate-200 focus:border-blue-500 rounded-xl text-sm px-4 bg-white transition-all shadow-sm"
                                    />
                                </div>
                            </div>

                            {/* Checkbox */}
                            <div className="pt-4 flex items-center gap-3">
                                <div
                                    onClick={() => setCopyToShipping(!copyToShipping)}
                                    className={cn(
                                        "w-5 h-5 rounded-md border flex items-center justify-center transition-all cursor-pointer",
                                        copyToShipping ? "bg-blue-600 border-blue-600 shadow-md" : "bg-white border-slate-200"
                                    )}
                                >
                                    {copyToShipping && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                                </div>
                                <span className="text-sm font-bold text-slate-600 cursor-pointer select-none" onClick={() => setCopyToShipping(!copyToShipping)}>
                                    Copy billing info to shipping
                                </span>
                            </div>

                            {/* Buttons inside card */}
                            <div className="flex justify-end gap-3 pt-8 mt-4 border-t border-slate-50">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-10 px-8 font-bold border-slate-200 text-slate-600 hover:bg-slate-50 transition-all rounded-lg"
                                    onClick={() => router.back()}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    size="sm"
                                    className="h-10 px-10 font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg shadow-blue-600/20 active:scale-[0.98] transition-all"
                                    onClick={() => router.push('/vendor/customers/1')}
                                >
                                    Save
                                </Button>
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
}