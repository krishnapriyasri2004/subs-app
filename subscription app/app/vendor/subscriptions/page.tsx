'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Plus,
  Search,
  ChevronRight,
  MoreHorizontal,
  LayoutGrid,
  List,
  Filter,
  ChevronDown,
  Download,
  FileSpreadsheet,
  Share2,
  RefreshCcw,
  UserPlus
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';
import { NewSubscriptionDialog } from './new-subscription-dialog';
import { ManageSubscriptionDialog } from './manage-subscription-dialog';
import { useVendorAuth } from '@/lib/vendor-auth';
import { toast } from 'sonner';


const initialSubscriptionData = [
  { id: 'SUB-012', customer: 'Hotha Kapoor', avatar: 'HK', plan: 'Pro Plan', status: 'Active', amount: '₹999.00', nextBilling: '23 Apr 2024' },
  { id: 'SUB-011', customer: 'Naveen Menon', avatar: 'NM', plan: 'Pro Trial', status: 'Trialing', amount: '₹0.00', nextBilling: '23 Apr 2024' },
  { id: 'SUB-010', customer: 'Nishara Deasi', avatar: 'ND', plan: 'Basic Plan', status: 'Active', amount: '₹799.00', nextBilling: '25 May 2024' },
  { id: 'SUB-009', customer: 'Krishna Iyer', avatar: 'KI', plan: 'Trial Plan', status: 'Active', amount: '₹999.00', nextBilling: '15 Apr 2024' },
  { id: 'SUB-008', customer: 'Anjali Verma', avatar: 'AV', plan: 'Basic Plan', status: 'Paused', amount: '₹1,594.00', nextBilling: '22 Apr 2024' },
  { id: 'SUB-007', customer: 'Ganesh Kumar', avatar: 'GK', plan: 'Pro Plan', status: 'Active', amount: '₹999.00', nextBilling: '19 Apr 2024' },
  { id: 'SUB-006', customer: 'Vikas Singh', avatar: 'VS', plan: 'Pro Plan', status: 'Active', amount: '₹2,450.00', nextBilling: '27 Apr 2024' },
  { id: 'SUB-005', customer: 'Megha Rao', avatar: 'MR', plan: 'Basic Plan', status: 'Active', amount: '₹999.00', nextBilling: '20 Apr 2024' },
  { id: 'SUB-9921', customer: 'Customer User', avatar: 'CU', plan: 'Premium Milk Delivery', status: 'Active', amount: '₹1,200.00', nextBilling: '15 Mar 2024' },
];

export default function SubscriptionsPage() {
  const { user } = useVendorAuth();
  const isCustomer = user?.role === 'customer' || user?.email === 'customer@user.com';

  const [subscriptions, setSubscriptions] = useState(initialSubscriptionData);
  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubscription, setSelectedSubscription] = useState<any>(null);
  const [isManageOpen, setIsManageOpen] = useState(false);

  // Persist data in localStorage
  useEffect(() => {
    const savedSubscriptions = localStorage.getItem('vendor_subscriptions');
    if (savedSubscriptions) {
      try {
        setSubscriptions(JSON.parse(savedSubscriptions));
      } catch (e) {
        console.error("Failed to parse saved subscriptions", e);
      }
    }
  }, []);

  useEffect(() => {
    if (subscriptions !== initialSubscriptionData) {
      localStorage.setItem('vendor_subscriptions', JSON.stringify(subscriptions));
    }
  }, [subscriptions]);

  const tabs = ['All', 'Active', 'Trialing', 'Past Due', 'Paused', 'Canceled'];

  const handleManage = (sub: any) => {
    if (isCustomer) return; // Restrict management for customers
    setSelectedSubscription(sub);
    setIsManageOpen(true);
  };

  const handleAddSubscription = (newSub: any) => {
    // Transform the newSub from dialog into the table's format
    const formattedSub = {
      id: `SUB-0${subscriptions.length + 13}`,
      customer: newSub.customer,
      avatar: newSub.customer.split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2),
      plan: newSub.plan,
      status: 'Active',
      amount: newSub.amount,
      nextBilling: new Date(newSub.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    };

    setSubscriptions([formattedSub, ...subscriptions]);
  };

  const filteredSubscriptions = subscriptions.filter(sub => {
    const matchesTab = activeTab === 'All' || sub.status === activeTab;
    const matchesSearch = sub.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.id.toLowerCase().includes(searchTerm.toLowerCase());

    // If customer, only show their own
    if (isCustomer) {
      return matchesTab && matchesSearch && sub.customer === 'Customer User';
    }

    return matchesTab && matchesSearch;
  });

  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const handleExport = () => {
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 1500)),
      {
        loading: 'Preparing subscriber data...',
        success: 'Subscription list exported successfully!',
        error: 'Export failed.'
      }
    );
  };

  const handleSync = () => {
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 2000)),
      {
        loading: 'Synchronizing with gateway...',
        success: 'All subscriptions are now in sync.',
        error: 'Sync failed. Gateway unreachable.'
      }
    );
  };

  if (isCustomer) {
    const handleAction = (action: string) => {
      toast.info(`${action} feature will be integrated soon!`);
    };

    const handlePaymentFlow = async (action: string, amount: number) => {
      toast.loading(`Processing ${action}...`, { id: 'pay' });
      setTimeout(() => {
        toast.dismiss('pay');
        toast.success(`${action} completed successfully!`);
      }, 1500);
    };

    return (
      <div className="space-y-6 max-w-7xl mx-auto mb-10">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Dashboard
        </h1>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* LEFT COLUMN */}
          <div className="space-y-6">

            {/* My Subscription */}
            <div className="bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100 p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-slate-900 text-base">My Subscription</h3>
                <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded">Active</span>
              </div>

              <div className="mb-6">
                <div className="flex items-end gap-1 mt-1">
                  <span className="text-2xl font-black text-slate-900">₹1,999</span>
                  <span className="text-slate-500 text-sm mb-1 font-medium">/month</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 font-medium">Next Billing: 28 Jun 2024 <span className="mx-2 text-slate-200">|</span> SUB-1234567</p>
              </div>

              <div className="flex items-center gap-3">
                <Button onClick={() => handlePaymentFlow('Upgrading to Premium Plan', 1500)} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold flex-1 sm:flex-none">Upgrade Plan</Button>
                <Button onClick={() => handleAction('Downgrade Plan')} variant="outline" className="border-slate-200 font-semibold text-slate-700 flex-1 sm:flex-none shadow-sm">Downgrade</Button>
              </div>
            </div>

            {/* Billing Information Card */}
            <div className="bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100 p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-slate-900 text-base">Billing Information</h3>
                <button onClick={() => handleAction('Edit Billing Details')} className="text-xs text-slate-400 hover:text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22h6a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v10" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M10.4 12.6a2 2 0 1 1 3 3L8 21l-4 1 1-4Z" /></svg>
                </button>
              </div>

              <div className="mb-6">
                <p className="font-bold text-slate-800 text-sm mb-1">Ganesh Enterprises</p>
                <p className="text-[12px] text-slate-500 leading-relaxed font-medium">
                  456 MG Road<br />
                  Bengaluru, Karnataka 560001<br />
                  India
                </p>
              </div>

              <div className="flex justify-between items-center pt-5 border-t border-slate-100 border-dashed">
                <span className="font-bold text-slate-900 text-sm">Total Active</span>
                <span className="font-black text-lg text-slate-900">₹ 2,349.04</span>
              </div>
            </div>

            {/* Payment Failed Alert Card */}
            <div className="bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-rose-100 p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-rose-500"></div>
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-rose-600 flex items-center gap-2 text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                  Payment Failed
                </h3>
                <button className="text-slate-400 hover:text-slate-600"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6" /></svg></button>
              </div>
              <p className="text-[11px] text-slate-600 font-medium leading-relaxed mb-4">
                Your recent payment attempt on 28 April 2024 for ₹1,999 failed. Please update your payment method to avoid service interruption.
              </p>
              <div className="flex items-center gap-3">
                <Button onClick={() => handlePaymentFlow('Update Payment Method', 1)} size="sm" className="bg-[#2b84ea] hover:bg-[#1a6ece] text-white text-[11px] font-bold shadow-sm shadow-blue-500/20 h-8 border-none">Update Payment Details</Button>
                <Button onClick={() => handlePaymentFlow('Pay Failed Invoice', 1999)} variant="outline" size="sm" className="text-slate-600 border-slate-200 text-[11px] font-bold h-8">Retry Payment</Button>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">

            {/* Outstanding Amount Card */}
            <div className="bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100 p-6">
              <h3 className="font-bold text-slate-900 text-base mb-2">Outstanding Amount</h3>

              <div className="mb-6">
                <div className="flex items-end gap-1 mt-1">
                  <span className="text-2xl font-black text-rose-500">₹1,999</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 font-medium">Next Billing: 28 March 2024</p>
              </div>

              <div className="flex items-center justify-between gap-3">
                <Button onClick={() => handleAction('Cancel Subscription')} className="bg-rose-50text-rose-600 font-bold shadow-none flex-1 hover:bg-rose-100 border border-transparent shadow-[inset_0_0_0_1px_rgba(244,63,94,0.3)] !text-rose-600 hover:!bg-rose-50 h-10 bg-white">
                  Cancel Subscription
                </Button>
                <Button onClick={() => handleAction('Change Billing Cycle')} variant="outline" className="border-slate-200 text-slate-600 font-bold flex-1 shadow-sm flex items-center justify-center gap-1 text-xs h-10 hover:bg-slate-50">
                  Change Billing Cycle <ChevronDown className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100 p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-slate-900 text-base">Payment Method</h3>
                <button onClick={() => handlePaymentFlow('Edit Payment Details', 1)} className="text-xs text-slate-400 hover:text-blue-600 flex items-center gap-1.5 font-medium">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg> Edit
                </button>
              </div>

              <div className="border border-slate-100 bg-slate-50/50 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-4">
                  <div className="min-w-12 h-8 bg-[#02042B] rounded-md shadow-sm flex items-center justify-center relative flex-shrink-0">
                    <span className="text-white text-[11px] font-black italic tracking-tighter">Card</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-black tracking-widest text-slate-800 text-sm">••••</span>
                      <span className="font-bold text-slate-900 text-sm">4242</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">Exp 09/2026 • Saved Card</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button onClick={() => handlePaymentFlow('Add New Payment Method', 1)} className="text-[12px] text-blue-600 font-bold hover:underline tracking-tight">+ Add New Payment Method</button>
                <Button onClick={() => handlePaymentFlow('Update Payment Method', 1)} variant="outline" size="sm" className="text-xs h-8 px-5 border-slate-200 text-slate-700 font-bold bg-white shadow-sm hover:bg-slate-50">
                  Update
                </Button>
              </div>
            </div>

            {/* Usage - 1. Sage */}
            <div className="bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100 p-6">
              <h3 className="font-bold text-slate-900 text-base mb-6 border-b border-slate-100 pb-3">1. Sage</h3>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-slate-500 font-medium">API Usage:</span>
                    <span className="text-xs font-bold text-slate-900">6,000 / 10,000</span>
                  </div>
                  <div className="w-full bg-blue-50/50 rounded-full h-1.5 border border-blue-100/50 overflow-hidden">
                    <div className="bg-blue-600 h-1.5 rounded-full relative" style={{ width: '60%' }}></div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="text-xs text-slate-500 font-medium">Overage Charges.</span>
                  <span className="text-xs font-bold text-slate-900">₹ 250</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumbs & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
            <span className="hover:text-blue-600 cursor-pointer">Dashboard</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-900">Subscriptions</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Subscriptions
          </h1>
        </div>
        {!isCustomer && (
          <div className="flex items-center gap-3">
            <NewSubscriptionDialog onAdd={handleAddSubscription} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="border border-slate-200 bg-white rounded-lg">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[180px] rounded-xl border-slate-100 shadow-xl p-1">
                <DropdownMenuItem onClick={handleExport} className="font-bold py-2 px-3 rounded-lg cursor-pointer">
                  <Download className="w-4 h-4 mr-2 text-slate-400" /> Export List
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSync} className="font-bold py-2 px-3 rounded-lg cursor-pointer">
                  <RefreshCcw className="w-4 h-4 mr-2 text-slate-400" /> Bulk Sync
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-slate-50" />
                <DropdownMenuItem onClick={() => toast.info('Integration help opened.')} className="font-bold py-2 px-3 rounded-lg cursor-pointer">
                  <Share2 className="w-4 h-4 mr-2 text-slate-400" /> Share Portal
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      {/* Filters & Search View */}
      <Card className="p-6 border-slate-100 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-lg">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-4 py-1.5 text-xs font-bold rounded-md transition-all",
                  activeTab === tab
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-slate-400 hover:text-slate-600"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
            <span>{filteredSubscriptions.length} Subscriptions Found</span>
            <span className="w-px h-4 bg-slate-200" />
            <span>{searchTerm ? `${filteredSubscriptions.length} Search Found` : 'Search for more'}</span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search customers..."
              className="pl-10 h-10 border-slate-200 focus-visible:ring-1 focus-visible:ring-blue-500 rounded-lg text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {!isCustomer && (
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="icon" 
                className="h-10 w-10 border-slate-100 hover:bg-slate-50"
                onClick={() => toast.info('Advanced filters will be available in the next version.')}
              >
                <Filter className="w-4 h-4 text-slate-500" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className={cn("h-10 w-10 border-slate-100", viewMode === 'list' && "bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-50")}
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className={cn("h-10 w-10 border-slate-100", viewMode === 'grid' && "bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-50")}
                onClick={() => setViewMode('grid')}
              >
                <LayoutGrid className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Subscriptions Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-50 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                <th className="text-left py-4 px-4 w-1 flex items-center gap-2">
                  <Input type="checkbox" className="w-4 h-4 rounded-sm border-slate-200" />
                </th>
                <th className="text-left py-4 px-4">Customer</th>
                <th className="text-left py-4 px-4">ID</th>
                <th className="text-left py-4 px-4">Plan</th>
                <th className="text-left py-4 px-4">Status</th>
                <th className="text-left py-4 px-4">Amount</th>
                <th className="text-left py-4 px-4">Next Billing</th>
                <th className="text-left py-4 px-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredSubscriptions.map((sub) => (
                <tr key={sub.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-4">
                    <Input type="checkbox" className="w-4 h-4 rounded-sm border-slate-200" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500 border border-slate-200">
                        {sub.avatar}
                      </div>
                      <span className="text-sm font-bold text-slate-900">{sub.customer}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-xs font-bold text-slate-400">#{sub.id}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-xs font-bold text-slate-600">{sub.plan}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={cn(
                      "text-[10px] font-black uppercase px-2 py-0.5 rounded-full",
                      sub.status === 'Active' ? "bg-emerald-50 text-emerald-600" :
                        sub.status === 'Trialing' ? "bg-amber-50 text-amber-600 text-amber-500/80 border border-amber-200/50" :
                          "bg-slate-100 text-slate-500"
                    )}>
                      {sub.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm font-black text-slate-900">{sub.amount}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-xs font-bold text-slate-600">{sub.nextBilling}</span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    {!isCustomer && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleManage(sub)}
                      >
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {!isCustomer && (
        <ManageSubscriptionDialog
          subscription={selectedSubscription}
          open={isManageOpen}
          onOpenChange={setIsManageOpen}
          onUpdateStatus={() => { }}
          onUpdateSubscription={() => { }}
        />
      )}
    </div>
  );
}