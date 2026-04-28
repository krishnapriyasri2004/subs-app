'use client';

import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
    Building2,
    Mail,
    Phone,
    Calendar,
    Clock,
    Users,
    Briefcase,
    TrendingUp,
    ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DemoRequest } from '@/types';

interface DemoDetailsDialogProps {
    request: DemoRequest | any | null;
    isOpen: boolean;
    onClose: () => void;
}

export function DemoDetailsDialog({ request, isOpen, onClose }: DemoDetailsDialogProps) {
    if (!request) return null;

    const formatRevenue = (val: string) => {
        const map: Record<string, string> = {
            '<1-lakh': 'Less than ₹1L',
            '1-5-lakh': '₹1 - ₹5 Lakh',
            '5-10-lakh': '₹5 - ₹10 Lakh',
            '10-50-lakh': '₹10 - ₹50 Lakh',
            '50-lakh+': '₹50 Lakh+'
        };
        return map[val] || val;
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
                <div className="bg-primary/5 p-8 border-b border-primary/10">
                    <div className="flex justify-between items-start gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-[2rem] bg-primary/10 flex items-center justify-center text-primary text-2xl font-black">
                                {request.fullName.charAt(0)}
                            </div>
                            <div>
                                <DialogTitle className="text-2xl font-black text-foreground">{request.fullName}</DialogTitle>
                                <div className="flex items-center gap-2 mt-1">
                                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/10 font-bold uppercase text-[10px]">
                                        {request.status}
                                    </Badge>
                                    <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                                        <Building2 className="w-3 h-3" /> {request.companyName}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Request ID</p>
                            <p className="text-xs font-bold text-foreground mt-1">#{request.id.split('-').pop()}</p>
                        </div>
                    </div>
                </div>

                <div className="p-8 grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div>
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-primary mb-4">Contact Information</h4>
                            <div className="space-y-4">
                                <a href={`mailto:${request.workEmail}`} className="flex items-center gap-3 p-3 rounded-2xl bg-muted/30 hover:bg-primary/5 transition-colors group border border-border/50">
                                    <div className="p-2 rounded-xl bg-background shadow-sm group-hover:text-primary">
                                        <Mail className="w-4 h-4" />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground">Work Email</p>
                                        <p className="text-sm font-bold text-foreground truncate">{request.workEmail}</p>
                                    </div>
                                </a>
                                <a href={`tel:${request.phone}`} className="flex items-center gap-3 p-3 rounded-2xl bg-muted/30 hover:bg-primary/5 transition-colors group border border-border/50">
                                    <div className="p-2 rounded-xl bg-background shadow-sm group-hover:text-primary">
                                        <Phone className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground">Phone Number</p>
                                        <p className="text-sm font-bold text-foreground">{request.phone || '+91 98765 43210'}</p>
                                    </div>
                                </a>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-primary mb-4">Schedule Preference</h4>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-3 rounded-2xl bg-background border border-border/50 shadow-sm">
                                    <p className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground flex items-center gap-1 mb-1">
                                        <Calendar className="w-3 h-3" /> Preferred Date
                                    </p>
                                    <p className="text-sm font-bold text-foreground">{request.preferredDate}</p>
                                </div>
                                <div className="p-3 rounded-2xl bg-background border border-border/50 shadow-sm">
                                    <p className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground flex items-center gap-1 mb-1">
                                        <Clock className="w-3 h-3" /> Time Slot
                                    </p>
                                    <p className="text-sm font-bold text-foreground uppercase tracking-tight">{request.preferredTimeSlot}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-primary mb-4">Company Overview</h4>
                            <div className="space-y-4 p-5 rounded-3xl bg-primary/[0.02] border border-primary/5 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-[0.05]">
                                    <TrendingUp className="w-12 h-12" />
                                </div>
                                <div className="grid grid-cols-2 gap-4 relative z-10">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground flex items-center gap-1 mb-1">
                                            <Briefcase className="w-3 h-3" /> Industry
                                        </p>
                                        <p className="text-sm font-bold text-foreground">{request.industry}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground flex items-center gap-1 mb-1">
                                            <Users className="w-3 h-3" /> Size
                                        </p>
                                        <p className="text-sm font-bold text-foreground">{request.companySize} Team</p>
                                    </div>
                                    <div className="col-span-2 pt-2 border-t border-primary/10">
                                        <p className="text-[10px] font-black uppercase tracking-tighter text-primary flex items-center gap-1 mb-1">
                                            <TrendingUp className="w-3 h-3" /> Potential Revenue
                                        </p>
                                        <p className="text-lg font-black text-foreground">{formatRevenue(request.expectedRevenue)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-end h-full pt-4">
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
