'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Exception {
  id: string;
  customer: string;
  address: string;
  startDate?: string;
  endDate?: string;
  days?: number;
  status: string;
  businessType: string;
  note?: string;
  details?: [string, number][];
}

// Mock Exception Data
const mockExceptions: Exception[] = [
  {
    id: 'EXC-001',
    customer: 'Ganesh Kumar',
    address: '456 MG Road, Block A',
    startDate: '19 Mar 2026',
    endDate: '22 Mar 2026',
    days: 4,
    status: 'Pending',
    businessType: 'Milk',
    note: 'Going out of town for holidays',
  },
  {
    id: 'EXC-002',
    customer: 'Anjali Verma',
    address: '12 Sunrise Apts, South Street',
    startDate: '20 Mar 2026',
    endDate: '20 Mar 2026',
    days: 1,
    status: 'Approved',
    businessType: 'Milk',
    note: 'Not at home tomorrow morning',
  },
  {
    id: 'EXC-003',
    customer: 'Megha Rao',
    address: 'Villa 5, Green Orchards',
    startDate: '18 Mar 2026',
    endDate: '25 Mar 2026',
    days: 8,
    status: 'Approved',
    businessType: 'Milk',
    note: 'Family emergency, pausing subscription',
  }
];

export default function VendorExceptionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [exceptions, setExceptions] = useState<Exception[]>(mockExceptions);

  // Hook to pull from local storage if the customer made a new request
  React.useEffect(() => {
    const stored = localStorage.getItem('subtrack_pause_requests');
    if (stored) {
      const parsed = JSON.parse(stored);
      setExceptions(prev => [...parsed, ...prev]);
    }
  }, []);

  const handleUpdateStatus = (id: string, newStatus: string) => {
    setExceptions(exceptions.map(e => e.id === id ? { ...e, status: newStatus } : e));
    
    // Update local storage so the customer side reflects the status change
    const stored = localStorage.getItem('subtrack_pause_requests');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const updatedStorage = parsed.map((e: any) => e.id === id ? { ...e, status: newStatus } : e);
        localStorage.setItem('subtrack_pause_requests', JSON.stringify(updatedStorage));
      } catch (err) {
        console.error('Failed to parse local storage exceptions', err);
      }
    }
    
    toast.success(`Exception marked as ${newStatus}`);
  };

  const filteredExceptions = exceptions.filter(e => 
    (e.customer.toLowerCase().includes(searchTerm.toLowerCase()) || 
    e.id.toLowerCase().includes(searchTerm.toLowerCase())) &&
    e.businessType === 'Milk' // Only show Milk exceptions for this vendor
  );

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 flex items-center gap-3">
            Delivery Exceptions
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Manage customer requests to pause or skip upcoming deliveries
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border-transparent bg-white shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 rounded-lg bg-amber-50 text-amber-500">
              <Clock className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black uppercase text-amber-600 bg-amber-100 px-2 py-0.5 rounded-sm">Action Required</span>
          </div>
          <h3 className="text-3xl font-black text-slate-900">{filteredExceptions.filter(e => e.status === 'Pending').length}</h3>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Pending Requests</p>
        </Card>

        <Card className="p-6 border-transparent bg-white shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-500">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-3xl font-black text-slate-900">
            {filteredExceptions.filter(e => e.status === 'Approved').reduce((acc, curr) => acc + (curr.days || 1), 0)}
          </h3>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Total Skipped Days</p>
        </Card>

        <Card className="p-6 border-transparent bg-white shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-500">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-3xl font-black text-slate-900">₹{(filteredExceptions.filter(e => e.status === 'Approved').reduce((acc, curr) => acc + (curr.days || 1), 0) * 45).toLocaleString('en-IN')}</h3>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Cost Saved / Adjusted</p>
        </Card>
      </div>

      {/* List */}
      <Card className="border-slate-100 bg-white shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/50">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <Input 
              placeholder="Search exceptions..." 
              className="pl-9 bg-white border-transparent focus:bg-white transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="gap-2 font-bold text-slate-600 border-slate-200 w-full sm:w-auto hover:bg-slate-50">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/80">
              <TableRow className="border-slate-100 hover:bg-transparent">
                <TableHead className="font-bold text-slate-500 py-4 pl-6">Customer & Request</TableHead>
                <TableHead className="font-bold text-slate-500 py-4">Skip Dates</TableHead>
                <TableHead className="font-bold text-slate-500 py-4 text-center">Duration</TableHead>
                <TableHead className="font-bold text-slate-500 py-4 text-center">Status</TableHead>
                <TableHead className="font-bold text-slate-500 py-4 text-right pr-6">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExceptions.map((exc) => (
                <TableRow key={exc.id} className="border-slate-50 hover:bg-slate-50/50 transition-colors group">
                  <TableCell className="py-4 pl-6">
                    <div>
                      <p className="font-bold text-slate-900">{exc.customer}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{exc.address}</p>
                      {exc.details && exc.details.length > 0 ? (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {exc.details.map(([date, qty]: any, idx: number) => (
                            <span key={idx} className={cn(
                              "text-[9px] font-bold px-1.5 py-0.5 rounded border",
                              qty === 0 ? "bg-rose-50 text-rose-600 border-rose-100" : "bg-blue-50 text-blue-600 border-blue-100"
                            )}>
                              {date}: {qty === 0 ? 'SKIP' : `${qty} pkt`}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter mt-1 p-1 bg-slate-100 rounded inline-block">
                          Note: {exc.note || 'Regular Pause'}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex flex-col gap-1">
                      {exc.details && exc.details.length > 0 ? (
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-900 uppercase">
                           <Calendar className="w-3.5 h-3.5 text-indigo-500" /> {exc.details.length} Days Adjusted
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-900 uppercase">
                            <Calendar className="w-3.5 h-3.5 text-indigo-500" /> {exc.startDate}
                          </div>
                          {exc.startDate !== exc.endDate && (
                            <div className="flex items-center gap-1.5 text-[10px] text-slate-500 uppercase font-bold tracking-tighter ml-2">
                              To {exc.endDate}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="py-4 text-center">
                    <span className="text-sm font-black text-slate-900">
                      {exc.details ? exc.details.length : exc.days} Day(s)
                    </span>
                  </TableCell>
                  <TableCell className="py-4 text-center">
                    <span className={cn(
                      "text-[10px] font-black uppercase px-2.5 py-1 rounded-sm border",
                      exc.status === 'Approved' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : 
                      (exc.status === 'Rejected' ? "bg-rose-50 text-rose-600 border-rose-100" : "bg-amber-50 text-amber-600 border-amber-100")
                    )}>
                      {exc.status}
                    </span>
                  </TableCell>
                  <TableCell className="py-4 text-right pr-6">
                    {exc.status === 'Pending' ? (
                      <div className="flex items-center justify-end gap-2 text-xs">
                        <Button onClick={() => handleUpdateStatus(exc.id, 'Approved')} size="sm" className="h-8 px-3 font-bold bg-emerald-500 hover:bg-emerald-600 text-white gap-1 transition-colors">
                           <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                        </Button>
                        <Button onClick={() => handleUpdateStatus(exc.id, 'Rejected')} size="sm" variant="outline" className="h-8 px-3 font-bold text-rose-500 border-rose-200 hover:bg-rose-50 transition-colors">
                           <XCircle className="w-3.5 h-3.5" /> Reject
                        </Button>
                      </div>
                    ) : (
                      <span className="text-xs font-bold text-slate-400">Actioned</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
