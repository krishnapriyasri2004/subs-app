'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Package,
  CreditCard,
  FileText,
  Settings,
  LogOut,
  ChevronDown,
  ChevronUp,
  Tags,
  RefreshCw,
  FileMinus,
  BarChart2,
  Menu,
  Compass,
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/ui/logo';
import { useVendorAuth } from '@/lib/vendor-auth';

type SidebarItemSubItem = {
  label: string;
  href: string;
};

type SidebarItemType = {
  icon: any;
  label: string;
  href: string;
  showBadge?: boolean;
  subItems?: SidebarItemSubItem[];
};

type SidebarGroupType = {
  items: SidebarItemType[];
};

const menuGroups: SidebarGroupType[] = [
  {
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', href: '/vendor/dashboard' },
      { icon: Package, label: 'Products', href: '/vendor/products' },
      { icon: Tags, label: 'Price Lists', href: '/vendor/price-lists' },
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
      { icon: Activity, label: 'Events', href: '/vendor/events' },
      { icon: BarChart2, label: 'Reports', href: '/vendor/reports' },
    ]
  },
  {
    items: [
      {
        icon: Settings,
        label: 'Settings',
        href: '/vendor/settings'
      }
    ]
  }
];

const customerMenuGroups: SidebarGroupType[] = [
  {
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', href: '/vendor/dashboard' },
      { icon: RefreshCw, label: 'My Subscriptions', href: '/vendor/subscriptions' },
      { icon: Compass, label: 'Discover Plans', href: '/vendor/discover-plans' },
      { icon: FileText, label: 'Invoices', href: '/vendor/invoices' },
      { icon: CreditCard, label: 'Payments', href: '/vendor/payments' },
      { icon: FileText, label: 'Billing History', href: '/vendor/billing-history' },
      { icon: Activity, label: 'Events', href: '/vendor/events' },
      { icon: Settings, label: 'Profile Settings', href: '/vendor/profile' },
    ]
  }
];

export function VendorSidebar() {
  const pathname = usePathname();
  const { user, logout } = useVendorAuth();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const isCustomer = user?.role === 'customer' || user?.email === 'customer@user.com';

  const toggleSettings = (e: React.MouseEvent) => {
    e.preventDefault();
    setSettingsOpen(!settingsOpen);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <div
        className={cn(
          "bg-[#111827] text-slate-300 flex flex-col h-screen fixed md:relative shrink-0 border-r border-slate-800 transition-all duration-300 z-50 group print:hidden",
          "w-16 hover:w-64 md:w-64",
          isMobileOpen ? "w-64 translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >


        <div className="p-4 relative z-10 flex items-center h-20">
          <div className="min-w-max">
            <Logo variant="light" />
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-4 relative z-10 overflow-y-auto custom-scrollbar overflow-x-hidden">
          {(isCustomer ? customerMenuGroups : menuGroups).map((group, groupIndex) => (
            <div key={groupIndex} className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname.startsWith(item.href);
                const isSettings = item.subItems !== undefined;

                return (
                  <div key={item.label}>
                    <Link
                      href={isSettings ? '#' : item.href}
                      onClick={isSettings ? toggleSettings : undefined}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors relative overflow-hidden",
                        isActive
                          ? "bg-indigo-600 text-white shadow-sm"
                          : "text-slate-400 hover:text-white hover:bg-slate-800"
                      )}
                    >
                      <item.icon className={cn(
                        "w-5 h-5 shrink-0 transition-colors",
                        isActive ? "text-white" : "text-white/80"
                      )} />

                      <span className={cn(
                        "flex-1 whitespace-nowrap transition-opacity duration-300",
                        "opacity-0 group-hover:opacity-100 md:opacity-100"
                      )}>
                        {item.label}
                      </span>

                      {item.showBadge && (
                        <span className={cn(
                          "bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap transition-opacity duration-300",
                          "opacity-0 group-hover:opacity-100 md:opacity-100"
                        )}>
                          2
                        </span>
                      )}

                      {isSettings && (
                        <div className={cn(
                          "ml-auto transition-opacity duration-300",
                          "opacity-0 group-hover:opacity-100 md:opacity-100"
                        )}>
                          {settingsOpen ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                        </div>
                      )}
                    </Link>

                    {isSettings && settingsOpen && (
                      <div className={cn(
                        "mt-1 ml-4 pl-4 border-l border-white/20 space-y-1 overflow-hidden transition-all duration-300",
                        "opacity-0 group-hover:opacity-100 md:opacity-100 max-h-0 group-hover:max-h-[500px] md:max-h-[500px]"
                      )}>
                        {item.subItems?.map(sub => (
                          <Link
                            key={sub.label}
                            href={sub.href}
                            className={cn(
                              "block px-3 py-1.5 text-xs font-medium rounded-md transition-colors border-l-2 border-transparent whitespace-nowrap",
                              pathname.startsWith(sub.href)
                                ? "text-white border-indigo-500 bg-slate-800/50"
                                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                            )}
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {groupIndex < (isCustomer ? customerMenuGroups.length : menuGroups.length) - 1 && (
                <div className="h-px bg-slate-800 my-2 mx-2" />
              )}
            </div>
          ))}
        </nav>

        <div className={cn(
          "p-4 border-t border-slate-800 relative z-10 transition-opacity duration-300",
          "opacity-0 group-hover:opacity-100 md:opacity-100"
        )}>
          <div className="bg-slate-800/50 rounded-md p-3 border border-slate-700/50 cursor-pointer hover:bg-slate-800 transition-all">
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1 truncate">GSTIN: 23ABCDE1234F1Z5</p>
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-slate-200 truncate">Business Group</p>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            </div>
          </div>

          <button
            onClick={logout}
            className="w-full mt-3 flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500 hover:text-slate-300 hover:bg-slate-800 rounded-md transition-colors"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Mobile toggle button (visible when sidebar is hidden) */}
      <button
        className="md:hidden fixed top-4 left-4 z-40 bg-slate-900 border border-slate-800 text-white p-2 rounded-md shadow-sm"
        onClick={() => setIsMobileOpen(true)}
      >
        <Menu className="w-5 h-5" />
      </button>
    </>
  );
}