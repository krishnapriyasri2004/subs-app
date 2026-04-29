'use client';

import { useAuth } from '../../lib/auth-context';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  LayoutDashboard,
  Building2,
  CreditCard,
  FileText,
  BarChart3,
  Users,
  Settings,
  LogOut,
  Zap,
  Banknote,
  History,
  ShieldAlert,
  ClipboardList,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/ui/logo';

export default function DashboardNavigation() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.push('/vendor/auth');
  };

  const isSuperAdmin = user?.role === 'super_admin';
  const isAdmin = user?.role === 'admin';

  const getNavItems = () => {
    // 1. Super Admin View (Platform Infrastructure)
    if (isSuperAdmin) {
      return [
        { href: '/dashboard', label: 'Global Dashboard', icon: LayoutDashboard },
        { href: '/dashboard/requests', label: 'Request', icon: ClipboardList },
        { href: '/dashboard/tenants', label: 'Tenants', icon: Building2 },
        { href: '/dashboard/plans', label: 'Plans & Pricing', icon: CreditCard },
        { href: '/dashboard/revenue', label: 'Global Revenue', icon: Banknote },
        { href: '/dashboard/analytics', label: 'Subscription Analytics', icon: BarChart3 },
        { href: '/dashboard/invoices', label: 'Invoices', icon: FileText },
        { href: '/dashboard/payments', label: 'Payment Logs', icon: History },
        { href: '/dashboard/dunning', label: 'Dunning Hub', icon: ShieldAlert },
        { href: '/dashboard/settings', label: 'Platform Settings', icon: Settings },
      ];
    }

    // 2. Admin View (Operations)
    if (isAdmin) {
      return [
        { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
        { href: '/dashboard/requests', label: 'Request', icon: ClipboardList },
        { href: '/dashboard/tenants', label: 'Tenants', icon: Building2 },
        { href: '/dashboard/plans', label: 'Plans', icon: CreditCard },
        { href: '/dashboard/subscriptions', label: 'Subscriptions', icon: Zap },
        { href: '/dashboard/invoices', label: 'Invoices', icon: FileText },
        { href: '/dashboard/users', label: 'Users', icon: Users },
        { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
        { href: '/dashboard/settings', label: 'Settings', icon: Settings },
      ];
    }



    // 4. Customer View (Self-Service)
    if (user?.role === 'customer' || user?.email === 'customer@user.com') {
      return [
        { href: '/dashboard', label: 'My Portal', icon: LayoutDashboard },
        { href: '/dashboard/subscriptions', label: 'Subscriptions', icon: Zap },
        { href: '/dashboard/plans', label: 'Plans', icon: CreditCard },
        { href: '/customer/invoices', label: 'Invoices', icon: FileText },
        { href: '/dashboard/settings', label: 'Settings', icon: Settings },
      ];
    }

    // 5. Tenant Owner View (The "Milk & Rice" vendors)
    return [
      { href: '/dashboard', label: 'My Dashboard', icon: LayoutDashboard },
      { href: '/dashboard/requests', label: 'Request', icon: ClipboardList },
      { href: '/dashboard/customers', label: 'Customers', icon: Users },
      { href: '/dashboard/plans', label: 'Plans', icon: CreditCard },
      { href: '/dashboard/subscriptions', label: 'Subscriptions', icon: Zap },
      { href: '/dashboard/invoices', label: 'Invoices', icon: FileText },
      { href: '/dashboard/payments', label: 'Payments', icon: Banknote },
      { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
      { href: '/dashboard/settings', label: 'Settings', icon: Settings },
    ];
  };

  const navItems = getNavItems();

  return (
    <aside className={cn(
      "w-64 flex flex-col h-screen sticky top-0 border-r transition-colors",
      isSuperAdmin
        ? "bg-[#111827] text-slate-300 border-slate-800"
        : "bg-background/50 backdrop-blur-xl border-border/50 text-foreground"
    )}>
      {/* Header */}
      <div className={cn(
        "p-6 border-b",
        isSuperAdmin ? "border-slate-800" : "border-border/50"
      )}>
        <Logo size={32} variant={isSuperAdmin ? "light" : undefined} />
        <p className={cn(
          "text-[10px] uppercase tracking-wider font-bold mt-1",
          isSuperAdmin ? "text-slate-500" : "text-muted-foreground/60"
        )}>
          {isSuperAdmin ? 'Super Admin HQ' : isAdmin ? 'Admin Console' : (user?.role === 'customer' || user?.email === 'customer@user.com') ? 'Customer Portal' : 'Partner Portal'}
        </p>
      </div>

      {/* User Info */}
      <div className={cn(
        "p-4 mx-4 my-6 rounded-2xl border",
        isSuperAdmin
          ? "bg-indigo-500/10 border-indigo-500/20"
          : "bg-primary/5 border-primary/10"
      )}>
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center font-bold",
            isSuperAdmin ? "bg-indigo-500 text-white" : "bg-primary/20 text-primary"
          )}>
            {user?.name?.charAt(0) || 'A'}
          </div>
          <div className="overflow-hidden">
            <p className={cn(
              "text-sm font-bold truncate",
              isSuperAdmin ? "text-slate-200" : "text-foreground"
            )}>{user?.name}</p>
            <p className={cn(
              "text-[10px] truncate",
              isSuperAdmin ? "text-slate-400" : "text-muted-foreground"
            )}>{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start transition-all duration-200 gap-3 px-4 py-6 rounded-xl",
                  isActive
                    ? isSuperAdmin
                      ? "bg-indigo-600 text-white shadow-sm hover:bg-indigo-500"
                      : "bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90"
                    : isSuperAdmin
                      ? "text-slate-400 hover:bg-slate-800 hover:text-white"
                      : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive ? "text-white" : "text-current")} />
                <span className="font-medium">{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                )}
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className={cn(
        "p-4 border-t",
        isSuperAdmin ? "border-slate-800" : "border-border/50"
      )}>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start gap-3 border-transparent transition-colors py-6 rounded-xl group",
            isSuperAdmin
              ? "hover:bg-rose-500/20 hover:text-rose-400 text-slate-400"
              : "hover:bg-rose-500/10 hover:text-rose-500 text-muted-foreground"
          )}
          onClick={handleLogout}
        >
          <LogOut className={cn(
            "w-5 h-5 group-hover:text-rose-500",
            isSuperAdmin ? "text-slate-400 group-hover:text-rose-400" : "text-muted-foreground"
          )} />
          <span className="font-medium">Sign Out</span>
        </Button>
      </div>
    </aside>
  );
}