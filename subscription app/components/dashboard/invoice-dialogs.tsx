'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Loader2, Send } from 'lucide-react';
import { mockTenants } from '@/lib/mock-data';
import { toast } from 'sonner';

export function IssueInvoiceDialog() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // Form state
    const [tenantId, setTenantId] = useState('');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Simulated API call
            await new Promise((r) => setTimeout(r, 1200));

            const newInvoice = {
                id: `INV-${Date.now()}`,
                invoiceNumber: `INV-${Math.floor(Math.random() * 10000)}`,
                tenantId: tenantId,
                status: 'sent',
                totalAmount: parseFloat(amount),
                amount: parseFloat(amount),
                currency: 'INR',
                tax: 0,
                items: [{ id: 'item1', description: description || 'Custom Service', quantity: 1, unitPrice: parseFloat(amount), amount: parseFloat(amount) }],
                issueDate: new Date().toISOString(),
                dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            const existingInvoices = JSON.parse(localStorage.getItem('admin_invoices') || '[]');
            localStorage.setItem('admin_invoices', JSON.stringify([newInvoice, ...existingInvoices]));
            window.dispatchEvent(new Event('adminInvoiceCreated'));

            toast.success("Invoice generated and sent successfully!");
            setOpen(false);

            // Reset state
            setTenantId('');
            setAmount('');
            setDescription('');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 rounded-xl px-6 h-12">
                    <FileText className="w-5 h-5 mr-2" />
                    Issue New Invoice
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-black text-slate-800">Generate Invoice</DialogTitle>
                    <DialogDescription>
                        Bill a partner directly for custom services, licensing extensions, or overages.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 py-4">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="tenant">Select Partner Entity *</Label>
                            <Select value={tenantId} onValueChange={setTenantId} required>
                                <SelectTrigger className="h-12 bg-slate-50 border-slate-200">
                                    <SelectValue placeholder="Search or select a partner..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {mockTenants.filter(t => t.status === 'active').map(tenant => (
                                        <SelectItem key={tenant.id} value={tenant.id}>{tenant.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="amount">Invoice Value (₹) *</Label>
                            <Input
                                id="amount"
                                type="number"
                                placeholder="0.00"
                                required
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="h-12 bg-slate-50 border-slate-200 text-slate-900 font-medium"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="desc">Line Item Description</Label>
                            <Input
                                id="desc"
                                placeholder="e.g. Annual Platform Overage Fees"
                                required
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="h-12 bg-slate-50 border-slate-200"
                            />
                        </div>
                    </div>

                    <DialogFooter className="gap-2 sm:space-x-0">
                        <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="h-12 border-slate-200">
                            Cancel
                        </Button>
                        <Button type="submit" className="h-12 px-8 bg-indigo-600 hover:bg-indigo-700 text-white font-bold" disabled={loading || !tenantId || !amount}>
                            {loading ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                                <Send className="w-4 h-4 mr-2" />
                            )}
                            Generate & Send
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export function ViewInvoiceDialog({ invoice, entityName, trigger }: { invoice: any, entityName: string, trigger: React.ReactNode }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden bg-slate-50">
                <div className="bg-white p-8 border-b-4 border-indigo-600">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h2 className="text-3xl font-black text-slate-900 tracking-tighter">INVOICE</h2>
                            <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest">{invoice.invoiceNumber}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
                            <span className={`inline-flex px-3 py-1 rounded-sm text-[10px] font-black uppercase tracking-widest ${invoice.status === 'paid' ? 'bg-emerald-100 text-emerald-700' :
                                invoice.status === 'overdue' ? 'bg-rose-100 text-rose-700' :
                                    'bg-indigo-100 text-indigo-700'
                                }`}>
                                {invoice.status}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8 mb-8">
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Billed To</p>
                            <p className="font-bold text-slate-800">{entityName}</p>
                            <p className="text-sm text-slate-500 mt-1 truncate">{"Billing Email On File"}</p>
                        </div>
                        <div className="text-right">
                            <div className="mb-4">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Issue Date</p>
                                <p className="text-sm font-semibold text-slate-800">{new Date(invoice.issueDate).toLocaleDateString('en-IN')}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-rose-400 uppercase tracking-widest mb-1">Due Date</p>
                                <p className="text-sm font-semibold text-rose-600">{new Date(invoice.dueDate).toLocaleDateString('en-IN')}</p>
                            </div>
                        </div>
                    </div>

                    <div className="border border-slate-100 rounded-lg overflow-hidden bg-slate-50">
                        <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-white">
                            <p className="text-sm font-bold text-slate-800">Description</p>
                            <p className="text-sm font-bold text-slate-800 text-right">Amount</p>
                        </div>
                        <div className="flex justify-between items-center p-4">
                            <p className="text-sm font-medium text-slate-600 max-w-[70%]">Enterprise Platform Licensing & Associated Usage Fees</p>
                            <p className="text-sm font-black text-slate-900 text-right">₹{invoice.totalAmount.toLocaleString('en-IN')}</p>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-slate-50 flex justify-between items-center">
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Due</p>
                        <p className="text-2xl font-black text-slate-900 tracking-tighter">₹{invoice.totalAmount.toLocaleString('en-IN')}</p>
                    </div>
                    <Button variant="outline" className="border-indigo-200 text-indigo-600 hover:bg-indigo-50 font-bold px-6">
                        <FileText className="w-4 h-4 mr-2" /> Download PDF
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
