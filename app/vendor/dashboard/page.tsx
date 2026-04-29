'use client';

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Inbox,
  UserPlus,
  CreditCard,
  PieChart as PieIcon,
  TrendingUp,
  History
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

import { useVendorAuth } from '@/lib/vendor-auth';
import { useData } from '@/lib/data-context';
import CustomerDashboard from '@/components/dashboard/customer-dashboard';
import NewCustomerDashboard from '@/components/dashboard/new-customer-dashboard';

// Lazy load charts to improve initial page load speed
const DashboardCharts = dynamic(() => import('./charts'), {
  ssr: false,
  loading: () => <div className="h-80 w-full animate-pulse bg-slate-50 rounded-xl" />
});

export default function VendorDashboardPage() {
  const { user } = useVendorAuth();
  const { mockInvoices, mockCustomerSubscriptions, mockCustomers, isLoading } = useData();
  const isCustomer = user?.role === 'customer' || user?.email === 'customer@user.com';
  const [isNewCustomer, setIsNewCustomer] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const isNew = localStorage.getItem('is_new_customer') === 'true';
      setIsNewCustomer(isNew);
    }
  }, []);

  // Filter data for the current vendor
  const vendorInvoices = mockInvoices.filter(inv => inv.tenantId === user?.tenantId);
  const vendorSubs = mockCustomerSubscriptions.filter(sub => sub.tenantId === user?.tenantId || sub.orgId === user?.tenantId);
  
  // Calculate Stats
  const activeSubsCount = vendorSubs.filter(s => s.status === 'active').length;
  const totalRevenue = vendorInvoices.reduce((sum, inv) => {
    const amount = typeof inv.amount === 'string' ? parseFloat(inv.amount.replace(/[^0-9.]/g, '')) : (inv.amount || 0);
    return sum + amount;
  }, 0);
  
  const dashboardStats = [
    { label: 'Active Subscriptions', value: activeSubsCount.toString(), change: '+5%', trend: 'up' },
    { label: 'Recent Growth', value: '14.2%', change: '+2.1%', trend: 'up' },
  ];

  if (isCustomer) {
    if (isNewCustomer) {
      return (
        <React.Suspense fallback={<div className="h-screen flex items-center justify-center animate-pulse bg-slate-50" />}>
          <NewCustomerDashboard />
        </React.Suspense>
      );
    }
    return <CustomerDashboard />;
  }

  if (isLoading) {
    return <div className="h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>;
  }

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black tracking-tight text-slate-900">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat, i) => (
          <Card key={i} className="p-6 border-slate-100 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{stat.label}</p>
            <div className="flex items-end justify-between">
              <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{stat.value}</h3>
              <div className={cn(
                "flex items-center gap-1 text-[11px] font-black px-2 py-1 rounded-sm",
                stat.trend === 'up' ? "text-emerald-600 bg-emerald-50" : "text-rose-600 bg-rose-50"
              )}>
                {stat.change} {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              </div>
            </div>
            <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase">Vs Last month</p>
          </Card>
        ))}
      </div>

      {/* Charts (Lazy Loaded) */}
      <DashboardCharts />

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Invoices */}
        <Card className="border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex items-center justify-between">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
              <Inbox className="w-4 h-4 text-blue-500" /> Recent Invoices
            </h3>
            <Link href="/vendor/invoices">
              <Button variant="ghost" size="sm" className="text-xs font-bold text-blue-600 hover:text-blue-700">View All</Button>
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {vendorInvoices.slice(0, 4).map((inv, i) => (
              <div key={i} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-sm bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition-all font-black text-[10px]">
                    #{inv.id.slice(-4)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{inv.customerName || 'Customer'}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">{inv.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-slate-900 tracking-tight">{inv.amount}</p>
                  <span className={cn(
                    "text-[9px] font-black uppercase px-2 py-0.5 rounded-sm",
                    inv.status === 'Paid' ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"
                  )}>{inv.status}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Subscriptions */}
        <Card className="border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex items-center justify-between">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-emerald-500" /> Recent Subscriptions
            </h3>
            <Link href="/vendor/subscriptions">
              <Button variant="ghost" size="sm" className="text-xs font-bold text-emerald-600 hover:text-emerald-700">View All</Button>
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {vendorSubs.slice(0, 4).map((sub, i) => (
              <div key={i} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-sm bg-slate-50 border border-slate-100 flex items-center justify-center">
                    <CreditCard className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 transition-colors" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{sub.customerEmail || sub.name}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">{sub.id.slice(-4)} • {sub.plan}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={cn(
                    "text-[9px] font-black uppercase px-2 py-0.5 rounded-sm",
                    sub.status === 'Active' ? "bg-emerald-50 text-emerald-600" : (sub.status === 'Trialing' ? "bg-amber-50 text-amber-600" : "bg-rose-50 text-rose-600")
                  )}>{sub.status}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Payments */}
        <Card className="border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex items-center justify-between">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
              <History className="w-4 h-4 text-amber-500" /> Recent Payments
            </h3>
            <Link href="/vendor/payments">
              <Button variant="ghost" size="sm" className="text-xs font-bold text-amber-600 hover:text-amber-700">View All</Button>
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {vendorInvoices.slice(0, 4).map((pay, i) => (
              <div key={i} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center font-black text-[10px] text-slate-400 uppercase">
                    {(pay.customerName || 'C').charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{pay.customerName || 'Customer'}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">{pay.date} • Successful</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-slate-900 tracking-tight">{pay.amount}</p>
                  <p className="text-[10px] text-emerald-500 font-black uppercase">Successful</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Strategy Hub Insight */}
        <Card className="p-8 bg-slate-900 border-none relative overflow-hidden flex flex-col justify-center min-h-[220px]">
          <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 scale-150">
            <TrendingUp className="w-32 h-32 text-white" />
          </div>
          <div className="relative z-10">
            <h3 className="text-lg font-black text-white mb-2">Revenue Optimization</h3>
            <p className="text-slate-400 text-sm font-medium max-w-sm mb-6">
              Your "Pro Plan" adoption is up by 14% this month. Consider launching a bundle offer to further boost LTV.
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-10 px-6 rounded-lg">
              Learn More
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}