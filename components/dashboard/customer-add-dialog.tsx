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
import { openWhatsApp, getWhatsAppUrl } from '@/lib/whatsapp';

interface CustomerAddDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onAdd: (newCustomer: any) => void;
}

export function CustomerAddDialog({ open, onOpenChange, onAdd }: CustomerAddDialogProps) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        walletBalance: '0'
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        onAdd({ 
            ...formData, 
            walletBalance: parseFloat(formData.walletBalance) || 0,
            status: 'active', 
            createdAt: new Date().toISOString(), 
            updatedAt: new Date().toISOString() 
        });

        // Send Welcome WhatsApp Message
        if (formData.phone) {
            try {
                await fetch('/api/send-whatsapp', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ phoneNumber: formData.phone, name: formData.name }),
                });
            } catch (e) {
                console.error("Failed to send welcome WhatsApp:", e);
            }

            // Open WhatsApp chat for the new customer
            toast.info(`Opening WhatsApp for ${formData.name}...`);
            const welcomeMsg = `Hello ${formData.name}, welcome to Subtrack! We're excited to have you on board.`;
            const url = getWhatsAppUrl(formData.phone, welcomeMsg);
            
            const link = document.createElement('a');
            link.href = url;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

        setFormData({ name: '', email: '', phone: '', address: '', walletBalance: '0' });
        onOpenChange(false);
        toast.success("Customer added successfully.");
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] bg-white dark:bg-slate-950 border">
                <DialogHeader>
                    <DialogTitle>Add New Customer</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                            id="add-name"
                            name="name"
                            placeholder="e.g. Rahul Kumar"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                            id="add-email"
                            type="email"
                            name="email"
                            placeholder="Optional email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone">Mobile Number</Label>
                        <Input
                            id="add-phone"
                            name="phone"
                            placeholder="e.g. 9876543210"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input
                            id="add-address"
                            name="address"
                            placeholder="Customer billing or delivery address"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="walletBalance">Initial Wallet Credit (₹)</Label>
                        <Input
                            id="add-walletBalance"
                            type="number"
                            name="walletBalance"
                            placeholder="0.00"
                            value={formData.walletBalance}
                            onChange={(e) => setFormData({ ...formData, walletBalance: e.target.value })}
                        />
                    </div>
                    <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit">Add Customer</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
