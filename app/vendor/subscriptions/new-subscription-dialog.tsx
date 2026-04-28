'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Plus } from 'lucide-react';

import { useVendorAuth } from '@/lib/vendor-auth';
import { useData } from '@/lib/data-context';

interface NewSubscriptionDialogProps {
    onAdd: (subscription: any) => void;
}

export function NewSubscriptionDialog({ onAdd }: NewSubscriptionDialogProps) {
    const { user } = useVendorAuth();
    const isRiceVendor = user?.businessType === 'rice';
    const { mockCustomers, mockBusinessPlans } = useData();

    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        customerId: '',
        customerName: '',
        planId: '',
        planName: '',
        description: '',
        amount: '',
        frequency: 'Monthly',
        startDate: new Date().toISOString().split('T')[0],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const endDate = new Date(formData.startDate);
        endDate.setMonth(endDate.getMonth() + 1);

        // Create new subscription object
        const newSubscription = {
            id: Date.now().toString(),
            customerId: formData.customerId,
            customer: formData.customerName,
            planId: formData.planId,
            plan: formData.planName,
            description: formData.description,
            amount: formData.amount,
            status: 'active',
            startDate: new Date(formData.startDate).toISOString(),
            endDate: endDate.toISOString(),
            autoRenew: true,
            totalAmount: Number(formData.amount),
            paidAmount: Number(formData.amount),
            tenantId: user?.tenantId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        onAdd(newSubscription);
        setOpen(false);
        setFormData({
            customerId: '',
            customerName: '',
            planId: '',
            planName: '',
            description: '',
            amount: '',
            frequency: 'Monthly',
            startDate: new Date().toISOString().split('T')[0],
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    New Subscription
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Create New Subscription</DialogTitle>
                    <DialogDescription>
                        Enter the details for the new subscription plan.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="customerId" className="text-right">
                                Select Customer
                            </Label>
                            <Select
                                value={formData.customerId}
                                onValueChange={(value) => {
                                    const cust = mockCustomers.find(c => c.id === value);
                                    setFormData(prev => ({ ...prev, customerId: value, customerName: cust?.name || '' }));
                                }}
                                required
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Choose a customer" />
                                </SelectTrigger>
                                <SelectContent>
                                    {mockCustomers.map((cust: any) => (
                                        <SelectItem key={cust.id} value={cust.id}>{cust.name} ({cust.email})</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="planId" className="text-right">
                                Select Plan
                            </Label>
                            <Select
                                value={formData.planId}
                                onValueChange={(value) => {
                                    const p = mockBusinessPlans.find(plan => plan.id === value);
                                    setFormData(prev => ({
                                        ...prev,
                                        planId: value,
                                        planName: p?.name || '',
                                        amount: p?.price?.toString() || ''
                                    }));
                                }}
                                required
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Choose a plan" />
                                </SelectTrigger>
                                <SelectContent>
                                    {mockBusinessPlans.map((p: any) => (
                                        <SelectItem key={p.id} value={p.id}>{p.name} - ₹{p.price}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="description" className="text-right">
                                Description
                            </Label>
                            <Input
                                id="description"
                                name="description"
                                placeholder={isRiceVendor ? "e.g. 10kg per month" : "e.g. 1L per day"}
                                value={formData.description}
                                onChange={handleChange}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="amount" className="text-right">
                                Amount (₹)
                            </Label>
                            <Input
                                id="amount"
                                name="amount"
                                type="number"
                                value={formData.amount}
                                onChange={handleChange}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="frequency" className="text-right">
                                Frequency
                            </Label>
                            <Select
                                value={formData.frequency}
                                onValueChange={(value) => handleSelectChange('frequency', value)}
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select frequency" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Daily">Daily</SelectItem>
                                    <SelectItem value="Weekly">Weekly</SelectItem>
                                    <SelectItem value="Monthly">Monthly</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="startDate" className="text-right">
                                Start Date
                            </Label>
                            <Input
                                id="startDate"
                                name="startDate"
                                type="date"
                                value={formData.startDate}
                                onChange={handleChange}
                                className="col-span-3"
                                required
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit">Create Subscription</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}