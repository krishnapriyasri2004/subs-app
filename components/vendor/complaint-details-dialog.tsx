'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, Phone, Mail, ShoppingCart, Calendar, MapPin, Clock, FileText, AlertCircle, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';

interface ComplaintDetailsDialogProps {
  complaint: any;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (id: string, newStatus: string) => void;
}

export function ComplaintDetailsDialog({ complaint, isOpen, onClose, onUpdateStatus }: ComplaintDetailsDialogProps) {
  if (!complaint) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden bg-slate-50">
        <DialogHeader className="p-6 pb-4 bg-white border-b border-slate-100 flex flex-row items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Badge variant="outline" className="font-bold bg-slate-100 text-slate-700 border-none">
                {complaint.id}
              </Badge>
              <Badge className={cn(
                "font-bold px-2 py-0.5 border-none",
                complaint.priority === 'High' ? "bg-rose-100 text-rose-700" :
                (complaint.priority === 'Medium' ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-700")
              )}>
                {complaint.priority} Priority
              </Badge>
              <Badge className={cn(
                "font-bold px-2 py-0.5 border-none uppercase text-[10px] tracking-wider",
                complaint.status === 'Resolved' ? "bg-emerald-100 text-emerald-700" :
                (complaint.status === 'In Progress' ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700")
              )}>
                {complaint.status}
              </Badge>
            </div>
            <DialogTitle className="text-xl font-black text-slate-900 mt-2">
              {complaint.subject}
            </DialogTitle>
            <p className="text-sm font-medium text-slate-500 mt-1">
              Opened on {complaint.date} • Category: {complaint.category}
            </p>
          </div>
        </DialogHeader>

        <div className="max-h-[70vh] overflow-y-auto px-6 py-6 custom-scrollbar space-y-6">
          
          {/* Customer & Subscription Section */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <User className="w-4 h-4 text-indigo-500" /> Customer Details
              </h4>
              <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm space-y-2">
                <p className="font-bold text-slate-900">{complaint.customerData?.name || 'Unknown Customer'}</p>
                <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                  <Mail className="w-4 h-4" /> {complaint.customerData?.email || 'N/A'}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                  <Phone className="w-4 h-4" /> {complaint.customerData?.phone || 'N/A'}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-emerald-500" /> Subscription Details
              </h4>
              <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm space-y-2">
                <p className="font-bold text-slate-900">{complaint.subscriptionData?.plan || 'Unknown Plan'}</p>
                <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                  <Calendar className="w-4 h-4" /> Frequency: {complaint.subscriptionData?.frequency || 'N/A'}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                  <MapPin className="w-4 h-4" /> Zone: {complaint.subscriptionData?.zone || 'N/A'}
                </div>
              </div>
            </div>
          </div>

          {/* Delivery & Issue Description Section */}
          <div className="grid md:grid-cols-2 gap-6">
             <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-500" /> Complaint Info
              </h4>
              <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm space-y-3">
                <p className="text-sm font-medium text-slate-700 leading-relaxed">
                  {complaint.description || 'No detailed description provided by the customer.'}
                </p>
                {complaint.hasAttachment && (
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <p className="text-xs font-bold text-slate-500 mb-2 flex items-center gap-2">
                      <FileText className="w-4 h-4" /> Attachment Provided
                    </p>
                    {/* Placeholder or actual image if available */}
                    <div className="h-24 bg-slate-100 rounded-lg flex items-center justify-center border border-dashed border-slate-300 overflow-hidden">
                       {complaint.attachmentData ? (
                         <img src={complaint.attachmentData} className="w-full h-full object-cover" alt="Proof" />
                       ) : (
                         <span className="text-xs font-medium text-slate-400">View Attachment</span>
                       )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-500" /> Delivery Details
              </h4>
              <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm space-y-2">
                <div className="flex items-start gap-2 text-sm text-slate-600 font-medium">
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{complaint.deliveryData?.address || 'Address not specified'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600 font-medium mt-3">
                  <Clock className="w-4 h-4 shrink-0" />
                  <span>Expected: {complaint.deliveryData?.expectedTime || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                  <User className="w-4 h-4 shrink-0" />
                  <span>Delivery Agent: {complaint.deliveryData?.agentName || 'Unassigned'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action / Response Section */}
          <div className="space-y-3 pt-2">
             <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-indigo-500" /> Status & Response
              </h4>
              <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm space-y-4">
                 <div className="flex gap-2">
                    {['Pending', 'In Progress', 'Resolved'].map((status) => (
                      <Button
                        key={status}
                        size="sm"
                        variant={complaint.status === status ? "default" : "outline"}
                        onClick={() => onUpdateStatus(complaint.id, status)}
                        className={cn(
                           "font-bold",
                           complaint.status === status ? "shadow-md" : ""
                        )}
                      >
                        {status}
                      </Button>
                    ))}
                 </div>
                 
                 <div className="space-y-2">
                   <p className="text-xs font-bold text-slate-500">Internal Notes / Customer Response (Mock)</p>
                   <Textarea 
                     placeholder="Add notes about resolving this complaint..." 
                     className="bg-slate-50 min-h-[80px]"
                     defaultValue={complaint.vendorResponse || ''}
                   />
                   <div className="flex justify-end pt-2">
                      <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold">
                        Save Note
                      </Button>
                   </div>
                 </div>
              </div>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}
