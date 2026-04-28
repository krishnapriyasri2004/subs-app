'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Package,
  FileText,
  Settings,
  LogOut,
  Tags,
  RefreshCw,
  BarChart2,
  ChevronDown,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/ui/logo';
import { useVendorAuth } from '@/lib/vendor-auth';

const adminMenuGroups = [
  {
    items: [
      { icon: LayoutDashboard, label: 'Admin Dashboard', href: '/vendor/dashboard' },
      { icon: Package, label: 'Master Products', href: '/vendor/products' },
      { icon: Tags, label: 'Global Discounts', href: '/vendor/price-lists' },
    ]
  },
  {
    items: [
      { icon: Users, label: 'All Customers', href: '/vendor/customers' },
      { icon: RefreshCw, label: 'Global Subscriptions', href: '/vendor/subscriptions' },
      { icon: FileText, label: 'Master Invoices', href: '/vendor/invoices' },
      { icon: BarChart2, label: 'Subscription Reports', href: '/vendor/reports/subscriptions' },
      { icon: AlertCircle, label: 'Complaints', href: '/vendor/complaints' },
    ]
  },
  {
    items: [
      { icon: Settings, label: 'System Settings', href: '/vendor/settings' }
    ]
  }
];

export function AdminSidebar({ onMobileClose }: { onMobileClose?: () => void }) {
  const pathname = usePathname();
  const { logout } = useVendorAuth();

  return (
    <>
      <div className="p-4 flex items-center h-20">
        <Logo variant="light" />
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-none">
        {adminMenuGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="py-2 first:pt-0">
            {group.items.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={onMobileClose}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors mb-1 last:mb-0",
                    isActive ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/10" : "text-slate-400 hover:text-white hover:bg-slate-800"
                  )}
                >
                  <item.icon className={cn("w-5 h-5 shrink-0 transition-colors", isActive ? "text-white" : "text-slate-400")} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            {groupIndex < adminMenuGroups.length - 1 && <div className="h-px bg-slate-800 my-4 mx-2" />}
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800/50 rounded-md p-3 border border-slate-700/50 cursor-pointer hover:bg-slate-800 transition-all mb-4">
          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1 truncate">GSTIN: 23ABCDE1234F1Z5</p>
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-200 truncate">Admin Console</p>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500 hover:text-slate-300 hover:bg-slate-800 rounded-md transition-colors"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </>
  );
}
