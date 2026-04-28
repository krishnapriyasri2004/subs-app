'use client';

import { useAuth } from '@/lib/auth-context';
import AdminDashboard from '@/components/dashboard/admin-dashboard';
import TenantDashboard from '@/components/dashboard/tenant-dashboard';
import SuperAdminDashboard from '@/components/dashboard/super-admin-dashboard';
import CustomerDashboard from '@/components/dashboard/customer-dashboard';

export default function DashboardPage() {
  const { user } = useAuth();
  const isCustomer = user?.role === 'customer' || user?.email === 'customer@user.com';

  if (user?.role === 'super_admin') {
    return <SuperAdminDashboard />;
  }

  if (user?.role === 'admin') {
    return <AdminDashboard />;
  }

  if (isCustomer) {
    return <CustomerDashboard />;
  }

  return <TenantDashboard />;
}