'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
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
  Paperclip
} from 'lucide-react';
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
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { RaiseComplaintDialog } from '@/components/dashboard/raise-complaint-dialog';

// Mock complaints data
const initialComplaints = [
  {
    id: 'CMP-1021',
    subject: 'Issue with milk delivery',
    category: 'Delivery',
    status: 'Pending',
    date: '18 Mar 2026',
    priority: 'High',
    hasAttachment: false,
    attachmentData: '',
    businessType: 'milk'
  },
  {
    id: 'CMP-1020',
    subject: 'Incorrect billing amount',
    category: 'Billing',
    status: 'Resolved',
    date: '15 Mar 2026',
    priority: 'Medium',
    hasAttachment: true,
    attachmentData: '',
    businessType: 'milk'
  },
  {
    id: 'CMP-1019',
    subject: 'Change subscription address',
    category: 'Account',
    status: 'In Progress',
    date: '10 Mar 2026',
    priority: 'Low',
    hasAttachment: false,
    attachmentData: '',
    businessType: 'rice'
  },
];

export default function DashboardComplaintsPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [complaints, setComplaints] = useState(initialComplaints);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchComplaints = () => {
      const stored = localStorage.getItem('subtrack_complaints');
      if (stored) {
        try {
          setComplaints(JSON.parse(stored));
        } catch (e) {}
      } else {
        localStorage.setItem('subtrack_complaints', JSON.stringify(initialComplaints));
        setComplaints(initialComplaints);
      }
    };

    fetchComplaints();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'subtrack_complaints') {
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

  const handleAddComplaint = (newComplaint: any) => {
    const updated = [newComplaint, ...complaints];
    setComplaints(updated);
    localStorage.setItem('subtrack_complaints', JSON.stringify(updated));
    window.dispatchEvent(new Event('complaints_updated'));
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground">Complaints & Support</h1>
          <p className="text-sm text-muted-foreground font-medium mt-1">Manage your support tickets and issues</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-10 px-6 rounded-lg gap-2 shadow-sm">
          <Plus className="w-4 h-4" />
          Raise Complaint
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border-border/50 bg-background/50 shadow-sm hover:shadow-md transition-all relative overflow-hidden backdrop-blur-xl">
          <div className="flex justify-between items-start">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 mb-4">
              <Clock className="w-6 h-6" />
            </div>
          </div>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Open/Pending</p>
          <h3 className="text-3xl font-black text-foreground tracking-tighter">{complaints.filter(c => c.status === 'Pending').length}</h3>
        </Card>

        <Card className="p-6 border-border/50 bg-background/50 shadow-sm hover:shadow-md transition-all relative overflow-hidden backdrop-blur-xl">
          <div className="flex justify-between items-start">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-4">
              <AlertCircle className="w-6 h-6" />
            </div>
          </div>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">In Progress</p>
          <h3 className="text-3xl font-black text-foreground tracking-tighter">{complaints.filter(c => c.status === 'In Progress').length}</h3>
        </Card>

        <Card className="p-6 border-border/50 bg-background/50 shadow-sm hover:shadow-md transition-all relative overflow-hidden backdrop-blur-xl">
          <div className="flex justify-between items-start">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-4">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Resolved</p>
          <h3 className="text-3xl font-black text-foreground tracking-tighter">{complaints.filter(c => c.status === 'Resolved').length}</h3>
        </Card>
      </div>

      {/* Main Content Area */}
      <Card className="border-border/50 bg-background/50 backdrop-blur-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-muted/20">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
            <Input
              placeholder="Search complaints..."
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
                <TableHead className="font-bold text-muted-foreground py-4 pl-6">Ticket ID</TableHead>
                <TableHead className="font-bold text-muted-foreground py-4">Subject</TableHead>
                <TableHead className="font-bold text-muted-foreground py-4">Service</TableHead>
                <TableHead className="font-bold text-muted-foreground py-4">Category</TableHead>
                <TableHead className="font-bold text-muted-foreground py-4">Date</TableHead>
                <TableHead className="font-bold text-muted-foreground py-4 text-center">Priority</TableHead>
                <TableHead className="font-bold text-muted-foreground py-4 text-right pr-6">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {complaints.filter(c => c.subject.toLowerCase().includes(searchTerm.toLowerCase()) || c.id.toLowerCase().includes(searchTerm.toLowerCase())).map((complaint) => (
                <TableRow key={complaint.id} className="border-border/50 hover:bg-muted/30 transition-colors cursor-pointer group">
                  <TableCell className="py-4 pl-6 font-bold text-foreground">{complaint.id}</TableCell>
                  <TableCell className="py-4 font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
                    <div className="flex items-center gap-2">
                       {complaint.subject}
                       {complaint.hasAttachment && (
                         <button
                           onClick={(e) => {
                             e.stopPropagation();
                             setPreviewImage(complaint.attachmentData || '/complaint-proof.png');
                           }}
                           className="p-1 hover:bg-muted rounded-full transition-colors group/icon"
                         >
                           <Paperclip className="w-3.5 h-3.5 text-blue-500 group-hover/icon:text-blue-700" />
                         </button>
                       )}
                    </div>
                  </TableCell>
                  <TableCell className="py-4 font-bold">
                     <span className={cn(
                       "px-2 py-0.5 rounded text-[10px] uppercase",
                       complaint.businessType === 'milk' ? "bg-blue-500/10 text-blue-500" : "bg-orange-500/10 text-orange-500"
                     )}>
                       {complaint.businessType || 'Milk'}
                     </span>
                  </TableCell>
                  <TableCell className="py-4 text-sm text-muted-foreground font-medium">{complaint.category}</TableCell>
                  <TableCell className="py-4 text-sm text-muted-foreground font-medium">{complaint.date}</TableCell>
                  <TableCell className="py-4 text-center">
                    <span className={cn(
                      "text-[10px] font-black uppercase px-2 py-0.5 rounded-sm",
                      complaint.priority === 'High' ? "bg-rose-500/10 text-rose-500" :
                        (complaint.priority === 'Medium' ? "bg-amber-500/10 text-amber-500" : "bg-muted text-muted-foreground")
                    )}>
                      {complaint.priority}
                    </span>
                  </TableCell>
                  <TableCell className="py-4 text-right pr-6">
                    <span className={cn(
                      "text-[10px] font-black uppercase px-2.5 py-1 rounded-sm border",
                      complaint.status === 'Resolved' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                        (complaint.status === 'In Progress' ? "bg-blue-500/10 text-blue-500 border-blue-500/20" : "bg-amber-500/10 text-amber-500 border-amber-500/20")
                    )}>
                      {complaint.status}
                    </span>
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

      <Dialog open={!!previewImage} onOpenChange={(open) => !open && setPreviewImage(null)}>
        <DialogContent className="max-w-3xl border-none p-0 overflow-hidden bg-transparent shadow-none">
          <div className="relative group">
             <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/50 to-transparent z-10">
                <h3 className="text-white font-bold tracking-tight">Your Attachment</h3>
             </div>
             <img
               src={previewImage || ''}
               alt="Proof"
               className="w-full h-auto rounded-xl shadow-2xl"
             />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
