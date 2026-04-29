'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from 'next/link';
import { mockTenants, mockInvoices, mockSubscriptions, mockAuditLogs, mockApprovalHistory } from '@/lib/mock-data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TenantApprovalPanel } from './tenant-approval-panel';
import { TenantDialog } from './tenant-dialog';
import { useState } from 'react';
import { Tenant } from '@/types';
import {
    Plus,
    Building2,
    TrendingUp,
    CreditCard,
    Zap,
    Users,
    AlertCircle,
    Activity,
    Settings,
    FileText,
    BarChart3,
    Search,
    RefreshCw,
    Globe
} from 'lucide-react';
import { cn } from '@/lib/utils';
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

export default function SuperAdminDashboard() {
    // 1. RBAC Guard
    const userRole = 'superadmin';
    if (userRole !== 'superadmin') {
        return (
            <div className="flex items-center justify-center p-8 h-[50vh]">
                <Card className="p-8 text-center max-w-md border-rose-500/20 bg-rose-500/5">
                    <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-foreground mb-2">Access Denied</h2>
                    <p className="text-muted-foreground text-sm">This area is restricted to SuperAdministrators only. Please contact system support if you believe this is an error.</p>
                </Card>
            </div>
        );
    }

    const [tenants, setTenants] = useState<Tenant[]>(mockTenants);
    const [approvalHistory, setApprovalHistory] = useState(mockApprovalHistory);
    const [isTenantDialogOpen, setIsTenantDialogOpen] = useState(false);

    // Audit log filters
    const [auditFilterTenant, setAuditFilterTenant] = useState('All');
    const [auditFilterAction, setAuditFilterAction] = useState('All');

    // 2. Metrics Calculations
    const totalTenants = tenants.length;
    // Calculate global MRR
    const globalMRR = tenants.reduce((acc, t) => {
        const price = t.subscriptionPlanId === 'plan-pro' ? 7999 : (t.subscriptionPlanId === 'plan-enterprise' ? 19999 : 2999);
        return acc + price;
    }, 0);
    const activeSubscriptions = mockSubscriptions.filter(s => s.status === 'active').length;

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const failedPaymentsCount = mockInvoices.filter(inv => inv.status === 'overdue' && new Date(inv.dueDate) >= thirtyDaysAgo).length;

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const newTenantsThisMonth = tenants.filter(t => {
        const d = new Date(t.createdAt);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    }).length;

    const platformChurnRate = "1.2%";

    // Chart Data calculations
    const revenueData = [
        { month: 'Jan', revenue: 1200000 },
        { month: 'Feb', revenue: 1450000 },
        { month: 'Mar', revenue: 1600000 },
        { month: 'Apr', revenue: 1850000 },
        { month: 'May', revenue: 2100000 },
        { month: 'Jun', revenue: 2400000 },
        { month: 'Jul', revenue: 2800000 },
        { month: 'Aug', revenue: 3200000 },
        { month: 'Sep', revenue: 3600000 },
        { month: 'Oct', revenue: 4100000 },
        { month: 'Nov', revenue: 4400000 },
        { month: 'Dec', revenue: 4800000 },
    ];

    const topTenantsData = [...tenants].map(t => {
        const price = t.subscriptionPlanId === 'plan-pro' ? 7999 : (t.subscriptionPlanId === 'plan-enterprise' ? 19999 : 2999);
        return { name: t.name, revenue: price * 12 }; // Annualized for chart
    }).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

    const subscriptionGrowthData = [
        { month: 'Jan', subs: 12 },
        { month: 'Feb', subs: 15 },
        { month: 'Mar', subs: 22 },
        { month: 'Apr', subs: 28 },
        { month: 'May', subs: 35 },
        { month: 'Jun', subs: 45 }
    ];

    // Card component for metrics
    const StatCard = ({ label, value, subValue, icon: Icon, color, delay = "" }: any) => (
        <Card className={cn("glass-card p-6 overflow-hidden relative group hover:scale-[1.02] transition-all duration-500 animate-in-up", delay)}>
            <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                <Icon className="w-16 h-16" />
            </div>
            <div className="flex justify-between items-start mb-4">
                <div className={cn("p-2 rounded-xl", color)}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{label}</p>
            <h3 className="text-2xl font-black text-foreground mt-1">{value}</h3>
            <p className="text-[10px] text-muted-foreground font-medium mt-2 uppercase tracking-tighter">{subValue}</p>
        </Card>
    );

    const toggleTenantStatus = (id: string, status: string) => {
        setTenants(tenants.map(t => t.id === id ? { ...t, status: status === 'active' ? 'suspended' : 'active' } : t));
    };

    const removeTenant = (id: string) => {
        setTenants(tenants.filter(t => t.id !== id));
    };

    const filteredAuditLogs = mockAuditLogs.filter(log => {
        const tMatch = auditFilterTenant === 'All' || log.entity.toLowerCase().includes(auditFilterTenant.toLowerCase());
        const aMatch = auditFilterAction === 'All' || log.action === auditFilterAction;
        return tMatch && aMatch;
    });

    const handleUpdateTenantStatus = (tenantId: string, newStatus: string, notes?: string) => {
        // Update tenant status
        setTenants(tenants.map(t => t.id === tenantId ? { ...t, status: newStatus as Tenant['status'] } : t));

        // Log the action in history
        const tenant = tenants.find(t => t.id === tenantId);
        if (tenant) {
            const newHistoryLog = {
                id: `ah-${Date.now()}`,
                tenantId: tenant.id,
                tenantName: tenant.name,
                action: newStatus,
                actedBy: 'super-admin-user',
                timestamp: new Date(),
                notes: notes || `Changed status to ${newStatus}`
            };
            setApprovalHistory([newHistoryLog, ...approvalHistory]);
        }
    };

    return (
        <div className="space-y-10 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 animate-in-fade">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-[2rem] bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-xl shadow-blue-500/20 group relative overflow-hidden">
                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <Activity className="w-8 h-8 relative z-10" />
                    </div>
                    <div>
                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
                            SuperAdmin <span className="text-gradient">Console</span>
                        </h1>
                        <p className="text-muted-foreground mt-1 text-lg font-medium">
                            Platform-wide governance, unified metrics, and ecosystem control.
                        </p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button onClick={() => setIsTenantDialogOpen(true)} className="rounded-xl h-12 bg-primary text-primary-foreground font-black shadow-xl hover:bg-primary/90">
                        <Plus className="w-4 h-4 mr-2" /> New Tenant
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="dashboard" className="space-y-8">
                <TabsList className="bg-muted/50 p-1 border border-border/50 rounded-2xl">
                    <TabsTrigger value="dashboard" className="rounded-xl px-6 font-bold">Metrics Dashboard</TabsTrigger>
                    <TabsTrigger value="approvals" className="rounded-xl px-6 font-bold flex items-center gap-2">
                        Onboarding Approvals
                        {tenants.filter(t => t.status === 'pending').length > 0 && (
                            <Badge className="bg-amber-500 text-amber-950 font-black px-1.5 py-0 h-4 min-w-4 flex items-center justify-center rounded-full text-[10px]">
                                {tenants.filter(t => t.status === 'pending').length}
                            </Badge>
                        )}
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="dashboard" className="space-y-10 focus-visible:outline-none">
                    {/* 1. PLATFORM METRICS DASHBOARD */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <StatCard label="Total Active Tenants" value={totalTenants} subValue="Enterprise & SMB Nodes" icon={Building2} color="bg-primary/10 text-primary" />
                        <StatCard label="Platform MRR" value={`₹${globalMRR.toLocaleString('en-IN')}`} subValue="Sum of all tenants' revenue" icon={CreditCard} color="bg-emerald-500/10 text-emerald-500" delay="delay-100" />
                        <StatCard label="Total Subscriptions" value={activeSubscriptions} subValue="Active subscriptions across all" icon={Zap} color="bg-amber-500/10 text-amber-500" delay="delay-100" />
                        <StatCard label="Failed Payments" value={failedPaymentsCount} subValue="Last 30 days" icon={AlertCircle} color="bg-rose-500/10 text-rose-500" delay="delay-200" />
                        <StatCard label="New Tenants" value={newTenantsThisMonth} subValue="This month" icon={Users} color="bg-indigo-500/10 text-indigo-500" delay="delay-200" />
                        <StatCard label="Platform Churn Rate" value={platformChurnRate} subValue="Monthly historical average" icon={TrendingUp} color="bg-cyan-500/10 text-cyan-500" delay="delay-300" />
                    </div>

                    {/* 2. TENANTS TABLE */}
                    <Card className="glass-card overflow-hidden">
                        <div className="p-6 border-b border-border/50 bg-muted/20 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Globe className="w-5 h-5 text-primary" />
                                <h3 className="text-lg font-bold">Tenant Directory</h3>
                            </div>
                        </div>
                        <div className="p-0 overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent border-border/50">
                                        <TableHead className="font-bold">Org Name</TableHead>
                                        <TableHead className="font-bold">Industry Type</TableHead>
                                        <TableHead className="font-bold">Plan Tier</TableHead>
                                        <TableHead className="font-bold">Status</TableHead>
                                        <TableHead className="font-bold text-right">Active Subs</TableHead>
                                        <TableHead className="font-bold text-right">Monthly Rev (INR)</TableHead>
                                        <TableHead className="font-bold text-right">Created Date</TableHead>
                                        <TableHead className="font-bold text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {tenants.map((tenant) => {
                                        const rev = tenant.subscriptionPlanId === 'plan-pro' ? 7999 : (tenant.subscriptionPlanId === 'plan-enterprise' ? 19999 : 2999);
                                        const tier = tenant.planTier || (tenant.subscriptionPlanId === 'plan-pro' ? 'Growth' : (tenant.subscriptionPlanId === 'plan-enterprise' ? 'Enterprise' : 'Starter'));
                                        const industry = tenant.industryType || 'N/A';

                                        return (
                                            <TableRow key={tenant.id} className="border-border/50 hover:bg-muted/10">
                                                <TableCell className="font-bold">{tenant.name}</TableCell>
                                                <TableCell className="text-muted-foreground text-xs">{industry}</TableCell>
                                                <TableCell><Badge variant="outline" className="font-bold text-xs">{tier}</Badge></TableCell>
                                                <TableCell>
                                                    <Badge className={tenant.status === 'active' ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20' : 'bg-rose-500/10 text-rose-500 hover:bg-rose-500/20'} variant="outline">
                                                        {tenant.status.toUpperCase()}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right font-medium">
                                                    {mockSubscriptions.filter(s => s.tenantId === tenant.id && s.status === 'active').length}
                                                </TableCell>
                                                <TableCell className="text-right font-bold text-emerald-500">₹{rev.toLocaleString()}</TableCell>
                                                <TableCell className="text-right text-muted-foreground text-sm">{tenant.createdAt.toLocaleDateString()}</TableCell>
                                                <TableCell className="text-right space-x-2">
                                                    <Button variant="ghost" size="sm" className="h-8 text-xs font-bold text-primary hover:text-primary">View</Button>
                                                    <Button onClick={() => toggleTenantStatus(tenant.id, tenant.status)} variant="outline" size="sm" className="h-8 text-xs font-bold border-border/50">
                                                        {tenant.status === 'active' ? 'Suspend' : 'Activate'}
                                                    </Button>
                                                    <Button onClick={() => removeTenant(tenant.id)} variant="ghost" size="sm" className="h-8 text-xs font-bold text-rose-500 hover:text-rose-600 hover:bg-rose-500/10">Delete</Button>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })}
                                    {tenants.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">No tenants found.</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </Card>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* 3. GLOBAL SETTINGS */}
                        <Card className="glass-card flex flex-col">
                            <div className="p-6 border-b border-border/50 bg-muted/20">
                                <h3 className="text-lg font-bold flex items-center gap-2">
                                    <Settings className="w-5 h-5 text-primary" /> Global Settings
                                </h3>
                            </div>
                            <div className="p-6 space-y-6 flex-1">
                                <div className="space-y-5">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Platform GST Rates</label>
                                            <Select defaultValue="18">
                                                <SelectTrigger className="font-bold border-border/50 bg-background/50"><SelectValue placeholder="Select Rate" /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="18">18% (Default)</SelectItem>
                                                    <SelectItem value="12">12%</SelectItem>
                                                    <SelectItem value="5">5%</SelectItem>
                                                    <SelectItem value="0">0%</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Default Currency</label>
                                            <Select defaultValue="inr">
                                                <SelectTrigger className="font-bold border-border/50 bg-background/50"><SelectValue placeholder="Select Currency" /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="inr">INR (₹)</SelectItem>
                                                    <SelectItem value="usd">USD ($)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Fiscal Year</label>
                                        <Select defaultValue="apr-mar">
                                            <SelectTrigger className="font-bold border-border/50 bg-background/50"><SelectValue placeholder="Select Period" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="apr-mar">April - March (India)</SelectItem>
                                                <SelectItem value="jan-dec">January - December</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="pt-5 border-t border-border/50 space-y-4">
                                        <h4 className="text-sm font-bold flex items-center gap-2 text-foreground"><CreditCard className="w-4 h-4 text-emerald-500" /> Razorpay Master Configuration</h4>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Platform Key ID</label>
                                            <Input type="text" placeholder="rzp_live_..." className="font-mono text-sm border-border/50 bg-background/50" defaultValue="rzp_live_8xJk9lO2PqQ1w" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Platform Key Secret</label>
                                            <Input type="password" placeholder="••••••••••••" className="font-mono text-sm border-border/50 bg-background/50" defaultValue="dummy_secret_key" />
                                        </div>
                                        <Button className="w-full font-bold h-10 mt-2">Save Keys</Button>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* 4. AUDIT LOGS */}
                        <Card className="glass-card flex flex-col">
                            <div className="p-6 border-b border-border/50 bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <h3 className="text-lg font-bold flex items-center gap-2 whitespace-nowrap">
                                    <FileText className="w-5 h-5 text-primary" /> Audit Logs
                                </h3>
                                <div className="flex gap-2">
                                    <Select value={auditFilterAction} onValueChange={setAuditFilterAction}>
                                        <SelectTrigger className="h-9 w-[150px] text-xs font-bold border-border/50 bg-background/50">
                                            <SelectValue placeholder="Action" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="All">All Actions</SelectItem>
                                            <SelectItem value="tenant.created">tenant.created</SelectItem>
                                            <SelectItem value="plan.updated">plan.updated</SelectItem>
                                            <SelectItem value="tenant.suspended">tenant.suspended</SelectItem>
                                            <SelectItem value="invoice.paid">invoice.paid</SelectItem>
                                            <SelectItem value="subscription.upgraded">sub.upgraded</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <div className="relative">
                                        <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
                                        <Input
                                            className="h-9 w-[160px] pl-9 text-xs font-medium border-border/50 bg-background/50"
                                            placeholder="Filter by entity..."
                                            value={auditFilterTenant === 'All' ? '' : auditFilterTenant}
                                            onChange={(e) => setAuditFilterTenant(e.target.value || 'All')}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="p-0 overflow-x-auto flex-1">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="hover:bg-transparent border-border/50">
                                            <TableHead className="font-bold text-xs h-10">User ID</TableHead>
                                            <TableHead className="font-bold text-xs h-10">Action</TableHead>
                                            <TableHead className="font-bold text-xs h-10">Entity</TableHead>
                                            <TableHead className="font-bold text-xs h-10">Time</TableHead>
                                            <TableHead className="font-bold text-xs h-10 text-right">IP Address</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredAuditLogs.length > 0 ? filteredAuditLogs.map(log => (
                                            <TableRow key={log.id} className="border-border/50 text-xs hover:bg-muted/10">
                                                <TableCell className="font-medium text-foreground py-3">{log.user_id}</TableCell>
                                                <TableCell className="font-mono text-muted-foreground">{log.action}</TableCell>
                                                <TableCell className="font-bold text-foreground">{log.entity}</TableCell>
                                                <TableCell className="text-muted-foreground whitespace-nowrap">{log.timestamp.toLocaleDateString()} {log.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</TableCell>
                                                <TableCell className="text-muted-foreground font-mono text-right">{log.ip_address}</TableCell>
                                            </TableRow>
                                        )) : (
                                            <TableRow>
                                                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground text-sm">No audit logs found.</TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </Card>
                    </div>

                    {/* 5. PLATFORM REPORTS */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                        {/* Revenue Chart (12 months) */}
                        <Card className="glass-card xl:col-span-2">
                            <div className="p-6 border-b border-border/50 bg-muted/20 flex justify-between items-center">
                                <div>
                                    <h3 className="text-lg font-bold flex items-center gap-2">
                                        <BarChart3 className="w-5 h-5 text-primary" /> Platform Revenue
                                    </h3>
                                    <p className="text-xs text-muted-foreground font-bold mt-1 tracking-widest uppercase">Last 12 Months Trajectory</p>
                                </div>
                                <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5 font-bold tracking-widest text-[10px]">LIVE DATA</Badge>
                            </div>
                            <div className="p-6 h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={revenueData}>
                                        <defs>
                                            <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: 'hsl(var(--muted-foreground))' }} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: 'hsl(var(--muted-foreground))' }} tickFormatter={(val) => `₹${val / 100000}L`} dx={-10} />
                                        <Tooltip formatter={(val: any) => [`₹${val.toLocaleString()}`, 'Revenue']} contentStyle={{ borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                                        <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorRev)" strokeWidth={3} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>

                        {/* Top Tenants & Growth */}
                        <div className="space-y-8 flex flex-col h-full">
                            <Card className="glass-card flex-1 min-h-[220px]">
                                <div className="p-6 border-b border-border/50 bg-muted/20 pb-4">
                                    <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-1">Top 5 Tenants</h3>
                                    <p className="font-black text-foreground">By Annualized Revenue</p>
                                </div>
                                <div className="p-4 h-[calc(100%-80px)]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={topTenantsData} layout="vertical" margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                                            <XAxis type="number" hide />
                                            <YAxis dataKey="name" type="category" width={110} tick={{ fontSize: 10, fontWeight: 700, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                                            <Tooltip formatter={(val: any) => [`₹${val.toLocaleString()}`, 'ARR']} cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', fontSize: '12px', border: '1px solid rgba(0,0,0,0.1)' }} />
                                            <Bar dataKey="revenue" radius={[0, 4, 4, 0]} barSize={20}>
                                                {topTenantsData.map((_, index) => (
                                                    <Cell key={`cell-${index}`} fill={index === 0 ? "hsl(var(--primary))" : "hsl(var(--primary) / 0.4)"} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </Card>

                            <Card className="glass-card flex-1 min-h-[220px]">
                                <div className="p-6 border-b border-border/50 bg-muted/20 pb-4">
                                    <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-1">Subscription Trend</h3>
                                    <p className="font-black text-foreground">Growth over 6 months</p>
                                </div>
                                <div className="p-4 h-[calc(100%-80px)] pt-6">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={subscriptionGrowthData} margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="colorSubs" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="hsl(var(--emerald))" stopOpacity={0.2} />
                                                    <stop offset="95%" stopColor="hsl(var(--emerald))" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <XAxis dataKey="month" hide />
                                            <YAxis hide />
                                            <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px', border: '1px solid rgba(0,0,0,0.1)' }} />
                                            <Area type="monotone" dataKey="subs" stroke="hsl(var(--emerald))" fillOpacity={1} fill="url(#colorSubs)" strokeWidth={3} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="approvals" className="focus-visible:outline-none">
                    <TenantApprovalPanel
                        tenants={tenants}
                        onUpdateTenantStatus={handleUpdateTenantStatus}
                        approvalHistory={approvalHistory}
                    />
                </TabsContent>
            </Tabs>

            <TenantDialog
                open={isTenantDialogOpen}
                onOpenChange={setIsTenantDialogOpen}
                onSave={(data) => {
                    const newTenant = {
                        id: `t-${Date.now()}`,
                        ...data,
                        users: [],
                        currentUsersCount: 0,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        status: 'active'
                    } as Tenant;
                    setTenants([newTenant, ...tenants]);
                }}
            />
        </div>
    );
}
