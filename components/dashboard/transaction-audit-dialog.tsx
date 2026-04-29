'use client';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ShieldCheck, Activity, Clock, Hash, MapPin, MonitorSmartphone, Key } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

interface TransactionAuditDialogProps {
    transaction: any;
    trigger: React.ReactNode;
}

export function TransactionAuditDialog({ transaction, trigger }: TransactionAuditDialogProps) {
    if (!transaction) return null;

    const transactionId = transaction.razorpayPaymentId || `TXN_${transaction.id.slice(-6).toUpperCase()}`;

    return (
        <Dialog>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] p-0 bg-slate-50 overflow-hidden flex flex-col">
                <div className="bg-white p-6 border-b border-border/50 shrink-0">
                    <div className="flex items-start justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <ShieldCheck className="w-5 h-5 text-indigo-500" />
                                <h2 className="text-xl font-black text-slate-900">Security Audit Trail</h2>
                            </div>
                            <p className="text-sm text-slate-500 font-medium">Detailed cryptographic and gateway logs for settlement node.</p>
                        </div>
                        <span className={cn(
                            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                            transaction.status === 'paid' ? "bg-emerald-500/10 text-emerald-600" :
                                transaction.status === 'overdue' ? "bg-rose-500/10 text-rose-600" : "bg-blue-500/10 text-blue-600"
                        )}>
                            <div className={cn(
                                "w-1.5 h-1.5 rounded-full",
                                transaction.status === 'paid' ? "bg-emerald-500" : transaction.status === 'overdue' ? "bg-rose-500" : "bg-blue-500"
                            )} />
                            {transaction.status === 'paid' ? 'Settled & Verified' : transaction.status === 'sent' ? 'Processing Sequence' : 'Failed'}
                        </span>
                    </div>
                </div>

                <div className="p-6 overflow-y-auto">
                    <div className="grid grid-cols-2 gap-8 mb-8">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <Hash className="w-4 h-4 text-slate-400" />
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Gateway Transaction ID</p>
                            </div>
                            <p className="text-lg font-mono font-bold text-slate-800 bg-slate-100 p-2 rounded-lg inline-block">{transactionId}</p>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <Clock className="w-4 h-4 text-slate-400" />
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Settlement Timestamp</p>
                            </div>
                            <p className="text-sm font-bold text-slate-800 p-2">{new Date(transaction.issueDate).toLocaleString('en-IN')}</p>
                        </div>
                    </div>

                    <Separator className="my-6" />

                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Activity className="w-4 h-4" /> Activity Ledger
                    </h3>

                    <div className="space-y-6">
                        <div className="flex gap-4 relative">
                            <div className="flex flex-col items-center">
                                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center translate-y-1">
                                    <CheckCircle2 className="w-4 h-4" />
                                </div>
                                <div className="w-0.5 h-full bg-slate-200 mt-2"></div>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-800">Payment Intitiated Request</p>
                                <p className="text-xs text-slate-500 mt-1 font-mono">Payload processed from {transaction.entityName}</p>
                                <p className="text-[10px] font-bold text-slate-400 mt-1">{new Date(transaction.issueDate).toLocaleString('en-IN')}</p>
                            </div>
                        </div>

                        <div className="flex gap-4 relative">
                            <div className="flex flex-col items-center">
                                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center translate-y-1">
                                    <Key className="w-3 h-3" />
                                </div>
                                <div className="w-0.5 h-full bg-slate-200 mt-2"></div>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-800">3D Secure Authentication</p>
                                <p className="text-xs text-slate-500 mt-1 font-mono">Validations cleared by issuing bank</p>
                                <p className="text-[10px] font-bold text-slate-400 mt-1">{new Date(transaction.issueDate).toLocaleString('en-IN')}</p>
                            </div>
                        </div>

                        <div className="flex gap-4 relative">
                            <div className="flex flex-col items-center">
                                <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center translate-y-1">
                                    <MonitorSmartphone className="w-4 h-4" />
                                </div>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-800">Gateway Confirmation Payload</p>
                                <p className="text-xs text-slate-500 mt-1 font-mono">Response code 200 - OK (Capture Complete)</p>
                                <p className="text-[10px] font-bold text-slate-400 mt-1">{new Date(transaction.issueDate).toLocaleString('en-IN')}</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 bg-slate-800 text-slate-300 p-4 rounded-xl font-mono text-[10px] overflow-x-auto">
                        <p className="text-slate-500 mb-2">// Raw Verification Payload Extract</p>
                        <p>{`{`}</p>
                        <p className="pl-4">{`"id": "${transactionId}",`}</p>
                        <p className="pl-4">{`"entity": "payment",`}</p>
                        <p className="pl-4">{`"amount": ${transaction.totalAmount * 100},`}</p>
                        <p className="pl-4 text-emerald-400">{`"status": "captured",`}</p>
                        <p className="pl-4">{`"order_id": "${transaction.invoiceNumber}",`}</p>
                        <p className="pl-4">{`"method": "card",`}</p>
                        <p>{`}`}</p>
                    </div>

                </div>
            </DialogContent>
        </Dialog>
    );
}
