'use client';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Phone, MapPin, Calendar, CreditCard, ShoppingBag, Edit, Clock, User, Hash, Mail, Languages, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CustomerViewDialogProps {
    customer: any;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onEditClick?: () => void;
}

export function CustomerViewDialog({ customer, open, onOpenChange, onEditClick }: CustomerViewDialogProps) {
    if (!customer) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[650px]">
                <DialogHeader>
                    <DialogTitle className="flex justify-between items-center pr-8 border-b pb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                                {customer.name?.[0]}
                            </div>
                            <div>
                                <span className="text-xl font-black text-slate-900 block">{customer.name}</span>
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{customer.accountNumber || 'NO ACCOUNT #'}</span>
                            </div>
                        </div>
                        <span
                            className={cn(
                                "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                                customer.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                            )}
                        >
                            {customer.status}
                        </span>
                    </DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 py-6">
                    {/* Basic Info */}
                    <div className="space-y-5">
                        <div className="flex items-start gap-3">
                            <User className="w-4 h-4 text-slate-400 mt-0.5" />
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-0.5">Full Name</p>
                                <p className="text-sm font-bold text-slate-900">{customer.name}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <Hash className="w-4 h-4 text-slate-400 mt-0.5" />
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-0.5">Account Number</p>
                                <p className="text-sm font-bold text-slate-900">{customer.accountNumber || 'N/A'}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <Mail className="w-4 h-4 text-slate-400 mt-0.5" />
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-0.5">Email Address</p>
                                <p className="text-sm font-bold text-slate-900">{customer.email || 'N/A'}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <Mail className="w-4 h-4 text-slate-400 mt-0.5" />
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-0.5">Additional Email</p>
                                <p className="text-sm font-bold text-slate-900">{customer.additionalEmail || 'None'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Preferences & Documents */}
                    <div className="space-y-5">
                        <div className="flex items-start gap-3">
                            <Clock className="w-4 h-4 text-slate-400 mt-0.5" />
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-0.5">Account Status</p>
                                <p className="text-sm font-bold text-slate-900">{customer.status}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <Languages className="w-4 h-4 text-slate-400 mt-0.5" />
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-0.5">Preferred Language</p>
                                <p className="text-sm font-bold text-slate-900">{customer.preferredLanguage || 'English'}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <FileText className="w-4 h-4 text-slate-400 mt-0.5" />
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-0.5">PAN Number</p>
                                <p className="text-sm font-bold text-slate-900">{customer.panNumber || 'N/A'}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <FileText className="w-4 h-4 text-slate-400 mt-0.5" />
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-0.5">GSTIN</p>
                                <p className="text-sm font-bold text-slate-900">{customer.gstin || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Contact & Address - Full Width */}
                    <div className="md:col-span-2 grid grid-cols-2 gap-8 pt-4 border-t border-slate-100">
                        <div className="flex items-start gap-3">
                            <Phone className="w-4 h-4 text-slate-400 mt-0.5" />
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-0.5">Phone</p>
                                <p className="text-sm font-bold text-slate-900">{customer.phone}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-0.5">Address</p>
                                <p className="text-sm font-bold text-slate-900 leading-relaxed">{customer.address}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 mt-4 pt-4 border-t">
                    <Button variant="outline" className="gap-2" onClick={onEditClick}>
                        <Edit className="w-4 h-4" />
                        Edit Profile
                    </Button>
                    <Button>View Full History</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}