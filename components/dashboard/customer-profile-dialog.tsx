'use client';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Phone, MapPin, User, Mail, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CustomerProfileDialogProps {
    customer: any;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CustomerProfileDialog({ customer, open, onOpenChange }: CustomerProfileDialogProps) {
    if (!customer) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[650px] bg-white dark:bg-slate-950 border">
                <DialogHeader>
                    <DialogTitle className="flex justify-between items-center pr-8 border-b border-border/50 pb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                                {customer.name?.[0]}
                            </div>
                            <div>
                                <span className="text-xl font-black text-foreground block tracking-tight">{customer.name}</span>
                                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{customer.email}</span>
                            </div>
                        </div>
                        <span
                            className={cn(
                                "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                                customer.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                            )}
                        >
                            {customer.status}
                        </span>
                    </DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 py-6 border-b border-border/50">
                    <div className="space-y-5">
                        <div className="flex items-start gap-3">
                            <User className="w-4 h-4 text-muted-foreground mt-0.5" />
                            <div>
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider mb-0.5">Full Name</p>
                                <p className="text-sm font-bold text-foreground">{customer.name}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Mail className="w-4 h-4 text-muted-foreground mt-0.5" />
                            <div>
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider mb-0.5">Email Address</p>
                                <p className="text-sm font-bold text-foreground">{customer.email || 'N/A'}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Phone className="w-4 h-4 text-muted-foreground mt-0.5" />
                            <div>
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider mb-0.5">Mobile Number</p>
                                <p className="text-sm font-bold text-foreground">{customer.phone || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-5">
                        <div className="flex items-start gap-3">
                            <Calendar className="w-4 h-4 text-muted-foreground mt-0.5" />
                            <div>
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider mb-0.5">Member Since</p>
                                <p className="text-sm font-bold text-foreground">{customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : 'N/A'}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                            <div>
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider mb-0.5">Primary Address</p>
                                <p className="text-sm font-bold text-foreground leading-relaxed">{customer.address || 'Corporate Park 12, BLR'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-2">
                    <Button variant="outline" className="gap-2 font-bold" onClick={() => onOpenChange(false)}>
                        Close
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
