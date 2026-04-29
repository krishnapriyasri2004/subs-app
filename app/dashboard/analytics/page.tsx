'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/lib/auth-context';
import {
  mockRevenueMetrics,
  mockChurnAnalysis
} from '@/lib/mock-data';
import { useData } from '@/lib/data-context';
import { TrendingUp, Calendar, DollarSign, Users, TrendingDown, BarChart3, AlertCircle, PieChart, ArrowUpRight, ArrowDownRight, Zap, Target, Download, ChevronDown } from 'lucide-react';
import { AdvancedRevenueChart } from '@/components/analytics/advanced-revenue-chart';
import { ChurnAnalysisComponent } from '@/components/analytics/churn-analysis';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from 'sonner';

export default function AnalyticsPage() {
    const { user } = useAuth();
    const [timeframe, setTimeframe] = useState('MONTH');
    const [selectedPeriod, setSelectedPeriod] = useState('Q1 2024');

    const handleExportDataset = () => {
        toast.promise(
            new Promise(async (resolve) => {
                await new Promise(r => setTimeout(r, 1500));
                
                // Create CSV Content
                const csvRows = [
                    ['Metric', 'Value', 'Status'],
                    ['MRR Impact', mockRevenueMetrics.mrr, 'Active'],
                    ['Projected ARR', mockRevenueMetrics.arr, 'Projected'],
                    ['Churn Velocity', `${(mockRevenueMetrics.churnRate * 100).toFixed(1)}%`, 'Warning'],
                    ['Gross Margin (NRR)', `${(mockRevenueMetrics.nrr * 100).toFixed(0)}%`, 'Healthy']
                ];
                const csvString = csvRows.map(r => r.join(',')).join('\n');
                
                // Trigger Download
                const blob = new Blob([csvString], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.setAttribute('hidden', '');
                a.setAttribute('href', url);
                a.setAttribute('download', `intel_revenue_dataset_${new Date().toISOString().split('T')[0]}.csv`);
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                
                resolve(true);
            }),
            {
                loading: 'Compiling platform dataset...',
                success: 'Full dataset exported successfully!',
                error: 'Failed to export data',
            }
        );
    };

    const isPlatformAdmin = user?.role === 'admin' || user?.role === 'super_admin';

  const { mockInvoices, mockInvoices: mockCustomerInvoices } = useData();

  // Calculate analytics data
  const relevantInvoices = isPlatformAdmin
    ? mockInvoices
    : mockCustomerInvoices.filter(i => i.tenantId === user?.tenantId);

  const totalRevenue = relevantInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
  const paidRevenue = relevantInvoices
    .filter((inv) => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.totalAmount, 0);

  const monthlyData = [
    { month: 'Jan', revenue: totalRevenue * 0.4, invoices: Math.ceil(relevantInvoices.length * 0.4) },
    { month: 'Feb', revenue: totalRevenue * 0.3, invoices: Math.ceil(relevantInvoices.length * 0.3) },
    { month: 'Mar', revenue: totalRevenue * 0.3, invoices: Math.ceil(relevantInvoices.length * 0.3) },
  ];

  const invoiceStatusBreakdown = {
    paid: relevantInvoices.filter((inv) => inv.status === 'paid').length,
    sent: relevantInvoices.filter((inv) => inv.status === 'sent').length,
    overdue: relevantInvoices.filter((inv) => inv.status === 'overdue').length,
    draft: relevantInvoices.filter((inv) => inv.status === 'draft').length,
  };

  return (
    <div className="space-y-10 pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 animate-in-fade">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
            Revenue <span className="text-gradient">Intelligence</span>
          </h1>
          <p className="text-muted-foreground mt-2 text-lg max-w-2xl">
            {user?.role === 'admin' || user?.role === 'super_admin'
              ? 'Real-time performance analytics across all enterprise partners and subscription tiers.'
              : 'Deep dive into your revenue streams, customer retention, and billing performance.'}
          </p>
        </div>
        <div className="flex gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-12 rounded-xl border-border/50 bg-background/50 backdrop-blur-sm font-bold gap-2">
                <Calendar className="w-4 h-4" /> {selectedPeriod} <ChevronDown className="w-3 h-3 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 rounded-xl p-2">
              <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-2 py-1.5">Fiscal Period</DropdownMenuLabel>
              <DropdownMenuItem className="rounded-lg font-bold text-xs cursor-pointer" onClick={() => setSelectedPeriod('Q1 2024')}>Q1 2024</DropdownMenuItem>
              <DropdownMenuItem className="rounded-lg font-bold text-xs cursor-pointer" onClick={() => setSelectedPeriod('Q2 2024')}>Q2 2024 (Projections)</DropdownMenuItem>
              <DropdownMenuItem className="rounded-lg font-bold text-xs cursor-pointer" onClick={() => setSelectedPeriod('FY 2023')}>Full Year 2023</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button onClick={handleExportDataset} className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 rounded-xl px-6 h-12">
            <Download className="w-4 h-4 mr-2" /> Export Dataset
          </Button>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-card p-6 relative overflow-hidden group hover:scale-[1.02] transition-all duration-500 animate-in-up delay-100">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <DollarSign className="w-16 h-16 text-primary" />
          </div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">MRR Impact</p>
          <h3 className="text-3xl font-black text-foreground">
            ₹{mockRevenueMetrics.mrr.toLocaleString('en-IN')}
          </h3>
          <div className="flex items-center gap-1.5 mt-4 text-emerald-500 font-bold text-xs bg-emerald-500/10 w-fit px-2 py-1 rounded-lg">
            <ArrowUpRight className="w-3 link-3" /> 5.2% Growth
          </div>
        </Card>

        <Card className="glass-card p-6 relative overflow-hidden group hover:scale-[1.02] transition-all duration-500 animate-in-up delay-200">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Target className="w-16 h-16 text-blue-500" />
          </div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Projected ARR</p>
          <h3 className="text-3xl font-black text-foreground">
            ₹{(mockRevenueMetrics.arr / 100000).toFixed(1)}L
          </h3>
          <p className="text-[10px] text-muted-foreground font-bold mt-4 uppercase tracking-tighter">Billed via {relevantInvoices.length} invoices</p>
        </Card>

        <Card className="glass-card p-6 relative overflow-hidden group hover:scale-[1.02] transition-all duration-500 animate-in-up delay-300">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Users className="w-16 h-16 text-rose-500" />
          </div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Churn Velocity</p>
          <h3 className="text-3xl font-black text-rose-500">
            {(mockRevenueMetrics.churnRate * 100).toFixed(1)}%
          </h3>
          <div className="flex items-center gap-1.5 mt-4 text-rose-500 font-bold text-xs bg-rose-500/10 w-fit px-2 py-1 rounded-lg">
            <ArrowDownRight className="w-3 link-3" /> -0.8% Drop
          </div>
        </Card>

        <Card className="glass-card p-6 relative overflow-hidden group hover:scale-[1.02] transition-all duration-500 animate-in-up delay-400">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Zap className="w-16 h-16 text-amber-500" />
          </div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Gross Margin (NRR)</p>
          <h3 className="text-3xl font-black text-amber-500">
            {(mockRevenueMetrics.nrr * 100).toFixed(0)}%
          </h3>
          <p className="text-[10px] text-muted-foreground font-bold mt-4 uppercase tracking-tighter">Includes net expansion</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart Area */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="glass-card overflow-hidden group animate-in-up delay-300">
            <div className="p-8 border-b border-border/50 flex justify-between items-center bg-muted/20">
              <div>
                <h3 className="text-xl font-bold text-foreground">Revenue Trajectory</h3>
                <p className="text-xs text-muted-foreground tracking-wide uppercase font-bold mt-1">Global collection history</p>
              </div>
              <div className="flex gap-2">
                <Button 
                    variant={timeframe === 'DAY' ? 'secondary' : 'ghost'} 
                    size="sm" 
                    onClick={() => setTimeframe('DAY')}
                    className={cn("rounded-lg font-bold text-[10px] h-8 px-3", timeframe === 'DAY' ? "shadow-md" : "hover:bg-primary/10 hover:text-primary")}
                >DAY</Button>
                <Button 
                    variant={timeframe === 'MONTH' ? 'secondary' : 'ghost'} 
                    size="sm" 
                    onClick={() => setTimeframe('MONTH')}
                    className={cn("rounded-lg font-bold text-[10px] h-8 px-3", timeframe === 'MONTH' ? "shadow-md" : "hover:bg-primary/10 hover:text-primary")}
                >MONTH</Button>
                <Button 
                    variant={timeframe === 'YEAR' ? 'secondary' : 'ghost'} 
                    size="sm" 
                    onClick={() => setTimeframe('YEAR')}
                    className={cn("rounded-lg font-bold text-[10px] h-8 px-3", timeframe === 'YEAR' ? "shadow-md" : "hover:bg-primary/10 hover:text-primary")}
                >YEAR</Button>
              </div>
            </div>
            <div className="p-8">
              <AdvancedRevenueChart data={monthlyData} />
            </div>
          </Card>

          <ChurnAnalysisComponent analysis={mockChurnAnalysis} />
        </div>

        {/* Side Panels */}
        <div className="space-y-8">
          {/* Status Distribution */}
          <Card className="glass-card p-6 group animate-in-up delay-400">
            <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-primary" /> Invoice Status
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-emerald-500/[0.03] border border-emerald-500/10 group-hover:bg-emerald-500/[0.06] transition-colors">
                <p className="text-2xl font-black text-emerald-500">{invoiceStatusBreakdown.paid}</p>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Cleared</p>
              </div>
              <div className="p-4 rounded-2xl bg-blue-500/[0.03] border border-blue-500/10 group-hover:bg-blue-500/[0.06] transition-colors">
                <p className="text-2xl font-black text-blue-500">{invoiceStatusBreakdown.sent}</p>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Pending</p>
              </div>
              <div className="p-4 rounded-2xl bg-rose-500/[0.03] border border-rose-500/10 group-hover:bg-rose-500/[0.06] transition-colors">
                <p className="text-2xl font-black text-rose-500">{invoiceStatusBreakdown.overdue}</p>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Delayed</p>
              </div>
              <div className="p-4 rounded-2xl bg-muted/30 border border-border/50 group-hover:bg-muted/50 transition-colors">
                <p className="text-2xl font-black text-muted-foreground">{invoiceStatusBreakdown.draft}</p>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Internal</p>
              </div>
            </div>
          </Card>

          {/* Efficiency Panel */}
          <Card className="glass-card p-8 animate-in-up delay-500">
            <h3 className="text-lg font-bold text-foreground mb-6">Efficiency Indices</h3>
            <div className="space-y-8">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Collection Rate</span>
                  <span className="text-sm font-black text-primary bg-primary/10 px-2 py-0.5 rounded-lg">
                    {Math.round((paidRevenue / totalRevenue) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-muted/40 rounded-full h-2 overflow-hidden border border-border/20 shadow-inner">
                  <div
                    className="bg-gradient-to-r from-primary/60 to-primary h-full rounded-full transition-all duration-1000"
                    style={{ width: `${(paidRevenue / totalRevenue) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="pt-6 border-t border-border/50 space-y-4">
                <div className="flex justify-between items-center group/item cursor-pointer">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest group-hover/item:text-foreground transition-colors">Average ACV</p>
                  <p className="text-sm font-black text-foreground">₹{Math.round(totalRevenue / relevantInvoices.length).toLocaleString('en-IN')}</p>
                </div>
                <div className="flex justify-between items-center group/item cursor-pointer">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest group-hover/item:text-foreground transition-colors">Sales Velocity</p>
                  <p className="text-sm font-black text-foreground">High</p>
                </div>
                <div className="flex justify-between items-center group/item cursor-pointer">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest group-hover/item:text-foreground transition-colors">Retention LTV</p>
                  <p className="text-sm font-black text-emerald-500">95% Health</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
