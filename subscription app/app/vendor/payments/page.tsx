'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Search,
  ChevronRight,
  ChevronDown,
  MoreHorizontal,
  CreditCard,
  Plus,
  ArrowUpRight,
  TrendingUp,
  Banknote,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Package,
  Download
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useVendorAuth } from '@/lib/vendor-auth';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from 'sonner';
import { format } from 'date-fns';

const initialPaymentData = [
  { id: 'TXN-001', customer: 'Rajesh Sharma', amount: '₹1,200', method: 'UPI', date: '23 Apr 2024', status: 'Completed', invoice: 'INV-1021' },
  { id: 'TXN-002', customer: 'Priya Patel', amount: '₹800', method: 'Bank Transfer', date: '20 Apr 2024', status: 'Completed', invoice: 'INV-1020' },
  { id: 'TXN-003', customer: 'Amit Kumar', amount: '₹2,000', method: 'UPI', date: '15 Apr 2024', status: 'Pending', invoice: 'INV-1019' },
  { id: 'TXN-004', customer: 'Neha Singh', amount: '₹5,600', method: 'Razorpay', date: '10 Apr 2024', status: 'Completed', invoice: 'INV-1018' },
  { id: 'TXN-9921', customer: 'Customer User', amount: '₹1,200', method: 'Credit Card', date: '01 Mar 2024', status: 'Completed', invoice: 'INV-9921' },
];

export default function PaymentsPage() {
  const router = useRouter();
  const { user } = useVendorAuth();
  const isCustomer = user?.role === 'customer' || user?.email === 'customer@user.com';

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [open, setOpen] = useState(false);
  const [payments, setPayments] = useState(initialPaymentData);
  const [isInitialized, setIsInitialized] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    customer: '',
    amount: '',
    method: 'UPI',
    date: '',
    status: 'Completed',
    refId: ''
  });

  // Load from localStorage on mount
  useEffect(() => {
    const savedPayments = localStorage.getItem('vendor_payments');
    if (savedPayments) {
      try {
        setPayments(JSON.parse(savedPayments));
      } catch (e) {
        console.error("Failed to parse saved payments", e);
        setPayments(initialPaymentData);
      }
    }
    setIsInitialized(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('vendor_payments', JSON.stringify(payments));
    }
  }, [payments, isInitialized]);

  const handleRecordPayment = () => {
    if (!formData.customer || !formData.amount || !formData.date) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newPayment = {
      id: formData.refId || `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
      customer: formData.customer,
      amount: `₹${Number(formData.amount).toLocaleString('en-IN')}`,
      method: formData.method,
      date: format(new Date(formData.date), 'dd MMM yyyy'),
      status: formData.status,
      invoice: `INV-${Math.floor(1000 + Math.random() * 9000)}`
    };

    setPayments([newPayment, ...payments]);
    setOpen(false);
    toast.success(`Payment from ${formData.customer} confirmed!`);

    // Reset form
    setFormData({
      customer: '',
      amount: '',
      method: 'UPI',
      date: '',
      status: 'Completed',
      refId: ''
    });
  };

  const filteredPayments = payments.filter(pay => {
    const matchesSearch = pay.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pay.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || pay.status === statusFilter;

    if (isCustomer) {
      return matchesSearch && matchesStatus && pay.customer === 'Customer User';
    }
    return matchesSearch && matchesStatus;
  });

  const handleExport = () => {
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 1500)),
      {
        loading: 'Preparing transaction export...',
        success: 'Financial data exported to CSV successfully!',
        error: 'Export failed.'
      }
    );
  };

  const handleSettlement = () => {
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 2000)),
      {
        loading: 'Syncing with banking provider...',
        success: 'Settlements updated. Next deposit in 4h 12m.',
        error: 'Banks connection timed out.'
      }
    );
  };

  // Calculate Stats
  const totalRevenue = payments
    .filter(p => p.status === 'Completed' || p.status === 'Success' || p.status === 'Paid')
    .reduce((acc: number, p) => acc + Number(p.amount.replace(/[₹,]/g, '')), 0);

  const pendingClearance = payments
    .filter(p => p.status === 'Pending')
    .reduce((acc: number, p) => acc + Number(p.amount.replace(/[₹,]/g, '')), 0);

  if (!isInitialized) return <div className="flex items-center justify-center h-screen">Loading...</div>;

  if (isCustomer) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto mb-10">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Payments</h1>

        <div className="bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" className="h-9 px-3 text-xs bg-slate-50 font-bold border-slate-100 text-slate-600 rounded-md">
                Date Range <ChevronDown className="w-3.5 h-3.5 ml-2 text-slate-400" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="h-9 px-3 text-xs bg-slate-50 font-bold border-slate-100 text-slate-600 rounded-md gap-2">
                    {statusFilter === 'All' ? 'All Status' : statusFilter} <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[180px] rounded-xl border-slate-100 shadow-xl p-1">
                  {['All', 'Completed', 'Pending', 'Failed'].map(status => (
                    <DropdownMenuItem 
                      key={status} 
                      onClick={() => setStatusFilter(status)}
                      className={cn("rounded-lg font-bold py-2 cursor-pointer", statusFilter === status && "bg-blue-50 text-blue-600")}
                    >
                      {status === 'All' ? 'All Status' : status}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search transactions..." 
                className="h-9 pl-9 pr-4 text-xs bg-slate-50 border border-slate-200 rounded-md outline-none focus:border-blue-500 w-[220px]" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto mb-10">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-y border-slate-100">
                <tr className="text-[10px] font-bold text-slate-500">
                  <th className="px-4 py-3 min-w-[120px]">Transaction ID.</th>
                  <th className="px-4 py-3 min-w-[100px]">Date</th>
                  <th className="px-4 py-3 min-w-[100px]">Amount (₹)</th>
                  <th className="px-4 py-3 min-w-[100px]">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-xs">
                {filteredPayments.map((pay) => (
                  <tr key={pay.id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-4 font-semibold text-slate-700">{pay.id}</td>
                    <td className="px-4 py-4 text-slate-500 font-medium">{pay.date}</td>
                    <td className="px-4 py-4 font-bold text-slate-900">{pay.amount}</td>
                    <td className="px-4 py-4">
                      {pay.status === 'Success' || pay.status === 'Paid' || pay.status === 'Completed' ? (
                        <span className="bg-emerald-50 text-emerald-600 font-bold px-3 py-1 rounded text-[10px]">Success</span>
                      ) : pay.status === 'Pending' ? (
                        <span className="bg-amber-50 text-amber-600 font-bold px-3 py-1 rounded text-[10px]">Pending</span>
                      ) : (
                        <span className="bg-rose-50 text-rose-600 font-bold px-3 py-1 rounded text-[10px]">{pay.status}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Breadcrumbs & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
            <span className="hover:text-blue-600 cursor-pointer" onClick={() => router.push('/vendor/dashboard')}>Dashboard</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-900">Payments</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Payments
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold gap-2 h-10 px-6 rounded-lg shadow-lg shadow-blue-600/20">
                <Plus className="w-4 h-4" /> Record Payment
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-none shadow-2xl">
              <div className="flex flex-col max-h-[90vh]">
                <DialogHeader className="p-8 pb-4">
                  <DialogTitle className="text-2xl font-black tracking-tight text-slate-900">Record Payment</DialogTitle>
                  <DialogDescription className="text-slate-500 font-bold text-sm">
                    Manually log a payment received from a customer.
                  </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto px-8 py-2 custom-scrollbar">
                  <div className="grid gap-8 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="customer" className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Customer Name</Label>
                      <Input
                        id="customer"
                        placeholder="e.g. Rajesh Sharma"
                        value={formData.customer}
                        onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                        className="h-12 rounded-xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all font-bold"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="grid gap-2">
                        <Label htmlFor="amount" className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Amount (₹)</Label>
                        <Input
                          id="amount"
                          type="number"
                          placeholder="1200"
                          value={formData.amount}
                          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                          className="h-12 rounded-xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all font-bold"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="method" className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Payment Method</Label>
                        <Select
                          value={formData.method}
                          onValueChange={(val) => setFormData({ ...formData, method: val })}
                        >
                          <SelectTrigger id="method" className="h-12 rounded-xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all font-bold">
                            <SelectValue placeholder="Method" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="UPI">UPI</SelectItem>
                            <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                            <SelectItem value="Cash">Cash</SelectItem>
                            <SelectItem value="Card">Card</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="grid gap-2">
                        <Label htmlFor="date" className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Payment Date</Label>
                        <Input
                          id="date"
                          type="date"
                          value={formData.date}
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                          className="h-12 rounded-xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all font-bold"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="status" className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Status</Label>
                        <Select
                          value={formData.status}
                          onValueChange={(val) => setFormData({ ...formData, status: val })}
                        >
                          <SelectTrigger id="status" className="h-12 rounded-xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all font-bold">
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Completed">Completed</SelectItem>
                            <SelectItem value="Pending">Pending</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="ref" className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Reference/TXN ID</Label>
                      <Input
                        id="ref"
                        placeholder="TXN-987654321"
                        value={formData.refId}
                        onChange={(e) => setFormData({ ...formData, refId: e.target.value })}
                        className="h-12 rounded-xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all font-bold"
                      />
                    </div>
                  </div>
                </div>

                <DialogFooter className="p-8 pt-4">
                  <Button
                    type="button"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black h-14 rounded-2xl shadow-xl shadow-blue-600/20 active:scale-[0.98] transition-all text-base"
                    onClick={handleRecordPayment}
                  >
                    Confirm Payment
                  </Button>
                </DialogFooter>
              </div>
            </DialogContent>
          </Dialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="border border-slate-100 bg-white rounded-lg hover:bg-slate-50 transition-colors">
                <MoreHorizontal className="w-4 h-4 text-slate-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px] rounded-xl border-slate-100 shadow-xl p-1 gap-1 flex flex-col">
              <DropdownMenuItem onClick={handleExport} className="rounded-lg font-bold py-2.5 cursor-pointer">
                <Download className="w-4 h-4 mr-2 text-slate-400" /> Export CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast.info('Integration help documentation opened.')} className="rounded-lg font-bold py-2.5 cursor-pointer">
                <ShieldCheck className="w-4 h-4 mr-2 text-slate-400" /> Compliance Guide
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Grid Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Revenue</p>
          <div className="flex items-end justify-between">
            <p className="text-2xl font-black text-slate-900 tracking-tight">₹{totalRevenue.toLocaleString('en-IN')}</p>
            <div className="flex items-center text-[10px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
              +12% <ArrowUpRight className="w-2.5 h-2.5" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm border-l-4 border-l-blue-500">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Pending Clearance</p>
          <p className="text-2xl font-black text-slate-900 tracking-tight">₹{pendingClearance.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm border-l-4 border-l-emerald-500">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Success Rate</p>
          <p className="text-2xl font-black text-emerald-600 tracking-tight">99.8%</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm border-l-4 border-l-amber-500">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Collection Speed</p>
          <p className="text-2xl font-black text-slate-900 tracking-tight">1.2 Days</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
        {/* Left: Transaction Table */}
        <Card className="lg:col-span-2 p-6 border-slate-100 shadow-sm">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-500" /> Recent Transactions
          </h3>
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search transactions..."
                className="pl-10 h-10 border-slate-100 bg-slate-50/30 text-sm rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="h-10 px-4 text-xs font-bold border-slate-100 text-slate-600 rounded-lg gap-2">
                    {statusFilter === 'All' ? 'Status' : statusFilter}
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[180px] rounded-xl border-slate-100 shadow-xl p-1">
                  {['All', 'Completed', 'Pending', 'Failed'].map(status => (
                    <DropdownMenuItem 
                      key={status} 
                      onClick={() => setStatusFilter(status)}
                      className={cn("rounded-lg font-bold py-2 cursor-pointer", statusFilter === status && "bg-blue-50 text-blue-600")}
                    >
                      {status === 'All' ? 'All Status' : status}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <th className="text-left py-4 px-2">TXN ID</th>
                  <th className="text-left py-4 px-2">Customer</th>
                  <th className="text-left py-4 px-2">Amount</th>
                  <th className="text-left py-4 px-2">Method</th>
                  <th className="text-left py-4 px-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredPayments.map((pay) => (
                  <tr key={pay.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-2 font-black text-slate-900 text-xs">#{pay.id}</td>
                    <td className="py-4 px-2">
                      <p className="text-sm font-bold text-slate-900">{pay.customer}</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{pay.date}</p>
                    </td>
                    <td className="py-4 px-2 font-black text-slate-900 text-sm tracking-tighter">{pay.amount}</td>
                    <td className="py-4 px-2 text-xs font-bold text-slate-500">{pay.method}</td>
                    <td className="py-4 px-2">
                      <span className={cn(
                        "text-[9px] font-black uppercase px-2 py-0.5 rounded-full flex items-center gap-1 w-fit",
                        pay.status === 'Completed' || pay.status === 'Success' || pay.status === 'Paid' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                      )}>
                        {pay.status === 'Completed' || pay.status === 'Success' || pay.status === 'Paid' ? <CheckCircle2 className="w-2.5 h-2.5" /> : <AlertCircle className="w-2.5 h-2.5" />}
                        {pay.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Right: Payment Setup Cards */}
        <div className="space-y-6">
          <Card className="p-6 border-slate-100 shadow-sm space-y-4">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-blue-500" /> Active Methods
            </h3>
            <div className="space-y-3">
              <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center border border-slate-100">
                    <Banknote className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-900">UPI Business</p>
                    <p className="text-[10px] font-bold text-slate-400">9876543210@paytm</p>
                  </div>
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              </div>
              <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center border border-slate-100">
                    <CreditCard className="w-4 h-4 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-900">Razorpay POS</p>
                    <p className="text-[10px] font-bold text-slate-400">Merchant: SUB-SF-441</p>
                  </div>
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              </div>
            </div>
            {!isCustomer && (
              <Button variant="outline" className="w-full h-10 text-xs font-bold border-dashed border-2 hover:border-blue-500 hover:text-blue-600 bg-transparent transition-all">
                + Add Payment Gateway
              </Button>
            )}
          </Card>

          <Card className="p-8 bg-[#0a2540] text-white border-none shadow-xl shadow-blue-900/40 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 -translate-x-4">
              <ShieldCheck className="w-32 h-32" />
            </div>
            <div className="relative z-10">
              <h4 className="text-sm font-bold italic text-blue-300 mb-2">Automated Reconciliation</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                {isCustomer ? 'All your payments are verified and reconciled with the merchant ledger instantly.' : 'Your daily bank settlement for Apr 23 is being processed. Expected arrival in 4 hours.'}
              </p>
              {!isCustomer && (
                <Button 
                    onClick={handleSettlement}
                    className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-black h-12 rounded-xl shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
                >
                  View Settlements
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}