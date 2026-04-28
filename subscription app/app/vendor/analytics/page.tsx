'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, Calendar, Users, DollarSign, Download, ChevronRight } from 'lucide-react';

import { useVendorAuth } from '@/lib/vendor-auth';

export default function AnalyticsPage() {
  const { user } = useVendorAuth();
  const isRiceVendor = user?.businessType === 'rice';
  const isMilkVendor = user?.businessType === 'milk';

  const metrics = [
    {
      title: 'Total Revenue',
      value: '₹48,500',
      change: '+12% vs last month',
      icon: DollarSign,
      color: 'text-green-600',
    },
    {
      title: 'Active Customers',
      value: '24',
      change: '+2 this month',
      icon: Users,
      color: 'text-blue-600',
    },
    {
      title: 'Growth Rate',
      value: '+8%',
      change: 'vs previous 30 days',
      icon: TrendingUp,
      color: 'text-purple-600',
    },
    {
      title: 'Renewal Rate',
      value: '92%',
      change: 'Customers retained',
      icon: Calendar,
      color: 'text-amber-600',
    },
  ];

  const monthlyData = [
    { month: 'Oct', revenue: 38000, customers: 18, subscriptions: 12 },
    { month: 'Nov', revenue: 42000, customers: 22, subscriptions: 15 },
    { month: 'Dec', revenue: 48500, customers: 24, subscriptions: 18 },
  ];

  const milkPlans = [
    { name: 'Daily Milk Delivery', count: 8, revenue: '₹9,600', growth: '+25%' },
    { name: 'Premium Milk Combo', count: 6, revenue: '₹10,800', growth: '+15%' },
  ];

  const ricePlans = [
    { name: 'Weekly Rice Delivery', count: 8, revenue: '₹9,600', growth: '+25%' },
    { name: 'Premium Rice Combo', count: 6, revenue: '₹10,800', growth: '+15%' },
    { name: 'Weekly Rice Supply', count: 4, revenue: '₹3,200', growth: '+10%' },
    { name: 'Organic Rice', count: 3, revenue: '₹9,000', growth: '+5%' },
  ];

  const topPlans = isRiceVendor ? ricePlans : (isMilkVendor ? milkPlans : [...milkPlans, ...ricePlans]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
            <span>Dashboard</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-900">Reports</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Analytics & Reports</h1>
          <p className="text-slate-500 font-bold text-sm">Your subscription business metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-11 rounded-xl border-slate-200 bg-white font-bold text-slate-900 gap-2 px-6 shadow-sm hover:bg-slate-50 transition-all active:scale-[0.98]">
            <Calendar className="w-4 h-4" /> Date Range
          </Button>
          <Button className="h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold gap-2 px-6 shadow-lg shadow-blue-600/20 transition-all active:scale-[0.98]">
            <Download className="w-4 h-4" /> Export All
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index} className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{metric.title}</p>
                  <p className="text-2xl font-bold text-foreground mb-2">{metric.value}</p>
                  <p className={`text-xs font-medium ${metric.color}`}>{metric.change}</p>
                </div>
                <Icon className={`w-8 h-8 ${metric.color} opacity-50`} />
              </div>
            </Card>
          );
        })}
      </div>

      {/* Revenue Trend */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-foreground mb-6">Revenue Trend (Last 3 Months)</h2>
        <div className="space-y-4">
          {monthlyData.map((data) => {
            const maxRevenue = Math.max(...monthlyData.map((d) => d.revenue));
            const percentage = (data.revenue / maxRevenue) * 100;
            return (
              <div key={data.month}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-foreground">{data.month}</span>
                  <div className="text-right">
                    <span className="text-sm font-bold text-foreground">
                      ₹{data.revenue.toLocaleString()}
                    </span>
                    <span className="text-xs text-muted-foreground ml-2">
                      {data.customers} customers
                    </span>
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Top Plans */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-foreground mb-6">Top Subscription Plans</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Plan Name</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Active Count</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Revenue</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Growth</th>
              </tr>
            </thead>
            <tbody>
              {topPlans.map((plan, index) => (
                <tr key={index} className="border-b border-border hover:bg-muted transition">
                  <td className="py-3 px-4 font-medium text-foreground">{plan.name}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-semibold text-xs">
                      {plan.count}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-foreground">{plan.revenue}</td>
                  <td className="py-3 px-4 text-green-600 font-medium">{plan.growth}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold text-foreground mb-4">Customer Lifetime Value</h3>
          <p className="text-3xl font-bold text-foreground mb-2">₹2,020</p>
          <p className="text-xs text-muted-foreground">Average per customer</p>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-foreground mb-4">Monthly Churn</h3>
          <p className="text-3xl font-bold text-red-600 mb-2">8%</p>
          <p className="text-xs text-muted-foreground">2 customers this month</p>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-foreground mb-4">MRR Growth</h3>
          <p className="text-3xl font-bold text-green-600 mb-2">+15%</p>
          <p className="text-xs text-muted-foreground">vs previous month</p>
        </Card>
      </div>
    </div>
  );
}