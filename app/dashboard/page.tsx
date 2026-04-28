'use client';

import { useAuth } from '@/lib/auth-context';
import AdminDashboard from '@/components/dashboard/admin-dashboard';
import TenantDashboard from '@/components/dashboard/tenant-dashboard';
import SuperAdminDashboard from '@/components/dashboard/super-admin-dashboard';
import CustomerDashboard from '@/components/dashboard/customer-dashboard';
import NewCustomerDashboard from '@/components/dashboard/new-customer-dashboard';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const { user } = useAuth();
  const [isNewCustomer, setIsNewCustomer] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isNew = localStorage.getItem('is_new_customer') === 'true';
      setIsNewCustomer(isNew);
    }
  }, []);

  const isCustomer = user?.role === 'customer' || user?.email === 'customer@user.com';

  if (user?.role === 'super_admin') {
    return <SuperAdminDashboard />;
  }

  if (user?.role === 'admin') {
    return <AdminDashboard />;
  }

  if (isCustomer) {
    if (isNewCustomer) {
      return <NewCustomerDashboard />;
    }
    return <CustomerDashboard />;
  }

  return <TenantDashboard />;
}