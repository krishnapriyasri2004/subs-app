'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Download, Filter, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { RazorpayButton } from '@/components/payment/razorpay-button';

type Invoice = {
    id: string;
    invoiceNumber: string;
    date: string;
    amount: number;
    gst: number;
    total: number;
    status: 'paid' | 'due' | 'overdue';
};

export function MyInvoices({ orgSlug }: { orgSlug: string }) {
    const [invoices, setInvoices] = useState<Invoice[]>([
        { id: '1', invoiceNumber: 'INV-2024-001', date: 'Apr 01, 2024', amount: 1000, gst: 180, total: 1180, status: 'paid' },
        { id: '2', invoiceNumber: 'INV-2024-002', date: 'Apr 05, 2024', amount: 850, gst: 0, total: 850, status: 'due' }, // e.g., milk/rice no gst
        { id: '3', invoiceNumber: 'INV-2024-003', date: 'Mar 01, 2024', amount: 2500, gst: 450, total: 2950, status: 'overdue' },
        { id: '4', invoiceNumber: 'INV-2024-004', date: 'Feb 01, 2024', amount: 2500, gst: 450, total: 2950, status: 'paid' },
        { id: '5', invoiceNumber: 'INV-2024-005', date: 'Jan 01, 2024', amount: 2500, gst: 450, total: 2950, status: 'paid' },
    ]);

    const [filter, setFilter] = useState('all');

    const handleDownloadPDF = async (id: string, invNum: string) => {
        toast.loading(`Downloading PDF for ${invNum}...`, { id: 'pdf' });
        try {
            // Simulated API call GET /api/invoices/[id]/pdf returning signed URL
            await new Promise(r => setTimeout(r, 1200));
            toast.dismiss('pdf');
            toast.success("Invoice downloaded successfully!");
        } catch (e) {
            toast.dismiss('pdf');
            toast.error("Failed to download invoice.");
        }
    };

    const handlePaymentSuccess = (id: string) => {
        setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, status: 'paid' } : inv));
    };

    const filteredInvoices = invoices.filter(inv => {
        if (filter === 'all') return true;
        return inv.status === filter;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-6">
                <div>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">My Invoices</h2>
                    <p className="text-sm text-slate-500 mt-1">View and manage your billing history</p>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="font-semibold text-slate-600">
                            <Filter className="w-4 h-4 mr-2" />
                            {filter === 'all' ? 'All Invoices' : filter.charAt(0).toUpperCase() + filter.slice(1)}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 rounded-xl">
                        <DropdownMenuRadioGroup value={filter} onValueChange={setFilter}>
                            <DropdownMenuRadioItem value="all">All Invoices</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="paid">Paid</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="due">Due</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="overdue">Overdue</DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <Card className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-slate-50">
                            <TableRow className="border-b-slate-200 hover:bg-transparent">
                                <TableHead className="py-4 pl-6 text-xs font-bold uppercase tracking-wider text-slate-500">Invoice #</TableHead>
                                <TableHead className="py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Date</TableHead>
                                <TableHead className="py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Total Amount</TableHead>
                                <TableHead className="py-4 text-center text-xs font-bold uppercase tracking-wider text-slate-500">Status</TableHead>
                                <TableHead className="py-4 pr-6 text-right text-xs font-bold uppercase tracking-wider text-slate-500">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredInvoices.length > 0 ? (
                                filteredInvoices.map((inv) => (
                                    <TableRow key={inv.id} className="border-b-slate-100/60 hover:bg-slate-50/50 transition-colors">
                                        <TableCell className="py-4 pl-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hidden sm:flex">
                                                    <FileText className="w-4 h-4" />
                                                </div>
                                                <span className="font-bold text-slate-800 text-sm whitespace-nowrap">{inv.invoiceNumber}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <span className="text-sm font-medium text-slate-600 whitespace-nowrap">{inv.date}</span>
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-slate-900 whitespace-nowrap">₹{inv.total.toLocaleString('en-IN')}</span>
                                                {inv.gst > 0 && <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">Includes ₹{inv.gst} GST</span>}
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4 text-center">
                                            {inv.status === 'paid' && <Badge variant="outline" className="border-emerald-200 text-emerald-700 bg-emerald-50 shadow-none px-2.5 py-0.5 whitespace-nowrap">Paid</Badge>}
                                            {inv.status === 'due' && <Badge variant="outline" className="border-amber-200 text-amber-700 bg-amber-50 shadow-none px-2.5 py-0.5 whitespace-nowrap">Due</Badge>}
                                            {inv.status === 'overdue' && <Badge variant="destructive" className="bg-red-500 hover:bg-red-500 shadow-none px-2.5 py-0.5 whitespace-nowrap">Overdue</Badge>}
                                        </TableCell>
                                        <TableCell className="py-4 pr-6 text-right space-x-2 whitespace-nowrap flex justify-end items-center h-full">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50" onClick={() => handleDownloadPDF(inv.id, inv.invoiceNumber)} title="Download PDF">
                                                <Download className="w-4 h-4" />
                                            </Button>

                                            {(inv.status === 'due' || inv.status === 'overdue') && (
                                                <RazorpayButton
                                                    amount={inv.total}
                                                    invoiceId={inv.invoiceNumber}
                                                    onSuccess={() => handlePaymentSuccess(inv.id)}
                                                    className={`h-8 text-xs px-3 ${inv.status === 'overdue' ? 'bg-red-500 hover:bg-red-600' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                                                />
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="py-12 text-center text-slate-500">
                                        No invoices found for this filter.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </Card>
        </div>
    );
}
