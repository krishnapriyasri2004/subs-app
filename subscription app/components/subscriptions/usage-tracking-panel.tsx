'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockUsageEvents } from '@/lib/mock-data';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Activity, TrendingUp, AlertTriangle, Zap, Server, Shield, Brain, ArrowUpRight, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export function UsageTrackingPanel() {
  // Aggregate usage data by metric
  const usageByMetric = mockUsageEvents.reduce(
    (acc, event) => {
      if (!acc[event.metricName]) {
        acc[event.metricName] = { name: event.metricName, events: [], total: 0 };
      }
      acc[event.metricName].events.push(event);
      acc[event.metricName].total += event.quantity;
      return acc;
    },
    {} as Record<string, { name: string; events: any[]; total: number }>
  );

  // Chart data for usage over time
  const chartData = mockUsageEvents
    .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
    .reduce((acc, curr) => {
      const timestamp = curr.timestamp.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
      const existing = acc.find((item: any) => item.timestamp === timestamp);
      if (existing) {
        existing[curr.metricName] = (existing[curr.metricName] || 0) + curr.quantity;
      } else {
        acc.push({
          timestamp,
          [curr.metricName]: curr.quantity,
        });
      }
      return acc;
    }, [] as any[]);

  const metrics = Object.values(usageByMetric);
  const limits = {
    'API Calls': 5000,
    'Storage (GB)': 100,
  };

  return (
    <div className="space-y-10 animate-in-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Activity className="w-6 h-6 text-primary" /> Elastic Consumption Metrics
          </h2>
          <p className="text-muted-foreground mt-1">
            Real-time telemetry and metered billing transparency for your cloud resources.
          </p>
        </div>
        <Button variant="outline" className="rounded-xl h-12 border-border/50 font-bold px-6">
          Audit Logs
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {metrics.map((metric, idx) => {
          const limit = limits[metric.name as keyof typeof limits] || 10000;
          const percentage = (metric.total / limit) * 100;
          const isHigh = percentage > 80;

          return (
            <Card key={metric.name} className={cn(
              "glass-card p-6 relative group overflow-hidden transition-all duration-500 hover:scale-[1.02]",
              isHigh && "border-amber-500/20 shadow-lg shadow-amber-500/5"
            )}>
              <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                {metric.name.includes('API') ? <Brain className="w-16 h-16" /> : <Server className="w-16 h-16" />}
              </div>

              <div className="flex justify-between items-start mb-6">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{metric.name}</p>
                  <h3 className="text-3xl font-black text-foreground">{metric.total.toLocaleString()}</h3>
                </div>
                {isHigh && (
                  <div className="p-2 bg-amber-500/10 rounded-xl text-amber-500 animate-pulse">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                )}
              </div>

              <div className="space-y-3 relative z-10">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-tighter">
                  <span className="text-muted-foreground">Threshold: {limit.toLocaleString()}</span>
                  <span className={cn(isHigh ? "text-amber-500" : "text-primary")}>{percentage.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-muted/40 rounded-full h-2.5 p-0.5 border border-border/20 shadow-inner overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-1000 ease-out",
                      percentage > 90 ? "bg-rose-500" : isHigh ? "bg-amber-500" : "bg-primary"
                    )}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
              </div>
            </Card>
          );
        })}

        <Card className="glass-card p-6 border-dashed border-2 flex flex-col items-center justify-center text-center opacity-60 hover:opacity-100 transition-opacity">
          <Zap className="w-8 h-8 text-muted-foreground mb-3" />
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">New Custom Metric</p>
          <p className="text-[10px] text-muted-foreground mt-1">Instrument additional nodes</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="glass-card group">
          <div className="p-8 border-b border-border/50 flex justify-between items-center bg-muted/20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg text-primary"><TrendingUp className="w-4 h-4" /></div>
              <h3 className="text-lg font-bold">Temporal Drift</h3>
            </div>
            <Badge variant="outline" className="rounded-lg h-6 font-bold text-[10px] tracking-widest uppercase">Live 24h</Badge>
          </div>
          <div className="p-8 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                <XAxis
                  dataKey="timestamp"
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
                  contentStyle={{ borderRadius: '16px', border: '1px solid rgba(0,0,0,0.1)', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' }} />
                <Line
                  type="monotone"
                  dataKey="API Calls"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  dot={{ r: 4, fill: 'hsl(var(--primary))', strokeWidth: 2, stroke: 'white' }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
                <Line
                  type="monotone"
                  dataKey="Storage (GB)"
                  stroke="hsl(var(--accent))"
                  strokeWidth={3}
                  dot={{ r: 4, fill: 'hsl(var(--accent))', strokeWidth: 2, stroke: 'white' }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="glass-card">
          <div className="p-8 border-b border-border/50 bg-muted/20">
            <h3 className="text-lg font-bold">Overage Forecasting</h3>
          </div>
          <div className="p-8 space-y-6">
            <div className="p-6 rounded-[1.5rem] bg-rose-500/5 border border-rose-500/10 group hover:bg-rose-500/[0.08] transition-colors">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500"><Zap className="w-5 h-5" /></div>
                  <div>
                    <p className="text-sm font-bold text-foreground">API Overage Estimate</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Base: 1,000 units incl.</p>
                  </div>
                </div>
                <p className="text-lg font-black text-rose-500">₹500.00</p>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-bold italic">
                <Shield className="w-3 h-3" /> Calculated at ₹0.50/unit for 1,000 extra items.
              </div>
            </div>

            <div className="p-6 rounded-[1.5rem] bg-accent/5 border border-accent/10 group hover:bg-accent/[0.08] transition-colors">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent"><Server className="w-5 h-5" /></div>
                  <div>
                    <p className="text-sm font-bold text-foreground">Storage Overage Estimate</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest">₹100.00 / GB / Cycle</p>
                  </div>
                </div>
                <p className="text-lg font-black text-foreground">₹5,000.00</p>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-bold italic">
                <Shield className="w-3 h-3" /> Current usage detected: 50 GB excess.
              </div>
            </div>

            <div className="pt-6 border-t border-border/50 flex flex-col items-center">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-2">Aggregate Estimate</p>
              <div className="flex items-center gap-3">
                <span className="text-4xl font-black text-foreground">₹5,500.00</span>
                <Badge className="bg-primary/20 text-primary border-none rounded-lg text-[10px] font-bold">JULY '24</Badge>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card className="glass-card overflow-hidden">
        <div className="p-8 border-b border-border/50 flex justify-between items-center bg-muted/20">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" /> Event Stream
          </h3>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="h-8 rounded-lg text-[10px] font-bold">GLOBAL</Button>
            <Button variant="secondary" size="sm" className="h-8 rounded-lg text-[10px] font-bold px-4">FILTERS</Button>
          </div>
        </div>
        <div className="divide-y divide-border/30">
          {mockUsageEvents
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
            .slice(0, 8)
            .map((event) => (
              <div key={event.id} className="p-6 hover:bg-muted/30 transition-all flex items-center justify-between group">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    {event.metricName.includes('API') ? <Brain className="w-5 h-5" /> : <Server className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{event.metricName}</h4>
                    <p className="text-[10px] text-muted-foreground font-bold mt-1 uppercase tracking-tighter">
                      Node ID: {event.id.toUpperCase().slice(0, 8)} • {event.timestamp.toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-black text-foreground">{event.quantity.toLocaleString()} units</p>
                    <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Verified Log</p>
                  </div>
                  <div className="w-8 h-8 rounded-lg border border-border/50 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all">
                    <ArrowUpRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-white" />
                  </div>
                </div>
              </div>
            ))}
        </div>
      </Card>
    </div>
  );
}
