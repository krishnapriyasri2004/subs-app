'use client';

import React from 'react';
import { Truck, MapPin, Search, Filter, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LogisticsPage() {
  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Daily Logistics</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">Real-time tracking for your daily milk delivery routes.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-11 rounded-xl font-bold gap-2">
            <Filter className="w-4 h-4" />
            <span>Maps</span>
          </Button>
          <Button className="h-11 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 px-6">
            Dispatch Today
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden min-h-[400px] flex flex-col items-center justify-center p-12 text-center">
        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
          <Truck className="w-8 h-8 text-slate-300" />
        </div>
        <h3 className="text-lg font-black text-slate-900 mb-2">Logistics Control Panel</h3>
        <p className="text-slate-500 text-sm max-w-sm font-medium leading-relaxed">
          The routing algorithm for your specific milk distribution map is currently being setup.
        </p>
      </div>
    </div>
  );
}
