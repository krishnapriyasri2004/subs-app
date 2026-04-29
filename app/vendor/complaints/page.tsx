'use client';

import React, { useState, useEffect } from 'react';
import { useVendorAuth } from '@/lib/vendor-auth';
import { mockBusinessPlans, mockCustomerSubscriptions } from '@/lib/mock-data';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  MessageSquare,
  Plus,
  AlertCircle,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  Paperclip,
  ChevronDown,
  X
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { RaiseComplaintDialog } from '@/components/dashboard/raise-complaint-dialog';
import { ComplaintDetailsDialog } from '@/components/vendor/complaint-details-dialog';
import { toast } from 'sonner';

// Mock complaints data
const initialComplaints = [
  {
    id: 'CMP-6492',
    subject: 'Milk Quality',
    category: 'Delivery',
    status: 'Pending',
    date: '18 Mar 2026',
    priority: 'High',
    hasAttachment: true,
    attachmentData: '',
    businessType: 'milk',
    description: 'The milk delivered today smelled slightly sour and curdled when boiled.',
    customerData: { name: 'Rahul Sharma', email: 'rahul.s@example.com', phone: '+91 9876543210' },
    subscriptionData: { plan: 'Fresh Cow Milk (1L)', frequency: 'Daily (Morning)', zone: 'North Zone' },
    deliveryData: { address: 'A-101, Sunrise Apts, North St', expectedTime: '06:30 AM', agentName: 'Raju' }
  },
  {
    id: 'CMP-5129',
    subject: 'Rice quality',
    category: 'Other',
    status: 'Resolved',
    date: '18 Mar 2026',
    priority: 'High',
    hasAttachment: true,
    attachmentData: '',
    businessType: 'rice',
    description: 'The Sona Masoori rice delivered was not aged properly as promised.',
    customerData: { name: 'Anita Verma', email: 'anita.v@example.com', phone: '+91 9988776655' },
    subscriptionData: { plan: 'Sona Masoori (10kg)', frequency: 'Monthly', zone: 'South Zone' },
    deliveryData: { address: 'Villa 4, Palm Orchards', expectedTime: '10:00 AM', agentName: 'Suresh' }
  },
  {
    id: 'CMP-6393',
    subject: 'Rice delivery delayed',
    category: 'Delivery',
    status: 'Pending',
    date: '18 Mar 2026',
    priority: 'Medium',
    hasAttachment: false,
    attachmentData: '',
    businessType: 'rice',
    description: 'My rice delivery was scheduled for the 1st but it arrived on the 3rd.',
    customerData: { name: 'Vikram Singh', email: 'vikram.s@test.com', phone: '+91 9123456789' },
    subscriptionData: { plan: 'Basmati Rice (5kg)', frequency: 'Monthly', zone: 'East Zone' },
    deliveryData: { address: 'Flat 202, Block B, Silver Oaks', expectedTime: '12:00 PM', agentName: 'Mahesh' }
  },
  {
    id: 'CMP-1021',
    subject: 'Issue with milk delivery',
    category: 'Delivery',
    status: 'Pending',
    date: '18 Mar 2026',
    priority: 'High',
    hasAttachment: false,
    attachmentData: '',
    businessType: 'milk',
    description: 'The milk was delivered very late today, around 8:30 AM instead of 6:30 AM.',
    customerData: { name: 'Priya Patel', email: 'priya.p@test.com', phone: '+91 9898989898' },
    subscriptionData: { plan: 'Premium A2 Milk (2L)', frequency: 'Daily (Morning)', zone: 'West Zone' },
    deliveryData: { address: 'C-34, Gated Community, Layout 2', expectedTime: '06:30 AM', agentName: 'Raju' }
  },
];

export default function ComplaintsPage() {
  const { user } = useVendorAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [complaints, setComplaints] = useState(initialComplaints);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);

  useEffect(() => {
    const fetchComplaints = () => {
      const stored = localStorage.getItem('subtrack_vendor_complaints_v2');
      if (stored) {
        try {
          setComplaints(JSON.parse(stored));
        } catch (e) {}
      } else {
        localStorage.setItem('subtrack_vendor_complaints_v2', JSON.stringify(initialComplaints));
        setComplaints(initialComplaints);
      }
    };

    fetchComplaints();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'subtrack_vendor_complaints_v2') {
        fetchComplaints();
      }
    };

    const handleLocalUpdate = () => fetchComplaints();

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('complaints_updated', handleLocalUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('complaints_updated', handleLocalUpdate);
    };
  }, [isDialogOpen]);

  const handleUpdateStatus = (id: string, newStatus: string) => {
    const updated = complaints.map(c => c.id === id ? { ...c, status: newStatus } : c);
    setComplaints(updated);
    localStorage.setItem('subtrack_vendor_complaints_v2', JSON.stringify(updated));
    window.dispatchEvent(new Event('complaints_updated'));
    toast.success(`Complaint status updated to ${newStatus}`);
  };

  const handleAddComplaint = (newComplaint: any) => {
    const isCustomer = user?.role === 'customer' || user?.email === 'customer@user.com';
    
    // Attempt to map real subscription info
    let subDetails = undefined;
    if (isCustomer) {
       const matchingSub = mockCustomerSubscriptions.find(s => 
           (newComplaint.businessType === 'milk' && s.planId === 'bp-milk-daily') ||
           (newComplaint.businessType === 'rice' && s.planId === 'bp-rice-monthly')
       );
       const planDetails = matchingSub ? mockBusinessPlans.find(p => p.id === matchingSub.planId) : null;
       subDetails = planDetails ? {
         plan: planDetails.name,
         frequency: planDetails.interval === 'monthly' ? 'Monthly' : 'Daily',
         zone: newComplaint.businessType === 'milk' ? 'North Zone' : 'South Zone'
       } : { plan: 'Active Plan', frequency: 'Regular', zone: 'Primary Zone' };
    }

    const enrichedComplaint = {
      ...newComplaint,
      customerData: isCustomer ? { name: user?.name || 'Current Customer', email: user?.email || '', phone: user?.phone || '+91 9999988888' } : undefined,
      subscriptionData: subDetails,
      deliveryData: isCustomer ? { 
        address: 'Customer Registered Address, Phase 1', 
        expectedTime: newComplaint.businessType === 'milk' ? '06:30 AM' : '10:00 AM', 
        agentName: newComplaint.businessType === 'milk' ? 'Raju Delivery' : 'Suresh Logistics'
      } : undefined
    };
    
    const updated = [enrichedComplaint, ...complaints];
    setComplaints(updated);
    localStorage.setItem('subtrack_vendor_complaints_v2', JSON.stringify(updated));
    window.dispatchEvent(new Event('complaints_updated'));
  };

  const filteredComplaints = complaints.filter(c => {
    const searchMatch = c.subject.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        c.id.toLowerCase().includes(searchTerm.toLowerCase());
    const vendorMatch = user?.businessType === 'both' || c.businessType === user?.businessType;
    
    const statusMatch = statusFilter === 'All' || c.status === statusFilter;
    const priorityMatch = priorityFilter === 'All' || c.priority === priorityFilter;
    const categoryMatch = categoryFilter === 'All' || c.category === categoryFilter;

    return searchMatch && vendorMatch && statusMatch && priorityMatch && categoryMatch;
  });

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Complaints</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Manage your support tickets and issues</p>
        </div>
        {(user?.role === 'customer' || user?.email === 'customer@user.com') && (
          <Button onClick={() => setIsDialogOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-10 px-6 rounded-lg gap-2 shadow-sm">
            <Plus className="w-4 h-4" />
            Raise Complaint
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border-transparent shadow-sm hover:shadow-md transition-all relative overflow-hidden bg-white">
          <div className="flex justify-between items-start">
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 mb-4">
              <Clock className="w-6 h-6" />
            </div>
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Open/Pending</p>
          <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{filteredComplaints.filter(c => c.status === 'Pending').length}</h3>
        </Card>

        <Card className="p-6 border-transparent shadow-sm hover:shadow-md transition-all relative overflow-hidden bg-white">
          <div className="flex justify-between items-start">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mb-4">
              <AlertCircle className="w-6 h-6" />
            </div>
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">In Progress</p>
          <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{filteredComplaints.filter(c => c.status === 'In Progress').length}</h3>
        </Card>

        <Card className="p-6 border-transparent shadow-sm hover:shadow-md transition-all relative overflow-hidden bg-white">
          <div className="flex justify-between items-start">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-4">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Resolved</p>
          <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{filteredComplaints.filter(c => c.status === 'Resolved').length}</h3>
        </Card>
      </div>

      {/* Main Content Area */}
      <Card className="border-slate-100 shadow-sm overflow-hidden bg-white">
        <div className="p-6 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <Input
              placeholder="Search complaints..."
              className="pl-9 bg-slate-50 border-transparent focus:bg-white transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 font-bold text-slate-600 border-slate-200 w-full sm:w-auto h-10 px-4 rounded-lg">
                  <Filter className="w-4 h-4 text-slate-400" />
                  Filter
                  <ChevronDown className="w-4 h-4 text-slate-400 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px] p-2 rounded-xl shadow-xl border-slate-100 max-h-[80vh] overflow-y-auto custom-scrollbar">
                <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2 py-1.5">By Status</DropdownMenuLabel>
                {['All', 'Pending', 'In Progress', 'Resolved'].map(status => (
                  <DropdownMenuItem 
                    key={status} 
                    onClick={() => setStatusFilter(status)}
                    className={cn("rounded-lg text-sm font-bold cursor-pointer py-2", statusFilter === status && "bg-indigo-50 text-indigo-600")}
                  >
                    {status}
                  </DropdownMenuItem>
                ))}
                
                <DropdownMenuSeparator className="my-2 bg-slate-50" />
                <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2 py-1.5">By Priority</DropdownMenuLabel>
                {['All', 'High', 'Medium', 'Low'].map(prio => (
                  <DropdownMenuItem 
                    key={prio} 
                    onClick={() => setPriorityFilter(prio)}
                    className={cn("rounded-lg text-sm font-bold cursor-pointer py-2", priorityFilter === prio && "bg-indigo-50 text-indigo-600")}
                  >
                    {prio}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Filter Badges */}
        {(statusFilter !== 'All' || priorityFilter !== 'All' || searchTerm) && (
          <div className="px-6 pb-4 flex items-center gap-2 flex-wrap">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">Active Filters:</p>
            {searchTerm && (
              <Badge variant="secondary" className="pl-3 pr-1 py-1 gap-1 rounded-lg bg-slate-100 text-slate-600 border-none font-bold text-xs">
                Search: {searchTerm}
                <button onClick={() => setSearchTerm('')}><X className="w-3 h-3 hover:text-rose-500 ml-1" /></button>
              </Badge>
            )}
            {statusFilter !== 'All' && (
              <Badge variant="secondary" className="pl-3 pr-1 py-1 gap-1 rounded-lg bg-indigo-50 text-indigo-600 border-none font-bold text-xs">
                Status: {statusFilter}
                <button onClick={() => setStatusFilter('All')}><X className="w-3 h-3 hover:text-rose-500 ml-1" /></button>
              </Badge>
            )}
            {priorityFilter !== 'All' && (
              <Badge variant="secondary" className="pl-3 pr-1 py-1 gap-1 rounded-lg bg-amber-50 text-amber-600 border-none font-bold text-xs">
                Priority: {priorityFilter}
                <button onClick={() => setPriorityFilter('All')}><X className="w-3 h-3 hover:text-rose-500 ml-1" /></button>
              </Badge>
            )}
            <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {setStatusFilter('All'); setPriorityFilter('All'); setCategoryFilter('All'); setSearchTerm('');}}
                className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 h-7 px-3 rounded-lg"
            >
                Clear All
            </Button>
          </div>
        )}

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="border-slate-100 hover:bg-transparent">
                <TableHead className="font-bold text-slate-500 py-4 pl-6">Ticket ID</TableHead>
                <TableHead className="font-bold text-slate-500 py-4">Subject</TableHead>
                {user?.businessType === 'both' && <TableHead className="font-bold text-slate-500 py-4">Service</TableHead>}
                <TableHead className="font-bold text-slate-500 py-4">Category</TableHead>
                <TableHead className="font-bold text-slate-500 py-4">Date</TableHead>
                <TableHead className="font-bold text-slate-500 py-4 text-center">Priority</TableHead>
                <TableHead className="font-bold text-slate-500 py-4 text-right pr-6">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredComplaints.map((complaint) => (
                <TableRow key={complaint.id} className="border-slate-50 hover:bg-slate-50/50 transition-colors cursor-pointer group" onClick={() => setSelectedComplaint(complaint)}>
                  <TableCell className="py-4 pl-6 font-bold text-slate-900">{complaint.id}</TableCell>
                  <TableCell className="py-2 font-semibold text-slate-700">
                    <div className="flex items-center gap-2">
                       {complaint.subject}
                       {complaint.hasAttachment && (
                         <button
                           onClick={(e) => {
                             e.stopPropagation();
                             setPreviewImage(complaint.attachmentData || '/complaint-proof.png');
                           }}
                           className="p-1 hover:bg-slate-100 rounded-full transition-colors group/icon"
                         >
                           <Paperclip className="w-3.5 h-3.5 text-blue-500 group-hover/icon:text-blue-700" />
                         </button>
                       )}
                    </div>
                  </TableCell>
                  {user?.businessType === 'both' && (
                    <TableCell className="py-4 font-bold">
                       <span className={cn(
                         "px-2 py-0.5 rounded text-[10px] uppercase",
                         complaint.businessType === 'milk' ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-700"
                       )}>
                         {complaint.businessType || 'Milk'}
                       </span>
                    </TableCell>
                  )}
                  <TableCell className="py-4 text-sm text-slate-500 font-medium">{complaint.category}</TableCell>
                  <TableCell className="py-4 text-sm text-slate-500 font-medium">{complaint.date}</TableCell>
                  <TableCell className="py-4 text-center">
                    <span className={cn(
                      "text-[10px] font-black uppercase px-2 py-0.5 rounded-sm",
                      complaint.priority === 'High' ? "bg-rose-50 text-rose-600" :
                        (complaint.priority === 'Medium' ? "bg-amber-50 text-amber-600" : "bg-slate-100 text-slate-600")
                    )}>
                      {complaint.priority}
                    </span>
                  </TableCell>
                  <TableCell className="py-2 text-right pr-6">
                    {user?.role === 'customer' || user?.email === 'customer@user.com' ? (
                      <span className={cn(
                        "h-8 px-3 py-1 rounded-sm text-[10px] font-black uppercase inline-flex items-center ml-auto font-bold",
                        complaint.status === 'Resolved' ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                          (complaint.status === 'In Progress' ? "bg-blue-50 text-blue-600 border border-blue-100" : "bg-amber-50 text-amber-600 border border-amber-100")
                      )}>
                        {complaint.status}
                      </span>
                    ) : (
                      <div onClick={(e) => e.stopPropagation()}>
                        <Select
                          defaultValue={complaint.status}
                          onValueChange={(val) => handleUpdateStatus(complaint.id, val)}
                        >
                          <SelectTrigger className={cn(
                            "h-8 w-[120px] text-[10px] font-black uppercase px-2.5 py-1 rounded-sm border inline-flex items-center ml-auto transition-all",
                            complaint.status === 'Resolved' ? "bg-emerald-50 text-emerald-600 border-emerald-100 shadow-none hover:bg-emerald-100" :
                              (complaint.status === 'In Progress' ? "bg-blue-50 text-blue-600 border-blue-100 shadow-none hover:bg-blue-100" : "bg-amber-50 text-amber-600 border-amber-100 shadow-none hover:bg-amber-100")
                          )}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="In Progress">In Progress</SelectItem>
                            <SelectItem value="Resolved">Resolved</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
      
      <RaiseComplaintDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleAddComplaint}
      />

      <ComplaintDetailsDialog 
        complaint={selectedComplaint} 
        isOpen={!!selectedComplaint} 
        onClose={() => setSelectedComplaint(null)} 
        onUpdateStatus={(id, status) => {
          handleUpdateStatus(id, status);
          if (selectedComplaint && selectedComplaint.id === id) {
            setSelectedComplaint({ ...selectedComplaint, status });
          }
        }} 
      />

      <Dialog open={!!previewImage} onOpenChange={(open) => !open && setPreviewImage(null)}>
        <DialogContent className="max-w-3xl border-none p-0 overflow-hidden bg-transparent shadow-none">
          <div className="relative group">
             <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/50 to-transparent z-10">
                <h3 className="text-white font-bold tracking-tight">Attachment Preview</h3>
             </div>
             <img
               src={previewImage || ''}
               alt="Proof"
               className="w-full h-auto rounded-xl shadow-2xl select-none"
             />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
