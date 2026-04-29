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
  RefreshCw,
  Droplet,
  Tag,
  CreditCard,
  FileMinus,
  Activity,
  BarChart3,
  ChevronDown,
  AlertCircle,
  Dumbbell
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/ui/logo';
import { useVendorAuth } from '@/lib/vendor-auth';

const milkVendorMenuGroups = [
  {
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', href: '/vendor/dashboard' },
      { icon: Package, label: 'Products', href: '/vendor/products' },
      { icon: CreditCard, label: 'Subscription Plans', href: '/vendor/plans' },
      { icon: Tag, label: 'Discount', href: '/vendor/coupons' }, // Mapped to coupons
    ]
  },
  {
    items: [
      { icon: Users, label: 'Customers', href: '/vendor/customers' },
      { icon: RefreshCw, label: 'Subscriptions', href: '/vendor/subscriptions' },
      { icon: FileText, label: 'Invoices', href: '/vendor/invoices' },
      { icon: FileMinus, label: 'Credit Notes', href: '/vendor/credit-notes' },
      { icon: CreditCard, label: 'Payments', href: '/vendor/payments' },
    ]
  },
  {
    items: [
      { icon: Activity, label: 'Events', href: '/vendor/events' }, // Mapped to events
      { icon: BarChart3, label: 'Reports', href: '/vendor/reports' },
      { icon: AlertCircle, label: 'Complaints', href: '/vendor/complaints' },
    ]
  },
  {
    items: [
      { icon: Settings, label: 'Settings', href: '/vendor/settings' }
    ]
  }
];

export function MilkVendorSidebar({ onMobileClose }: { onMobileClose?: () => void }) {
  const pathname = usePathname();
  const { logout, user } = useVendorAuth();

  const isGym = user?.businessType?.toLowerCase() === 'gym' || user?.businessType?.toLowerCase() === 'fitness';

  const menuGroups = milkVendorMenuGroups.map(group => ({
    items: group.items.map(item => {
      let icon = item.icon;
      let label = item.label;

      if (isGym) {
        if (label === 'Subscription Plans') {
          label = 'Memberships';
          icon = Dumbbell;
        } else if (label === 'Products') {
          label = 'Services';
          icon = Activity;
        }
      }

      return {
        ...item,
        label,
        icon
      };
    })
  }));

  return (
    <>
      <div className="px-6 flex items-center h-24">
        <Logo variant="light" size={32} />
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto scrollbar-none">
        {menuGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="mb-6 last:mb-0">
            {group.items.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={onMobileClose}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 text-[15px] font-medium rounded-xl transition-all duration-200 mb-1 last:mb-0 group/item",
                    isActive
                      ? "bg-[#4F46E5] text-white shadow-lg shadow-indigo-500/20"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                  )}
                >
                  <item.icon className={cn(
                    "w-5 h-5 shrink-0 transition-colors",
                    isActive ? "text-white" : "text-slate-500 group-hover/item:text-slate-300"
                  )} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            {groupIndex < milkVendorMenuGroups.length - 1 && (
              <div className="h-[1px] bg-slate-800/50 my-4 mx-2" />
            )}
          </div>
        ))}
      </nav>

      <div className="p-6 mt-auto">
        <div className="bg-[#111827]/80 rounded-2xl p-4 border border-slate-800/50 cursor-pointer hover:bg-slate-800 transition-all mb-4">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 opacity-70">
            {user?.gstNumber ? `GSTIN: ${user.gstNumber}` : (isGym ? 'Fitness Certified' : 'Verified Vendor')}
          </p>
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-200 truncate pr-2">
              {user?.businessName || (isGym ? 'Gym Group' : 'Business Group')}
            </p>
            <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2.5 px-3 py-3 text-[13px] font-bold uppercase tracking-widest text-slate-500 hover:text-slate-300 transition-colors"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </>
  );
}