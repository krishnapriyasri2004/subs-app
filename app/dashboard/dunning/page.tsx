'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    ShieldAlert,
    RefreshCw,
    TrendingUp,
    ArrowUpRight,
    Clock,
    CheckCircle2,
    AlertCircle,
    MailPlus,
    Ban,
    BarChart3,
    Search,
    Filter,
    Activity as HealthIcon,
    ChevronRight,
    Users
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useData } from '@/lib/data-context';
import { toast } from 'sonner';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';

const recoveryMetrics = [
    { name: 'Automatic Retry', value: 45, color: 'hsl(var(--primary))' },
    { name: 'Email Nudge', value: 30, color: 'hsl(var(--accent))' },
    { name: 'Direct Outreach', value: 15, color: 'hsl(var(--indigo-500))' },
    { name: 'Manual Resolved', value: 10, color: 'hsl(var(--emerald-500))' },
];

export default function GlobalDunningOverviewPage() {
    const { mockTenants, mockDunningEvents } = useData();

    const [selectedEscalation, setSelectedEscalation] = useState<any | null>(null);
    const [isEscalationDialogOpen, setIsEscalationDialogOpen] = useState(false);

    const handleGlobalHealth = () => {
        toast.success("Ecosystem Health: OPTIMAL", {
            description: "Success Rate: 94.2% | Recovery Velocity: High | Churn Mitigation: Active",
            icon: <HealthIcon className="w-4 h-4 text-emerald-500" />
        });
    };

    const handleForceBatch = () => {
        toast.promise(
            new Promise(resolve => setTimeout(resolve, 2000)),
            {
                loading: 'Initializing global dunning retry batch...',
                success: 'Retry batch dispatched to 14 active dunning streams.',
                error: 'Failed to dispatch batch',
            }
        );
    };

    const handlePauseSubscription = () => {
        toast.promise(
            new Promise(resolve => setTimeout(resolve, 1500)),
            {
                loading: 'Initiating subscription suspension...',
                success: (data) => `Subscription for Invoice ${selectedEscalation?.invoiceId} has been paused.`,
                error: 'Failed to pause subscription',
            }
        );
        setIsEscalationDialogOpen(false);
    };

    const handleSendLink = () => {
        toast.success("Recovery link dispatched", {
            description: `A secure payment link has been sent to the customer for Invoice ${selectedEscalation?.invoiceId}.`,
        });
    };

    const handleIntervention = (action: string) => {
        toast.success(`${action} Initialized`, {
            description: "Executing automated protocol for dunning stream optimization.",
        });
    };

    const handleViewMatrix = () => {
        toast.info("Escalation Matrix v2.4 Active", {
            description: "Phase 1: Day 1-3 | Phase 2: Day 4-10 | Phase 3: Day 11+",
        });
    };

    return (
        <div className="space-y-10 animate-in-up pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter flex items-center gap-3">
                        <ShieldAlert className="w-8 h-8 text-rose-500" /> Dunning <span className="text-gradient">Recovery Sentinel</span>
                    </h1>
                    <p className="text-muted-foreground font-medium mt-1">Global monitoring of revenue leakage and payment failure mitigation streams.</p>
                </div>
                <div className="flex gap-3">
                    <Button onClick={handleGlobalHealth} variant="outline" className="rounded-xl h-12 border-border/50 font-bold">
                        <HealthIcon className="w-4 h-4 mr-2" /> Global Health
                    </Button>
                    <Button onClick={handleForceBatch} className="rounded-xl h-12 bg-rose-500 text-white hover:bg-rose-600 font-black shadow-lg shadow-rose-500/20">
                        <RefreshCw className="w-4 h-4 mr-2" /> Force Global Batch
                    </Button>
                </div>
            </div>

            {/* Critical Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Active Recoveries', val: '42', icon: ShieldAlert, color: 'text-rose-500', bg: 'bg-rose-500/10' },
                    { label: 'Recovery Value', val: '₹12.8L', icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                    { label: 'Avg. Recover Time', val: '4.2 Days', icon: Clock, color: 'text-primary', bg: 'bg-primary/10' },
                    { label: 'Write-off Risk', val: '₹2.4L', icon: AlertCircle, color: 'text-amber-500', bg: 'bg-amber-500/10' },
                ].map((stat, i) => (
                    <Card key={i} className="glass-card glass-card-hover p-6 border-border/50">
                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-4 shadow-inner", stat.bg, stat.color)}>
                            <stat.icon className="w-5 h-5" />
                        </div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                        <h3 className="text-2xl font-black text-foreground mt-1">{stat.val}</h3>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recovery Success Analysis */}
                <Card className="lg:col-span-2 glass-card flex flex-col">
                    <div className="p-8 border-b border-border/50 bg-muted/20 flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-bold">Recovery Attribution</h3>
                            <p className="text-xs text-muted-foreground font-bold uppercase tracking-tighter mt-1">Efficacy by escalation level and intervention type</p>
                        </div>
                        <Badge variant="outline" className="text-emerald-500 bg-emerald-500/5 font-black text-[10px] tracking-widest px-3 border-emerald-500/20">68% EFFICIENCY</Badge>
                    </div>
                    <div className="flex-1 p-8 h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={recoveryMetrics}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fontWeight: 700, fill: 'hsl(var(--muted-foreground))' }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fontWeight: 700, fill: 'hsl(var(--muted-foreground))' }}
                                />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ borderRadius: '16px', border: '1px solid rgba(0,0,0,0.1)', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                                />
                                <Bar dataKey="value" radius={[12, 12, 0, 0]} barSize={40}>
                                    {recoveryMetrics.map((entry, index) => (
                                        <Cell key={index} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Critical Escalations */}
                <Card className="glass-card flex flex-col">
                    <div className="p-8 border-b border-border/50 bg-muted/20">
                        <h3 className="text-lg font-bold">High Priority Escalations</h3>
                        <p className="text-xs text-muted-foreground font-bold uppercase tracking-tighter mt-1">Accounts approaching suspension threshold</p>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {mockDunningEvents.slice(0, 5).map((event) => {
                            const tenant = mockTenants.find(t => t.id === event.subscriptionId.replace('sub', 'tenant'));// Mock mapping
                            return (
                                <div 
                                    key={event.id} 
                                    onClick={() => {
                                        setSelectedEscalation(event);
                                        setIsEscalationDialogOpen(true);
                                    }}
                                    className="p-6 border-b border-border/20 last:border-none group hover:bg-rose-500/[0.02] transition-colors cursor-pointer"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-500 font-black text-xs">
                                                {event.id.slice(-2).toUpperCase()}
                                            </div>
                                            <span className="text-sm font-bold text-foreground group-hover:text-rose-500 transition-colors">Invoice {event.invoiceId}</span>
                                        </div>
                                        <Badge className="bg-rose-500 text-white rounded-lg px-2 h-5 font-black text-[9px] uppercase tracking-tighter">Level {event.attemptNumber}</Badge>
                                    </div>
                                    <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">Failure: {event.failureReason}</p>
                                    <div className="mt-4 flex justify-between items-center">
                                        <span className="text-[10px] text-muted-foreground font-bold">Retry in 2 Days</span>
                                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-all" />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <Button variant="ghost" onClick={handleViewMatrix} className="m-4 h-12 rounded-xl text-xs font-black uppercase tracking-widest bg-muted/30 hover:bg-rose-500/10 hover:text-rose-500">
                        View Escalation Matrix
                    </Button>
                </Card>
            </div>

            {/* Dunning Lifecycle Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="glass-card p-8">
                    <h3 className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] mb-8">Ecosystem Recovery Stream</h3>
                    <div className="space-y-6">
                        {[
                            { step: 'Phase 1: Initial Notice', rate: 45, color: 'bg-primary' },
                            { step: 'Phase 2: Soft Retry', rate: 25, color: 'bg-accent' },
                            { step: 'Phase 3: Hard Pivot', rate: 15, color: 'bg-indigo-400' },
                            { step: 'Phase 4: Manual Wrap', rate: 10, color: 'bg-emerald-400' },
                            { step: 'Phase 5: Suspension Risk', rate: 5, color: 'bg-rose-400' },
                        ].map((s, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-foreground">
                                    <span>{s.step}</span>
                                    <span>{s.rate}% Vol</span>
                                </div>
                                <div className="w-full h-1.5 bg-muted/40 rounded-full overflow-hidden">
                                    <div className={cn("h-full rounded-full transition-all duration-1000", s.color)} style={{ width: `${s.rate}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card className="glass-card">
                    <div className="p-8 border-b border-border/50 bg-muted/20 flex justify-between items-center">
                        <h3 className="text-lg font-bold">Intervention Governance</h3>
                        <Button 
                            size="icon" 
                            variant="ghost" 
                            onClick={() => toast.info("Search functionality limited to active dunning streams.")}
                            className="h-8 w-8 rounded-lg"
                        >
                            <Search className="w-4 h-4" />
                        </Button>
                    </div>
                    <div className="p-8 space-y-6">
                        {[
                            { action: 'Batch Email Dispatch', status: 'Completed', time: '12m ago', icon: MailPlus },
                            { action: 'Smart Retry Engine v2', status: 'Optimizing', time: '1h ago', icon: RefreshCw },
                            { action: 'Direct Callback Protocol', status: '8 Pending', time: '3h ago', icon: Users },
                            { action: 'Credit Risk Shield', status: 'Active', time: 'Live', icon: ShieldAlert },
                        ].map((a, i) => (
                            <div 
                                key={i} 
                                onClick={() => handleIntervention(a.action)}
                                className="flex gap-4 items-center group cursor-pointer p-2 rounded-xl hover:bg-muted/30 transition-all"
                            >
                                <div className="w-10 h-10 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center text-primary">
                                    <a.icon className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{a.action}</p>
                                    <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">{a.time}</p>
                                </div>
                                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{a.status}</span>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
            {/* Escalation Detail Dialog */}
            <Dialog open={isEscalationDialogOpen} onOpenChange={setIsEscalationDialogOpen}>
                <DialogContent className="glass-card border-border/50 max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black flex items-center gap-3">
                            <ShieldAlert className="w-6 h-6 text-rose-500" /> Escalation Detail
                        </DialogTitle>
                        <DialogDescription className="text-muted-foreground font-medium">
                            Critical recovery protocol internal ledger for Invoice {selectedEscalation?.invoiceId}
                        </DialogDescription>
                    </DialogHeader>

                    {selectedEscalation && (
                        <div className="space-y-6 my-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-2xl bg-muted/30 border border-border/20">
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Current Status</p>
                                    <Badge className="bg-rose-500 text-white font-black text-[10px] px-2 py-0.5 rounded-lg">Level {selectedEscalation.attemptNumber}</Badge>
                                </div>
                                <div className="p-4 rounded-2xl bg-muted/30 border border-border/20">
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Failure Reason</p>
                                    <p className="text-xs font-bold text-foreground">{selectedEscalation.failureReason}</p>
                                </div>
                            </div>

                            <div className="p-6 rounded-2xl bg-rose-500/5 border border-rose-500/10">
                                <h4 className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em] mb-4">Intervention Timeline</h4>
                                <div className="space-y-4">
                                    <div className="flex gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1" />
                                        <div>
                                            <p className="text-xs font-bold">Phase {selectedEscalation.attemptNumber}: Automated Retry</p>
                                            <p className="text-[10px] text-muted-foreground">System attempted recovery. Gateway response: "Declined by Issuer"</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30 mt-1" />
                                        <div>
                                            <p className="text-xs font-bold text-muted-foreground">Next Phase: Professional Outreach</p>
                                            <p className="text-[10px] text-muted-foreground">Scheduled for April 25, 2024</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-primary/5 border border-primary/10">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                    <MailPlus className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-bold">Engagement Predicted</p>
                                    <p className="text-[10px] text-muted-foreground">High probability of recovery via direct SMS link.</p>
                                </div>
                                <Button 
                                    size="sm" 
                                    onClick={handleSendLink}
                                    className="h-8 rounded-lg text-[10px] font-black uppercase bg-primary text-primary-foreground"
                                >
                                    Send Link
                                </Button>
                            </div>
                        </div>
                    )}

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="outline" onClick={() => setIsEscalationDialogOpen(false)} className="rounded-xl font-bold h-11 border-border/50">Dismiss</Button>
                        <Button 
                            onClick={handlePauseSubscription}
                            className="rounded-xl font-black h-11 bg-rose-500 text-white hover:bg-rose-600 shadow-lg shadow-rose-500/20"
                        >
                            Pause Subscription
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
