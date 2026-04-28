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
import CustomerDashboard from '@/components/dashboard/customer-dashboard';

// Lazy load charts to improve initial page load speed
const DashboardCharts = dynamic(() => import('./charts'), {
  ssr: false,
  loading: () => <div className="h-80 w-full animate-pulse bg-slate-50 rounded-xl" />
});

const dashboardData = {
  stats: [
    { label: 'Monthly Revenue', value: '₹42,500', change: '10%', trend: 'up' },
    { label: 'Annual Revenue', value: '₹5,10,000', change: '10.1%', trend: 'up' },
    { label: 'Active Subscriptions', value: '342', change: '10.1%', trend: 'up' },
    { label: 'Churn Rate', value: '3.2%', change: '0.1%', trend: 'down' },
  ],
  recentInvoices: [
    { id: '1021', name: 'Ganesh Kumar', amount: '₹999.00', status: 'Paid', date: '23 Apr 2024' },
    { id: '1092', name: 'Ananya Sharma', amount: '₹1,999.00', status: 'Paid', date: '20 Apr 2024' },
    { id: '1126', name: 'Vikas Singh', amount: '₹2,499.00', status: 'Paid', date: '15 Apr 2024' },
    { id: '1152', name: 'Megha Rao', amount: '₹999.00', status: 'Active', date: '10 Apr 2024' },
  ],
  recentSubscriptions: [
    { name: 'Krishna Iyer', plan: 'Pro Plan', status: 'Active', id: 'SUB-011' },
    { name: 'Anjali Verma', plan: 'Basic Plan', status: 'Trialing', id: 'SUB-005' },
    { name: 'Naveen Menon', plan: 'Trial Plan', status: 'Active', id: 'SUB-023' },
    { name: 'Nishant Desai', plan: 'Pro Plan', status: 'Canceled', id: 'SUB-021' },
  ],
  payments: [
    { name: 'Ganesh Kumar', amount: '₹999.00', date: '23 Apr 2024', time: '10:21 AM' },
    { name: 'Naveen Menon', amount: '₹1,999.00', date: '20 Apr 2024', time: '11:15 AM' },
    { name: 'Ananya Sharma', amount: '₹1,119.00', date: '15 Apr 2024', time: '1:00 PM' },
    { name: 'Vikas Singh', amount: '₹1,999.00', date: '10 Apr 2024', time: '2:30 PM' },
  ]
};

export default function VendorDashboardPage() {
  const { user } = useVendorAuth();
  const isCustomer = user?.role === 'customer' || user?.email === 'customer@user.com';

  if (isCustomer) {
    return <CustomerDashboard />;
  }

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black tracking-tight text-slate-900">Dashboard</h1>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardData.stats.map((stat, i) => (
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
            {dashboardData.recentInvoices.slice(0, 2).map((inv, i) => (
              <div key={i} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-sm bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition-all font-black text-[10px]">
                    #{inv.id}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{inv.name}</p>
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
            {dashboardData.recentSubscriptions.slice(0, 2).map((sub, i) => (
              <div key={i} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-sm bg-slate-50 border border-slate-100 flex items-center justify-center">
                    <CreditCard className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 transition-colors" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{sub.name}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">{sub.id} • {sub.plan}</p>
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
            {dashboardData.payments.slice(0, 2).map((pay, i) => (
              <div key={i} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center font-black text-[10px] text-slate-400 uppercase">
                    {pay.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{pay.name}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">{pay.date} • {pay.time}</p>
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