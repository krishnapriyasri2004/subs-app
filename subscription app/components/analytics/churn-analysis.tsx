'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChurnAnalysis } from '@/types';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { AlertCircle, TrendingDown, Users, LogOut } from 'lucide-react';

interface ChurnAnalysisComponentProps {
  analysis: ChurnAnalysis;
}

export function ChurnAnalysisComponent({ analysis }: ChurnAnalysisComponentProps) {
  const reasonColors = ['#ef4444', '#f97316', '#eab308', '#22c55e'];
  const retentionRate = 1 - analysis.churnRate;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingDown className="w-4 h-4" /> Monthly Churn Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-destructive">{(analysis.churnRate * 100).toFixed(1)}%</p>
            <p className="text-xs text-muted-foreground mt-2">
              {analysis.totalCancelledSubscriptions} subscriptions cancelled
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <LogOut className="w-4 h-4" /> Downgrade Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-yellow-600">{(analysis.downgradeRate * 100).toFixed(1)}%</p>
            <p className="text-xs text-muted-foreground mt-2">
              Customers moving to lower plans
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Users className="w-4 h-4" /> Retention Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-accent">{(retentionRate * 100).toFixed(1)}%</p>
            <p className="text-xs text-muted-foreground mt-2">
              Customers staying subscribed
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Cancellation Reasons</CardTitle>
            <CardDescription>Why customers are leaving</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analysis.topCancellationReasons.map((reason, idx) => {
                const percentage = (reason.count / analysis.totalCancelledSubscriptions) * 100;
                return (
                  <div key={idx}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-muted-foreground">{reason.reason}</span>
                      <Badge variant="outline">{reason.count}</Badge>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="h-2 rounded-full"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: reasonColors[idx % reasonColors.length],
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue at Risk</CardTitle>
            <CardDescription>From cancelled subscriptions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-red-50 dark:bg-red-950 p-4 rounded-lg">
                <p className="text-sm text-red-800 dark:text-red-200 mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" /> Cancelled Revenue
                </p>
                <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                  ₹{analysis.totalCancelledRevenue.toLocaleString('en-IN')}
                </p>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg">
                <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-2">
                  Paused Subscriptions
                </p>
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {(analysis.pauseRate * 100).toFixed(1)}%
                </p>
                <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                  At risk of cancellation
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Churn Prevention Strategies</CardTitle>
          <CardDescription>Recommended actions to reduce churn</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="border rounded-lg p-4 space-y-2">
            <h4 className="font-semibold text-sm">Re-engagement Campaigns</h4>
            <p className="text-sm text-muted-foreground">
              Target customers with downgrade activity with personalized upgrade offers
            </p>
            <Badge variant="outline" className="w-fit">Recommended</Badge>
          </div>

          <div className="border rounded-lg p-4 space-y-2">
            <h4 className="font-semibold text-sm">Win-back Offers</h4>
            <p className="text-sm text-muted-foreground">
              Send special discounts to cancelled customers to encourage reactivation
            </p>
            <Badge variant="outline" className="w-fit">Active</Badge>
          </div>

          <div className="border rounded-lg p-4 space-y-2">
            <h4 className="font-semibold text-sm">Early Warning System</h4>
            <p className="text-sm text-muted-foreground">
              Monitor usage decline and low engagement to identify at-risk customers early
            </p>
            <Badge variant="outline" className="w-fit">Recommended</Badge>
          </div>

          <div className="border rounded-lg p-4 space-y-2">
            <h4 className="font-semibold text-sm">Customer Success Check-ins</h4>
            <p className="text-sm text-muted-foreground">
              Schedule regular check-ins with high-value accounts to ensure satisfaction
            </p>
            <Badge variant="outline" className="w-fit">Not Active</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
