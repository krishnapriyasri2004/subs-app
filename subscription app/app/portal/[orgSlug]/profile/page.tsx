'use client';

import React, { useState } from 'react';
import { PortalLayout } from '@/components/portal/portal-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function ProfilePage({ params }: { params: { orgSlug: string } }) {
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await new Promise(r => setTimeout(r, 1000));
            toast.success("Profile updated successfully!");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <PortalLayout orgSlug={params.orgSlug}>
            <div className="max-w-2xl mx-auto space-y-6">
                <div>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">Profile Settings</h2>
                    <p className="text-sm text-slate-500 mt-1">Manage your account details and default address</p>
                </div>

                <Card className="p-6 sm:p-8 bg-white border border-slate-200 rounded-2xl shadow-sm">
                    <form onSubmit={handleSave} className="space-y-6">

                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-2">Personal Information</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>First Name</Label>
                                    <Input defaultValue="John" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Last Name</Label>
                                    <Input defaultValue="Doe" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Email</Label>
                                <Input defaultValue="customer@example.com" disabled className="bg-slate-50 text-slate-500 cursor-not-allowed" />
                            </div>
                            <div className="space-y-2">
                                <Label>Phone</Label>
                                <Input defaultValue="+91 98765 43210" />
                            </div>
                        </div>

                        <div className="space-y-4 pt-4">
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-2">Default Billing Address</h3>
                            <div className="space-y-2">
                                <Label>Street Address</Label>
                                <Input defaultValue="123 Example Street, Apt 4B" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>City</Label>
                                    <Input defaultValue="Bangalore" />
                                </div>
                                <div className="space-y-2">
                                    <Label>State</Label>
                                    <Input defaultValue="Karnataka" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Pincode</Label>
                                <Input defaultValue="560001" />
                            </div>
                        </div>

                        <div className="pt-6 flex justify-end">
                            <Button type="submit" className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 font-bold" disabled={isLoading}>
                                {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : 'Save Changes'}
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </PortalLayout>
    );
}
