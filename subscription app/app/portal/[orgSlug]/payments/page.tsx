import React from 'react';
import { PortalLayout } from '@/components/portal/portal-layout';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export default function PaymentsPage({ params }: { params: { orgSlug: string } }) {
    // Mock payment history
    const payments = [
        { id: 'PAY-1100', date: 'Mar 05, 2024', amount: 1180, method: 'UPI', status: 'success', invoice: 'INV-2024-001' },
        { id: 'PAY-1099', date: 'Feb 05, 2024', amount: 2950, method: 'Credit Card', status: 'success', invoice: 'INV-2024-004' },
        { id: 'PAY-1098', date: 'Jan 05, 2024', amount: 2950, method: 'Credit Card', status: 'success', invoice: 'INV-2024-005' },
    ];

    return (
        <PortalLayout orgSlug={params.orgSlug}>
            <div className="space-y-6">
                <div>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">Payment History</h2>
                    <p className="text-sm text-slate-500 mt-1">Review your recent transactions</p>
                </div>

                <Card className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader className="bg-slate-50">
                            <TableRow className="border-b-slate-200 hover:bg-transparent">
                                <TableHead className="py-4 pl-6 text-xs font-bold uppercase tracking-wider text-slate-500">Date</TableHead>
                                <TableHead className="py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Transaction ID</TableHead>
                                <TableHead className="py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Invoice</TableHead>
                                <TableHead className="py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Method</TableHead>
                                <TableHead className="py-4 text-center text-xs font-bold uppercase tracking-wider text-slate-500">Status</TableHead>
                                <TableHead className="py-4 pr-6 text-right text-xs font-bold uppercase tracking-wider text-slate-500">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {payments.map(pay => (
                                <TableRow key={pay.id} className="border-b-slate-100/60 hover:bg-slate-50/50">
                                    <TableCell className="py-4 pl-6 text-sm font-medium text-slate-600">{pay.date}</TableCell>
                                    <TableCell className="py-4 text-sm font-bold text-slate-800">{pay.id}</TableCell>
                                    <TableCell className="py-4 text-sm font-medium text-slate-500">{pay.invoice}</TableCell>
                                    <TableCell className="py-4 text-sm font-medium text-slate-500">{pay.method}</TableCell>
                                    <TableCell className="py-4 text-center">
                                        <Badge variant="outline" className="border-emerald-200 text-emerald-700 bg-emerald-50 px-2.5 py-0.5">Success</Badge>
                                    </TableCell>
                                    <TableCell className="py-4 pr-6 text-right text-sm font-black text-slate-900">₹{pay.amount.toLocaleString('en-IN')}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            </div>
        </PortalLayout>
    );
}
