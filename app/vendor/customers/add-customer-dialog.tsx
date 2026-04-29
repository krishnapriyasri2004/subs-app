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
import { Plus } from 'lucide-react';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface AddCustomerDialogProps {
    onAdd: (customer: any) => void;
}

export function AddCustomerDialog({ onAdd }: AddCustomerDialogProps) {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        accountNumber: '',
        email: '',
        additionalEmail: '',
        status: 'Active',
        preferredLanguage: 'English',
        panNumber: '',
        gstin: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Create new customer object
        const newCustomer = {
            id: Date.now(), // temporary ID generation
            ...formData,
            subscriptions: 0,
            joinedDate: new Date().toISOString().split('T')[0],
            lifetime: '₹0',
        };

        onAdd(newCustomer);
        setOpen(false);
        setFormData({
            name: '',
            phone: '',
            address: '',
            accountNumber: '',
            email: '',
            additionalEmail: '',
            status: 'Active',
            preferredLanguage: 'English',
            panNumber: '',
            gstin: '',
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
                    Add Customer
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add New Customer</DialogTitle>
                    <DialogDescription>
                        Enter the full details of the new customer below.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Raj Kumar" required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="accountNumber">Account Number</Label>
                            <Input id="accountNumber" name="accountNumber" value={formData.accountNumber} onChange={handleChange} placeholder="ACC001" required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 98765 43210" required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="raj@example.com" required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="additionalEmail">Additional Email</Label>
                            <Input id="additionalEmail" name="additionalEmail" type="email" value={formData.additionalEmail} onChange={handleChange} placeholder="raj.work@example.com" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="status">Account Status</Label>
                            <Select value={formData.status} onValueChange={(val) => handleSelectChange('status', val)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Active">Active</SelectItem>
                                    <SelectItem value="Inactive">Inactive</SelectItem>
                                    <SelectItem value="Suspended">Suspended</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="preferredLanguage">Preferred Language</Label>
                            <Select value={formData.preferredLanguage} onValueChange={(val) => handleSelectChange('preferredLanguage', val)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select language" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="English">English</SelectItem>
                                    <SelectItem value="Tamil">Tamil</SelectItem>
                                    <SelectItem value="Hindi">Hindi</SelectItem>
                                    <SelectItem value="Malayalam">Malayalam</SelectItem>
                                    <SelectItem value="Kannada">Kannada</SelectItem>
                                    <SelectItem value="Telugu">Telugu</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="panNumber">PAN Number</Label>
                            <Input id="panNumber" name="panNumber" value={formData.panNumber} onChange={handleChange} placeholder="ABCDE1234F" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="gstin">GSTIN</Label>
                            <Input id="gstin" name="gstin" value={formData.gstin} onChange={handleChange} placeholder="22AAAAA0000A1Z5" />
                        </div>
                        <div className="grid gap-2 col-span-2">
                            <Label htmlFor="address">Full Address</Label>
                            <Input id="address" name="address" value={formData.address} onChange={handleChange} placeholder="Street, City, State, ZIP" required />
                        </div>
                    </div>
                    <DialogFooter className="mt-6">
                        <Button type="submit" className="w-full sm:w-auto">Save Customer</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}