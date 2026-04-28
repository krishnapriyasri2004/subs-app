'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/auth-context';
import { mockInvoices, mockTenants, mockCustomerInvoices, mockCustomers } from '@/lib/mock-data';
import { 
  Download, 
  Eye, 
  Search, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ArrowUpRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { IssueInvoiceDialog, ViewInvoiceDialog } from '@/components/dashboard/invoice-dialogs';

export default function InvoicesPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  
  const isPlatformAdmin = user?.role === 'admin' || user?.role === 'super_admin';
  const isBusinessOwner = user?.role === 'tenant_owner';

  const [allInvoices, setAllInvoices] = useState<any[]>(mockInvoices);

  const fetchInvoices = () => {
    const localInvoices = JSON.parse(localStorage.getItem('admin_invoices') || '[]');
    setAllInvoices([...localInvoices, ...mockInvoices]);
  };

  useEffect(() => {
    fetchInvoices();
    window.addEventListener('adminInvoiceCreated', fetchInvoices);
    return () => window.removeEventListener('adminInvoiceCreated', fetchInvoices);
  }, []);

  const invoices = isPlatformAdmin
    ? allInvoices
    : isBusinessOwner
      ? mockCustomerInvoices.filter(i => i.tenantId === user?.tenantId)
      : allInvoices.filter(i => i.tenantId === user?.tenantId);

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch = 
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mockTenants
        .find((t) => t.id === invoice.tenantId)
        ?.name.toLowerCase()
        .includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  const getEntityName = (invoice: any) => {
    if (isPlatformAdmin) {
      return mockTenants.find((t) => t.id === invoice.tenantId)?.name || 'Unknown';
    }
    const customer = mockCustomers.find(c => c.id === (invoice as any).customerId);
    return customer?.name || 'Unknown Customer';
  };

  const stats = {
    totalInvoices: invoices.length,
    paidInvoices: invoices.filter((inv) => inv.status === 'paid').length,
    pendingAmount: invoices
      .filter((inv) => inv.status !== 'paid')
      .reduce((sum, inv) => sum + inv.totalAmount, 0),
    totalAmount: invoices.reduce((sum, inv) => sum + inv.totalAmount, 0),
  };

  return (
    <div className="space-y-10 pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 animate-in-fade text-slate-900">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
            Financial <span className="text-gradient">Ledger</span>
          </h1>
          <p className="text-muted-foreground mt-2 text-lg max-w-2xl font-medium">
            {user?.role === 'admin'
              ? 'Comprehensive overview of global transactions, billings, and revenue collections.'
              : 'Track your billing history, download receipts, and manage pending payments.'}
          </p>
        </div>
        {user?.role === 'admin' && (
          <IssueInvoiceDialog />
        )}
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in-up delay-100">
        <Card className="glass-card p-6 flex flex-col justify-between hover:scale-[1.02] transition-transform cursor-pointer border-slate-100">
          <div className="flex justify-between items-start">
            <p className="text-sm font-semibold text-muted-foreground">Volume</p>
            <div className="p-2 bg-primary/10 rounded-xl">
              <FileText className="w-5 h-5 text-primary" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-black text-slate-900 tracking-tighter">{stats.totalInvoices}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black mt-1">Total Records</p>
          </div>
        </Card>

        <Card className="glass-card p-6 flex flex-col justify-between hover:scale-[1.02] transition-transform cursor-pointer border-slate-100">
          <div className="flex justify-between items-start">
            <p className="text-sm font-semibold text-muted-foreground">Clearance</p>
            <div className="p-2 bg-emerald-500/10 rounded-xl">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-black text-emerald-500 tracking-tighter">{stats.paidInvoices}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black mt-1">Settled Invoices</p>
          </div>
        </Card>

        <Card className="glass-card p-6 flex flex-col justify-between hover:scale-[1.02] transition-transform cursor-pointer border-slate-100">
          <div className="flex justify-between items-start">
            <p className="text-sm font-semibold text-muted-foreground">Gross Revenue</p>
            <div className="p-2 bg-blue-500/10 rounded-xl">
              <Clock className="w-5 h-5 text-blue-500" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-black text-blue-500 tracking-tighter">₹{stats.totalAmount.toLocaleString('en-IN')}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black mt-1">Total Value</p>
          </div>
        </Card>

        <Card className="glass-card p-6 flex flex-col justify-between border-rose-500/10 bg-rose-500/[0.02] hover:scale-[1.02] transition-transform cursor-pointer">
          <div className="flex justify-between items-start">
            <p className="text-sm font-semibold text-muted-foreground">Outstanding</p>
            <div className="p-2 bg-rose-500/10 rounded-xl">
              <AlertCircle className="w-5 h-5 text-rose-500" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-black text-rose-500 tracking-tighter">₹{stats.pendingAmount.toLocaleString('en-IN')}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black mt-1">Unpaid Balance</p>
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-4 animate-in-up delay-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by invoice ID, partner name, or date..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-14 bg-white/50 backdrop-blur-sm border-slate-200 focus:ring-primary/20 rounded-2xl text-lg shadow-sm font-medium"
            />
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <Card className="glass-card overflow-hidden animate-in-up delay-300">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/30 border-b border-border/50">
                <th className="text-left py-5 px-6 font-bold text-foreground uppercase tracking-wider text-xs">
                  Invoice ID
                </th>
                <th className="text-left py-5 px-6 font-bold text-foreground uppercase tracking-wider text-xs">
                  {isPlatformAdmin ? 'Enterprise' : 'Customer'}
                </th>
                <th className="text-left py-5 px-6 font-bold text-foreground uppercase tracking-wider text-xs">
                  Valuation
                </th>
                <th className="text-left py-5 px-6 font-bold text-foreground uppercase tracking-wider text-xs">
                  Timeline
                </th>
                <th className="text-left py-5 px-6 font-bold text-foreground uppercase tracking-wider text-xs">
                  Status
                </th>
                <th className="text-right py-5 px-6 font-bold text-foreground uppercase tracking-wider text-xs">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredInvoices.map((invoice) => (
                <tr
                  key={invoice.id}
                  className="group hover:bg-primary/[0.02] transition-colors"
                >
                  <td className="py-5 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                        <FileText className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-foreground group-hover:text-primary transition-colors font-mono">
                        {invoice.invoiceNumber}
                      </span>
                    </div>
                  </td>
                  <td className="py-5 px-6">
                    <div className="text-sm font-medium text-foreground">
                      {getEntityName(invoice)}
                    </div>
                  </td>
                  <td className="py-5 px-6">
                    <div className="text-sm font-extrabold text-foreground">
                      ₹{invoice.totalAmount.toLocaleString('en-IN')}
                    </div>
                  </td>
                  <td className="py-5 px-6">
                    <div className="flex flex-col gap-1">
                      <div className="text-[10px] text-muted-foreground uppercase font-bold">Issued: {new Date(invoice.issueDate).toLocaleDateString('en-IN')}</div>
                      <div className="text-[10px] text-rose-500 uppercase font-bold">Due: {new Date(invoice.dueDate).toLocaleDateString('en-IN')}</div>
                    </div>
                  </td>
                  <td className="py-5 px-6">
                    <span
                      className={`inline-flex px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border ${invoice.status === 'paid'
                        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                        : invoice.status === 'overdue'
                          ? 'bg-rose-500/10 text-rose-500 border-rose-500/20 shadow-[0_0_10px_rgba(244,63,94,0.1)] animate-pulse'
                          : invoice.status === 'sent'
                            ? 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                            : 'bg-muted text-muted-foreground border-border'
                        }`}
                    >
                      {invoice.status}
                    </span>
                  </td>
                  <td className="py-5 px-6">
                    <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                      <ViewInvoiceDialog
                        invoice={invoice}
                        entityName={getEntityName(invoice)}
                        trigger={
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 rounded-xl text-primary hover:bg-primary/10"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        }
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-xl text-primary hover:bg-primary/10"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-xl text-muted-foreground hover:bg-muted"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredInvoices.length === 0 && (
          <div className="text-center py-24">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6 transform -rotate-12">
              <FileText className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold text-foreground">Zero records found</h3>
            <p className="text-muted-foreground max-w-sm mx-auto mt-2">
              We couldn't locate any financial documents matching your criteria. Try adjusting your filters.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
