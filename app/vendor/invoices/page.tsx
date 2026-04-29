'use client';

import React, { useState, useEffect } from 'react';
import { InvoiceList } from '@/components/invoices/invoice-list';
import { CreateInvoiceDialog } from '@/components/invoices/create-invoice-dialog';
import { useVendorAuth } from '@/lib/vendor-auth';
import { useData } from '@/lib/data-context';
import { Button } from '@/components/ui/button';
import { Search, ChevronDown, Download, Plus } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
export default function VendorInvoicesPage() {
  const { user } = useVendorAuth();
  const { mockInvoices: firebaseInvoices } = useData();
  const isCustomer = user?.role === 'customer' || user?.email === 'customer@user.com';

  const invoices = firebaseInvoices.filter(inv => inv.tenantId === user?.tenantId);

  // Customer filters
  const [receiptFilter, setReceiptFilter] = useState('All Receipts');
  const [subscriptionFilter, setSubscriptionFilter] = useState('All Subscriptions');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [searchQuery, setSearchQuery] = useState('');

  const customerDocs = [
    { id: 'inv-001', no: 'INV-3105', date: '28 Mar 2024', amount: '₹1,999', gst: '₹360', status: 'Paid', statusColor: 'emerald', receiptType: 'Billed Receipts', subType: 'Active' },
    { id: 'inv-002', no: 'INV-2798', date: '28 Feb 2024', amount: '₹1,999', gst: '₹360', status: 'Pending', statusColor: 'amber', receiptType: 'Unbilled Receipts', subType: 'Active' },
  ];

  const filteredDocs = customerDocs.filter(doc => {
    const matchesSearch = doc.no.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesReceipt = receiptFilter === 'All Receipts' || doc.receiptType === receiptFilter;
    const matchesSub = subscriptionFilter === 'All Subscriptions' || doc.subType === subscriptionFilter;
    const matchesStatus = statusFilter === 'All Status' || doc.status === statusFilter;
    return matchesSearch && matchesReceipt && matchesSub && matchesStatus;
  });

  const getStatusClasses = (color: string) => {
    switch (color) {
      case 'emerald': return 'bg-emerald-50 text-emerald-600';
      case 'amber': return 'bg-amber-50 text-amber-600';
      case 'rose': return 'bg-rose-50 text-rose-600';
      default: return 'bg-slate-50 text-slate-600';
    }
  };

  const handleDownload = () => {
    toast.success('Downloading PDF...', { icon: <Download className="w-4 h-4" /> });
  };

  if (isCustomer) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto mb-10">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Invoices
        </h1>

        <div className="bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex flex-wrap items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="h-9 px-3 text-xs bg-slate-50 font-bold border-slate-100 text-slate-600 rounded-md">
                    {receiptFilter} <ChevronDown className="w-3.5 h-3.5 ml-2 text-slate-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setReceiptFilter('All Receipts')}>All Receipts</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setReceiptFilter('Billed Receipts')}>Billed Receipts</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setReceiptFilter('Unbilled Receipts')}>Unbilled Receipts</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="h-9 px-3 text-xs bg-slate-50 font-bold border-slate-100 text-slate-600 rounded-md">
                    {subscriptionFilter} <ChevronDown className="w-3.5 h-3.5 ml-2 text-slate-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setSubscriptionFilter('All Subscriptions')}>All Subscriptions</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSubscriptionFilter('Active')}>Active</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSubscriptionFilter('Cancelled')}>Cancelled</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="h-9 px-3 text-xs bg-slate-50 font-bold border-slate-100 text-slate-600 rounded-md">
                    {statusFilter} <ChevronDown className="w-3.5 h-3.5 ml-2 text-slate-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setStatusFilter('All Status')}>All Status</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('Paid')}>Paid</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('Pending')}>Pending</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by Invoice"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 pl-9 pr-4 text-xs bg-slate-50 border border-slate-200 rounded-md outline-none focus:border-blue-500 w-[220px]"
              />
            </div>
          </div>

          <div className="overflow-x-auto mb-6">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-y border-slate-100">
                <tr className="text-[10px] font-bold text-slate-500">
                  <th className="px-4 py-3">Invoice No.</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Amount (₹)</th>
                  <th className="px-4 py-3">GST (₹)</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Download</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-xs">
                {filteredDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-4 font-semibold text-slate-700">{doc.no}</td>
                    <td className="px-4 py-4 text-slate-500 font-medium">{doc.date}</td>
                    <td className="px-4 py-4 font-bold text-slate-900">{doc.amount}</td>
                    <td className="px-4 py-4 text-slate-600">{doc.gst}</td>
                    <td className="px-4 py-4">
                      <span className={`font-bold px-2 py-1 rounded text-[10px] ${getStatusClasses(doc.statusColor)}`}>{doc.status}</span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <Link href={`/vendor/invoices/${doc.id}`}>
                        <button className="text-[10px] font-bold text-slate-600 border border-slate-200 px-3 py-1.5 rounded bg-white hover:bg-slate-50 inline-flex items-center gap-1.5 shadow-sm">
                          <Download className="w-3 h-3 text-[#2b84ea]" /> Download PDF
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
                {filteredDocs.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-slate-500 font-medium text-sm">No invoices found matching the current filters.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center bg-slate-50 rounded-lg p-4 border border-slate-100">
            <span className="text-xs text-slate-500 font-bold">Total Balance 30&11 940</span>
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-slate-600">Total Balance:</span>
              <span className="bg-amber-100/50 text-amber-800 font-black px-4 py-1 rounded text-sm tracking-tight border border-amber-200/50">₹1,999</span>
            </div>
          </div>
        </div>

      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Invoices</h1>
          <p className="text-muted-foreground mt-1 text-sm font-medium">
            View, manage, and download GST tax invoices for your customers.
          </p>
        </div>
        <Link href="/vendor/invoices/new">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-black px-6 rounded-xl shadow-lg shadow-blue-500/20 gap-2">
            <Plus className="w-5 h-5" />
            Generate Invoice
          </Button>
        </Link>
      </div>

      <InvoiceList initialInvoices={invoices} />
    </div>
  );
}
