'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useData } from '@/lib/data-context';
import { Plus, Edit2, Trash2, Search, Building2, Users, ArrowUpRight, Filter, AlertCircle, RefreshCw, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TenantDialog } from '@/components/dashboard/tenant-dialog';
import { Tenant } from '@/types';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function TenantsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const { mockTenants: tenants, mockBusinessPlans, mockSubscriptionPlans, mockCustomers, addDocument, updateDocument, deleteDocument } = useData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);

  const filteredTenants = tenants.filter(
    (tenant) =>
      tenant.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPlanName = (planId: string) => {
    const plan = [...mockBusinessPlans, ...mockSubscriptionPlans].find((p) => p.id === planId);
    return plan?.name || 'Unknown';
  };

  const handleAddTenant = () => {
    setSelectedTenant(null);
    setIsDialogOpen(true);
  };

  const handleEditTenant = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setIsDialogOpen(true);
  };

  const handleDeleteTenant = async (id: string) => {
    if (confirm('Are you sure you want to decommission this tenant node? This action is irreversible.')) {
      try {
        await deleteDocument('tenants', id);
      } catch (error) {
        console.error("Failed to delete tenant:", error);
      }
    }
  };

  const handleSaveTenant = async (tenantData: any) => {
    try {
      if (selectedTenant) {
        // Update
        await updateDocument('tenants', selectedTenant.id, tenantData);
        toast.success("Partnership details updated successfully.");
      } else {
        // Create
        const newId = `tenant-${Date.now()}`;
        await addDocument('tenants', {
          ...tenantData,
          id: newId,
          orgId: newId,
          tenantId: newId,
          users: [],
          currentUsersCount: 0,
        });
        toast.success("New partnership added successfully.");
      }
    } catch (error) {
      console.error("Failed to save tenant:", error);
      toast.error("Failed to process request.");
    }
  };

  const handleSyncBranding = async () => {
    const loadingToast = toast.loading("Connecting to Live Firestore...");
    console.log("Current Tenants in State:", tenants);
    try {
      let count = 0;
      for (const t of tenants) {
        const tenantName = t.name?.toLowerCase() || '';
        const tenantId = t.id || '';

        // Match PureFlow Dairy (Milk)
        if (tenantName.includes('aavin') ||
          tenantName.includes('techcorp') ||
          tenantId === 'tenant-1' ||
          tenantId.startsWith('tenant-1772')) {
          await updateDocument('tenants', t.id, {
            name: 'PureFlow Dairy',
            email: 'contact@pureflowdairy.com',
            industryType: 'Dairy'
          });
          count++;
        }
        // Match Golden Fields Grains (Rice)
        else if (tenantName.includes('innovate') ||
          tenantName.includes('consulting') ||
          tenantId === 'tenant-2' ||
          tenantId.startsWith('tenant-1774')) {
          await updateDocument('tenants', t.id, {
            name: 'Golden Fields Grains',
            email: 'sales@goldenfieldsgrains.com',
            industryType: 'Agriculture'
          });
          count++;
        }
      }
      toast.dismiss(loadingToast);
      if (count > 0) {
        toast.success(`Successfully rebranded ${count} tenants! Check your Firebase Console now.`);
      } else {
        toast.error("No matching tenants found. Check the browser console for details.");
      }
    } catch (err: any) {
      toast.dismiss(loadingToast);
      toast.error("Branding sync failed: " + err.message);
      console.error("Sync Error:", err);
    }
  };

  const handleHardResetBranding = async () => {
    if (!confirm("This will REMOVE the old tenants and create FRESH ones. This is helpful if the update sync failed. Are you sure?")) return;

    const loadingToast = toast.loading("Cleaning and Rebuilding branding...");
    try {
      // IDs identified as problematic in Firestore
      const idsToDelete = ['tenant-1', 'tenant-2', 'tenant-1772715353347', 'tenant-1774435988199'];
      for (const id of idsToDelete) {
        try {
          await deleteDocument('tenants', id);
          console.log(`Deleted ${id}`);
        } catch (e) {
          console.warn(`Could not delete ${id}, it might not exist.`);
        }
      }

      // Create Fresh "PureFlow Dairy"
      await addDocument('tenants', {
        id: 'tenant-1',
        orgId: 'tenant-1',
        tenantId: 'tenant-1',
        name: 'PureFlow Dairy',
        email: 'contact@pureflowdairy.com',
        industryType: 'Dairy',
        status: 'active',
        subscriptionPlanId: 'plan-pro',
        planTier: 'Growth',
        maxUsers: 25,
        currentUsersCount: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
        users: []
      });

      // Create Fresh "Golden Fields Grains"
      await addDocument('tenants', {
        id: 'tenant-2',
        orgId: 'tenant-2',
        tenantId: 'tenant-2',
        name: 'Golden Fields Grains',
        email: 'sales@goldenfieldsgrains.com',
        industryType: 'Agriculture',
        status: 'active',
        subscriptionPlanId: 'plan-basic',
        planTier: 'Starter',
        maxUsers: 5,
        currentUsersCount: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        users: []
      });

      toast.dismiss(loadingToast);
      toast.success("SUCCESS! System branding has been rebuilt.");
    } catch (err: any) {
      toast.dismiss(loadingToast);
      toast.error("HARD RESET FAILED: " + err.message);
      console.error(err);
    }
  };

  return (
    <div className="space-y-10 pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
            Tenants <span className="text-gradient">Directory</span>
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Manage your partners, monitor their usage, and control access levels.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
          <Button
            variant="outline"
            onClick={handleHardResetBranding}
            className="border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10 text-rose-500 h-12 rounded-xl px-6 gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Force Rebuild
          </Button>
          <Button
            variant="outline"
            onClick={handleSyncBranding}
            className="border-border/50 bg-background/50 backdrop-blur-sm h-12 rounded-xl px-6 gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Sync Branding
          </Button>
          <Button
            onClick={handleAddTenant}
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 rounded-xl px-6 h-12"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Partner
          </Button>
        </div>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-card p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Total Partnerships</p>
            <p className="text-3xl font-bold text-foreground">{tenants.length}</p>
          </div>
          <div className="p-3 bg-primary/10 rounded-2xl">
            <Building2 className="w-6 h-6 text-primary" />
          </div>
        </Card>
        <Card className="glass-card p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Active Accounts</p>
            <p className="text-3xl font-bold text-emerald-500">
              {tenants.filter((t) => t.status === 'active').length}
            </p>
          </div>
          <div className="p-3 bg-emerald-500/10 rounded-2xl">
            <div className="w-6 h-6 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        </Card>
        <Card className="glass-card p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Global Customer Count</p>
            <p className="text-3xl font-bold text-blue-500">
              {mockCustomers.length}
            </p>
          </div>
          <div className="p-3 bg-blue-500/10 rounded-2xl">
            <Users className="w-6 h-6 text-blue-500" />
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by company name or contact email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-14 bg-background/50 backdrop-blur-sm border-border/50 focus:ring-primary/20 rounded-2xl text-lg shadow-sm"
          />
        </div>
        <Button variant="outline" className="h-14 px-6 rounded-2xl border-border/50 bg-background/50 backdrop-blur-sm gap-2">
          <Filter className="w-5 h-5" /> Filters
        </Button>
      </div>

      {/* Tenants Table */}
      <Card className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/30 border-b border-border/50">
                <th className="text-left py-5 px-6 font-bold text-foreground uppercase tracking-wider text-xs">
                  Enterprise
                </th>
                <th className="text-left py-5 px-6 font-bold text-foreground uppercase tracking-wider text-xs">
                  Active Plan
                </th>
                <th className="text-left py-5 px-6 font-bold text-foreground uppercase tracking-wider text-xs">
                  Customers
                </th>
                <th className="text-left py-5 px-6 font-bold text-foreground uppercase tracking-wider text-xs">
                  Status
                </th>
                <th className="text-right py-5 px-6 font-bold text-foreground uppercase tracking-wider text-xs">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredTenants.map((tenant) => (
                <tr
                  key={tenant.id}
                  className="group hover:bg-primary/[0.02] transition-colors"
                >
                  <td className="py-5 px-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold shadow-inner">
                        {tenant.name?.charAt(0) || '?'}
                      </div>
                      <div>
                        <div className="text-foreground font-bold group-hover:text-primary transition-colors">
                          {tenant.name || 'Unnamed Partner'}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {tenant.email || 'No email provided'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-6">
                    <span className="inline-flex items-center px-3 py-1 rounded-lg bg-indigo-500/10 text-indigo-500 text-xs font-bold border border-indigo-500/20">
                      {getPlanName(tenant.subscriptionPlanId || '')}
                    </span>
                  </td>
                  <td className="py-5 px-6">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-primary" />
                      <span className="text-sm font-bold text-foreground">
                        {mockCustomers.filter(c => c.tenantId === tenant.id).length} Customers
                      </span>
                    </div>
                  </td>
                  <td className="py-5 px-6">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${tenant.status === 'active'
                        ? 'bg-emerald-500/10 text-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.1)]'
                        : tenant.status === 'trial'
                          ? 'bg-blue-500/10 text-blue-500'
                          : 'bg-rose-500/10 text-rose-500'
                        }`}
                    >
                      <span className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        tenant.status === 'active' ? "bg-emerald-500 animate-pulse" :
                          tenant.status === 'trial' ? "bg-blue-500" : "bg-rose-500"
                      )} />
                      {tenant.status}
                    </span>
                  </td>
                  <td className="py-5 px-6">
                    <div className="flex gap-2 justify-end transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditTenant(tenant)}
                        className="h-9 w-9 rounded-xl text-primary hover:bg-primary/10"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteTenant(tenant.id)}
                        className="h-9 w-9 rounded-xl text-rose-500 hover:bg-rose-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-xl text-muted-foreground hover:bg-muted"
                        onClick={() => router.push(`/dashboard/customers?tenantId=${tenant.id}`)}
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTenants.length === 0 && (
          <div className="text-center py-24">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-bold text-foreground">No matches found</h3>
            <p className="text-muted-foreground max-w-sm mx-auto">
              We couldn't find any partners matching "{searchTerm}". Try refining your search terms.
            </p>
          </div>
        )}
      </Card>

      <TenantDialog
        tenant={selectedTenant}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleSaveTenant}
      />
    </div>
  );
}