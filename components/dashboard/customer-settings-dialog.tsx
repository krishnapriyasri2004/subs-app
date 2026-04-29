'use client';

import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';

interface CustomerSettingsDialogProps {
    customer: any;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (updatedCustomer: any) => void;
}

export function CustomerSettingsDialog({ customer, open, onOpenChange, onSave }: CustomerSettingsDialogProps) {
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        if (customer) {
            setIsActive(customer.status === 'active');
        }
    }, [customer, open]);

    const handleSave = () => {
        onSave({ ...customer, status: isActive ? 'active' : 'inactive' });
        onOpenChange(false);
        toast.success("Customer settings updated successfully.");
    };

    if (!customer) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] bg-white dark:bg-slate-950 border">
                <DialogHeader>
                    <DialogTitle>Manage Settings - {customer.name}</DialogTitle>
                </DialogHeader>
                <div className="space-y-6 py-4">
                    <div className="flex items-center justify-between border border-border/50 p-4 rounded-xl">
                        <div className="space-y-0.5">
                            <Label className="text-base font-bold">Account Active</Label>
                            <p className="text-xs text-muted-foreground">
                                Allow this customer access to the platform and delivery network.
                            </p>
                        </div>
                        <Switch
                            checked={isActive}
                            onCheckedChange={setIsActive}
                        />
                    </div>
                </div>
                <DialogFooter className="pt-4">
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSave}>Save Preferences</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
