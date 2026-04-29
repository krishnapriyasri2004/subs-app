'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useData } from '@/lib/data-context';
import { Plus, Edit2, Trash2, Check, Zap, Layers, Sparkles, Building, MousePointer2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PlanDialog } from '@/components/dashboard/plan-dialog';
import { Plan } from '@/types';
import { useAuth } from '@/lib/auth-context';
import { toast } from 'sonner';

export default function PlansPage() {
  const { user } = useAuth();
  const { mockBusinessPlans: plans, addDocument, updateDocument, deleteDocument } = useData();
  const isPlatformAdmin = user?.role === 'admin' || user?.role === 'super_admin';
  const isCustomer = user?.role === 'customer' || user?.email === 'customer@user.com';
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  const handleCreatePlan = () => {
    setSelectedPlan(null);
    setIsDialogOpen(true);
  };

  const handleEditPlan = (plan: Plan) => {
    setSelectedPlan(plan);
    setIsDialogOpen(true);
  };

  const handleDeletePlan = async (id: string) => {
    if (confirm('Are you sure you want to retire this subscription tier? Existing accounts will retain their current terms until manual migration.')) {
      try {
        await deleteDocument('plans', id);
        toast.success("Subscription tier retired.");
      } catch (error) {
        console.error("Failed to delete plan:", error);
        toast.error("Failed to process request.");
      }
    }
  };

  const handleSavePlan = async (planData: any) => {
    try {
      if (selectedPlan) {
        // Update
        await updateDocument('plans', selectedPlan.id, planData);
        toast.success("Subscription tier updated successfully.");
      } else {
        // Create
        const newId = `plan-${Date.now()}`;
        await addDocument('plans', {
          ...planData,
          id: newId,
          orgId: user?.tenantId || null,
          category: user?.businessType || 'general',
          status: 'active'
        });
        toast.success("New subscription tier created successfully.");
      }
    } catch (error) {
      console.error("Failed to save plan:", error);
      toast.error("Failed to process request.");
    }
  };

  return (
    <div className="space-y-10 pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
            Subscription <span className="text-gradient">Architect</span>
          </h1>
          <p className="text-muted-foreground mt-2 text-lg max-w-2xl">
            Design and deploy tiered service architectures. Manage pricing models, feature sets, and resource allocations for your partners.
          </p>
        </div>
        {!isCustomer && (
          <Button
            onClick={handleCreatePlan}
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 rounded-xl px-6 h-12"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create New Tier
          </Button>
        )}
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {plans.filter(plan => {
          if (!isCustomer) return true;

          const businessType = user?.businessType?.toLowerCase();
          const category = (plan.category || '').toLowerCase();
          const name = (plan.name || '').toLowerCase();

          // Map customer preference to canonical category
          const getPreferred = (t: string | undefined) => {
            if (!t) return null;
            const low = t.toLowerCase();
            if (low === 'milk' || low === 'dairy') return 'dairy';
            if (low === 'rice' || low === 'grains') return 'grains';
            if (low === 'gym' || low === 'fitness') return 'gym';
            return low;
          };

          const pref = getPreferred(businessType);

          if (pref) {
            // Return true if category matches, plan name contains the type, or it's a known synonym
            return category.includes(pref) ||
              name.includes(pref) ||
              (pref === 'gym' && (category.includes('fitness') || name.includes('fitness'))) ||
              (pref === 'dairy' && (category.includes('milk') || name.includes('milk'))) ||
              (pref === 'grains' && (category.includes('rice') || name.includes('rice')));
          }

          return true;
        }).map((plan, index) => (
          <Card key={plan.id} className={cn(
            "relative group flex flex-col p-8 glass-card border-2 transition-all duration-500 overflow-hidden",
            plan.name.toLowerCase().includes('pro') ? "border-primary/30" : "border-border/50",
            index < 6 ? "animate-in-up" : "" // Only animate initial grid
          )}>
            {plan.name.toLowerCase().includes('pro') && (
              <div className="absolute top-0 right-0">
                <div className="bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest py-1 px-4 transform rotate-45 translate-x-3 translate-y-3 shadow-lg">
                  Popular
                </div>
              </div>
            )}

            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                  {plan.name.toLowerCase().includes('enterprise') ? <Building className="w-6 h-6" /> : index === 0 ? <Zap className="w-6 h-6" /> : <Layers className="w-6 h-6" />}
                </div>
                <h3 className="text-2xl font-bold text-foreground">
                  {plan.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-1 min-h-[32px]">
                  {plan.description}
                </p>
              </div>
            </div>

            {/* Price section */}
            <div className="mb-8 p-4 rounded-2xl bg-primary/[0.03] border border-primary/10 group-hover:bg-primary/[0.05] transition-colors">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-foreground">
                  ₹{plan.price.toLocaleString('en-IN')}
                </span>
                <span className="text-sm text-muted-foreground font-medium uppercase tracking-wider">
                  / {plan.interval}
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">Billed {plan.interval === 'monthly' ? 'monthly' : 'annually'}</p>
            </div>

            {/* Quotas & Limits Note */}
            <div className="space-y-3 mb-8 pt-6 border-t border-border/50">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Configuration:</p>
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">Unit</span>
                <span className="font-bold text-foreground bg-muted px-2 py-0.5 rounded capitalize">{plan.unitName}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">Setup Fee</span>
                <span className="font-bold text-foreground bg-muted px-2 py-0.5 rounded">₹{plan.setupFee?.toLocaleString() || 0}</span>
              </div>
            </div>

            {/* Features List */}
            <div className="flex-1 space-y-4 mb-8">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">What's included:</p>
              {plan.features?.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-3 group/feature">
                  <div className="mt-1 w-4 h-4 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover/feature:bg-emerald-500 group-hover/feature:text-white transition-all">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                  <span className="text-sm text-foreground/80 group-hover/feature:text-foreground transition-colors">{feature}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-auto">
              {isCustomer ? (
                <Button
                  className="flex-1 h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/20"
                >
                  View Plan Details
                </Button>
              ) : (
                <>
                  <Button
                    onClick={() => handleEditPlan(plan)}
                    className="flex-1 h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/20"
                  >
                    Manage Details
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDeletePlan(plan.id)}
                    className="h-12 w-12 rounded-xl border-border/50 hover:bg-rose-500/10 hover:text-rose-500 hover:border-rose-500/20 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>
          </Card>
        ))}

        {/* Ad-hoc Creation Card */}
        {!isCustomer && (
          <button
            onClick={handleCreatePlan}
            className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-border/50 rounded-[2rem] bg-muted/20 hover:bg-muted/30 hover:border-primary/30 transition-all group animate-in-up delay-300"
          >
            <div className="w-16 h-16 rounded-full bg-background border-2 border-border/50 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-primary/10 group-hover:border-primary/20 transition-all">
              <Plus className="w-8 h-8 text-muted-foreground group-hover:text-primary" />
            </div>
            <span className="text-lg font-bold text-muted-foreground group-hover:text-primary transition-colors">Custom Service Tier</span>
            <p className="text-xs text-muted-foreground/60 mt-2 text-center max-w-[200px]">Define a custom plan with bespoke quotas for specific enterprise partners.</p>
          </button>
        )}
      </div>

      {/* Infrastructure Advisory */}
      {!isCustomer && (
        <Card className="glass-card p-8 border-primary/20 bg-primary/[0.02] flex flex-col md:flex-row gap-6 items-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <Sparkles className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground mb-1">
              Subscription Governance
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Identity seat limits and record quotas are enforced at the API layer. Modifying these plans will impact newly created accounts immediately. For upgrading existing partners, use the <span className="text-primary font-bold">Migration Tool</span> in the Enterprise panel.
            </p>
          </div>
          <Button variant="ghost" className="text-primary font-bold shrink-0 gap-2 hover:bg-primary/10 rounded-xl px-6 h-12 ml-auto">
            View Audit Logs <MousePointer2 className="w-4 h-4" />
          </Button>
        </Card>
      )}

      <PlanDialog
        plan={selectedPlan}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleSavePlan}
      />
    </div>
  );
}