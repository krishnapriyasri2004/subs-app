'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { mockTenantUsers, mockTenants } from '@/lib/mock-data';
import { Plus, Edit2, Trash2, Search, UserCheck, ShieldCheck, Mail, Filter, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState(mockTenantUsers);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTenantName = (tenantId?: string) => {
    if (!tenantId) return 'Global/Admin';
    return mockTenants.find((t) => t.id === tenantId)?.name || 'Unknown Enterprise';
  };

  return (
    <div className="space-y-10 pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 animate-in-fade">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
            User <span className="text-gradient">Management</span>
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Monitor activity, manage roles, and control access across all enterprise accounts.
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 rounded-xl px-6 h-12">
          <Plus className="w-5 h-5 mr-2" />
          Provision New User
        </Button>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in-up delay-100">
        <Card className="glass-card p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Total Identity count</p>
            <p className="text-3xl font-bold text-foreground">{users.length}</p>
          </div>
          <div className="p-3 bg-primary/10 rounded-2xl shadow-inner">
            <UserCheck className="w-6 h-6 text-primary" />
          </div>
        </Card>
        <Card className="glass-card p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Active Sessions</p>
            <p className="text-3xl font-bold text-emerald-500">
              {users.filter((u) => u.status === 'active').length}
            </p>
          </div>
          <div className="p-3 bg-emerald-500/10 rounded-2xl shadow-inner">
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        </Card>
        <Card className="glass-card p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Privileged Accounts</p>
            <p className="text-3xl font-bold text-violet-500">
              {users.filter((u) => u.role === 'tenant-owner').length}
            </p>
          </div>
          <div className="p-3 bg-violet-500/10 rounded-2xl shadow-inner">
            <ShieldCheck className="w-6 h-6 text-violet-500" />
          </div>
        </Card>
      </div>

      {/* Search and Advanced Filters */}
      <div className="flex flex-col md:flex-row gap-4 animate-in-up delay-200">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by name, email, or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-14 bg-background/50 backdrop-blur-sm border-border/50 focus:ring-primary/20 rounded-2xl text-lg shadow-sm"
          />
        </div>
        <Button variant="outline" className="h-14 px-6 rounded-2xl border-border/50 bg-background/50 backdrop-blur-sm gap-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all">
          <Filter className="w-5 h-5" /> Filter by Tenant
        </Button>
      </div>

      {/* Users Table */}
      <Card className="glass-card overflow-hidden animate-in-up delay-300">
        <div className="overflow-x-auto overflow-y-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/30 border-b border-border/50">
                <th className="text-left py-5 px-6 font-bold text-foreground uppercase tracking-wider text-xs">
                  User
                </th>
                <th className="text-left py-5 px-6 font-bold text-foreground uppercase tracking-wider text-xs whitespace-nowrap">
                  Identity Provider
                </th>
                <th className="text-left py-5 px-6 font-bold text-foreground uppercase tracking-wider text-xs">
                  Role
                </th>
                <th className="text-left py-5 px-6 font-bold text-foreground uppercase tracking-wider text-xs">
                  Access Level
                </th>
                <th className="text-right py-5 px-6 font-bold text-foreground uppercase tracking-wider text-xs">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="group hover:bg-primary/[0.02] transition-colors"
                >
                  <td className="py-5 px-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary font-bold shadow-sm group-hover:scale-110 transition-transform">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-foreground font-bold leading-tight group-hover:text-primary transition-colors">
                          {user.name}
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <Mail className="w-3 h-3" /> {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-6">
                    <div className="text-sm font-medium text-foreground">
                      {getTenantName(user.tenantId)}
                    </div>
                    <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter mt-0.5">
                      Enterprise ID: {user.tenantId || 'GLOBAL'}
                    </div>
                  </td>
                  <td className="py-5 px-6">
                    <span className={cn(
                      "inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold border",
                      user.role === 'tenant-owner'
                        ? "bg-violet-500/10 text-violet-500 border-violet-500/20 shadow-[0_0_10px_rgba(139,92,246,0.1)]"
                        : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                    )}>
                      {user.role === 'tenant-owner' ? 'Administrator' : 'General User'}
                    </span>
                  </td>
                  <td className="py-5 px-6">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "w-2 h-2 rounded-full",
                        user.status === 'active' ? "bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]" : "bg-rose-500 shadow-[0_0_5px_rgba(244,63,94,0.5)]"
                      )} />
                      <span className={cn(
                        "text-xs font-bold uppercase tracking-widest",
                        user.status === 'active' ? "text-emerald-500" : "text-rose-500"
                      )}>
                        {user.status}
                      </span>
                    </div>
                  </td>
                  <td className="py-5 px-6">
                    <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-xl text-primary hover:bg-primary/10"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-xl text-rose-500 hover:bg-rose-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-xl text-muted-foreground hover:bg-muted"
                      >
                        <ShieldCheck className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-24">
            <div className="w-20 h-20 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-6 transform rotate-12">
              <Search className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold text-foreground">Zero identity matches</h3>
            <p className="text-muted-foreground max-w-sm mx-auto mt-2">
              The user you're looking for directory doesn't seem to exist. Check for spelling errors or broad search criteria.
            </p>
            <Button variant="link" onClick={() => setSearchTerm('')} className="mt-4 text-primary font-bold">
              Clear all search parameters
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
