'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Minus, Plus, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ScheduleEditorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
  onCancel?: () => void;
}

export function ScheduleEditorDialog({ open, onOpenChange, onSubmit, onCancel }: ScheduleEditorDialogProps) {
  const [dailyQuantities, setDailyQuantities] = useState<Record<string, number>>({});
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (open) {
      setIsSuccess(false);
      const dates: Record<string, number> = {};
      const existingOverrides = JSON.parse(localStorage.getItem('subtrack_daily_overrides') || '{}');

      for (let i = 0; i < 10; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i); // Start from today
        const weekday = date.toLocaleDateString('en-GB', { weekday: 'short' });
        const day = date.toLocaleDateString('en-GB', { day: '2-digit' });
        const month = date.toLocaleDateString('en-GB', { month: 'short' });
        const year = date.toLocaleDateString('en-GB', { year: 'numeric' });
        const dateStr = `${weekday} ${day} ${month} ${year}`;
        
        // If there's an existing override, load it, otherwise default to 2
        dates[dateStr] = existingOverrides[dateStr] !== undefined ? existingOverrides[dateStr] : 2;
      }
      setDailyQuantities(dates);
    }
  }, [open]);

  const updateQuantity = (date: string, delta: number) => {
    setDailyQuantities(prev => ({
      ...prev,
      [date]: Math.max(0, prev[date] + delta)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const modifiedDays = Object.entries(dailyQuantities).filter(([_, qty]) => qty !== 2);
    
    // Save to local storage for request history
    const request = {
      id: `EXC-${Math.floor(1000 + Math.random() * 9000)}`,
      customer: 'Customer User',
      address: '123 Main St, Apartment 4B',
      details: modifiedDays,
      status: 'Pending',
      businessType: 'Milk',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, ' '),
    };

    const existingLogs = JSON.parse(localStorage.getItem('subtrack_pause_requests') || '[]');
    localStorage.setItem('subtrack_pause_requests', JSON.stringify([request, ...existingLogs]));

    // Save actual overrides date-wise
    const existingOverrides = JSON.parse(localStorage.getItem('subtrack_daily_overrides') || '{}');
    const newOverrides = { ...existingOverrides };
    modifiedDays.forEach(([date, qty]) => {
        newOverrides[date] = qty;
    });
    localStorage.setItem('subtrack_daily_overrides', JSON.stringify(newOverrides));
    
    // Dispatch custom event for real-time frontend syncing
    window.dispatchEvent(new Event('overrides_updated'));

    onSubmit(request);
    setIsSuccess(true);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        {isSuccess ? (
          <div className="py-8 flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-center">Schedule Updated</h2>
            <p className="text-muted-foreground text-center text-sm mb-6 px-4">
              Your daily delivery schedule has been updated. The vendor has been notified of your changes.
            </p>
            <Button 
              className="mt-6 w-auto px-8" 
              onClick={() => onOpenChange(false)}
            >
              Done
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-black">Edit Schedule</DialogTitle>
              <p className="text-sm text-slate-500">Adjust the number of packets for each day.</p>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 py-2 border-t mt-4">
              
              {/* Tomorrow's Preview & Summary */}
              {(() => {
                const totalExtraPackets = Object.values(dailyQuantities).filter(q => q > 2).reduce((sum, q) => sum + (q - 2), 0);
                const totalExtraCost = totalExtraPackets * 25;
                const modifiedCount = Object.values(dailyQuantities).filter(qty => qty !== 2).length;

                return (
                  <div className="flex flex-col gap-2 mb-4">
                    <div className="flex items-center justify-between bg-blue-50/50 border border-blue-100 p-3 rounded-lg">
                      <div>
                        <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest mb-0.5">Tomorrow's Delivery</p>
                        <p className="text-sm font-bold text-slate-800">
                          {Object.values(dailyQuantities)[1] === 0 
                            ? <span className="text-rose-500">Skipped</span> 
                            : `${Object.values(dailyQuantities)[1]} Packets Scheduled`}
                        </p>
                      </div>
                      {modifiedCount > 0 && (
                        <div className="text-right">
                          <p className="text-[10px] text-orange-600 font-black uppercase tracking-widest mb-0.5">Changes</p>
                          <p className="text-sm font-bold text-slate-800">{modifiedCount} Days Modified</p>
                        </div>
                      )}
                    </div>
                    {totalExtraCost > 0 && (
                      <div className="flex items-center justify-between bg-indigo-50 border border-indigo-100 p-3 rounded-lg shadow-sm">
                        <div className="flex items-center gap-2">
                           <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-black text-sm">₹</div>
                           <div>
                             <p className="text-[10px] text-indigo-600 font-black uppercase tracking-widest mb-0.5">Extra Milk Cost</p>
                             <p className="text-xs font-bold text-indigo-900">{totalExtraPackets} Extra Packets</p>
                           </div>
                        </div>
                        <p className="text-lg font-black text-indigo-700">₹{totalExtraCost}</p>
                      </div>
                    )}
                  </div>
                );
              })()}

              <div className="max-h-[350px] overflow-y-auto px-2 -mx-2 scrollbar-thin scrollbar-thumb-slate-200">
                {Object.entries(dailyQuantities).map(([date, qty]) => {
                  const isModified = qty !== 2;
                  const extraCost = qty > 2 ? (qty - 2) * 25 : 0;
                  return (
                    <div key={date} className={cn(
                      "flex items-center justify-between py-3 px-3 mb-2 rounded-lg border transition-all",
                      isModified && extraCost > 0 ? "border-indigo-200 bg-indigo-50/30 shadow-sm" :
                      isModified ? "border-orange-200 bg-orange-50/30 shadow-sm" : "border-slate-100 hover:bg-slate-50/50"
                    )}>
                      <div className="flex flex-col">
                        <span className="text-[13px] font-bold text-slate-800 tracking-tight">{date}</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          {isModified && <span className={cn("text-[9px] font-black uppercase tracking-widest", extraCost > 0 ? "text-indigo-500" : "text-orange-500")}>Modified</span>}
                          {extraCost > 0 && <span className="text-[9px] font-black text-indigo-600 bg-indigo-100 px-1.5 py-0.5 rounded uppercase tracking-widest">+₹{extraCost}</span>}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col gap-1 items-end">
                          <div className="flex items-center gap-3">
                            <button 
                              type="button"
                              onClick={() => updateQuantity(date, -1)}
                              className="w-7 h-7 rounded-full border border-blue-400 flex items-center justify-center text-blue-500 hover:bg-blue-50 transition-all active:scale-90"
                            >
                              <Minus className="w-3.5 h-3.5 stroke-[2.5px]" />
                            </button>
                            
                            <span className="text-[13px] font-bold text-slate-900 min-w-[100px] text-center tracking-tight">
                              {qty === 0 ? (
                                <span className="text-rose-500 uppercase text-[11px] font-black tracking-widest bg-rose-50 px-2 py-0.5 rounded">Skipped</span>
                              ) : (
                                `${qty} Packets`
                              )}
                            </span>

                            <button 
                              type="button"
                              onClick={() => updateQuantity(date, 1)}
                              className="w-7 h-7 rounded-full border border-blue-400 flex items-center justify-center text-blue-500 hover:bg-blue-50 transition-all active:scale-90"
                            >
                              <Plus className="w-3.5 h-3.5 stroke-[2.5px]" />
                            </button>
                          </div>
                          
                          <div className="flex items-center gap-3 pr-9">
                            {qty !== 0 && (
                              <button 
                                type="button" 
                                onClick={() => updateQuantity(date, -qty)} 
                                className="text-[10px] font-bold text-rose-500 hover:underline tracking-tight"
                              >
                                Skip
                              </button>
                            )}
                            {qty !== 2 && (
                              <button 
                                type="button" 
                                onClick={() => updateQuantity(date, 2 - qty)} 
                                className="text-[10px] font-bold text-slate-500 hover:text-slate-800 hover:underline tracking-tight"
                              >
                                Reset
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <DialogFooter className="pt-4 flex flex-row gap-3 border-t">
                <button 
                   type="button" 
                   onClick={() => {
                     onOpenChange(false);
                     if (onCancel) onCancel();
                   }} 
                   className="font-bold flex-1 h-11 border border-slate-200 rounded-md hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <Button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white font-bold flex-[1.5] h-11">
                  Update Schedule
                </Button>
              </DialogFooter>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
