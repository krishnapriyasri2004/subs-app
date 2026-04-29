'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockSubscriptions, mockSubscriptionPlans } from '@/lib/mock-data';
import { AlertCircle, TrendingUp, TrendingDown, Pause, Play, Activity, Calendar, ShieldCheck, ChevronRight, Sparkles, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SubscriptionLifecycleModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscriptionId: string | null;
}

export function SubscriptionLifecycleModal({
  isOpen,
  onClose,
  subscriptionId,
}: SubscriptionLifecycleModalProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const subscription = mockSubscriptions.find((s) => s.id === subscriptionId);

  if (!subscription) return null;

  const currentPlan = mockSubscriptionPlans.find((p) => p.id === subscription.planId);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl glass-card border-border/50 p-0 overflow-hidden outline-none">
        <div className="bg-gradient-to-br from-primary/10 via-transparent to-accent/5 p-8 pb-4">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/10 rounded-xl"><Activity className="w-5 h-5 text-primary" /></div>
              <DialogTitle className="text-2xl font-black">Lifecycle <span className="text-gradient">Orchestrator</span></DialogTitle>
            </div>
            <DialogDescription className="text-muted-foreground font-medium">
              Manage transitions, escalations, and persistence states for the customer subscription node.
            </DialogDescription>
          </DialogHeader>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <div className="px-8 border-b border-border/30 bg-muted/20">
            <TabsList className="bg-transparent h-14 w-full justify-start gap-8 p-0">
              {[
                { id: 'overview', label: 'Telemetry', icon: Activity },
                { id: 'upgrade', label: 'Escalate', icon: TrendingUp },
                { id: 'downgrade', label: 'De-escalate', icon: TrendingDown },
                { id: 'pause', label: 'Interrupt', icon: Pause },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="h-14 border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none px-0 font-bold text-xs uppercase tracking-widest gap-2"
                >
                  <tab.icon className="w-3.5 h-3.5" />
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <div className="p-8 max-h-[60vh] overflow-y-auto custom-scrollbar bg-card/50">
            <TabsContent value="overview" className="mt-0 space-y-6 animate-in-fade">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="glass-card p-6 border-primary/20 bg-primary/[0.02] shadow-inner">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-4">Active Protocol</p>
                  <h3 className="text-2xl font-black text-foreground mb-1">{currentPlan?.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-primary">₹{currentPlan?.price.toLocaleString('en-IN')}</span>
                    <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">/ Billing Cycle</span>
                  </div>
                </Card>

                <Card className="glass-card p-6 bg-muted/30">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-4">State Signature</p>
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-3 h-3 rounded-full animate-pulse",
                      subscription.status === 'active' ? "bg-emerald-500" : "bg-amber-500"
                    )} />
                    <span className="text-xl font-black text-foreground uppercase tracking-widest">{subscription.status}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground font-bold mt-4">Verified by Auth-Service Tier 1</p>
                </Card>
              </div>

              <Card className="glass-card overflow-hidden">
                <div className="p-6 border-b border-border/50 bg-muted/10">
                  <h4 className="text-sm font-bold text-foreground uppercase tracking-[0.1em]">Economic footprint</h4>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-center group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500"><TrendingUp className="w-4 h-4" /></div>
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-tighter">Annualized Value</span>
                    </div>
                    <span className="text-sm font-black text-foreground">₹{((currentPlan?.price || 0) * 12).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary"><Calendar className="w-4 h-4" /></div>
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-tighter">Next Cycle Onset</span>
                    </div>
                    <span className="text-sm font-black text-foreground">{subscription.endDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="upgrade" className="mt-0 space-y-6 animate-in-up">
              <div className="space-y-4">
                {mockSubscriptionPlans
                  .filter((p) => (currentPlan?.price || 0) < p.price)
                  .map((plan) => (
                    <Card
                      key={plan.id}
                      className="glass-card p-6 cursor-pointer hover:border-primary/50 hover:bg-primary/[0.03] transition-all group relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
                        <Sparkles className="w-16 h-16" />
                      </div>
                      <div className="flex justify-between items-start relative z-10">
                        <div className="space-y-1">
                          <h3 className="text-lg font-black text-foreground group-hover:text-primary transition-colors">{plan.name}</h3>
                          <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">{plan.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-black text-foreground">₹{plan.price.toLocaleString('en-IN')}</p>
                          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">Per Cycle</p>
                        </div>
                      </div>

                      <div className="mt-6 pt-6 border-t border-border/30 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-emerald-500" />
                          <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">+₹{(plan.price - (currentPlan?.price || 0)).toLocaleString('en-IN')} Delta</p>
                        </div>
                        <Button size="sm" className="rounded-lg h-9 bg-primary px-6 font-bold shadow-lg shadow-primary/20">Select Tier</Button>
                      </div>
                    </Card>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="downgrade" className="mt-0 space-y-6 animate-in-up">
              <div className="p-6 rounded-[1.5rem] bg-rose-500/[0.03] border border-rose-500/10 flex gap-4">
                <div className="w-10 h-10 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500 shrink-0"><AlertCircle className="w-5 h-5" /></div>
                <div>
                  <p className="text-sm font-bold text-rose-500 mb-1">Impact Analysis</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">De-escalating the subscription tier will deprecate specialized compute nodes and premium feature access at the conclusion of the current cycle.</p>
                </div>
              </div>

              <div className="space-y-4">
                {mockSubscriptionPlans
                  .filter((p) => (currentPlan?.price || 0) > p.price)
                  .map((plan) => (
                    <Card
                      key={plan.id}
                      className="glass-card p-6 cursor-pointer hover:border-amber-500/50 hover:bg-amber-500/[0.03] transition-all group"
                    >
                      <div className="flex justify-between items-start mb-6">
                        <div className="space-y-1">
                          <h3 className="text-lg font-black text-foreground group-hover:text-amber-500 transition-colors">{plan.name}</h3>
                          <p className="text-xs text-muted-foreground leading-relaxed">{plan.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-black text-foreground">₹{plan.price.toLocaleString('en-IN')}</p>
                          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">Per Cycle</p>
                        </div>
                      </div>
                      <div className="pt-6 border-t border-border/30 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-primary" />
                          <p className="text-[10px] font-bold text-primary uppercase tracking-widest">-₹{((currentPlan?.price || 0) - plan.price).toLocaleString('en-IN')} Delta</p>
                        </div>
                        <Button variant="outline" size="sm" className="rounded-lg h-9 border-border/50 font-bold px-6">De-escalate</Button>
                      </div>
                    </Card>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="pause" className="mt-0 space-y-6 animate-in-up">
              {subscription.status !== 'paused' ? (
                <div className="space-y-6">
                  <div className="p-8 rounded-[2rem] bg-amber-500/5 border border-amber-500/10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 -rotate-12 group-hover:rotate-0 transition-transform">
                      <Zap className="w-20 h-20 text-amber-500" />
                    </div>
                    <h3 className="text-lg font-black text-amber-500 mb-2 relative z-10">Suspend Operations</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed max-w-sm relative z-10">
                      This will halt all provisioned cloud resources associated with this node. Invoices will cease generation until manual resumption.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1 flex items-center gap-2">
                      <ShieldCheck className="w-3 h-3" /> Suspension Justification (Required)
                    </label>
                    <textarea
                      className="w-full p-4 bg-muted/30 border border-border/50 rounded-[1.5rem] text-sm focus:ring-amber-500/20 focus:border-amber-500"
                      placeholder="Specify the reason for operational interruption..."
                      rows={4}
                    />
                  </div>
                </div>
              ) : (
                <Card className="glass-card p-10 text-center space-y-6 animate-in-up">
                  <div className="w-20 h-20 bg-emerald-500/10 rounded-[2.5rem] flex items-center justify-center text-emerald-500 mx-auto">
                    <Play className="w-10 h-10 fill-current" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-foreground">Resume Continuity</h3>
                    <p className="text-xs text-muted-foreground mt-2 font-bold uppercase tracking-tighter">Halted on {subscription.pausedAt?.toLocaleDateString('en-GB')}</p>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
                    Immediate re-synchronization of API endpoints and compute clusters will be initiated upon commitment.
                  </p>
                </Card>
              )}
            </TabsContent>
          </div>
        </Tabs>

        <div className="p-8 bg-muted/20 border-t border-border/30">
          <DialogFooter className="gap-3">
            <Button variant="ghost" onClick={onClose} className="rounded-xl h-12 px-8 font-bold text-muted-foreground hover:bg-black/5 hover:text-foreground">
              Abort Lifecycle Action
            </Button>
            <Button className="rounded-xl h-12 px-10 bg-primary hover:bg-primary/90 text-primary-foreground font-black shadow-lg shadow-primary/20 flex items-center gap-2">
              Commit Action <ChevronRight className="w-4 h-4" />
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
