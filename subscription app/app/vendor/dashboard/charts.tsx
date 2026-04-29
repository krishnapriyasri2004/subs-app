'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';

const chartData = [
    { name: 'Jan', mrr: 45000, subs: 200 },
    { name: 'Feb', mrr: 52000, subs: 220 },
    { name: 'Mar', mrr: 48000, subs: 210 },
    { name: 'Apr', mrr: 61000, subs: 280 },
    { name: 'May', mrr: 58000, subs: 260 },
    { name: 'Jun', mrr: 72000, subs: 320 },
    { name: 'Jul', mrr: 75450, subs: 342 },
];

const revenueByPlan = [
    { name: 'Pro Plan', value: 45, color: '#1890ff' },
    { name: 'Basic Plan', value: 35, color: '#722ed1' },
    { name: 'Add-ons', value: 20, color: '#fadb14' },
];

export default function DashboardCharts() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Growth Chart */}
            <Card className="lg:col-span-2 p-8 border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="text-lg font-black text-slate-900 tracking-tight">Revenue & Subscription Growth</h3>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Real-time performance metrics</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">MRR</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Growth</span>
                        </div>
                    </div>
                </div>
                <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorMrr" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#2e5cd5" stopOpacity={0.15} />
                                    <stop offset="95%" stopColor="#2e5cd5" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                            />
                            <Tooltip
                                contentStyle={{
                                    borderRadius: '12px',
                                    border: 'none',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                                    padding: '12px'
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="mrr"
                                stroke="#2e5cd5"
                                fillOpacity={1}
                                fill="url(#colorMrr)"
                                strokeWidth={3}
                            />
                            <Area
                                type="monotone"
                                dataKey="subs"
                                stroke="#10b981"
                                fillOpacity={1}
                                fill="none"
                                strokeWidth={3}
                                strokeDasharray="5 5"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            {/* Revenue Distribution */}
            <Card className="p-8 border-slate-100 shadow-sm">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-8">Revenue by Plan</h3>
                <div className="h-48 w-full relative mb-10">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={revenueByPlan}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={8}
                                dataKey="value"
                            >
                                {revenueByPlan.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Growth</p>
                        <p className="text-2xl font-black text-slate-900">12%</p>
                    </div>
                </div>
                <div className="space-y-4">
                    {revenueByPlan.map((plan, i) => (
                        <div key={i} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: plan.color }} />
                                <span className="text-xs font-bold text-slate-600">{plan.name}</span>
                            </div>
                            <span className="text-xs font-black text-slate-900">{plan.value}%</span>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
}
