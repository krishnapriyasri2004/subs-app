'use client';

import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Bell, ShieldAlert, CheckCircle2, Clock, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface NotificationDialogProps {
    isOpen: boolean;
    onClose: () => void;
    notification: {
        title: string;
        desc: string;
        time: string;
        type: string;
    } | null;
}

export function NotificationDialog({ isOpen, onClose, notification }: NotificationDialogProps) {
    const router = useRouter();
    if (!notification) return null;

    const handleAction = () => {
        onClose();
        if (notification.type === 'error') {
            router.push('/vendor/invoices');
            toast.info('Navigating to Invoices to resolve payment issue.');
        } else if (notification.type === 'success') {
            router.push('/vendor/customers');
            toast.info('Opening Customer Management.');
        } else {
            toast.success('System checking status...');
        }
    };

    const handleDismiss = () => {
        onClose();
        toast.info('Notification dismissed locally.');
    };

    const getIcon = () => {
        switch (notification.type) {
            case 'error': return <ShieldAlert className="w-12 h-12 text-rose-500" />;
            case 'success': return <CheckCircle2 className="w-12 h-12 text-emerald-500" />;
            case 'info': return <Clock className="w-12 h-12 text-blue-500" />;
            default: return <Bell className="w-12 h-12 text-slate-400" />;
        }
    };

    const getBgColor = () => {
        switch (notification.type) {
            case 'error': return 'bg-rose-50 border-rose-100';
            case 'success': return 'bg-emerald-50 border-emerald-100';
            case 'info': return 'bg-blue-50 border-blue-100';
            default: return 'bg-slate-50 border-slate-100';
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md border-slate-100 shadow-2xl rounded-[2.5rem] overflow-hidden p-0 gap-0">
                <div className={`h-32 flex items-center justify-center border-b ${getBgColor()}`}>
                    <div className="w-20 h-20 rounded-[2rem] bg-white shadow-sm flex items-center justify-center">
                        {getIcon()}
                    </div>
                </div>

                <div className="p-10 text-center">
                    <DialogHeader className="p-0 text-center">
                        <DialogTitle className="text-3xl font-black text-slate-900 tracking-tighter mb-4 text-center">
                            {notification.title}
                        </DialogTitle>
                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">
                            Received {notification.time}
                        </p>
                    </DialogHeader>

                    <p className="text-lg text-slate-600 font-medium leading-relaxed mb-10 max-w-xs mx-auto">
                        {notification.desc}
                    </p>

                    <div className="space-y-3">
                        <Button
                            onClick={handleDismiss}
                            className="w-full h-14 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-lg shadow-xl shadow-slate-900/10 transition-transform active:scale-95"
                        >
                            Dismiss Notification
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={handleAction}
                            className="w-full h-14 rounded-2xl text-blue-600 font-bold gap-2 hover:bg-blue-50"
                        >
                            Take Action <ExternalLink className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
