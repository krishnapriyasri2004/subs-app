'use client';

import React, { useState, useEffect } from 'react';
import { InvoiceList } from '@/components/invoices/invoice-list';
import { CreateInvoiceDialog } from '@/components/invoices/create-invoice-dialog';
import { mockCustomerInvoices, mockInvoices } from '@/lib/mock-data';
import { useVendorAuth } from '@/lib/vendor-auth';
import { Button } from '@/components/ui/button';
import { Search, ChevronDown, Download } from 'lucide-react';
import { toast } from 'sonner';

export default function VendorInvoicesPage() {
  const { user } = useVendorAuth();
  const isCustomer = user?.role === 'customer' || user?.email === 'customer@user.com';
  const [invoices, setInvoices] = useState<any[]>([]);

  const loadInvoices = () => {
    const mockData = [...mockInvoices, ...mockCustomerInvoices];
    const savedInvoicesJson = localStorage.getItem('vendor_invoices');
    const savedInvoices = savedInvoicesJson ? JSON.parse(savedInvoicesJson) : [];
    setInvoices([...savedInvoices, ...mockData]);
  };

  useEffect(() => {
    loadInvoices();
  }, []);

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
              <Button variant="outline" className="h-9 px-3 text-xs bg-slate-50 font-bold border-slate-100 text-slate-600 rounded-md">
                Billed Receipts <ChevronDown className="w-3.5 h-3.5 ml-2 text-slate-400" />
              </Button>
              <Button variant="outline" className="h-9 px-3 text-xs bg-slate-50 font-bold border-slate-100 text-slate-600 rounded-md">
                All Subscriptions <ChevronDown className="w-3.5 h-3.5 ml-2 text-slate-400" />
              </Button>
              <Button variant="outline" className="h-9 px-3 text-xs bg-slate-50 font-bold border-slate-100 text-slate-600 rounded-md">
                All Status <ChevronDown className="w-3.5 h-3.5 ml-2 text-slate-400" />
              </Button>
            </div>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Search by Invoice" className="h-9 pl-9 pr-4 text-xs bg-slate-50 border border-slate-200 rounded-md outline-none focus:border-blue-500 w-[220px]" />
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
                <tr className="hover:bg-slate-50/50">
                  <td className="px-4 py-4 font-semibold text-slate-700">INV-3105</td>
                  <td className="px-4 py-4 text-slate-500 font-medium">28 Mar 2024</td>
                  <td className="px-4 py-4 font-bold text-slate-900">₹1,999</td>
                  <td className="px-4 py-4 text-slate-600">₹360</td>
                  <td className="px-4 py-4">
                    <span className="bg-emerald-50 text-emerald-600 font-bold px-2 py-1 rounded text-[10px]">Paid</span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <button onClick={handleDownload} className="text-[10px] font-bold text-slate-600 border border-slate-200 px-3 py-1.5 rounded bg-white hover:bg-slate-50 inline-flex items-center gap-1.5 shadow-sm">
                      <Download className="w-3 h-3 text-[#2b84ea]" /> Download PDF
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="px-4 py-4 font-semibold text-slate-700">INV-2798</td>
                  <td className="px-4 py-4 text-slate-500 font-medium">28 Feb 2024</td>
                  <td className="px-4 py-4 font-bold text-slate-900">₹1,999</td>
                  <td className="px-4 py-4 text-slate-600">₹360</td>
                  <td className="px-4 py-4">
                    <span className="bg-amber-50 text-amber-600 font-bold px-2 py-1 rounded text-[10px]">Pending</span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <button onClick={handleDownload} className="text-[10px] font-bold text-slate-600 border border-slate-200 px-3 py-1.5 rounded bg-white hover:bg-slate-50 inline-flex items-center gap-1.5 shadow-sm">
                      <Download className="w-3 h-3 text-[#2b84ea]" /> Download PDF
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="px-4 py-4 font-semibold text-slate-700">INV-2886</td>
                  <td className="px-4 py-4 text-slate-500 font-medium">28 Jan 2024</td>
                  <td className="px-4 py-4 font-bold text-slate-900">₹1,999</td>
                  <td className="px-4 py-4 text-slate-600">₹360</td>
                  <td className="px-4 py-4">
                    <span className="bg-rose-50 text-rose-600 font-bold px-2 py-1 rounded text-[10px]">Overdue</span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <button onClick={handleDownload} className="text-[10px] font-bold text-slate-600 border border-slate-200 px-3 py-1.5 rounded bg-white hover:bg-slate-50 inline-flex items-center gap-1.5 shadow-sm">
                      <Download className="w-3 h-3 text-[#2b84ea]" /> Download PDF
                    </button>
                  </td>
                </tr>
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

        <div className="bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100 p-6">
          <h3 className="font-bold text-slate-900 text-base mb-1 mt-2">Invoice History</h3>
          <p className="text-xs text-slate-400 mb-6 font-medium">For active regular amenities.</p>

          <div className="overflow-x-auto">
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
                <tr className="hover:bg-slate-50/50">
                  <td className="px-4 py-4 font-semibold text-slate-700">INV-3105</td>
                  <td className="px-4 py-4 text-slate-500 font-medium">28 Mar 2024</td>
                  <td className="px-4 py-4 font-bold text-slate-900">₹1,999</td>
                  <td className="px-4 py-4 text-slate-600">₹360</td>
                  <td className="px-4 py-4">
                    <span className="bg-emerald-50 text-emerald-600 font-bold px-2 py-1 rounded text-[10px]">Paid</span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <button onClick={handleDownload} className="text-[10px] font-bold text-[#2b84ea] hover:underline inline-flex items-center gap-1.5">
                      <Download className="w-3 h-3" /> Download PDF
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="px-4 py-4 font-semibold text-slate-700">INV-2359</td>
                  <td className="px-4 py-4 text-slate-500 font-medium">28 Feb 2024</td>
                  <td className="px-4 py-4 font-bold text-slate-900">₹1,999</td>
                  <td className="px-4 py-4 text-slate-600">₹360</td>
                  <td className="px-4 py-4">
                    <span className="bg-amber-50 text-amber-600 font-bold px-2 py-1 rounded text-[10px]">Pending</span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <button onClick={handleDownload} className="text-[10px] font-bold text-[#2b84ea] hover:underline inline-flex items-center gap-1.5">
                      <Download className="w-3 h-3" /> Download PDF
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="px-4 py-4 font-semibold text-slate-700">INV-2755</td>
                  <td className="px-4 py-4 text-slate-500 font-medium">28 Jan 2024</td>
                  <td className="px-4 py-4 font-bold text-slate-900">₹1,999</td>
                  <td className="px-4 py-4 text-slate-600">₹360</td>
                  <td className="px-4 py-4">
                    <span className="bg-rose-50 text-rose-600 font-bold px-2 py-1 rounded text-[10px]">Overdue</span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <button onClick={handleDownload} className="text-[10px] font-bold text-[#2b84ea] hover:underline inline-flex items-center gap-1.5">
                      <Download className="w-3 h-3" /> Download PDF
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
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
        <CreateInvoiceDialog onInvoiceCreated={loadInvoices} />
      </div>

      <InvoiceList initialInvoices={invoices} />
    </div>
  );
}
