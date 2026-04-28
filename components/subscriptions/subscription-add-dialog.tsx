'use client';

import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useData } from '@/lib/data-context';

interface SubscriptionAddDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function SubscriptionAddDialog({ open, onOpenChange }: SubscriptionAddDialogProps) {
    const { addDocument, mockBusinessPlans, mockCustomers, mockTenants } = useData();
    const [formData, setFormData] = useState({
        customerId: '',
        planId: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const customer = mockCustomers.find(c => c.id === formData.customerId);
        const plan = mockBusinessPlans.find(p => p.id === formData.planId);

        if (!customer || !plan) {
            toast.error("Please select a valid customer and plan.");
            return;
        }

        const newSubscription = {
            customerId: customer.id,
            tenantId: customer.tenantId,
            planId: plan.id,
            status: 'active',
            startDate: new Date().toISOString(),
            endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
            autoRenew: true,
            totalAmount: plan.price,
            paidAmount: plan.price,
        };

        try {
            await addDocument('subscriptions', newSubscription);
            setFormData({ customerId: '', planId: '' });
            onOpenChange(false);
            toast.success("Subscription provisioned successfully.");
        } catch (e) {
            toast.error("Failed to provision subscription.");
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] border">
                <DialogHeader>
                    <DialogTitle>Provision Manual Service</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="customerId">Select Customer</Label>
                        <select
                            id="customerId"
                            className="w-full flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={formData.customerId}
                            onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                            required
                        >
                            <option value="">-- Choose Customer --</option>
                            {mockCustomers.map(customer => (
                                <option key={customer.id} value={customer.id}>
                                    {customer.name} ({customer.email})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="planId">Select Plan</Label>
                        <select
                            id="planId"
                            className="w-full flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={formData.planId}
                            onChange={(e) => setFormData({ ...formData, planId: e.target.value })}
                            required
                        >
                            <option value="">-- Choose Plan --</option>
                            {mockBusinessPlans.map(plan => (
                                <option key={plan.id} value={plan.id}>
                                    {plan.name} - ₹{plan.price}
                                </option>
                            ))}
                        </select>
                    </div>
                    <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit">Provision</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
