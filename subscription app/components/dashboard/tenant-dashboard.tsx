'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import {
  mockTenants,
  mockCustomerInvoices,
  mockCustomerSubscriptions,
  mockCustomers,
  mockBusinessPlans,
  mockDemoRequests
} from '@/lib/mock-data';
import {
  Users,
  Zap,
  TrendingUp,
  Banknote,
  Calendar,
  Clock,
  ChevronRight,
  Activity,
  Package,
  ShoppingCart,
  Plus,
  ArrowUpRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function TenantDashboard() {
  const { user } = useAuth();
  const [demoRequests, setDemoRequests] = React.useState<any[]>(mockDemoRequests);

  React.useEffect(() => {
    const localRequests = JSON.parse(localStorage.getItem('subscale_demo_requests') || '[]');
    if (localRequests.length > 0) {
      setDemoRequests([...localRequests, ...mockDemoRequests]);
    }
  }, []);

  const formatRevenue = (val: string) => {
    const map: Record<string, string> = {
      '<1-lakh': 'Less than ₹1L',
      '1-5-lakh': '₹1 - ₹5 Lakh',
      '5-10-lakh': '₹5 - ₹10 Lakh',
      '10-50-lakh': '₹10 - ₹50 Lakh',
      '50-lakh+': '₹50 Lakh+'
    };
    return map[val] || val;
  };

  // Business logic for the Tenant Owner (e.g. Milk/Rice Vendor)
  const tenantId = user?.tenantId || 'tenant-1';
  const tenant = mockTenants.find(t => t.id === tenantId);

  const customers = mockCustomers.filter(c => c.tenantId === tenantId);
  const activeSubs = mockCustomerSubscriptions.filter(s => s.tenantId === tenantId && s.status === 'active');
  const invoices = mockCustomerInvoices.filter(i => i.tenantId === tenantId);

  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
  const activeCustomerCount = customers.filter(c => c.status === 'active').length;

  return (
    <div className="space-y-10 pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 animate-in-fade">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-[2rem] bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-xl shadow-indigo-500/20 group relative overflow-hidden">
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <Package className="w-8 h-8 relative z-10" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
              {tenant?.name} <span className="text-gradient">Hub</span>
            </h1>
            <p className="text-muted-foreground mt-1 text-lg font-medium">
              Manage your delivery business and customer subscriptions
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="h-12 rounded-xl border-border/50 bg-background/50 backdrop-blur-sm font-bold gap-2">
            Business Settings
          </Button>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 rounded-xl px-6 h-12 font-black">
            <Plus className="w-4 h-4 mr-2" /> NEW ORDER
          </Button>
        </div>
      </div>

      {/* Business Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-card p-6 relative overflow-hidden group hover:scale-[1.02] transition-all duration-500 animate-in-up">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-lg">+12%</span>
          </div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Total Customers</p>
          <h3 className="text-3xl font-black text-foreground">{customers.length}</h3>
          <p className="text-[10px] text-muted-foreground font-medium mt-2 uppercase tracking-tighter">{activeCustomerCount} active patrons</p>
        </Card>

        <Card className="glass-card p-6 relative overflow-hidden group hover:scale-[1.02] transition-all duration-500 animate-in-up delay-100">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Zap className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Active Deliveries</p>
          <h3 className="text-3xl font-black text-foreground">{activeSubs.length}</h3>
          <p className="text-[10px] text-muted-foreground font-medium mt-2 uppercase tracking-tighter">Daily Fulfillment</p>
        </Card>

        <Card className="glass-card p-6 relative overflow-hidden group hover:scale-[1.02] transition-all duration-500 animate-in-up delay-200">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
              <Banknote className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Monthly Revenue</p>
          <h3 className="text-3xl font-black text-foreground">₹{totalRevenue.toLocaleString('en-IN')}</h3>
          <p className="text-[10px] text-emerald-500 font-bold mt-2 uppercase tracking-tighter">Collected 95% today</p>
        </Card>

        <Card className="glass-card p-6 relative overflow-hidden group hover:scale-[1.02] transition-all duration-500 animate-in-up delay-300">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Demo Requests</p>
          <h3 className="text-3xl font-black text-foreground">{demoRequests.filter(d => d.status === 'pending').length}</h3>
          <p className="text-[10px] text-muted-foreground font-medium mt-2 uppercase tracking-tighter">Scheduled Leads</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Section */}
        <div className="lg:col-span-2 space-y-8">
          {/* Demo Requests */}
          <Card className="glass-card overflow-hidden">
            <div className="p-8 border-b border-border/50 flex justify-between items-center bg-blue-50/50">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-500" /> Recent Demo Bookings
              </h3>
              <Button asChild variant="ghost" className="text-xs font-bold uppercase tracking-widest">
                <Link href="/dashboard/requests">Leads Dashboard</Link>
              </Button>
            </div>
            <div className="p-0">
              <div className="divide-y divide-border/30">
                {demoRequests.map((request) => (
                  <div key={request.id} className="p-6 flex items-center justify-between group hover:bg-blue-500/[0.02] transition-all">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-100 group-hover:text-blue-600 transition-all">
                        <Users className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-foreground">{request.fullName}</h4>
                        <div className="flex items-center gap-3 mt-1">
                          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">
                            {request.companyName}
                          </p>
                          <span className="w-1 h-1 bg-muted-foreground/30 rounded-full" />
                          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">
                            {request.industry}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-8">
                      <div className="hidden sm:block">
                        <p className="text-[11px] font-black text-foreground flex items-center gap-1.5 justify-end uppercase">
                          <Calendar className="w-3.5 h-3.5 text-blue-500" /> {request.preferredDate}
                        </p>
                        <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest mt-0.5 flex items-center gap-1.5 justify-end">
                          <Clock className="w-3 h-3" /> {request.preferredTimeSlot}
                        </p>
                      </div>
                      <span className={cn(
                        "inline-flex px-2 py-0.5 rounded-lg text-[9px] font-black uppercase",
                        request.status === 'pending' ? "bg-amber-100 text-amber-600" : (request.status === 'scheduled' ? "bg-blue-100 text-blue-600" : "bg-emerald-100 text-emerald-600")
                      )}>
                        {request.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card className="glass-card overflow-hidden">
            <div className="p-8 border-b border-border/50 flex justify-between items-center bg-muted/20">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-primary" /> Active Product Tiers
              </h3>
              <Link href="/dashboard/plans">
                <Button variant="ghost" className="text-xs font-bold uppercase tracking-widest">Architect Plans</Button>
              </Link>
            </div>
            <div className="p-0">
              <div className="divide-y divide-border/30">
                {mockBusinessPlans.map((plan) => (
                  <div key={plan.id} className="p-6 flex items-center justify-between group hover:bg-primary/[0.02] transition-all">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-all">
                        <Package className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-foreground">{plan.name}</h4>
                        <p className="text-[10px] text-muted-foreground mt-1 uppercase font-bold tracking-tighter">
                          {plan.features.slice(0, 2).join(' • ')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-8">
                      <div>
                        <p className="text-sm font-black text-foreground">₹{plan.price.toLocaleString('en-IN')}</p>
                        <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">{plan.frequency}</p>
                      </div>
                      <Button variant="ghost" size="icon" className="rounded-xl group-hover:translate-x-1 transition-transform">
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Quick Analytics Simulation */}
          <Card className="glass-card p-8">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-lg font-bold">Delivery Velocity</h3>
              <div className="flex gap-2">
                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-primary" /> Milk
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-purple-500" /> Rice
                </div>
              </div>
            </div>
            <div className="h-48 w-full flex items-end gap-2 pb-2">
              {[40, 70, 45, 90, 65, 80, 50, 85, 95, 75, 60, 80].map((h, i) => (
                <div key={i} className="flex-1 space-y-1">
                  <div className="w-full bg-primary/20 rounded-t-lg relative group transition-all duration-500 hover:bg-primary/40" style={{ height: `${h}%` }}>
                    <div className="absolute inset-x-0 bottom-0 bg-primary rounded-t-lg transition-all duration-1000 delay-300" style={{ height: '60%' }} />
                  </div>
                  <div className="text-[8px] font-black text-muted-foreground/50 text-center uppercase">{['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][i]}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Recent Updates Sidebar */}
        <div className="space-y-8">
          <Card className="glass-card overflow-hidden">
            <div className="p-6 border-b border-border/50 bg-muted/10">
              <h3 className="text-xs font-black uppercase tracking-widest">Recent Customers</h3>
            </div>
            <div className="p-2 space-y-1">
              {customers.slice(0, 4).map((customer) => (
                <div key={customer.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer group">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                    {customer.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">{customer.name}</p>
                    <p className="text-[10px] text-muted-foreground uppercase font-medium tracking-tighter">Joined {new Date(customer.createdAt).toLocaleDateString()}</p>
                  </div>
                  <ArrowUpRight className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
            <Link href="/dashboard/customers">
              <div className="p-4 border-t border-border/30 text-center">
                <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest w-full">View Directory</Button>
              </div>
            </Link>
          </Card>

          <Card className="glass-card p-8 bg-gradient-to-br from-indigo-600 to-purple-700 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 rotate-12 translate-x-4 -translate-y-4 opacity-10 group-hover:rotate-0 transition-all duration-700">
              <Activity className="w-32 h-32 text-white" />
            </div>
            <h3 className="text-white font-black text-xl relative z-10">Expand Your <br />Fulfilment</h3>
            <p className="text-white/60 text-[10px] font-bold mt-4 relative z-10 uppercase tracking-widest leading-relaxed">Optimization algorithms are ready for your route density.</p>
            <Button className="mt-8 bg-white text-indigo-700 hover:bg-white/90 rounded-xl px-6 font-black h-12 relative z-10 transition-all active:scale-95">
              GET STARTED
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
