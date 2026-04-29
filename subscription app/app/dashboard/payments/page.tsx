'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Search,
    Download,
    CreditCard,
    CheckCircle2,
    XCircle,
    Clock,
    ArrowUpRight,
    ExternalLink,
    History,
    MoreHorizontal,
    FileText,
    ShieldCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { mockInvoices, mockTenants, mockCustomerInvoices, mockCustomers } from '@/lib/mock-data';
import { useAuth } from '@/lib/auth-context';

export default function PaymentLogsPage() {
    const [searchTerm, setSearchTerm] = useState('');

    const { user } = useAuth();
    const isPlatformAdmin = user?.role === 'admin' || user?.role === 'super_admin';
    const isBusinessOwner = user?.role === 'tenant_owner';

    // Combine invoice data with tenant/customer info
    const logs = isPlatformAdmin
        ? mockInvoices.map(inv => ({
            ...inv,
            entityName: mockTenants.find(t => t.id === inv.tenantId)?.name || 'Unknown',
            entityEmail: mockTenants.find(t => t.id === inv.tenantId)?.email || 'Unknown'
        })).sort((a, b) => b.issueDate.getTime() - a.issueDate.getTime())
        : mockCustomerInvoices.filter(i => i.tenantId === user?.tenantId).map(inv => ({
            ...inv,
            entityName: mockCustomers.find(c => c.id === (inv as any).customerId)?.name || 'Unknown Customer',
            entityEmail: mockCustomers.find(c => c.id === (inv as any).customerId)?.email || 'Unknown'
        })).sort((a, b) => b.issueDate.getTime() - a.issueDate.getTime());

    return (
        <div className="space-y-10 animate-in-up pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter flex items-center gap-3">
                        <History className="w-8 h-8 text-primary" /> Payment <span className="text-gradient">Transaction Logs</span>
                    </h1>
                    <p className="text-muted-foreground font-medium mt-1">Real-time platform-wide settlement monitoring and gateway auditing.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-xl h-12 border-border/50 font-bold">
                        <ShieldCheck className="w-4 h-4 mr-2" /> Gateway Health
                    </Button>
                    <Button className="rounded-xl h-12 bg-foreground text-background font-black shadow-xl">
                        <Download className="w-4 h-4 mr-2" /> Daily Settlements
                    </Button>
                </div>
            </div>

            {/* Metrics Bar */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Settled Today', val: '₹4,82,900', color: 'text-emerald-500' },
                    { label: 'Gateway Success', val: '98.4%', color: 'text-primary' },
                    { label: 'Active Retries', val: '14', color: 'text-amber-500' },
                    { label: 'Fraud Alerts', val: '0', color: 'text-muted-foreground' },
                ].map((m, i) => (
                    <Card key={i} className="glass-card p-4 flex flex-col items-center justify-center text-center">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">{m.label}</p>
                        <p className={cn("text-xl font-black", m.color)}>{m.val}</p>
                    </Card>
                ))}
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                        placeholder="Search by Transaction ID, Invoice #, or Tenant Name..."
                        className="h-14 pl-12 rounded-2xl bg-muted/20 border-border/50 focus:ring-primary/20"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

            </div>

            {/* Transaction Ledger */}
            <Card className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-muted/30 border-b border-border/50">
                                <th className="text-left py-6 px-8 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Settlement Node</th>
                                <th className="text-left py-6 px-8 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Transaction ID</th>
                                <th className="text-left py-6 px-8 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">{isPlatformAdmin ? 'Tenant / Account' : 'Customer / Account'}</th>
                                <th className="text-left py-6 px-8 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Amount</th>
                                <th className="text-left py-6 px-8 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Protocol Status</th>
                                <th className="text-right py-6 px-8 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Audit</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/20">
                            {logs.map((log) => (
                                <tr key={log.id} className="group hover:bg-muted/10 transition-colors">
                                    <td className="py-6 px-8">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary border border-primary/10">
                                                <FileText className="w-4 h-4" />
                                            </div>
                                            <span className="text-sm font-bold text-foreground">{log.invoiceNumber}</span>
                                        </div>
                                    </td>
                                    <td className="py-6 px-8">
                                        <code className="text-[10px] font-bold text-muted-foreground bg-muted/40 px-2 py-1 rounded">
                                            {log.razorpayPaymentId || `TXN_${log.id.slice(-6).toUpperCase()}`}
                                        </code>
                                    </td>
                                    <td className="py-6 px-8">
                                        <div>
                                            <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{log.entityName}</p>
                                            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">{log.entityEmail}</p>
                                        </div>
                                    </td>
                                    <td className="py-6 px-8">
                                        <p className="text-sm font-black text-foreground">₹{log.totalAmount.toLocaleString('en-IN')}</p>
                                    </td>
                                    <td className="py-6 px-8">
                                        <span className={cn(
                                            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                                            log.status === 'paid' ? "bg-emerald-500/10 text-emerald-500" :
                                                log.status === 'overdue' ? "bg-rose-500/10 text-rose-500" : "bg-primary/10 text-primary"
                                        )}>
                                            <div className={cn(
                                                "w-1 h-1 rounded-full",
                                                log.status === 'paid' ? "bg-emerald-500 shadow-[0_0_5px_emerald]" : "bg-current"
                                            )} />
                                            {log.status === 'paid' ? 'Settled' : log.status === 'sent' ? 'Processing' : 'Failed'}
                                        </span>
                                    </td>
                                    <td className="py-6 px-8 text-right">
                                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-primary/10 hover:text-primary transition-all">
                                            <ExternalLink className="w-4 h-4" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Pagination / Footer */}
            <div className="flex justify-between items-center bg-muted/20 p-6 rounded-3xl border border-border/50">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Displaying 1-25 of 1,420 Settlements</p>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="rounded-xl h-10 px-6 font-bold" disabled>Previous</Button>
                    <Button variant="outline" size="sm" className="rounded-xl h-10 px-6 font-bold bg-background shadow-sm hover:text-primary transition-colors">Next</Button>
                </div>
            </div>
        </div>
    );
}
