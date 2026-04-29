'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Search, ChevronDown, Download, ReceiptText } from 'lucide-react';
import { useVendorAuth } from '@/lib/vendor-auth';
import { toast } from 'sonner';
import { MockPaymentModal } from '@/components/dashboard/mock-payment-modal';

const billingData = [
    { id: 'BIL-459201', date: '28 Mar 2024', period: 'Mar 01 - Mar 28', amount: '₹1,999', status: 'Paid', type: 'Subscription', invoice: 'INV-3240' },
    { id: 'BIL-487826', date: '28 Feb 2024', period: 'Feb 01 - Feb 28', amount: '₹1,999', status: 'Paid', type: 'Subscription', invoice: 'INV-3112' },
    { id: 'BIL-480535', date: '28 Jan 2024', period: 'Jan 01 - Jan 28', amount: '₹1,999', status: 'Paid', type: 'Subscription', invoice: 'INV-2998' },
    { id: 'BIL-489256', date: '28 Dec 2023', period: 'Dec 01 - Dec 28', amount: '₹2,499', status: 'Paid', type: 'Overage', invoice: 'INV-2845' },
    { id: 'BIL-491234', date: '28 Nov 2023', period: 'Nov 01 - Nov 28', amount: '₹1,999', status: 'Paid', type: 'Subscription', invoice: 'INV-2710' },
    { id: 'BIL-501239', date: '28 Oct 2023', period: 'Oct 01 - Oct 28', amount: '₹1,999', status: 'Refunded', type: 'Subscription', invoice: 'INV-2550' },
];

export default function BillingHistoryPage() {
    const { user } = useVendorAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [yearFilter, setYearFilter] = useState('Current Year (2024)');
    const [typeFilter, setTypeFilter] = useState('All Transactions');

    // Payment Modal State
    const [isMockPaymentOpen, setIsMockPaymentOpen] = useState(false);
    const [mockPaymentAmount, setMockPaymentAmount] = useState(0);
    const [mockPaymentTitle, setMockPaymentTitle] = useState('');

    const handleDownloadStatement = async () => {
        toast.loading("Generating Yearly Statement PDF...");
        await new Promise(r => setTimeout(r, 1500));
        toast.dismiss();
        toast.success("Statement downloaded successfully.");
    };

    const handleDownloadInvoice = (invoiceId: string) => {
        toast.success(`Downloading Invoice ${invoiceId}...`);
    };

    const filteredData = billingData.filter(b => {
        const matchesSearch = b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.invoice.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.period.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesYear = yearFilter === 'Current Year (2024)' ? b.date.includes('2024')
            : yearFilter === 'Previous Year (2023)' ? b.date.includes('2023')
                : true;

        const matchesType = typeFilter === 'All Transactions' ? true : b.type === typeFilter;

        return matchesSearch && matchesYear && matchesType;
    });

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-12">
            <MockPaymentModal
                isOpen={isMockPaymentOpen}
                onClose={() => setIsMockPaymentOpen(false)}
                onSuccess={() => toast.success('Payment verified!')}
                amount={mockPaymentAmount}
                title={mockPaymentTitle}
            />

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Billing History</h1>
                    <p className="text-sm text-slate-500 font-medium mt-1">Review your past statements, charges, and refunds.</p>
                </div>
                <Button onClick={handleDownloadStatement} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-sm flex items-center gap-2">
                    <Download className="w-4 h-4" /> Download Statement
                </Button>
            </div>

            <div className="bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100 p-6">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <div className="flex flex-wrap items-center gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="h-9 px-3 text-xs bg-slate-50 font-bold border-slate-100 text-slate-600 rounded-md">
                                    {yearFilter} <ChevronDown className="w-3.5 h-3.5 ml-2 text-slate-400" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => setYearFilter('All Years')}>All Years</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setYearFilter('Current Year (2024)')}>Current Year (2024)</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setYearFilter('Previous Year (2023)')}>Previous Year (2023)</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="h-9 px-3 text-xs bg-slate-50 font-bold border-slate-100 text-slate-600 rounded-md">
                                    {typeFilter} <ChevronDown className="w-3.5 h-3.5 ml-2 text-slate-400" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => setTypeFilter('All Transactions')}>All Transactions</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setTypeFilter('Subscription')}>Subscription</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setTypeFilter('Overage')}>Overage</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div className="relative">
                        <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search statements..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="h-9 pl-9 pr-4 text-xs bg-slate-50 border border-slate-200 rounded-md outline-none focus:border-indigo-500 w-full sm:w-[260px] transition-all"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#f8fafc] border-y border-slate-100">
                            <tr className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                <th className="px-4 py-3.5 min-w-[120px]">Billing ID</th>
                                <th className="px-4 py-3.5 min-w-[140px]">Billing Period</th>
                                <th className="px-4 py-3.5 min-w-[100px]">Amount</th>
                                <th className="px-4 py-3.5 min-w-[100px]">Type</th>
                                <th className="px-4 py-3.5 min-w-[100px]">Status</th>
                                <th className="px-4 py-3.5 min-w-[100px] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 text-xs">
                            {filteredData.map((bill) => (
                                <tr key={bill.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-4 py-4 font-bold text-slate-800">{bill.id}</td>
                                    <td className="px-4 py-4">
                                        <span className="block text-slate-800 font-semibold">{bill.period}</span>
                                        <span className="block text-slate-400 text-[10px] mt-0.5">Billed on {bill.date}</span>
                                    </td>
                                    <td className="px-4 py-4 font-black text-slate-900 text-sm">{bill.amount}</td>
                                    <td className="px-4 py-4">
                                        <span className="text-slate-600 font-medium bg-slate-100 px-2.5 py-1 rounded text-[10px]">{bill.type}</span>
                                    </td>
                                    <td className="px-4 py-4">
                                        {bill.status === 'Paid' ? (
                                            <span className="bg-emerald-50 text-emerald-600 font-bold px-3 py-1 rounded text-[10px] uppercase tracking-wider">Paid</span>
                                        ) : bill.status === 'Refunded' ? (
                                            <span className="bg-amber-50 text-amber-600 font-bold px-3 py-1 rounded text-[10px] uppercase tracking-wider bg-opacity-70">Refunded</span>
                                        ) : (
                                            <span className="bg-rose-50 text-rose-600 font-bold px-3 py-1 rounded text-[10px] uppercase tracking-wider">{bill.status}</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-4 text-right">
                                        <Button
                                            onClick={() => handleDownloadInvoice(bill.invoice)}
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 px-2 text-indigo-600 font-bold hover:bg-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 ml-auto"
                                        >
                                            <ReceiptText className="w-3.5 h-3.5" />
                                            Inv
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredData.length === 0 && (
                        <div className="py-12 text-center">
                            <p className="text-sm font-bold text-slate-400">No statements found matching your search.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
