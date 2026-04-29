'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tenant, TenantStatus } from '@/types';
import { useData } from '@/lib/data-context';

interface TenantDialogProps {
    tenant?: Tenant | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (tenantData: any) => void;
}

export function TenantDialog({ tenant, open, onOpenChange, onSave }: TenantDialogProps) {
    const { mockBusinessPlans } = useData();
    const defaultPlanId = mockBusinessPlans.length > 0 ? mockBusinessPlans[0].id : '';

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subscriptionPlanId: defaultPlanId,
        status: 'active' as TenantStatus,
        maxUsers: 10,
    });

    useEffect(() => {
        if (tenant) {
            setFormData({
                name: tenant.name || '',
                email: tenant.email || '',
                phone: tenant.phone || '',
                subscriptionPlanId: tenant.subscriptionPlanId || defaultPlanId,
                status: tenant.status || 'active',
                maxUsers: tenant.maxUsers || 10,
            });
        } else {
            setFormData({
                name: '',
                email: '',
                phone: '',
                subscriptionPlanId: defaultPlanId,
                status: 'active',
                maxUsers: 10,
            });
        }
    }, [tenant, open, defaultPlanId]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
        onOpenChange(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'maxUsers' ? parseInt(value) : value
        }));
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[480px] bg-white dark:bg-slate-950 border text-foreground p-0 overflow-hidden flex flex-col max-h-[90vh] fixed left-[50%] top-[10vh] translate-x-[-50%] translate-y-0 duration-200">
                <DialogHeader className="p-8 pb-0">
                    <DialogTitle className="text-2xl font-bold">
                        {tenant ? 'Scale Enterprise Node' : 'Provision New Partnership'}
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                        {tenant
                            ? 'Update configuration for this tenant node. Changes apply globally.'
                            : 'Initialize a new tenant environment with specific service quotas.'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-8 space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="tenant-name" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Company Name</Label>
                                <Input
                                    id="tenant-name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="e.g. Acme Corporation"
                                    className="h-12 rounded-xl bg-muted/20 border-border/50 focus:ring-primary/20"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="tenant-email" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Corporate Email</Label>
                                    <Input
                                        id="tenant-email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="contact@company.com"
                                        className="h-12 rounded-xl bg-muted/20 border-border/50 focus:ring-primary/20"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="tenant-phone" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Direct Line</Label>
                                    <Input
                                        id="tenant-phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="+91 ..."
                                        className="h-12 rounded-xl bg-muted/20 border-border/50 focus:ring-primary/20"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="tenant-plan" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Service Tier</Label>
                                    <select
                                        id="tenant-plan"
                                        name="subscriptionPlanId"
                                        value={formData.subscriptionPlanId}
                                        onChange={handleChange}
                                        className="flex h-12 w-full rounded-xl border border-border/50 bg-muted/20 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    >
                                        {mockBusinessPlans.map(plan => (
                                            <option key={plan.id} value={plan.id}>{plan.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="tenant-seats" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Identity Quota</Label>
                                    <Input
                                        id="tenant-seats"
                                        name="maxUsers"
                                        type="number"
                                        value={formData.maxUsers}
                                        onChange={handleChange}
                                        className="h-12 rounded-xl bg-muted/20 border-border/50 focus:ring-primary/20"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="tenant-status" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Lifecycle Status</Label>
                                <select
                                    id="tenant-status"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="flex h-12 w-full rounded-xl border border-border/50 bg-muted/20 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                >
                                    <option value="active">Active</option>
                                    <option value="suspended">Suspended</option>
                                    <option value="trial">Trial</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="p-8 pt-4 border-t border-border/50 bg-muted/10">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => onOpenChange(false)}
                            className="h-12 rounded-xl font-bold"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="h-12 rounded-xl bg-primary text-primary-foreground font-black px-8 shadow-lg shadow-primary/20"
                        >
                            {tenant ? 'Deploy Updates' : 'Initialize Node'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
