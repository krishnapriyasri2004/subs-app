'use client';

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
import { mockDunningEvents } from '@/lib/mock-data';
import { AlertCircle, CheckCircle, Clock, MailPlus, ShieldAlert, TrendingUp, Activity, CreditCard, ChevronRight, RefreshCw, Trash2, Ban } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DunningRecoveryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DunningRecoveryModal({ isOpen, onClose }: DunningRecoveryModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl glass-card border-border/50 p-0 overflow-hidden outline-none">
        <div className="bg-gradient-to-br from-rose-500/10 via-transparent to-primary/5 p-8 pb-4">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-rose-500/10 rounded-xl"><ShieldAlert className="w-5 h-5 text-rose-500" /></div>
              <DialogTitle className="text-2xl font-black">Dunning <span className="text-rose-500">Sentinel</span></DialogTitle>
            </div>
            <DialogDescription className="text-muted-foreground font-medium">
              Intelligent payment recovery orchestration and failure mitigation strategies.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar space-y-8 bg-card/50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in-up">
            <Card className="glass-card p-6 border-rose-500/20 bg-rose-500/[0.02]">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Critical Nodes</p>
              <h3 className="text-3xl font-black text-rose-500">2 <span className="text-xs font-medium text-muted-foreground">Active</span></h3>
            </Card>
            <Card className="glass-card p-6">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Exposure Value</p>
              <h3 className="text-3xl font-black text-foreground">₹7,076</h3>
            </Card>
            <Card className="glass-card p-6 border-emerald-500/20 bg-emerald-500/[0.02]">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Recovery Rate</p>
              <h3 className="text-3xl font-black text-emerald-500">65%</h3>
            </Card>
          </div>

          <div className="space-y-4 animate-in-up delay-100">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-[0.2em] flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" /> Lifecycle Strategies
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {[
                { step: 1, name: 'Notice', timing: 'Instant', icon: MailPlus, color: 'text-primary' },
                { step: 2, name: 'Retry 1', timing: 'Day 3', icon: RefreshCw, color: 'text-emerald-500' },
                { step: 3, name: 'Retry 2', timing: 'Day 7', icon: RefreshCw, color: 'text-primary' },
                { step: 4, name: 'Final', timing: 'Day 14', icon: AlertCircle, color: 'text-amber-500' },
                { step: 5, name: 'Suspend', timing: 'Day 21', icon: Ban, color: 'text-rose-500' },
              ].map((strategy) => (
                <div key={strategy.step} className="glass-card p-4 flex flex-col items-center text-center group hover:bg-muted/50 transition-colors cursor-help border-border/30">
                  <div className={cn("w-10 h-10 rounded-xl bg-muted/40 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform", strategy.color)}>
                    <strategy.icon className="w-5 h-5" />
                  </div>
                  <p className="text-[10px] font-black text-foreground uppercase tracking-tighter">{strategy.name}</p>
                  <p className="text-[8px] text-muted-foreground font-bold mt-1">{strategy.timing}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6 animate-in-up delay-200">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-[0.2em] flex items-center gap-2">
              <Activity className="w-4 h-4 text-rose-500" /> Active Recoveries
            </h3>
            {mockDunningEvents.map((event) => (
              <Card key={event.id} className="glass-card overflow-hidden group">
                <div className="p-6 border-b border-border/50 bg-muted/10 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-foreground">Invoice {event.invoiceId}</h4>
                      <p className="text-[10px] text-muted-foreground font-medium">Subscription Ref: {event.subscriptionId.slice(0, 8).toUpperCase()}</p>
                    </div>
                  </div>
                  <Badge className="bg-rose-500/20 text-rose-500 border-none rounded-lg px-4 font-black">Escalation Phase #{event.attemptNumber}</Badge>
                </div>

                <CardContent className="p-6 space-y-6">
                  <div className="grid grid-cols-3 gap-6">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Previous Attempt</p>
                      <p className="text-xs font-black text-foreground">{event.lastAttemptDate.toLocaleDateString('en-GB')}</p>
                    </div>
                    <div className="space-y-1 text-center">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Scheduled Retry</p>
                      <p className="text-xs font-black text-amber-500">{event.nextRetryDate.toLocaleDateString('en-GB')}</p>
                    </div>
                    <div className="space-y-1 text-right">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Rejection ID</p>
                      <p className="text-xs font-black text-foreground">{event.failureReason}</p>
                    </div>
                  </div>

                  <div className="p-6 rounded-[1.5rem] bg-rose-500/[0.02] border border-rose-500/10">
                    <div className="flex items-center gap-3 mb-6">
                      <ShieldAlert className="w-4 h-4 text-rose-500" />
                      <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">Escalation Progress</p>
                    </div>
                    <div className="flex items-center justify-between relative px-2">
                      <div className="absolute top-1/2 left-0 w-full h-0.5 bg-muted/30 -translate-y-1/2 -z-10" />
                      {[1, 2, 3, 4, 5].map((level) => {
                        const isActive = level <= event.attemptNumber;
                        return (
                          <div key={level} className="flex flex-col items-center gap-3">
                            <div className={cn(
                              "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black transition-all",
                              isActive ? "bg-rose-500 text-white scale-125 shadow-lg shadow-rose-500/20" : "bg-muted text-muted-foreground"
                            )}>
                              {isActive ? <CheckCircle className="w-3.5 h-3.5" /> : level}
                            </div>
                            <span className={cn(
                              "text-[8px] font-bold uppercase tracking-tighter whitespace-nowrap",
                              isActive ? "text-rose-500" : "text-muted-foreground"
                            )}>
                              {level === 1 && 'Notice'}
                              {level === 2 && 'Day 3'}
                              {level === 3 && 'Day 7'}
                              {level === 4 && 'Day 14'}
                              {level === 5 && 'Suspension'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button size="sm" variant="outline" className="h-10 rounded-xl px-4 font-bold border-border/50 text-xs gap-2">
                      <MailPlus className="w-4 h-4" /> Send Escalation
                    </Button>
                    <Button size="sm" variant="outline" className="h-10 rounded-xl px-4 font-bold border-border/50 text-xs gap-2">
                      <RefreshCw className="w-4 h-4" /> Force Retry
                    </Button>
                    <Button size="sm" variant="ghost" className="h-10 rounded-xl px-4 font-bold text-rose-500 hover:bg-rose-500/10 text-xs gap-2 ml-auto">
                      <Trash2 className="w-4 h-4" /> Write-off Debt
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="p-8 bg-muted/20 border-t border-border/30 flex justify-end">
          <Button variant="ghost" onClick={onClose} className="rounded-xl h-12 px-8 font-bold text-muted-foreground hover:bg-black/5 hover:text-foreground">
            Exit Sentinel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
