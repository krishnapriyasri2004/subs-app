'use client';

import React, { useState, useEffect } from 'react';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { mockTenants, mockInvoices, mockSubscriptions, mockDemoRequests } from '@/lib/mock-data';
import { DashboardStats, Tenant, Subscription, Invoice, DemoRequest } from '@/types';
import {
  Building2,
  TrendingUp,
  Users,
  CreditCard,
  AlertCircle,
  ArrowRight,
  Plus,
  Calendar,
  Clock,
  Check,
  X,
  Video,
  ExternalLink,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';
import { DemoDetailsDialog } from './demo-details-dialog';

export default function AdminDashboard() {
  const [tenants] = useState<Tenant[]>(mockTenants);
  const [subscriptions] = useState<Subscription[]>(mockSubscriptions);
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [demoRequests, setDemoRequests] = useState<DemoRequest[]>(mockDemoRequests);
  const [selectedRequest, setSelectedRequest] = useState<DemoRequest | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const fetchInvoices = () => {
    const localInvoices = JSON.parse(localStorage.getItem('admin_invoices') || '[]');
    setInvoices([...localInvoices, ...mockInvoices]);
  };

  useEffect(() => {
    const localRequests = JSON.parse(localStorage.getItem('subscale_demo_requests') || '[]');
    if (localRequests.length > 0) {
      setDemoRequests([...localRequests, ...mockDemoRequests]);
    }

    fetchInvoices();
    window.addEventListener('adminInvoiceCreated', fetchInvoices);
    return () => window.removeEventListener('adminInvoiceCreated', fetchInvoices);
  }, []);

  const handleStatusChange = (id: string, newStatus: string) => {
    setDemoRequests(prev => prev.map(req =>
      req.id === id ? { ...req, status: newStatus as any } : req
    ));
    toast.success(`Request status updated to ${newStatus}`);
  };

  const handleDelete = (id: string) => {
    const updatedRequests = demoRequests.filter(req => req.id !== id);
    setDemoRequests(updatedRequests);

    // Also update localStorage if it was a local request
    const localRequests = JSON.parse(localStorage.getItem('subscale_demo_requests') || '[]');
    const filteredLocal = localRequests.filter((req: any) => req.id !== id);
    localStorage.setItem('subscale_demo_requests', JSON.stringify(filteredLocal));

    toast.error("Request deleted successfully");
  };

  const openDetails = (request: DemoRequest) => {
    setSelectedRequest(request);
    setIsDetailsOpen(true);
  };

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

  // Calculate dashboard stats
  const stats: DashboardStats = {
    totalTenants: tenants.length,
    activeTenants: tenants.filter((t) => t.status === 'active').length,
    totalRevenue: invoices.reduce((sum, inv) => sum + inv.totalAmount, 0),
    activeSubscriptions: subscriptions.filter(
      (s) => s.status === 'active'
    ).length,
    pendingInvoices: invoices.filter(
      (inv) => inv.status === 'sent' || inv.status === 'overdue'
    ).length,
    monthlyRecurringRevenue: subscriptions
      .filter((s) => s.status === 'active')
      .reduce((sum, sub) => {
        const monthlyPrice = Math.floor(sub.totalAmount / 12);
        return sum + monthlyPrice;
      }, 0),
  };

  const StatCard = ({
    icon: Icon,
    label,
    value,
    color,
    delay,
  }: {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    color: string;
    delay: string;
  }) => (
    <Card className={`glass-card p-6 animate-in-up ${delay}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">{label}</p>
          <p className="text-3xl font-bold tracking-tight text-foreground">{value}</p>
        </div>
        <div className={`p-3 rounded-2xl ${color} shadow-inner`}>{Icon}</div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-10 pb-10">
      {/* Hero / Header Section */}
      <div className="relative overflow-hidden rounded-3xl bg-primary/5 p-8 md:p-12 animate-in-fade">
        <div className="absolute top-0 right-0 -mt-32 -mr-32 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
              Admin <span className="text-gradient">Command Center</span>
            </h1>
            <p className="text-muted-foreground mt-2 text-lg max-w-xl">
              Monitor your enterprise performance, manage tenants, and track global revenue in real-time.
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/dashboard/tenants">
              <Button className="shad-button-primary bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 rounded-xl px-6">
                <Plus className="w-4 h-4 mr-2" /> New Tenant
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<Building2 className="w-6 h-6 text-primary" />}
          label="Total Tenants"
          value={stats.totalTenants ?? 0}
          color="bg-primary/10"
          delay="delay-100"
        />
        <StatCard
          icon={<TrendingUp className="w-6 h-6 text-emerald-500" />}
          label="Active Subscriptions"
          value={stats.activeSubscriptions ?? 0}
          color="bg-emerald-500/10"
          delay="delay-200"
        />
        <StatCard
          icon={<Calendar className="w-6 h-6 text-blue-500" />}
          label="Pending Demos"
          value={demoRequests.filter(d => d.status === 'pending').length}
          color="bg-blue-500/10"
          delay="delay-300"
        />
        <StatCard
          icon={<CreditCard className="w-6 h-6 text-amber-500" />}
          label="Total Revenue"
          value={`₹${(stats.totalRevenue || 0).toLocaleString('en-IN')}`}
          color="bg-amber-500/10"
          delay="delay-100"
        />
        <StatCard
          icon={<TrendingUp className="w-6 h-6 text-indigo-500" />}
          label="MRR"
          value={`₹${(stats.monthlyRecurringRevenue || 0).toLocaleString('en-IN')}`}
          color="bg-indigo-500/10"
          delay="delay-100"
        />
        <StatCard
          icon={<AlertCircle className="w-6 h-6 text-rose-500" />}
          label="Pending Invoices"
          value={stats.pendingInvoices ?? 0}
          color="bg-rose-500/10"
          delay="delay-200"
        />
        <StatCard
          icon={<Users className="w-6 h-6 text-violet-500" />}
          label="Total Users"
          value={mockTenants.reduce((sum, t) => sum + t.currentUsersCount, 0)}
          color="bg-violet-500/10"
          delay="delay-300"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Demo Requests */}
        {/* Recent Demo Requests */}
        <Card className="glass-card p-0 animate-in-up delay-300 lg:col-span-2 overflow-hidden">
          <div className="p-8 border-b border-border/50 flex justify-between items-center bg-blue-50/50">
            <div>
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-500" /> Recent Demo Requests
              </h2>
              <p className="text-sm text-muted-foreground mt-1">Prospective clients waiting for a walkthrough</p>
            </div>
            <Button asChild variant="ghost" className="text-primary hover:text-primary hover:bg-primary/5 group">
              <Link href="/dashboard/requests">
                Manage All <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-muted-foreground uppercase tracking-wider text-left border-b border-border/50">
                  <th className="px-8 py-3 font-semibold">Name</th>
                  <th className="py-3 font-semibold">Company</th>
                  <th className="py-3 font-semibold">Expected Revenue</th>
                  <th className="py-3 font-semibold">Preferred Slot</th>
                  <th className="py-3 font-semibold text-center">Status</th>
                  <th className="px-8 py-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {demoRequests.slice(0, 5).map((request) => (
                  <tr key={request.id} className="group hover:bg-muted/30 transition-colors">
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold group-hover:bg-blue-600 group-hover:text-white transition-all">
                          {request.fullName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{request.fullName}</p>
                          <p className="text-[10px] text-muted-foreground">{request.workEmail}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <p className="text-xs font-medium text-foreground">{request.companyName}</p>
                      <p className="text-[10px] text-muted-foreground font-bold uppercase">{request.industry}</p>
                    </td>
                    <td className="py-4 text-xs font-bold text-foreground">
                      {formatRevenue(request.expectedRevenue)}
                    </td>
                    <td className="py-4">
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-1 text-[10px] font-bold text-foreground uppercase tracking-tighter">
                          <Calendar className="w-3 h-3 text-primary" /> {request.preferredDate}
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground uppercase">
                          <Clock className="w-3 h-3" /> {request.preferredTimeSlot}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-center">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${request.status === 'pending'
                          ? 'bg-amber-100 text-amber-600'
                          : request.status === 'scheduled'
                            ? 'bg-blue-100 text-blue-600'
                            : 'bg-emerald-100 text-emerald-600'
                          }`}
                      >
                        {request.status}
                      </span>
                    </td>
                    <td className="px-8 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {request.status === 'pending' && (
                          <>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white"
                              onClick={() => handleStatusChange(request.id, 'scheduled')}
                              title="Set as Scheduled"
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white"
                              onClick={() => handleStatusChange(request.id, 'rejected')}
                              title="Reject Request"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                        {request.status === 'scheduled' && (
                          <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-black text-[10px] uppercase h-8 px-3 rounded-lg flex items-center gap-1.5"
                            onClick={() => toast.info('Starting Google Meet session...')}
                          >
                            <Video className="w-3.5 h-3.5" /> Start Meet
                          </Button>
                        )}
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 rounded-lg text-muted-foreground hover:bg-muted"
                          title="View Details"
                          onClick={() => openDetails(request)}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 rounded-lg text-rose-500 hover:bg-rose-50 hover:text-rose-600"
                          onClick={() => handleDelete(request.id)}
                          title="Delete Request"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Details Dialog */}
        <DemoDetailsDialog
          request={selectedRequest}
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
        />

        {/* Recent Tenants */}
        <Card className="glass-card p-6 animate-in-up delay-300">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-xl font-bold text-foreground">Active Tenants</h2>
              <p className="text-sm text-muted-foreground mt-1">Recently onboarded business partners</p>
            </div>
            <Link href="/dashboard/tenants">
              <Button variant="ghost" className="text-primary hover:text-primary hover:bg-primary/5 group">
                View All <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="space-y-4">
            {mockTenants.slice(0, 4).map((tenant) => (
              <div
                key={tenant.id}
                className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border/50 hover:bg-muted/50 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {tenant.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{tenant.name}</h3>
                    <p className="text-xs text-muted-foreground">{tenant.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground">
                    {tenant.currentUsersCount} Users
                  </p>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${tenant.status === 'active'
                      ? 'bg-emerald-500/10 text-emerald-500'
                      : 'bg-amber-500/10 text-amber-500'
                      }`}
                  >
                    {tenant.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Invoices */}
        <Card className="glass-card p-6 animate-in-up delay-300">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-xl font-bold text-foreground">Recent Invoices</h2>
              <p className="text-sm text-muted-foreground mt-1">Financial transactions and billing status</p>
            </div>
            <Link href="/dashboard/invoices">
              <Button variant="ghost" className="text-primary hover:text-primary hover:bg-primary/5 group">
                View All <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-muted-foreground uppercase tracking-wider text-left border-b border-border/50">
                  <th className="pb-3 font-semibold">Invoice</th>
                  <th className="pb-3 font-semibold">Tenant</th>
                  <th className="pb-3 font-semibold text-right">Amount</th>
                  <th className="pb-3 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {invoices.slice(0, 4).map((invoice) => {
                  const tenant = mockTenants.find(
                    (t) => t.id === invoice.tenantId
                  );
                  return (
                    <tr key={invoice.id} className="group hover:bg-muted/30 transition-colors">
                      <td className="py-4 text-sm font-medium text-foreground">
                        {invoice.invoiceNumber}
                      </td>
                      <td className="py-4 text-sm text-muted-foreground whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px]">
                        {tenant?.name}
                      </td>
                      <td className="py-4 text-sm text-right font-bold text-foreground">
                        ₹{invoice.totalAmount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-4 text-right">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-semibold ${invoice.status === 'paid'
                            ? 'bg-emerald-500/10 text-emerald-500'
                            : invoice.status === 'overdue'
                              ? 'bg-rose-500/10 text-rose-500'
                              : 'bg-muted text-muted-foreground'
                            }`}
                        >
                          {invoice.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
