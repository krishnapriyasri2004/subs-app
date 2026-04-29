'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { Plus, Download, MoreHorizontal, Filter, MapPin, Mail, Phone, UserPlus, Search, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

const initialCustomerData = [
  { id: 'CUST-301', name: 'Anjali Sharma', avatar: 'AS', email: 'anjali@example.com', phone: '+91 98765 43210', address: 'Delhi, India', status: 'Active', ltv: '₹15,400' },
  { id: 'CUST-302', name: 'Vikram Singh', avatar: 'VS', email: 'vikram@example.com', phone: '+91 88765 12345', address: 'Mumbai, India', status: 'Active', ltv: '₹12,200' },
  { id: 'CUST-303', name: 'Suresh Raina', avatar: 'SR', email: 'suresh@example.com', phone: '+91 78765 00000', address: 'Chennai, India', status: 'Inactive', ltv: '₹8,400' },
  { id: 'CUST-304', name: 'Priya Patel', avatar: 'PP', email: 'priya@example.com', phone: '+91 99876 54321', address: 'Bangalore, India', status: 'Active', ltv: '₹22,100' },
  { id: 'CUST-305', name: 'Rohit Sharma', avatar: 'RS', email: 'rohit@example.com', phone: '+91 99000 11223', address: 'Mumbai, India', status: 'Active', ltv: '₹5,600' },
];

export default function CustomersPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState(initialCustomerData);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string[]>(['Active', 'Inactive']);

  // Persist data in localStorage
  useEffect(() => {
    const savedCustomers = localStorage.getItem('vendor_customers');
    if (savedCustomers) {
      try {
        setCustomers(JSON.parse(savedCustomers));
      } catch (e) {
        console.error("Failed to parse saved customers", e);
      }
    }
  }, []);

  useEffect(() => {
    if (customers !== initialCustomerData) {
      localStorage.setItem('vendor_customers', JSON.stringify(customers));
    }
  }, [customers]);

  const filteredCustomers = customers.filter(cust => {
    const searchLow = searchTerm.toLowerCase();
    const matchesSearch = (
      cust.name.toLowerCase().includes(searchLow) ||
      cust.email.toLowerCase().includes(searchLow) ||
      cust.phone.toLowerCase().includes(searchLow) ||
      cust.id.toLowerCase().includes(searchLow) ||
      cust.ltv.toLowerCase().includes(searchLow)
    );
    const matchesStatus = statusFilter.includes(cust.status);
    return matchesSearch && matchesStatus;
  });

  const handleExport = () => {
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 1500)),
      {
        loading: 'Preparing customer records for export...',
        success: 'customer_database_export.csv downloaded successfully.',
        error: 'Export failed',
      }
    );
  };

  const handleAddCustomer = () => {
    router.push('/vendor/customers/new');
  };

  const handleViewCustomer = (id: string) => {
    router.push(`/vendor/customers/${id}`);
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
          <Button onClick={handleAddCustomer} className="bg-blue-600 hover:bg-blue-700 text-white font-bold gap-2 h-10 px-6 rounded-lg shadow-lg shadow-blue-600/20">
            <Plus className="w-4 h-4" /> Add Customer
          </Button>
          <Button onClick={handleExport} variant="outline" size="sm" className="h-10 px-4 font-bold gap-2">
            <Download className="w-4 h-4" /> Export
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="border border-slate-200 h-10 w-10">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 glass-card border-slate-200 p-1">
              <DropdownMenuItem className="rounded-lg text-xs font-bold" onClick={() => toast.info("Import feature coming soon")}>Import Customers</DropdownMenuItem>
              <DropdownMenuItem className="rounded-lg text-xs font-bold" onClick={() => toast.info("Bulk actions available soon")}>Bulk Sync</DropdownMenuItem>
              <DropdownMenuSeparator className="bg-slate-100" />
              <DropdownMenuItem className="rounded-lg text-xs font-bold text-rose-500" onClick={() => toast.error("Action restricted")}>Purge Inactive</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
            <UserPlus className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Customers</p>
            <p className="text-2xl font-black text-slate-900 tracking-tight">1,284</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Nodes</p>
            <p className="text-2xl font-black text-slate-900 tracking-tight">1,110</p>
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
              <Button variant="outline" className="h-11 px-6 font-bold gap-2 border-slate-200 hover:bg-slate-50 transition-colors">
                <Filter className="w-4 h-4" /> Filters
                {statusFilter.length < 2 && (
                  <span className="ml-1 w-2 h-2 rounded-full bg-blue-600" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 glass-card p-2 border-slate-200">
              <DropdownMenuLabel className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2 py-1.5">Customer Status</DropdownMenuLabel>
              {['Active', 'Inactive'].map(status => (
                <DropdownMenuCheckboxItem
                  key={status}
                  checked={statusFilter.includes(status)}
                  onCheckedChange={(checked) => {
                    setStatusFilter(prev => 
                      checked ? [...prev, status] : prev.filter(s => s !== status)
                    );
                  }}
                  className="rounded-lg text-xs font-bold text-slate-600 focus:bg-slate-50"
                >
                  {status}
                </DropdownMenuCheckboxItem>
              ))}
              <DropdownMenuSeparator className="my-2 bg-slate-100" />
              <DropdownMenuItem 
                onClick={() => setStatusFilter(['Active', 'Inactive'])}
                className="rounded-lg text-xs font-black text-blue-600 focus:bg-blue-50 justify-center py-2"
              >
                Reset All
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-50 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                <th className="text-left py-4 px-4">Customer</th>
                <th className="text-left py-4 px-4">Contact</th>
                <th className="text-left py-4 px-4">Location</th>
                <th className="text-left py-4 px-4">Status</th>
                <th className="text-left py-4 px-4">Lifetime Value</th>
                <th className="text-right py-4 px-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredCustomers.map((cust) => (
                <tr key={cust.id} className="group hover:bg-slate-50/50 transition-colors cursor-pointer" onClick={() => handleViewCustomer(cust.id)}>
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
                    <span className="text-sm font-black text-slate-900 tracking-tight">{cust.ltv}</span>
                  </td>
                  <td className="py-5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40 glass-card p-1 border-slate-200">
                        <DropdownMenuItem onClick={() => handleViewCustomer(cust.id)} className="rounded-lg text-xs font-bold">Edit Profile</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast.info(`Generating link for ${cust.name}...`)} className="rounded-lg text-xs font-bold">Payment Link</DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-slate-100" />
                        <DropdownMenuItem className="rounded-lg text-xs font-bold text-rose-500">Deactivate</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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