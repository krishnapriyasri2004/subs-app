'use client';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Calendar,
    CreditCard,
    User,
    Package,
    Clock,
    AlertCircle,
    Save,
    X
} from 'lucide-react';
import { useState, useEffect } from 'react';

interface ManageSubscriptionDialogProps {
    subscription: any;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onUpdateStatus: (id: string, status: string) => void;
    onUpdateSubscription: (subscription: any) => void;
    onDeleteSubscription: (id: string) => void;
}

export function ManageSubscriptionDialog({
    subscription,
    open,
    onOpenChange,
    onUpdateStatus,
    onUpdateSubscription,
    onDeleteSubscription
}: ManageSubscriptionDialogProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<any>(null);

    useEffect(() => {
        if (subscription) {
            setFormData({
                ...subscription,
                amount: subscription.amount.replace(/[^0-9]/g, '') // Remove currency symbol for input
            });
        }
    }, [subscription]);

    if (!subscription) return null;

    const statusColors: Record<string, string> = {
        Active: 'bg-green-100 text-green-800',
        Pending: 'bg-yellow-100 text-yellow-800',
        Paused: 'bg-gray-100 text-gray-800',
        Cancelled: 'bg-red-100 text-red-800',
    };

    const handleSave = () => {
        const updatedSubscription = {
            ...formData,
            amount: `₹${formData.amount}` // restore currency symbol
        };
        onUpdateSubscription(updatedSubscription);
        setIsEditing(false);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        if (subscription) {
            setFormData({
                ...subscription,
                amount: subscription.amount.replace(/[^0-9]/g, '')
            });
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };

    return (
        <Dialog open={open} onOpenChange={(val) => {
            onOpenChange(val);
            if (!val) setIsEditing(false);
        }}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <div className="flex justify-between items-start pr-8">
                        <div>
                            <DialogTitle className="text-xl font-bold mb-1">
                                {isEditing ? 'Edit Subscription' : 'Subscription Details'}
                            </DialogTitle>
                            <DialogDescription>
                                {isEditing ? 'Update subscription details below' : `Manage subscription for ${subscription.customer}`}
                            </DialogDescription>
                        </div>
                        {!isEditing && (
                            <span
                                className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${statusColors[subscription.status] || 'bg-gray-100 text-gray-800'
                                    }`}
                            >
                                {subscription.status}
                            </span>
                        )}
                    </div>
                </DialogHeader>

                {isEditing ? (
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="plan" className="text-right">
                                Plan Name
                            </Label>
                            <Input
                                id="plan"
                                name="plan"
                                value={formData?.plan || ''}
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
                                value={formData?.amount || ''}
                                onChange={handleChange}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="frequency" className="text-right">
                                Frequency
                            </Label>
                            <Select
                                value={formData?.frequency || 'Monthly'}
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
                            <Label htmlFor="nextBilling" className="text-right">
                                Next Billing
                            </Label>
                            <Input
                                id="nextBilling"
                                name="nextBilling"
                                type="date"
                                value={formData?.nextBilling || ''}
                                onChange={handleChange}
                                className="col-span-3"
                            />
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Plan Info</h3>

                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-full">
                                    <Package className="w-4 h-4 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Plan Name</p>
                                    <p className="font-medium text-foreground">{subscription.plan}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-full">
                                    <CreditCard className="w-4 h-4 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Amount</p>
                                    <p className="font-medium text-foreground">{subscription.amount} / {subscription.frequency}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-full">
                                    <User className="w-4 h-4 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Customer</p>
                                    <p className="font-medium text-foreground">{subscription.customer}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Billing Info</h3>

                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-secondary/10 rounded-full">
                                    <Calendar className="w-4 h-4 text-secondary" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Start Date</p>
                                    <p className="font-medium text-foreground">{subscription.startDate}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-accent/10 rounded-full">
                                    <Clock className="w-4 h-4 text-accent" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Next Billing</p>
                                    <p className="font-medium text-foreground">{subscription.nextBilling}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-orange-100 rounded-full">
                                    <AlertCircle className="w-4 h-4 text-orange-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Billing Cycle</p>
                                    <p className="font-medium text-foreground">{subscription.cycles} Completed</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="border-t pt-4 mt-4">
                    <h4 className="text-sm font-medium mb-3">Quick Actions</h4>
                    <div className="flex gap-3">
                        {isEditing ? (
                            <>
                                <Button variant="default" onClick={handleSave} className="gap-2">
                                    <Save className="w-4 h-4" /> Save Changes
                                </Button>
                                <Button variant="ghost" onClick={handleCancelEdit} className="gap-2">
                                    <X className="w-4 h-4" /> Cancel
                                </Button>
                            </>
                        ) : (
                            <>
                                {subscription.status === 'Active' ? (
                                    <Button
                                        variant="outline"
                                        className="text-amber-600 border-amber-200 hover:bg-amber-50"
                                        onClick={() => onUpdateStatus(subscription.id, 'Paused')}
                                    >
                                        Pause Subscription
                                    </Button>
                                ) : (
                                    <Button
                                        variant="outline"
                                        className="text-green-600 border-green-200 hover:bg-green-50"
                                        onClick={() => onUpdateStatus(subscription.id, 'Active')}
                                    >
                                        Activate Subscription
                                    </Button>
                                )}

                                {subscription.status !== 'Cancelled' && (
                                    <Button
                                        variant="destructive"
                                        onClick={() => onUpdateStatus(subscription.id, 'Cancelled')}
                                    >
                                        Cancel Subscription
                                    </Button>
                                )}

                                <Button
                                    variant="outline"
                                    className="text-red-600 border-red-200 hover:bg-red-50"
                                    onClick={() => {
                                        if (window.confirm('Are you sure you want to delete this subscription?')) {
                                            onDeleteSubscription(subscription.id);
                                        }
                                    }}
                                >
                                    Delete
                                </Button>

                                <div className="flex-1"></div>
                                <Button variant="secondary" onClick={() => setIsEditing(true)}>Edit Plan</Button>
                            </>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}