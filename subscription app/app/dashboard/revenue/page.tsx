'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    TrendingUp,
    CreditCard,
    Download,
    Filter,
    ArrowUpRight,
    ArrowDownRight,
    IndianRupee,
    Calendar,
    BarChart3,
    PieChart,
    Layers
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell
} from 'recharts';
import { cn } from '@/lib/utils';

const revenueOverTime = [
    { month: 'Jan', revenue: 4500000, expansion: 200000, churn: 50000 },
    { month: 'Feb', revenue: 5200000, expansion: 400000, churn: 100000 },
    { month: 'Mar', revenue: 4800000, expansion: 300000, churn: 150000 },
    { month: 'Apr', revenue: 6100000, expansion: 800000, churn: 200000 },
    { month: 'May', revenue: 7500000, expansion: 1200000, churn: 100000 },
    { month: 'Jun', revenue: 8900000, expansion: 1500000, churn: 50000 },
];

const revenueByPlan = [
    { name: 'Enterprise', value: 4500000, color: 'hsl(var(--primary))' },
    { name: 'Professional', value: 2800000, color: 'hsl(var(--accent))' },
    { name: 'Basic', value: 1600000, color: 'hsl(var(--muted-foreground))' },
];

export default function GlobalRevenuePage() {
    const [timeframe, setTimeframe] = useState<'monthly' | 'quarterly'>('monthly');

    // Calculate quarterly data from monthly data
    const quarterlyData = [
        { 
            month: 'Q1', 
            revenue: revenueOverTime.slice(0, 3).reduce((acc, curr) => acc + curr.revenue, 0),
            expansion: revenueOverTime.slice(0, 3).reduce((acc, curr) => acc + curr.expansion, 0),
            churn: revenueOverTime.slice(0, 3).reduce((acc, curr) => acc + curr.churn, 0)
        },
        { 
            month: 'Q2', 
            revenue: revenueOverTime.slice(3, 6).reduce((acc, curr) => acc + curr.revenue, 0),
            expansion: revenueOverTime.slice(3, 6).reduce((acc, curr) => acc + curr.expansion, 0),
            churn: revenueOverTime.slice(3, 6).reduce((acc, curr) => acc + curr.churn, 0)
        }
    ];

    const currentData = timeframe === 'monthly' ? revenueOverTime : quarterlyData;
    return (
        <div className="space-y-10 animate-in-up pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black flex items-center gap-3">
                        <IndianRupee className="w-8 h-8 text-primary" /> Global <span className="text-gradient">Revenue Intelligence</span>
                    </h1>
                    <p className="text-muted-foreground font-medium mt-1">Institutional-grade financial analysis and ecosystem value tracking.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-xl h-12 border-border/50 font-bold">
                        <Filter className="w-4 h-4 mr-2" /> Segments
                    </Button>
                    <Button className="rounded-xl h-12 bg-primary text-primary-foreground font-black shadow-lg shadow-primary/20">
                        <Download className="w-4 h-4 mr-2" /> Export Ledger
                    </Button>
                </div>
            </div>

            {/* Core Financial Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Revenue (ARR)', value: '₹12.4Cr', trend: '+18%', icon: CreditCard, color: 'bg-primary/10 text-primary' },
                    { label: 'Net MRR Growth', value: '₹8.9L', trend: '+4.2%', icon: TrendingUp, color: 'bg-emerald-500/10 text-emerald-500' },
                    { label: 'NRR (Retention)', value: '114%', trend: 'Optimal', icon: Layers, color: 'bg-blue-500/10 text-blue-500' },
                    { label: 'Expansion Revenue', value: '₹2.1M', trend: '+22%', icon: ArrowUpRight, color: 'bg-indigo-500/10 text-indigo-500' },
                ].map((stat, i) => (
                    <Card key={i} className="glass-card p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className={cn("p-2 rounded-xl", stat.color)}>
                                <stat.icon className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/5 px-2 py-1 rounded-lg border border-emerald-500/10">
                                {stat.trend}
                            </span>
                        </div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                        <h3 className="text-2xl font-black text-foreground mt-1">{stat.value}</h3>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Revenue Chart */}
                <Card className="lg:col-span-2 glass-card h-[450px] flex flex-col">
                    <div className="p-8 border-b border-border/50 flex justify-between items-center bg-muted/20">
                        <div>
                            <h3 className="text-lg font-bold">Revenue Proliferation</h3>
                            <p className="text-xs text-muted-foreground font-bold uppercase tracking-tighter mt-1">{timeframe === 'monthly' ? 'Monthly' : 'Quarterly'} recurring revenue with expansion attribution</p>
                        </div>
                        <div className="flex gap-2">
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => setTimeframe('monthly')}
                                className={cn(
                                    "h-8 rounded-lg text-[10px] font-black uppercase tracking-tighter transition-all",
                                    timeframe === 'monthly' ? "bg-primary/10 text-primary" : "hover:bg-muted"
                                )}
                            >
                                Monthly
                            </Button>
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => setTimeframe('quarterly')}
                                className={cn(
                                    "h-8 rounded-lg text-[10px] font-black uppercase tracking-tighter transition-all",
                                    timeframe === 'quarterly' ? "bg-primary/10 text-primary" : "hover:bg-muted"
                                )}
                            >
                                Quarterly
                            </Button>
                        </div>
                    </div>
                    <div className="flex-1 p-8">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={currentData}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                                <XAxis
                                    dataKey="month"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fontWeight: 700, fill: 'hsl(var(--muted-foreground))' }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fontWeight: 700, fill: 'hsl(var(--muted-foreground))' }}
                                    tickFormatter={(val) => timeframe === 'monthly' ? `₹${val / 100000}L` : `₹${(val / 10000000).toFixed(1)}Cr`}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '16px', border: '1px solid rgba(0,0,0,0.1)', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                                    formatter={(v: any) => [`₹${v.toLocaleString('en-IN')}`, 'Value']}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" fill="url(#colorRev)" strokeWidth={4} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Contribution by Plan Layer */}
                <Card className="glass-card flex flex-col">
                    <div className="p-8 border-b border-border/50 bg-muted/20">
                        <h3 className="text-lg font-bold">Contribution Layer</h3>
                        <p className="text-xs text-muted-foreground font-bold uppercase tracking-tighter mt-1">Revenue composition by pricing tier</p>
                    </div>
                    <div className="flex-1 p-8 flex flex-col justify-center">
                        <div className="h-48 mb-8">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={revenueByPlan} layout="vertical">
                                    <XAxis type="number" hide />
                                    <YAxis type="category" dataKey="name" hide />
                                    <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                                        {revenueByPlan.map((entry, index) => (
                                            <Cell key={index} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="space-y-4">
                            {revenueByPlan.map((p, i) => (
                                <div key={i} className="flex justify-between items-center group cursor-default">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                                        <span className="text-xs font-bold text-muted-foreground group-hover:text-foreground transition-colors">{p.name}</span>
                                    </div>
                                    <span className="text-xs font-black text-foreground">₹{(p.value / 100000).toFixed(1)}L</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>
            </div>

            {/* Segment Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="glass-card overflow-hidden">
                    <div className="p-8 border-b border-border/50 flex justify-between items-center bg-muted/20">
                        <h3 className="text-lg font-bold">Churn vs Expansion</h3>
                        <Badge variant="outline" className="font-bold text-[10px] tracking-widest text-emerald-500 bg-emerald-500/5">POSITIVE NRR</Badge>
                    </div>
                    <div className="p-8 space-y-6">
                        {[
                            { label: 'Customer Expansion', val: '₹1.2M', desc: 'Upgrades and add-ons', status: 'up' },
                            { label: 'Segment Churn', val: '₹45K', desc: 'Subscription cancellations', status: 'down' },
                            { label: 'Reactivation Revenue', val: '₹120K', desc: 'Returning past partners', status: 'up' },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-muted/10 border border-border/30 hover:bg-muted/30 transition-all group">
                                <div className="flex items-center gap-4">
                                    <div className={cn(
                                        "w-10 h-10 rounded-xl flex items-center justify-center",
                                        item.status === 'up' ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
                                    )}>
                                        {item.status === 'up' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{item.label}</p>
                                        <p className="text-[10px] text-muted-foreground font-medium">{item.desc}</p>
                                    </div>
                                </div>
                                <span className="text-sm font-black text-foreground">{item.val}</span>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card className="glass-card overflow-hidden">
                    <div className="p-8 border-b border-border/50 bg-muted/20">
                        <h3 className="text-lg font-bold">Regional Distribution</h3>
                    </div>
                    <div className="p-8 space-y-6">
                        {[
                            { region: 'South (Karnataka/TN)', percentage: 65, color: 'bg-primary' },
                            { region: 'North (Delhi/NCR)', percentage: 15, color: 'bg-accent' },
                            { region: 'West (Maharashtra)', percentage: 12, color: 'bg-indigo-500' },
                            { region: 'East (Bengal)', percentage: 8, color: 'bg-muted-foreground' },
                        ].map((r, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                                    <span>{r.region}</span>
                                    <span>{r.percentage}%</span>
                                </div>
                                <div className="w-full h-2 bg-muted/40 rounded-full overflow-hidden">
                                    <div className={cn("h-full rounded-full transition-all duration-1000", r.color)} style={{ width: `${r.percentage}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
}
