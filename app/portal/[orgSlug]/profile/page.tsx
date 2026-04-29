'use client';

import React, { useState, useEffect } from 'react';
import { PortalLayout } from '@/components/portal/portal-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useData } from '@/lib/data-context';

export default function ProfilePage({ params }: { params: { orgSlug: string } }) {
    const { user } = useAuth();
    const { mockCustomers, updateDocument } = useData();
    const [isLoading, setIsLoading] = useState(false);

    // Find customer record by matching email to the authenticated user
    const currentCustomer = mockCustomers.find(c => c.email === user?.email);

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
    });

    useEffect(() => {
        if (currentCustomer) {
            setFormData({
                name: currentCustomer.name || '',
                phone: currentCustomer.phone || '',
                address: currentCustomer.address || '',
            });
        }
    }, [currentCustomer]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentCustomer) return;

        setIsLoading(true);
        try {
            await updateDocument('customers', currentCustomer.id, {
                ...currentCustomer,
                name: formData.name,
                phone: formData.phone,
                address: formData.address,
            });
            toast.success("Profile updated successfully!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to update profile.");
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
                            <div className="space-y-2">
                                <Label>Full Name</Label>
                                <Input
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Email</Label>
                                <Input value={user?.email || 'customer@example.com'} disabled className="bg-slate-50 text-slate-500 cursor-not-allowed" />
                            </div>
                            <div className="space-y-2">
                                <Label>Phone</Label>
                                <Input
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-4 pt-4">
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-2">Default Address</h3>
                            <div className="space-y-2">
                                <Label>Full Address</Label>
                                <Input
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="pt-6 flex justify-end">
                            <Button type="submit" className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 font-bold" disabled={isLoading || !currentCustomer}>
                                {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : 'Save Changes'}
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </PortalLayout>
    );
}
