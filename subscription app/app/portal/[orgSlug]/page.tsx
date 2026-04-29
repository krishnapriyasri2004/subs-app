import React from 'react';
import { PortalLayout } from '@/components/portal/portal-layout';
import { Card } from '@/components/ui/card';
import { CreditCard, IndianRupee, Clock, Wallet } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function PortalDashboard({ params }: { params: { orgSlug: string } }) {
    // Mock customer data
    const customerName = "John Doe";
    const activeSubs = 2;
    const nextBillDate = "Apr 10, 2024";
    const outstanding = 850;
    const outstandingCount = 1;
    const lastPaymentAmount = 1180;
    const lastPaymentDate = "Mar 05, 2024";

    return (
        <PortalLayout orgSlug={params.orgSlug}>
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900">Hello, {customerName}!</h1>
                    <p className="text-slate-500 mt-2">Welcome to your secure customer portal for {params.orgSlug}.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Active Subs */}
                    <Card className="p-6 bg-white border border-slate-200 rounded-lg shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><CreditCard className="w-16 h-16" /></div>
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Active Plans</p>
                        <p className="text-4xl font-black text-slate-800">{activeSubs}</p>
                        <Link href={`/portal/${params.orgSlug}/subscriptions`}>
                            <Button variant="link" className="mt-4 p-0 h-auto text-indigo-600 font-bold hover:text-indigo-800">Manage &rarr;</Button>
                        </Link>
                    </Card>

                    {/* Outstanding */}
                    <Card className={`p-6 border rounded-lg shadow-sm relative overflow-hidden group ${outstanding > 0 ? 'bg-red-50 border-red-200' : 'bg-white border-slate-200'}`}>
                        <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform ${outstanding > 0 ? 'text-red-500' : 'text-slate-500'}`}><IndianRupee className="w-16 h-16" /></div>
                        <p className={`text-sm font-bold uppercase tracking-widest mb-2 ${outstanding > 0 ? 'text-red-600' : 'text-slate-500'}`}>Outstanding Amount</p>
                        <div className="flex items-end gap-2">
                            <p className="text-4xl font-black text-slate-800">₹{outstanding.toLocaleString('en-IN')}</p>
                            {outstanding > 0 && <span className="text-xs font-bold text-red-500 mb-1.5 uppercase tracking-wider">{outstandingCount} Due</span>}
                        </div>
                        <Link href={`/portal/${params.orgSlug}/invoices`}>
                            <Button variant="link" className={`mt-4 p-0 h-auto font-bold ${outstanding > 0 ? 'text-red-700 hover:text-red-800' : 'text-indigo-600 hover:text-indigo-800'}`}>View Invoices &rarr;</Button>
                        </Link>
                    </Card>

                    {/* Next Billing */}
                    <Card className="p-6 bg-white border border-slate-200 rounded-lg shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><Clock className="w-16 h-16" /></div>
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Next Billing Date</p>
                        <p className="text-2xl font-black text-slate-800">{nextBillDate}</p>
                        <p className="text-xs font-semibold text-slate-400 mt-2">Auto-charge via default payment method</p>
                    </Card>

                    {/* Last Payment */}
                    <Card className="p-6 bg-slate-900 border-none rounded-lg shadow-md relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><Wallet className="w-16 h-16 text-indigo-400" /></div>
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Last Payment</p>
                        <p className="text-2xl font-black">₹{lastPaymentAmount.toLocaleString('en-IN')}</p>
                        <p className="text-sm font-medium text-emerald-400 mt-1">Paid on {lastPaymentDate}</p>
                        <Link href={`/portal/${params.orgSlug}/payments`}>
                            <Button variant="link" className="mt-4 p-0 h-auto text-indigo-400 font-bold hover:text-indigo-300">Payment History &rarr;</Button>
                        </Link>
                    </Card>
                </div>
            </div>
        </PortalLayout>
    );
}
