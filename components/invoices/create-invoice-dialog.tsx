'use client';

import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import {
    Plus,
    Trash2,
    Calculator,
    FileText,
    Loader2,
    Calendar as CalendarIcon,
    ChevronRight,
    Search,
    IndianRupee,
    Info
} from 'lucide-react';
import { toast } from 'sonner';
import { useVendorAuth } from '@/lib/vendor-auth';
import { calculateGST } from '@/lib/gst-calculator';
import { useData } from '@/lib/data-context';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { downloadInvoicePdf } from '@/lib/pdf-util';

interface Customer {
    id: string;
    name: string;
    email: string;
    address: string;
    gstin?: string;
    state?: string;
}

interface LineItem {
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
    hsnSac?: string;
    amount: number;
}

export function CreateInvoiceDialog({ onInvoiceCreated }: { onInvoiceCreated?: () => void }) {
    const { user } = useVendorAuth();
    const { mockCustomers, addDocument } = useData();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const customers = mockCustomers as Customer[];

    // Form State
    const [selectedCustomerId, setSelectedCustomerId] = useState('');
    const [invoiceNumber, setInvoiceNumber] = useState('');
    const [issueDate, setIssueDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [dueDate, setDueDate] = useState(format(new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'));

    const [items, setItems] = useState<LineItem[]>([
        { id: uuidv4(), description: '', quantity: 1, unitPrice: 0, amount: 0 }
    ]);

    // Generate invoice number
    useEffect(() => {
        if (open) {
            // Generate a random invoice number if empty
            if (!invoiceNumber) {
                setInvoiceNumber(`INV-${Math.floor(10000 + Math.random() * 90000)}`);
            }
        }
    }, [open, invoiceNumber]);

    const handleAddItem = () => {
        setItems([...items, { id: uuidv4(), description: '', quantity: 1, unitPrice: 0, amount: 0 }]);
    };

    const handleRemoveItem = (id: string) => {
        if (items.length > 1) {
            setItems(items.filter(item => item.id !== id));
        }
    };

    const handleItemChange = (id: string, field: keyof LineItem, value: string | number) => {
        setItems(items.map(item => {
            if (item.id === id) {
                const updatedItem = { ...item, [field]: value };
                if (field === 'quantity' || field === 'unitPrice') {
                    updatedItem.amount = Number(updatedItem.quantity) * Number(updatedItem.unitPrice);
                }
                return updatedItem;
            }
            return item;
        }));
    };

    const selectedCustomer = customers.find(c => c.id === selectedCustomerId);

    // Calculations
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const gstRate = 18; // Default 18%
    const sellerState = (user as any)?.state || 'Tamil Nadu';
    const buyerState = selectedCustomer?.state || 'Tamil Nadu';

    // Calculate total GST
    const gstInfo = calculateGST(subtotal, gstRate, sellerState, buyerState);
    const totalGst = gstInfo.cgst + gstInfo.sgst + gstInfo.igst;
    const totalAmount = subtotal + totalGst;

    const handleSubmit = async (e: React.FormEvent, status: 'sent' | 'draft' = 'sent') => {
        e.preventDefault();

        if (!selectedCustomerId) {
            toast.error("Please select a customer");
            return;
        }

        if (items.some(item => !item.description || item.unitPrice <= 0)) {
            toast.error("Please fill in all item details correctly");
            return;
        }

        const loadingToast = toast.loading("Saving invoice and generating PDF...");
        setLoading(true);

        try {
            console.log("Invoice Generation Started:", { invoiceNumber, customerId: selectedCustomerId });
            
            const newInvoice = {
                id: uuidv4(),
                invoiceNumber,
                tenantId: user?.tenantId,
                customerId: selectedCustomerId,
                customerName: selectedCustomer?.name,
                customerEmail: selectedCustomer?.email,
                customerAddress: selectedCustomer?.address,
                customerGstin: selectedCustomer?.gstin,
                customerState: selectedCustomer?.state,
                issueDate,
                dueDate,
                status,
                subtotal,
                taxAmount: totalGst,
                totalAmount,
                items: items.map(item => ({
                    ...item,
                    hsnSac: item.hsnSac || '9983'
                })),
                gstDetails: {
                    cgst: gstInfo.cgst,
                    sgst: gstInfo.sgst,
                    igst: gstInfo.igst,
                    rate: gstRate
                }
            };

            await addDocument('invoices', newInvoice);
            console.log("Invoice Document Saved Successfully");

            if (status === 'sent') {
                toast.loading("Generating PDF document...", { id: loadingToast });
                // Generate PDF
                await downloadInvoicePdf(newInvoice, user);
                toast.success("Invoice generated and downloaded successfully!", { id: loadingToast });
            } else {
                toast.success("Invoice saved as draft!", { id: loadingToast });
            }

            setOpen(false);

            // Reset state
            setSelectedCustomerId('');
            setInvoiceNumber('');
            setItems([{ id: uuidv4(), description: '', quantity: 1, unitPrice: 0, amount: 0 }]);

            if (onInvoiceCreated) onInvoiceCreated();
        } catch (error: any) {
            console.error("Invoice Generation Error:", error);
            toast.error(`Failed to generate invoice: ${error?.message || 'Unknown error'}`, { id: loadingToast });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold gap-2 h-10 px-6 rounded-lg shadow-lg shadow-blue-600/20">
                    <Plus className="w-4 h-4" /> Generate Invoice
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px] h-[90vh] flex flex-col p-0 gap-0 border-none shadow-2xl overflow-hidden rounded-2xl">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white shrink-0">
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Invoice Generator</span>
                            </div>
                            <DialogTitle className="text-3xl font-black tracking-tight">Create Professional Invoice</DialogTitle>
                            <DialogDescription className="text-blue-100 text-sm mt-1">
                                Generate GST compliant invoices for your customers in seconds.
                            </DialogDescription>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-xl border border-white/20 mr-8">
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Amount Preview</p>
                            <p className="text-2xl font-black">₹{totalAmount.toLocaleString('en-IN')}</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={(e) => handleSubmit(e, 'sent')} className="flex flex-col flex-1 overflow-hidden">
                    <div className="flex-1 overflow-y-auto bg-slate-50 p-8 space-y-8">
                        {/* Section 1: Basic Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-black uppercase text-slate-400 tracking-wider">Select Customer</Label>
                                    <Select value={selectedCustomerId} onValueChange={setSelectedCustomerId}>
                                        <SelectTrigger className="h-12 bg-slate-50 border-slate-200 focus:ring-blue-500 rounded-xl">
                                            <SelectValue placeholder="Choose a customer..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {customers.length === 0 ? (
                                                <SelectItem value="none" disabled>No customers found</SelectItem>
                                            ) : (
                                                customers.map(cust => (
                                                    <SelectItem key={cust.id} value={cust.id}>
                                                        {cust.name} ({cust.email})
                                                    </SelectItem>
                                                ))
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-black uppercase text-slate-400 tracking-wider">Invoice Number</Label>
                                    <div className="relative">
                                        <Info className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <Input
                                            value={invoiceNumber}
                                            onChange={(e) => setInvoiceNumber(e.target.value)}
                                            className="h-12 pl-12 bg-slate-50 border-slate-200 focus:ring-blue-500 rounded-xl font-bold"
                                            placeholder="INV-00001"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-black uppercase text-slate-400 tracking-wider">Issue Date</Label>
                                    <div className="relative">
                                        <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <Input
                                            type="date"
                                            value={issueDate}
                                            onChange={(e) => setIssueDate(e.target.value)}
                                            className="h-12 pl-12 bg-slate-50 border-slate-200 focus:ring-blue-500 rounded-xl"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-black uppercase text-slate-400 tracking-wider">Due Date</Label>
                                    <div className="relative">
                                        <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <Input
                                            type="date"
                                            value={dueDate}
                                            onChange={(e) => setDueDate(e.target.value)}
                                            className="h-12 pl-12 bg-slate-50 border-slate-200 focus:ring-blue-500 rounded-xl"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Items */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-black text-slate-900 tracking-tight">Invoice Items</h3>
                                <Button
                                    type="button"
                                    onClick={handleAddItem}
                                    variant="outline"
                                    className="border-dashed border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700 font-bold"
                                >
                                    <Plus className="w-4 h-4 mr-2" /> Add Line Item
                                </Button>
                            </div>

                            <Card className="rounded-2xl border-slate-200 overflow-hidden shadow-sm">
                                <table className="w-full text-sm">
                                    <thead className="bg-slate-50 border-b border-slate-100">
                                        <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                            <th className="px-6 py-4 text-left">Description</th>
                                            <th className="px-4 py-4 text-center w-24">Qty</th>
                                            <th className="px-4 py-4 text-right w-36">Rate</th>
                                            <th className="px-4 py-4 text-right w-36">Amount</th>
                                            <th className="px-6 py-4 text-center w-16"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 bg-white">
                                        {items.map((item) => (
                                            <tr key={item.id} className="group">
                                                <td className="px-6 py-4">
                                                    <Input
                                                        placeholder="e.g. Service Fee"
                                                        value={item.description}
                                                        onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                                                        className="border-none bg-slate-50/50 h-10 focus-visible:ring-1 focus-visible:ring-blue-500 rounded-lg font-medium px-3"
                                                        required
                                                    />
                                                </td>
                                                <td className="px-4 py-4">
                                                    <Input
                                                        type="number"
                                                        value={item.quantity}
                                                        onChange={(e) => handleItemChange(item.id, 'quantity', Number(e.target.value))}
                                                        className="text-center h-10 border-slate-100 focus:ring-blue-500 rounded-lg font-medium"
                                                        min="1"
                                                        required
                                                    />
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="relative">
                                                        <Input
                                                            type="number"
                                                            value={item.unitPrice}
                                                            onChange={(e) => handleItemChange(item.id, 'unitPrice', Number(e.target.value))}
                                                            className="text-right h-10 border-slate-100 focus:ring-blue-500 rounded-lg pr-9 font-medium tabular-nums"
                                                            min="0"
                                                            required
                                                        />
                                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none font-medium">₹</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 text-right font-bold text-slate-900 tabular-nums">
                                                    ₹{item.amount.toLocaleString('en-IN')}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleRemoveItem(item.id)}
                                                        className="h-8 w-8 text-slate-300 hover:text-red-500 transition-colors"
                                                        disabled={items.length === 1}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </Card>
                        </div>

                        {/* Section 3: Totals */}
                        <div className="flex justify-end pt-4">
                            <div className="w-full md:w-80 space-y-3 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                <div className="flex justify-between items-center text-sm font-medium text-slate-500">
                                    <span>Subtotal</span>
                                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm font-medium text-slate-500">
                                    <div className="flex items-center gap-2">
                                        <span>GST ({gstRate}%)</span>
                                        <Badge variant="outline" className="text-[9px] h-4 px-1.5 font-bold uppercase">
                                            {gstInfo.igst > 0 ? 'IGST' : 'CGST+SGST'}
                                        </Badge>
                                    </div>
                                    <span>₹{totalGst.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="h-px bg-slate-100 my-2" />
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-black text-slate-900">Total Amount</span>
                                    <span className="text-xl font-black text-blue-600">₹{totalAmount.toLocaleString('en-IN')}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="sticky bottom-0 bg-white border-t border-slate-100 p-6 shadow-[0_-10px_20px_rgba(0,0,0,0.02)] shrink-0">
                        <div className="flex w-full items-center justify-between">
                            <div className="hidden md:flex items-center gap-2 text-slate-400">
                                <Calculator className="w-4 h-4" />
                                <span className="text-xs font-bold uppercase tracking-widest">Self-Correcting Totals</span>
                            </div>
                            <div className="flex gap-3">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => setOpen(false)}
                                    className="font-bold text-slate-500 h-11 px-6"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={(e) => {
                                        handleSubmit(e, 'draft');
                                    }}
                                    className="border-slate-200 text-slate-600 font-bold h-11 px-6 rounded-xl hover:bg-slate-50"
                                    disabled={loading}
                                >
                                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save as Draft'}
                                </Button>
                                <Button
                                    type="button"
                                    onClick={(e) => {
                                        handleSubmit(e, 'sent');
                                    }}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-black h-11 px-8 rounded-xl shadow-lg shadow-blue-600/20 gap-2"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <>
                                            Generate & Send Invoice
                                            <ChevronRight className="w-4 h-4" />
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function Badge({ children, variant, className }: { children: React.ReactNode, variant?: string, className?: string }) {
    return (
        <span className={cn(
            "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            variant === "outline" ? "text-foreground" : "bg-primary text-primary-foreground",
            className
        )}>
            {children}
        </span>
    );
}
