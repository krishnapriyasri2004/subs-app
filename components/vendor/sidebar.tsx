'use client';

import React from 'react';
import { useVendorAuth } from '@/lib/vendor-auth';
import { CustomerSidebar } from './sidebars/CustomerSidebar';
import { AdminSidebar } from './sidebars/AdminSidebar';
import { MilkVendorSidebar } from './sidebars/MilkVendorSidebar';
import { RiceVendorSidebar } from './sidebars/RiceVendorSidebar';
import { cn } from '@/lib/utils';

export function VendorSidebar() {
  const { user, isLoading } = useVendorAuth();
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  React.useEffect(() => {
    const handleToggle = () => setIsMobileOpen(true);
    document.addEventListener('toggle-mobile-sidebar', handleToggle);
    return () => document.removeEventListener('toggle-mobile-sidebar', handleToggle);
  }, []);

  if (isLoading) {
    return (
      <div className="w-64 h-screen bg-[#111827] animate-pulse border-r border-slate-800" />
    );
  }

  // 1. Determine the Role/Context
  const isCustomer = user?.role === 'customer' || user?.email === 'customer@user.com';
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';
  const isVendor = user?.role === 'tenant_owner';

  const isMilkVendor = (
    user?.businessType?.toLowerCase() === 'milk' ||
    user?.businessType?.toLowerCase() === 'dairy' ||
    user?.businessType?.toLowerCase() === 'both'
  ) && isVendor;

  const isRiceVendor = (
    user?.businessType?.toLowerCase() === 'rice' ||
    user?.businessType?.toLowerCase() === 'grains'
  ) && isVendor;

  const renderContent = () => {
    if (isCustomer) return <CustomerSidebar onMobileClose={() => setIsMobileOpen(false)} />;
    if (isAdmin) return <AdminSidebar onMobileClose={() => setIsMobileOpen(false)} />;
    if (isRiceVendor) return <RiceVendorSidebar onMobileClose={() => setIsMobileOpen(false)} />;
    if (isMilkVendor || isVendor) return <MilkVendorSidebar onMobileClose={() => setIsMobileOpen(false)} />;
    return <AdminSidebar onMobileClose={() => setIsMobileOpen(false)} />;
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[60]"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <div
        className={cn(
          "bg-[#0A0D16] text-slate-300 flex flex-col h-screen fixed inset-y-0 left-0 shrink-0 transition-all duration-300 z-[70] group print:hidden shadow-2xl",
          "w-72",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {renderContent()}
      </div>
    </>
  );
}