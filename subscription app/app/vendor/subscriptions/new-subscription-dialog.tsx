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

interface NewSubscriptionDialogProps {
    onAdd: (subscription: any) => void;
}

export function NewSubscriptionDialog({ onAdd }: NewSubscriptionDialogProps) {
    const { user } = useVendorAuth();
    const isRiceVendor = user?.businessType === 'rice';

    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        customer: '',
        plan: '',
        description: '',
        amount: '',
        frequency: 'Monthly',
        startDate: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Create new subscription object
        const newSubscription = {
            id: Date.now(),
            customer: formData.customer,
            plan: formData.plan,
            description: formData.description,
            amount: `₹${formData.amount}`,
            frequency: formData.frequency,
            startDate: formData.startDate,
            nextBilling: new Date(new Date(formData.startDate).setMonth(new Date(formData.startDate).getMonth() + 1)).toISOString().split('T')[0], // simplistic next month logic
            status: 'Active',
            cycles: 0,
        };

        onAdd(newSubscription);
        setOpen(false);
        setFormData({
            customer: '',
            plan: '',
            description: '',
            amount: '',
            frequency: 'Monthly',
            startDate: '',
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
                            <Label htmlFor="customer" className="text-right">
                                Customer Name
                            </Label>
                            <Input
                                id="customer"
                                name="customer"
                                value={formData.customer}
                                onChange={handleChange}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="plan" className="text-right">
                                Plan Name
                            </Label>
                            <Input
                                id="plan"
                                name="plan"
                                placeholder={isRiceVendor ? "e.g. Weekly Rice" : "e.g. Daily Milk"}
                                value={formData.plan}
                                onChange={handleChange}
                                className="col-span-3"
                                required
                            />
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