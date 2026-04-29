'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ChevronRight,
  Download,
  Milk,
  ShoppingCart,
  Users,
  Search,
  Filter
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useData } from '@/lib/data-context';
import { useVendorAuth } from '@/lib/vendor-auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';
import ExcelJS from 'exceljs';

export default function SubscriptionReportsPage() {
  const { user } = useVendorAuth();
  const { mockCustomerSubscriptions: subscriptions, mockCustomers, mockBusinessPlans } = useData();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string[]>(['ACTIVE', 'PAUSED', 'EXPIRED']);
  const [typeFilter, setTypeFilter] = React.useState<string[]>(['Milk', 'Rice', 'Other']);

  // Filtering logic
  const formattedData = subscriptions.filter(s => {
    // Broaden filters to ensure we catch the relevant subscriptions for this tenant
    return s.tenantId === user?.tenantId;
  }).map(s => {
    // Attempt to find the customer more thoroughly
    const customer = mockCustomers.find(c => 
      c.id === s.customerId || 
      c.email === s.customerEmail || 
      c.email === s.customer || 
      c.id === s.customer
    );
    
    const plan = mockBusinessPlans.find(p => p.id === s.planId);
    const planName = s.plan || plan?.name || s.planId || 'N/A';
    
    // Logic to ensure the customer name isn't just a copy of the plan name
    let resolutionName = customer?.name || s.customer || s.name || 'Unknown';
    if (resolutionName === planName && customer?.name) {
        resolutionName = customer.name;
    } else if (resolutionName === planName && s.customerEmail) {
        // If it still matches the plan name, but we have an email, fallback to showing 'Customer' based on the email
        resolutionName = s.customerEmail.split('@')[0];
    }
    
    // Improved product type detection
    const isMilk = planName.toLowerCase().includes('milk') || 
                  s.planId?.toLowerCase().includes('milk') || 
                  s.id?.toLowerCase().includes('milk');
    const isRice = planName.toLowerCase().includes('rice') || 
                  s.planId?.toLowerCase().includes('rice') || 
                  s.id?.toLowerCase().includes('rice');

    return {
      id: s.id,
      customerName: resolutionName,
      customerEmail: s.customerEmail || customer?.email || 'N/A',
      planName: planName,
      status: s.status,
      amount: s.totalAmount || s.price || plan?.price || 0,
      startDate: s.startDate ? new Date(s.startDate).toLocaleDateString() : 'N/A',
      productType: isMilk ? 'Milk' : isRice ? 'Rice' : 'Other'
    };
  });

  const filteredData = formattedData.filter(d => {
    const matchesSearch = d.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         d.planName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter.includes(d.status.toUpperCase());
    const matchesType = typeFilter.includes(d.productType);
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const milkCount = formattedData.filter(d => d.productType === 'Milk').length;
  const riceCount = formattedData.filter(d => d.productType === 'Rice').length;

  const handleDownload = async (type: 'Milk' | 'Rice' | 'All') => {
    const reportData = type === 'All' 
      ? formattedData 
      : formattedData.filter(d => d.productType === type);

    if (reportData.length === 0) {
      alert(`No ${type} subscriptions found.`);
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Subscriptions');

    // Define columns
    worksheet.columns = [
      { header: 'Subscription ID', key: 'id', width: 25 },
      { header: 'Customer Name', key: 'customerName', width: 25 },
      { header: 'Email', key: 'customerEmail', width: 35 },
      { header: 'Plan Name', key: 'planName', width: 25 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Amount', key: 'amount', width: 15 },
      { header: 'Start Date', key: 'startDate', width: 15 },
      { header: 'Type', key: 'productType', width: 15 }
    ];

    // Add rows
    worksheet.addRows(reportData);

    // Style the header
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFEFEFEF' }
    };

    // Generate filename
    const fileName = `${type}_Subscription_Report_${new Date().toISOString().split('T')[0]}.xlsx`;

    try {
      // Write to buffer
      const buffer = await workbook.xlsx.writeBuffer();
      
      const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, 100);
      
      console.log(`Download started for ${fileName}`);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to generate Excel report.');
    }
  };


  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
            <span>Dashboard</span>
            <ChevronRight className="w-3 h-3" />
            <span>Reports</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-900">Subscription Report</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Subscription Reports</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={() => handleDownload('All')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold gap-2 h-10 px-6 rounded-lg"
          >
            <Download className="w-4 h-4" /> Download All Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Active</p>
            <p className="text-2xl font-black text-slate-900 tracking-tight">{formattedData.length}</p>
          </div>
        </Card>
        <Card className="p-6 border-slate-100 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Milk className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Milk Plan</p>
              <p className="text-2xl font-black text-slate-900 tracking-tight">{milkCount}</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleDownload('Milk')}
            className="text-emerald-600 hover:bg-emerald-50 font-bold"
          >
            <Download className="w-4 h-4 mr-1" /> Excel Download
          </Button>
        </Card>
        <Card className="p-6 border-slate-100 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rice Plan</p>
              <p className="text-2xl font-black text-slate-900 tracking-tight">{riceCount}</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleDownload('Rice')}
            className="text-amber-600 hover:bg-amber-50 font-bold"
          >
            <Download className="w-4 h-4 mr-1" /> Excel Download
          </Button>
        </Card>
      </div>

      <Card className="p-6 border-slate-100 shadow-sm">
        <div className="flex items-center gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search by customer or plan..."
              className="pl-10 h-11 border-slate-100 bg-slate-50/50 focus-visible:ring-1 focus-visible:ring-blue-500 rounded-lg text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-11 px-6 font-bold gap-2 border-slate-200 hover:bg-slate-50 transition-colors">
                <Filter className="w-4 h-4" /> Filters
                {(statusFilter.length < 3 || typeFilter.length < 3) && (
                  <span className="ml-1 w-2 h-2 rounded-full bg-blue-600" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 glass-card p-2 border-slate-200">
              <DropdownMenuLabel className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2 py-1.5">Filter by Status</DropdownMenuLabel>
              {['ACTIVE', 'PAUSED', 'EXPIRED'].map(status => (
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
              <DropdownMenuLabel className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2 py-1.5">Filter by Type</DropdownMenuLabel>
              {['Milk', 'Rice', 'Other'].map(type => (
                <DropdownMenuCheckboxItem
                  key={type}
                  checked={typeFilter.includes(type)}
                  onCheckedChange={(checked) => {
                    setTypeFilter(prev => 
                      checked ? [...prev, type] : prev.filter(t => t !== type)
                    );
                  }}
                  className="rounded-lg text-xs font-bold text-slate-600 focus:bg-slate-50"
                >
                  {type}
                </DropdownMenuCheckboxItem>
              ))}
              <DropdownMenuSeparator className="my-2 bg-slate-100" />
              <DropdownMenuItem 
                onClick={() => {
                  setStatusFilter(['ACTIVE', 'PAUSED', 'EXPIRED']);
                  setTypeFilter(['Milk', 'Rice', 'Other']);
                }}
                className="rounded-lg text-xs font-black text-blue-600 focus:bg-blue-50 focus:text-blue-700 justify-center py-2"
              >
                Reset All Filters
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-50 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                <th className="text-left py-4 px-4">Subscription</th>
                <th className="text-left py-4 px-4">Customer</th>
                <th className="text-left py-4 px-4">Plan</th>
                <th className="text-left py-4 px-4">Type</th>
                <th className="text-left py-4 px-4">Amount</th>
                <th className="text-left py-4 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredData.map((d) => (
                <tr key={d.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="py-5 px-4 text-xs font-bold text-slate-500 uppercase">{d.id}</td>
                  <td className="py-5 px-4">
                    <div>
                      <p className="text-sm font-bold text-slate-900">{d.customerName}</p>
                      <p className="text-[10px] text-slate-400 font-medium">{d.customerEmail}</p>
                    </div>
                  </td>
                  <td className="py-5 px-4 text-sm font-medium text-slate-600">{d.planName}</td>
                  <td className="py-5 px-4">
                    <span className={cn(
                      "text-[9px] font-black uppercase px-2 py-0.5 rounded",
                      d.productType === 'Milk' ? "bg-emerald-50 text-emerald-600" : 
                      d.productType === 'Rice' ? "bg-amber-50 text-amber-600" : "bg-slate-100 text-slate-400"
                    )}>
                      {d.productType}
                    </span>
                  </td>
                  <td className="py-5 px-4 text-sm font-black text-slate-900 tracking-tight">₹{d.amount.toLocaleString()}</td>
                  <td className="py-5 px-4">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                      {d.status}
                    </span>
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

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
