'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle } from 'lucide-react';

interface PauseDeliveryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
  onEdit?: () => void;
}

export function PauseDeliveryDialog({ open, onOpenChange, onSubmit, onEdit }: PauseDeliveryDialogProps) {
  const handleEditClick = () => {
    if (onEdit) {
      onEdit();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
          <>
            <DialogHeader>
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 mb-4">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <DialogTitle className="text-xl font-black">Pause Delivery</DialogTitle>
              <DialogDescription className="text-sm">
                Going out of town? Temporarily pause your milk/rice delivery to avoid wastage. You won't be charged for skipped days.
              </DialogDescription>
            </DialogHeader>

            {/* Subscription Info Card from Screenshot */}
            <div className="border border-slate-200 rounded-sm overflow-hidden mb-6 text-[11px] font-medium text-slate-500">
              <div className="grid grid-cols-2">
                <div className="border-b border-r border-slate-200 p-2 text-center uppercase tracking-wider">PREPAID</div>
                <div className="border-b border-slate-200 p-2 text-center uppercase tracking-wider">FRESH COW MILK</div>
                <div className="border-b border-r border-slate-200 p-2 text-center">Mar</div>
                <div className="border-b border-slate-200 p-2 text-center">Start from : 18-03-2026</div>
                <div className="border-b border-r border-slate-200 p-2 text-center">2 Packet (500ml)/Day</div>
                <div className="border-b border-slate-200 p-2 text-center">27 Days Subscribed</div>
                <div className="col-span-1 p-2 flex items-center pl-4 bg-slate-50/30">Paid on Mar 03, 2026</div>
                <div className="col-span-1 p-1">
                   <Button 
                     type="button"
                     variant="ghost" 
                     className="w-full h-8 bg-orange-500 hover:bg-orange-600 text-white rounded-none text-[10px] uppercase font-bold tracking-widest"
                     onClick={handleEditClick}
                   >
                      EDIT
                   </Button>
                </div>
              </div>
            </div>
          </>
      </DialogContent>
    </Dialog>
  );
}
