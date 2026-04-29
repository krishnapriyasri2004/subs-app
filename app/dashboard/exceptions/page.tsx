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

// Mock Exception Data
const mockExceptions = [
  {
    id: 'EXC-001',
    customer: 'Ganesh Kumar',
    address: '456 MG Road, Block A',
    startDate: '19 Mar 2026',
    endDate: '22 Mar 2026',
    days: 4,
    status: 'Pending',
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
    note: 'Family emergency, pausing subscription',
  }
];

export default function DeliveryExceptionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [exceptions, setExceptions] = useState(mockExceptions);

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
    
    // Update local storage so the status changes persist
    const stored = localStorage.getItem('subtrack_pause_requests');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const updatedStorage = parsed.map((e: any) => e.id === id ? { ...e, status: newStatus } : e);
        localStorage.setItem('subtrack_pause_requests', JSON.stringify(updatedStorage));
      } catch (err) {
        console.error('Failed to update localStorage', err);
      }
    }
    
    toast.success(`Exception marked as ${newStatus}`);
  };

  const filteredExceptions = exceptions.filter(e => 
    e.customer.toLowerCase().includes(searchTerm.toLowerCase()) || 
    e.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-3">
            Delivery Exceptions
          </h1>
          <p className="text-sm text-muted-foreground font-medium mt-1">
            Manage customer requests to pause or skip upcoming deliveries
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border-amber-500/20 bg-amber-500/[0.02] shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
              <Clock className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black uppercase text-amber-600 bg-amber-100/50 px-2 py-0.5 rounded-sm">Action Required</span>
          </div>
          <h3 className="text-3xl font-black text-foreground">{exceptions.filter(e => e.status === 'Pending').length}</h3>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Pending Requests</p>
        </Card>

        <Card className="p-6 border-blue-500/20 bg-blue-500/[0.02] shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-3xl font-black text-foreground">
            {exceptions.filter(e => e.status === 'Approved').reduce((acc, curr) => acc + curr.days, 0)}
          </h3>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Total Skipped Days</p>
        </Card>

        <Card className="p-6 border-emerald-500/20 bg-emerald-500/[0.02] shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-3xl font-black text-foreground">₹{(exceptions.filter(e => e.status === 'Approved').reduce((acc, curr) => acc + curr.days, 0) * 45).toLocaleString('en-IN')}</h3>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Cost Saved / Adjusted</p>
        </Card>
      </div>

      {/* List */}
      <Card className="border-border/50 bg-background/50 backdrop-blur-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-muted/20">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
            <Input 
              placeholder="Search exceptions..." 
              className="pl-9 bg-background/50 border-border/50 focus:bg-background transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="gap-2 font-bold text-foreground border-border/50 w-full sm:w-auto hover:bg-muted/50">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/10">
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="font-bold text-muted-foreground py-4 pl-6">Customer & Request</TableHead>
                <TableHead className="font-bold text-muted-foreground py-4">Skip Dates</TableHead>
                <TableHead className="font-bold text-muted-foreground py-4 text-center">Duration</TableHead>
                <TableHead className="font-bold text-muted-foreground py-4 text-center">Status</TableHead>
                <TableHead className="font-bold text-muted-foreground py-4 text-right pr-6">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExceptions.map((exc) => (
                <TableRow key={exc.id} className="border-border/50 hover:bg-muted/30 transition-colors group">
                  <TableCell className="py-4 pl-6">
                    <div>
                      <p className="font-bold text-foreground">{exc.customer}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{exc.address}</p>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter mt-1 p-1 bg-muted/50 rounded inline-block">
                        Note: {exc.note}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-foreground uppercase">
                        <Calendar className="w-3.5 h-3.5 text-primary" /> {exc.startDate}
                      </div>
                      {exc.startDate !== exc.endDate && (
                        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground uppercase font-bold tracking-tighter ml-2">
                          To {exc.endDate}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="py-4 text-center">
                    <span className="text-sm font-black text-foreground">{exc.days} Day(s)</span>
                  </TableCell>
                  <TableCell className="py-4 text-center">
                    <span className={cn(
                      "text-[10px] font-black uppercase px-2.5 py-1 rounded-sm border",
                      exc.status === 'Approved' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : 
                      (exc.status === 'Rejected' ? "bg-rose-500/10 text-rose-500 border-rose-500/20" : "bg-amber-500/10 text-amber-500 border-amber-500/20")
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
                      <span className="text-xs font-bold text-muted-foreground">Actioned</span>
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
