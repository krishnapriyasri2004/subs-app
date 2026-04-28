'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { mockTenants, mockSubscriptionPlans } from '@/lib/mock-data';
import { Plus, Edit2, Trash2, Search, Building2, Users, ArrowUpRight, Filter, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TenantDialog } from '@/components/dashboard/tenant-dialog';
import { Tenant } from '@/types';

export default function TenantsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [tenants, setTenants] = useState<Tenant[]>(mockTenants);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);

  const filteredTenants = tenants.filter(
    (tenant) =>
      tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPlanName = (planId: string) => {
    return mockSubscriptionPlans.find((p) => p.id === planId)?.name || 'Unknown';
  };

  const handleAddTenant = () => {
    setSelectedTenant(null);
    setIsDialogOpen(true);
  };

  const handleEditTenant = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setIsDialogOpen(true);
  };

  const handleDeleteTenant = (id: string) => {
    if (confirm('Are you sure you want to decommission this tenant node? This action is irreversible.')) {
      setTenants(tenants.filter(t => t.id !== id));
    }
  };

  const handleSaveTenant = (tenantData: any) => {
    if (selectedTenant) {
      // Update
      setTenants(tenants.map(t => t.id === selectedTenant.id ? { ...t, ...tenantData } : t));
    } else {
      // Create
      const newTenant: Tenant = {
        id: `tenant-${Date.now()}`,
        ...tenantData,
        users: [],
        currentUsersCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Tenant;
      setTenants([newTenant, ...tenants]);
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
        <Button
          onClick={handleAddTenant}
          className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 rounded-xl px-6 h-12"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add New Partner
        </Button>
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
            <p className="text-sm font-medium text-muted-foreground mb-1">Global User Count</p>
            <p className="text-3xl font-bold text-blue-500">
              {tenants.reduce((sum, t) => sum + t.currentUsersCount, 0)}
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
                  Usage
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
                        {tenant.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-foreground font-bold group-hover:text-primary transition-colors">
                          {tenant.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {tenant.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-6">
                    <span className="inline-flex items-center px-3 py-1 rounded-lg bg-indigo-500/10 text-indigo-500 text-xs font-bold border border-indigo-500/20">
                      {getPlanName(tenant.subscriptionPlanId)}
                    </span>
                  </td>
                  <td className="py-5 px-6">
                    <div className="space-y-1.5 min-w-[120px]">
                      <div className="flex justify-between text-[10px] font-bold uppercase tracking-tighter">
                        <span>Users</span>
                        <span>{Math.round((tenant.currentUsersCount / tenant.maxUsers) * 100)}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className={cn(
                            "h-full transition-all duration-500",
                            (tenant.currentUsersCount / tenant.maxUsers) > 0.8 ? "bg-amber-500" : "bg-primary"
                          )}
                          style={{ width: `${(tenant.currentUsersCount / tenant.maxUsers) * 100}%` }}
                        />
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        {tenant.currentUsersCount} / {tenant.maxUsers} seats
                      </div>
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
                    <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
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
