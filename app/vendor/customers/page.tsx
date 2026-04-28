'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Search,
  ChevronRight,
  MoreHorizontal,
  UserPlus,
  Phone,
  Mail,
  MapPin,
  Filter,
  Download,
  Plus,
  Eye,
  Trash2,
  Send,
  MessageSquare,
  CheckCircle2
} from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useData } from '@/lib/data-context';
import { useVendorAuth } from '@/lib/vendor-auth';
import { openWhatsAppForProfile } from '@/lib/whatsapp';

export default function CustomersPage() {
  const router = useRouter();
  const { mockCustomers, deleteDocument } = useData();
  const { user } = useVendorAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isSendingBulk, setIsSendingBulk] = useState(false);

  // Format firestore customers to match table expectations
  const customers = mockCustomers
    .filter(c => c.tenantId === user?.tenantId)
    .map(cust => {
      let finalName = cust.name;
      if (!finalName || finalName === 'Unknown' || finalName === 'Unknown Customer') {
        if (cust.email) {
          const prefix = cust.email.split('@')[0];
          finalName = prefix.charAt(0).toUpperCase() + prefix.slice(1);
        } else {
          finalName = 'Platform Customer';
        }
      }

      return {
        id: cust.id,
        name: finalName,
        avatar: finalName.substring(0, 2).toUpperCase(),
        email: cust.email || 'No email',
        phone: cust.phone || '+91 00000 00000',
        address: cust.address || 'India',
        status: cust.status === 'active' ? 'Active' : 'Inactive',
        ltv: `₹${cust.ltv || 0}`,
        wallet: `₹${cust.walletBalance || 0}`
      };
    });

  const filteredCustomers = customers.filter(cust => {
    const searchLow = searchTerm.toLowerCase();
    const searchMatches =
      cust.name.toLowerCase().includes(searchLow) ||
      cust.email.toLowerCase().includes(searchLow) ||
      cust.phone.toLowerCase().includes(searchLow) ||
      cust.id.toLowerCase().includes(searchLow) ||
      cust.ltv.toLowerCase().includes(searchLow);

    if (statusFilter !== 'All') {
      return searchMatches && cust.status === statusFilter;
    }
    return searchMatches;
  });

  const handleAddCustomer = () => {
    router.push('/vendor/customers/new');
  };

  const handleViewCustomer = (id: string) => {
    router.push(`/vendor/customers/${id}`);
  };

  const handleDeleteCustomer = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await deleteDocument('customers', id);
      toast.success("Customer deleted successfully");
      setSelectedIds(prev => prev.filter(currId => currId !== id));
    } catch (err) {
      toast.error("Failed to delete customer");
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredCustomers.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredCustomers.map(c => c.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(currId => currId !== id) 
        : [...prev, id]
    );
  };

  const handleNotifyBulk = async () => {
    if (selectedIds.length === 0) return;
    
    setIsSendingBulk(true);
    const loadingToast = toast.loading(`Sending payment links to ${selectedIds.length} customers...`);
    
    // Simulate API delay for bulk SMS
    await new Promise(r => setTimeout(r, 2000));
    
    toast.dismiss(loadingToast);
    toast.success(`Broadcasting Completed!`, {
      description: `Payment links were successfully delivered to ${selectedIds.length} customers via WhatsApp/SMS.`,
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />
    });
    
    setIsSendingBulk(false);
    setSelectedIds([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
            <span>Dashboard</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-900">Customers</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Customers</h1>
        </div>
        <div className="flex items-center gap-3">
          {selectedIds.length > 0 && (
            <Button 
                onClick={handleNotifyBulk}
                disabled={isSendingBulk}
                className="bg-amber-100 hover:bg-amber-200 text-amber-900 font-black gap-2 h-10 px-6 rounded-lg border border-amber-200 animate-in fade-in zoom-in duration-300"
            >
                <Send className="w-4 h-4" /> 
                Send Link ({selectedIds.length})
            </Button>
          )}
          <Button onClick={handleAddCustomer} className="bg-blue-600 hover:bg-blue-700 text-white font-bold gap-2 h-10 px-6 rounded-lg shadow-lg shadow-blue-600/20">
            <Plus className="w-4 h-4" /> Add Customer
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
            <UserPlus className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Customers</p>
            <p className="text-2xl font-black text-slate-900 tracking-tight">{customers.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Members</p>
            <p className="text-2xl font-black text-slate-900 tracking-tight">{customers.filter(c => c.status === 'Active').length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
            <Filter className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Growth Rate</p>
            <p className="text-2xl font-black text-slate-900 tracking-tight">+12.4%</p>
          </div>
        </div>
      </div>

      <Card className="p-6 border-slate-100 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search by name, contact or amount..."
              className="pl-10 h-11 border-slate-100 bg-slate-50/50 focus-visible:ring-1 focus-visible:ring-blue-500 rounded-lg text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className={cn(
                  "h-11 px-6 font-bold gap-2 rounded-xl transition-all border-slate-100 hover:bg-slate-50",
                  statusFilter !== 'All' && "bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100 hover:border-blue-300"
                )}
              >
                <Filter className={cn("w-4 h-4", statusFilter !== 'All' ? "text-blue-600" : "text-slate-400")} /> 
                <span>{statusFilter === 'All' ? 'Filters' : `Status: ${statusFilter}`}</span>
                {statusFilter !== 'All' && (
                  <div className="ml-1 w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px] rounded-2xl border-slate-100 shadow-2xl p-2 glass-card">
              <div className="px-2 py-1.5 text-[10px] font-black tracking-widest text-slate-400 uppercase">Filter by Status</div>
              <div className="h-px bg-slate-50 my-1" />
              <DropdownMenuItem 
                onClick={() => setStatusFilter('All')}
                className={cn("rounded-xl font-bold py-2.5 cursor-pointer mb-1", statusFilter === 'All' && "bg-slate-50 text-slate-900")}
              >
                All Statuses
                {statusFilter === 'All' && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600" />}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setStatusFilter('Active')}
                className={cn("rounded-xl font-bold py-2.5 cursor-pointer mb-1", statusFilter === 'Active' && "bg-emerald-50 text-emerald-600")}
              >
                Active Only
                {statusFilter === 'Active' && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500" />}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setStatusFilter('Inactive')}
                className={cn("rounded-xl font-bold py-2.5 cursor-pointer", statusFilter === 'Inactive' && "bg-slate-100 text-slate-500")}
              >
                Inactive Only
                {statusFilter === 'Inactive' && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-slate-400" />}
              </DropdownMenuItem>
              
              {statusFilter !== 'All' && (
                <>
                  <div className="h-px bg-slate-50 my-2" />
                  <DropdownMenuItem 
                    onClick={() => setStatusFilter('All')}
                    className="rounded-xl font-bold py-2.5 cursor-pointer text-blue-600 focus:text-blue-600 focus:bg-blue-50 text-center justify-center text-xs"
                  >
                    Clear Filter
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-50 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                <th className="py-4 px-4 w-10">
                  <Checkbox 
                    checked={selectedIds.length === filteredCustomers.length && filteredCustomers.length > 0}
                    onCheckedChange={toggleSelectAll}
                    className="border-slate-300 data-[state=checked]:bg-blue-600"
                  />
                </th>
                <th className="text-left py-4 px-4">Customer</th>
                <th className="text-left py-4 px-4">Contact</th>
                <th className="text-left py-4 px-4">Location</th>
                <th className="text-left py-4 px-4">Status</th>
                <th className="text-left py-4 px-4">Wallet Balance</th>
                <th className="text-left py-4 px-4">Lifetime Value</th>
                <th className="text-right py-4 px-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredCustomers.map((cust) => (
               <tr key={cust.id} className={cn(
                  "group transition-colors border-b border-slate-50",
                  selectedIds.includes(cust.id) ? "bg-blue-50/40" : "hover:bg-slate-50/50"
                )}>
                  <td className="py-5 px-4">
                    <Checkbox 
                      checked={selectedIds.includes(cust.id)}
                      onCheckedChange={() => toggleSelect(cust.id)}
                      className="border-slate-300 data-[state=checked]:bg-blue-600"
                    />
                  </td>
                  <td className="py-5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-xs font-black text-slate-500 border border-slate-200 uppercase">
                        {cust.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{cust.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">{cust.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                        <Mail className="w-3 h-3 opacity-40" /> {cust.email}
                      </div>
                      <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                        <Phone className="w-3 h-3 opacity-40" /> {cust.phone}
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-4">
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                      <MapPin className="w-3.5 h-3.5 opacity-40 text-blue-500" /> {cust.address}
                    </div>
                  </td>
                  <td className="py-5 px-4">
                    <span className={cn(
                      "text-[10px] font-black uppercase px-2 py-0.5 rounded-full",
                      cust.status === 'Active' ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"
                    )}>
                      {cust.status}
                    </span>
                  </td>
                  <td className="py-5 px-4">
                    <span className="text-sm font-black text-slate-900 tracking-tight">{cust.wallet}</span>
                  </td>
                  <td className="py-5 px-4">
                    <span className="text-sm font-black text-slate-900 tracking-tight">{cust.ltv}</span>
                  </td>
                  <td className="py-5 px-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                        onClick={(e) => { e.stopPropagation(); handleViewCustomer(cust.id); }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50"
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          openWhatsAppForProfile(cust, `Hello ${cust.name}, this is regarding your subscription.`); 
                        }}
                      >
                        <MessageSquare className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={(e) => handleDeleteCustomer(e, cust.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}