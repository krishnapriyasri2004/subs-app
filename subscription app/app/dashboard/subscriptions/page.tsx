'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { mockSubscriptions, mockTenants, mockSubscriptionPlans, mockCustomerSubscriptions, mockCustomers, mockBusinessPlans } from '@/lib/mock-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SubscriptionLifecycleModal } from '@/components/subscriptions/subscription-lifecycle-modal';
import { DunningRecoveryModal } from '@/components/subscriptions/dunning-recovery-modal';
import { UsageTrackingPanel } from '@/components/subscriptions/usage-tracking-panel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Pause, Play, TrendingUp, AlertTriangle, Zap, Calendar, CreditCard, ChevronRight, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SubscriptionsPage() {
  const { user } = useAuth();
  const [selectedSubscription, setSelectedSubscription] = useState<string | null>(null);
  const [lifecycleModalOpen, setLifecycleModalOpen] = useState(false);
  const [dunningModalOpen, setDunningModalOpen] = useState(false);

  const isPlatformAdmin = user?.role === 'admin' || user?.role === 'super_admin';
  const isBusinessOwner = user?.role === 'tenant_owner';
  const isCustomer = user?.role === 'customer' || user?.email === 'customer@user.com';

  if (!isPlatformAdmin && !isBusinessOwner && !isCustomer) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="glass-card border-rose-500/20 max-w-md p-8 text-center animate-in-fade">
          <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center text-rose-500 mx-auto mb-6">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Access Restricted</h2>
          <p className="text-muted-foreground mt-2">
            This module requires business-owner or system-administrator privileges.
          </p>
        </Card>
      </div>
    );
  }

  const subscriptionsToDisplay = isPlatformAdmin
    ? mockSubscriptions
    : isBusinessOwner
      ? mockCustomerSubscriptions.filter(s => s.tenantId === user?.tenantId)
      : mockCustomerSubscriptions.filter(s => s.customerId === 'cust-1'); // Filter for the logged in customer

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'paused':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'dunning':
        return 'bg-rose-500/10 text-rose-500 border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.1)]';
      case 'trial':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'cancelled':
        return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'dunning':
        return <AlertTriangle className="w-3 h-3" />;
      case 'paused':
        return <Pause className="w-3 h-3" />;
      case 'active':
        return <Activity className="w-3 h-3" />;
      default:
        return <Play className="w-3 h-3" />;
    }
  };

  return (
    <div className="space-y-10 pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 animate-in-fade">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
            {isCustomer ? 'My' : 'Contract'} <span className="text-gradient">{isCustomer ? 'Subscriptions' : 'Intelligence'}</span>
          </h1>
          <p className="text-muted-foreground mt-2 text-lg max-w-2xl">
            {isCustomer
              ? 'Manage your active plans, track usage, and view upcoming renewals.'
              : 'Monitor and govern the entire subscription lifecycle, from automated recovery to usage-based scaling.'}
          </p>
        </div>
        {!isCustomer && (
          <div className="flex gap-3">
            <Button variant="outline" className="h-12 rounded-xl border-border/50 hover:bg-muted font-bold px-6">
              Lifecycle Reports
            </Button>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 rounded-xl px-6 h-12">
              <Zap className="w-5 h-5 mr-2" />
              Provision Manual Service
            </Button>
          </div>
        )}
      </div>

      <Tabs defaultValue="subscriptions" className="w-full space-y-8 animate-in-up delay-100">
        <TabsList className="bg-muted/30 p-1 rounded-2xl border border-border/50">
          <TabsTrigger value="subscriptions" className="rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm px-6">Overview</TabsTrigger>
          <TabsTrigger value="lifecycle" className="rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm px-6">Event Streams</TabsTrigger>
          <TabsTrigger value="dunning" className="rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm px-6">Dunning Hub</TabsTrigger>
          <TabsTrigger value="usage" className="rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm px-6">Usage Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="subscriptions" className="space-y-6">
          <div className="grid gap-6">
            {subscriptionsToDisplay.map((subscription, index) => {
              const tenant = isPlatformAdmin
                ? mockTenants.find((t) => t.id === (subscription as any).tenantId)
                : null;

              const customer = !isPlatformAdmin
                ? mockCustomers.find((c) => c.id === (subscription as any).customerId)
                : null;

              const plan = isPlatformAdmin
                ? mockSubscriptionPlans.find((p) => p.id === subscription.planId)
                : mockBusinessPlans.find((p) => p.id === subscription.planId);

              const displayName = isPlatformAdmin ? tenant?.name : customer?.name;

              return (
                <Card key={subscription.id} className={cn(
                  "glass-card border-border/50 hover:border-primary/30 transition-all group overflow-hidden",
                  "animate-in-up",
                  index < 5 ? `delay-${(index + 2) * 100}` : ""
                )}>
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Left: Client Info */}
                      <div className="flex-1 min-w-[300px]">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-xl group-hover:scale-110 transition-transform">
                            {tenant?.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">{displayName}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="rounded-lg text-[10px] uppercase font-bold tracking-wider py-0 px-2">
                                {plan?.name} Tier
                              </Badge>
                              <Badge className={cn("rounded-lg text-[10px] uppercase font-bold tracking-widest py-0 px-2 gap-1.5 border", getStatusColor(subscription.status))}>
                                {getStatusIcon(subscription.status)}
                                {subscription.status}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6 mt-6 pt-6 border-t border-border/50">
                          <div>
                            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter mb-1">Total Valuation</p>
                            <div className="flex items-center gap-1.5 font-bold text-foreground">
                              <CreditCard className="w-4 h-4 text-muted-foreground" />
                              ₹{subscription.totalAmount.toLocaleString()}
                            </div>
                          </div>
                          <div>
                            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter mb-1">Contract Timeline</p>
                            <div className="flex items-center gap-1.5 font-bold text-foreground">
                              <Calendar className="w-4 h-4 text-muted-foreground" />
                              {new Date(subscription.startDate).toLocaleDateString()} <ChevronRight className="w-3 h-3 mx-1 opacity-40" /> {new Date(subscription.endDate).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right: Usage & Health */}
                      <div className="flex-1 flex flex-col justify-center">
                        {subscription.isUsageBased ? (
                          <div className="bg-primary/[0.03] p-6 rounded-[2rem] border border-primary/10">
                            <div className="flex justify-between items-center mb-3">
                              <p className="text-xs font-bold text-foreground flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-primary" /> Elastic Resource Usage
                              </p>
                              <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                                {Math.round(((subscription.currentUsageAmount || 0) / (subscription.usageLimit || 100)) * 100)}% Consumed
                              </span>
                            </div>
                            <div className="w-full bg-background rounded-full h-3 p-0.5 shadow-inner">
                              <div
                                className="bg-gradient-to-r from-primary/50 to-primary h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                                style={{
                                  width: `${((subscription.currentUsageAmount || 0) / (subscription.usageLimit || 100)) * 100}%`,
                                }}
                              ></div>
                            </div>
                            <p className="text-[10px] text-muted-foreground mt-3 font-medium uppercase tracking-widest text-right">
                              {subscription.currentUsageAmount} of {subscription.usageLimit} total units
                            </p>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center h-full text-center border-2 border-dashed border-border/50 rounded-[2rem] p-6">
                            <div>
                              <Zap className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                              <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Fixed Rate Contract</p>
                            </div>
                          </div>
                        )}

                        {subscription.status === 'dunning' && (
                          <div className="mt-4 bg-rose-500/5 border border-rose-500/20 p-4 rounded-2xl flex items-center gap-4 animate-pulse">
                            <div className="p-2 bg-rose-500/10 rounded-xl text-rose-500">
                              <AlertTriangle className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-rose-500 uppercase tracking-widest">Payment Recovery Triggered</p>
                              <p className="text-[10px] text-muted-foreground mt-0.5">Attempt #{subscription.failureCount} failed. Manual review recommended.</p>
                            </div>
                            <Button size="sm" className="ml-auto bg-rose-500 hover:bg-rose-600 text-white border-none rounded-lg h-8">
                              Recover
                            </Button>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-row lg:flex-col gap-2 justify-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-12 w-12 rounded-2xl text-primary hover:bg-primary/10"
                          title="Modify Service"
                          onClick={() => {
                            setSelectedSubscription(subscription.id);
                            setLifecycleModalOpen(true);
                          }}
                        >
                          <Zap className="w-5 h-5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-12 w-12 rounded-2xl text-muted-foreground hover:bg-muted"
                          title="Pause Contract"
                          onClick={() => {
                            setSelectedSubscription(subscription.id);
                            setLifecycleModalOpen(true);
                          }}
                        >
                          <Pause className="w-5 h-5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-12 w-12 rounded-2xl text-muted-foreground hover:bg-muted"
                          title="Contract History"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="lifecycle">
          <Card className="glass-card p-12 text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-6">
              <Activity className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">Real-time Event Streaming</h3>
            <p className="text-muted-foreground max-w-sm mx-auto mt-2">
              Access audit-ready logs for every upgrade, downgrade, and contract transition across your ecosystem.
            </p>
            <Button variant="outline" className="mt-8 rounded-xl h-12 px-8 font-bold border-border/50">Initialize Stream Connection</Button>
          </Card>
        </TabsContent>

        <TabsContent value="dunning">
          <Card className="glass-card p-8 min-h-[400px]">
            <DunningRecoveryModal isOpen={dunningModalOpen} onClose={() => setDunningModalOpen(false)} />
            <div className="text-center py-20">
              <AlertTriangle className="w-16 h-16 text-rose-500/30 mx-auto mb-6" />
              <h3 className="text-xl font-bold text-foreground">Revenue Recovery Control</h3>
              <p className="text-muted-foreground max-w-sm mx-auto mt-2">Configure automated retry logic and custom notification flows for failed transactions.</p>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="usage">
          <UsageTrackingPanel />
        </TabsContent>
      </Tabs>

      <SubscriptionLifecycleModal
        isOpen={lifecycleModalOpen}
        onClose={() => setLifecycleModalOpen(false)}
        subscriptionId={selectedSubscription}
      />
    </div>
  );
}