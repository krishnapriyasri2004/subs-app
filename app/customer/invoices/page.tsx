'use client';

import { useState, useMemo } from 'react';
import { useAuth } from '@/lib/auth-context';
import { mockCustomerInvoices, mockCustomerSubscriptions, mockBusinessPlans } from '@/lib/mock-data';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { format } from 'date-fns';
import { Download, Eye, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

export default function CustomerInvoicesPage() {
  const { user } = useAuth();

  if (user?.role !== 'customer') {
    return <div className="p-10 text-center">Unauthorized</div>;
  }

  // get invoices for this customer
  const myInvoices = useMemo(() => {
    return mockCustomerInvoices.filter(i => i.customerId === user.id);
  }, [user]);

  // summary card data
  const subscription = mockCustomerSubscriptions.find(s => s.customerId === user.id);
  const plan = subscription ? mockBusinessPlans.find(p => p.id === subscription.planId) : null;
  const outstanding = myInvoices
    .filter(i => i.status !== 'paid')
    .reduce((a, i) => a + i.totalAmount, 0);

  const [selected, setSelected] = useState<typeof myInvoices[0] | null>(null);

  const getStatusClasses = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-emerald-500/10 text-emerald-500';
      case 'overdue':
        return 'bg-rose-500/10 text-rose-500';
      default:
        return 'bg-yellow-500/10 text-yellow-500';
    }
  };

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-3xl font-extrabold">My Invoices</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Current Plan</p>
          <p className="text-xl font-bold">{plan?.name || '—'}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Next Billing Date</p>
          <p className="text-xl font-bold">
            {subscription ? format(new Date(subscription.endDate), 'dd MMM yyyy') : '—'}
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Outstanding Amount</p>
          <p className="text-xl font-bold">₹{outstanding.toLocaleString('en-IN')}</p>
        </Card>
      </div>

      <Card className="overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice No</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount (₹)</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {myInvoices.map(inv => (
              <TableRow key={inv.id}>
                <TableCell>{inv.invoiceNumber}</TableCell>
                <TableCell>{format(new Date(inv.issueDate), 'dd MMM yyyy')}</TableCell>
                <TableCell>₹{inv.totalAmount.toLocaleString('en-IN')}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusClasses(inv.status)}`}>
                    {inv.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {inv.status !== 'paid' && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toast(`Proceeding to pay ${inv.invoiceNumber}`)}
                      >
                        <CreditCard className="w-4 h-4" />
                      </Button>
                    )}
                    <Dialog open={selected?.id === inv.id} onOpenChange={(o) => !o && setSelected(null)}>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={() => setSelected(inv)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Invoice {inv.invoiceNumber}</DialogTitle>
                          <DialogDescription>
                            Detailed billing information
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 p-4">
                          <p>Company GSTIN: {inv.items.length ? '18AABCT1234F1Z0' : '-'}</p>
                          <p>Billing Address: {user.name} - sample address</p>
                          <table className="w-full text-left">
                            <thead>
                              <tr>
                                <th className="py-1">Item</th>
                                <th className="py-1">Qty</th>
                                <th className="py-1">Price</th>
                              </tr>
                            </thead>
                            <tbody>
                              {inv.items.map(it => (
                                <tr key={it.id}>
                                  <td>{it.description}</td>
                                  <td>{it.quantity}</td>
                                  <td>₹{it.unitPrice.toLocaleString('en-IN')}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          <p>CGST: ₹{(inv.tax / 2).toLocaleString('en-IN')}</p>
                          <p>SGST: ₹{(inv.tax / 2).toLocaleString('en-IN')}</p>
                          <p>Total: ₹{inv.totalAmount.toLocaleString('en-IN')}</p>
                          <p>Payment history: {inv.paidDate ? format(new Date(inv.paidDate), 'dd MMM yyyy') : 'not paid'}</p>
                        </div>
                        <DialogFooter>
                          <Button onClick={() => setSelected(null)}>Close</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toast(`Downloading ${inv.invoiceNumber}`)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
