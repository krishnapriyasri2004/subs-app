'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useVendorAuth } from '@/lib/vendor-auth';
import { useData } from '@/lib/data-context';
import { calculateGST } from '@/lib/gst-calculator';
import { downloadInvoicePdf } from '@/lib/pdf-util';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
    Plus, 
    Trash2, 
    Calendar as CalendarIcon, 
    Info, 
    ChevronRight, 
    ArrowLeft,
    Calculator,
    Loader2
} from 'lucide-react';
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

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

export default function NewInvoicePage() {
    const router = useRouter();
    const { user } = useVendorAuth();
    const { mockCustomers: customers, addDocument } = useData();
    const [loading, setLoading] = useState(false);

    // Form State
    const [selectedCustomerId, setSelectedCustomerId] = useState('');
    const [invoiceNumber, setInvoiceNumber] = useState(`INV-${Math.floor(10000 + Math.random() * 90000)}`);
    const [issueDate, setIssueDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [dueDate, setDueDate] = useState(format(new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'));

    const [items, setItems] = useState<LineItem[]>([
        { id: uuidv4(), description: '', quantity: 1, unitPrice: 0, amount: 0 }
    ]);

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

    const handleSubmit = async (status: 'sent' | 'draft' = 'sent') => {
        if (!selectedCustomerId && status === 'sent') {
            toast.error("Please select a customer for sending");
            return;
        }

        const loadingToast = toast.loading(status === 'sent' ? "Saving and Generating PDF..." : "Saving draft...");
        setLoading(true);

        try {
            const finalCustomerId = selectedCustomerId || 'one-time-cust';
            const finalCustomerName = selectedCustomer?.name || 'One-time Customer';

            const newInvoice = {
                id: uuidv4(),
                invoiceNumber,
                tenantId: user?.tenantId,
                customerId: finalCustomerId,
                customerName: finalCustomerName,
                customerEmail: selectedCustomer?.email || 'N/A',
                customerAddress: selectedCustomer?.address || 'N/A',
                customerGstin: selectedCustomer?.gstin || 'N/A',
                customerState: selectedCustomer?.state || sellerState,
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

            if (status === 'sent') {
                await downloadInvoicePdf(newInvoice, user);
                toast.success("Invoice generated and downloaded!", { id: loadingToast });
            } else {
                toast.success("Saved as draft!", { id: loadingToast });
            }

            router.push('/vendor/invoices');
        } catch (error: any) {
            console.error("Error creating invoice:", error);
            toast.error(`Error: ${error?.message || 'Check connection'}`, { id: loadingToast });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-20">
            {/* Header Area */}
            <div className="flex flex-col gap-4">
                <Button 
                    variant="ghost" 
                    onClick={() => router.back()}
                    className="w-fit gap-2 -ml-2 text-slate-500 font-bold hover:text-slate-900"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to List
                </Button>
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Create New Invoice</h1>
                        <p className="text-slate-500 font-medium mt-1">Fill in the details below to generate a professional GST invoice.</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Side */}
                <div className="lg:col-span-2 space-y-8">
                    <Card className="p-8 border-slate-200 shadow-xl shadow-slate-200/20 rounded-3xl space-y-8">
                        {/* Section 1: Basic Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Select Customer</Label>
                                    <Select value={selectedCustomerId} onValueChange={setSelectedCustomerId}>
                                        <SelectTrigger className="h-14 bg-slate-50 border-slate-200 focus:ring-blue-500 rounded-2xl">
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
                                    <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Invoice Number</Label>
                                    <div className="relative">
                                        <Info className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                        <Input
                                            value={invoiceNumber}
                                            onChange={(e) => setInvoiceNumber(e.target.value)}
                                            className="h-14 pl-12 bg-slate-50 border-slate-200 focus:ring-blue-500 rounded-2xl font-black text-slate-900"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Issue Date</Label>
                                    <div className="relative">
                                        <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                        <Input
                                            type="date"
                                            value={issueDate}
                                            onChange={(e) => setIssueDate(e.target.value)}
                                            className="h-14 pl-12 bg-slate-50 border-slate-200 focus:ring-blue-500 rounded-2xl font-bold"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Due Date</Label>
                                    <div className="relative">
                                        <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                        <Input
                                            type="date"
                                            value={dueDate}
                                            onChange={(e) => setDueDate(e.target.value)}
                                            className="h-14 pl-12 bg-slate-50 border-slate-200 focus:ring-blue-500 rounded-2xl font-bold"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="h-px bg-slate-100" />

                        {/* Section 2: Items */}
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-black text-slate-900 tracking-tight">Invoice Items</h3>
                                <Button
                                    type="button"
                                    onClick={handleAddItem}
                                    variant="outline"
                                    className="h-10 border-dashed border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700 font-black rounded-xl"
                                >
                                    <Plus className="w-4 h-4 mr-2" /> Add Item
                                </Button>
                            </div>

                            <div className="space-y-4">
                                {items.map((item) => (
                                    <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-5 bg-slate-50/50 rounded-2xl border border-slate-100 relative group animate-in fade-in zoom-in duration-300">
                                        <div className="md:col-span-6 space-y-1.5">
                                            <Label className="text-[9px] font-black uppercase text-slate-400">Description</Label>
                                            <Input
                                                placeholder="Service or Product name"
                                                value={item.description}
                                                onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                                                className="border-slate-200 h-10 bg-white focus:ring-blue-500 rounded-xl font-medium"
                                            />
                                        </div>
                                        <div className="md:col-span-2 space-y-1.5">
                                            <Label className="text-[9px] font-black uppercase text-slate-400">Qty</Label>
                                            <Input
                                                type="number"
                                                value={item.quantity}
                                                onChange={(e) => handleItemChange(item.id, 'quantity', Number(e.target.value))}
                                                className="text-center h-10 border-slate-200 bg-white focus:ring-blue-500 rounded-xl font-black"
                                                min="1"
                                            />
                                        </div>
                                        <div className="md:col-span-3 space-y-1.5">
                                            <Label className="text-[9px] font-black uppercase text-slate-400">Rate (₹)</Label>
                                            <Input
                                                type="number"
                                                value={item.unitPrice}
                                                onChange={(e) => handleItemChange(item.id, 'unitPrice', Number(e.target.value))}
                                                className="text-right h-10 border-slate-200 bg-white focus:ring-blue-500 rounded-xl font-black tabular-nums"
                                                min="0"
                                            />
                                        </div>
                                        <div className="md:col-span-1 flex items-end justify-center pb-1">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleRemoveItem(item.id)}
                                                className="h-10 w-10 text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all rounded-xl"
                                                disabled={items.length === 1}
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Summary / Actions Side */}
                <div className="space-y-6">
                    <Card className="p-8 border-slate-200 shadow-xl shadow-slate-200/20 rounded-3xl sticky top-6">
                        <h3 className="text-xl font-black text-slate-900 tracking-tight mb-6">Payment Summary</h3>
                        
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm font-bold text-slate-500">
                                <span>Subtotal</span>
                                <span className="text-slate-900">₹{subtotal.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm font-bold text-slate-500">
                                <div className="flex items-center gap-2">
                                    <span>GST ({gstRate}%)</span>
                                    <Badge variant="outline" className="text-[9px] h-4 px-1.5 font-black bg-blue-50 text-blue-600 border-blue-100 uppercase">
                                        {gstInfo.igst > 0 ? 'IGST' : 'CGST+SGST'}
                                    </Badge>
                                </div>
                                <span className="text-slate-900">₹{totalGst.toLocaleString('en-IN')}</span>
                            </div>
                            
                            <div className="h-px bg-slate-100 my-4" />
                            
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-black text-slate-900 uppercase">Total Amount</span>
                                <span className="text-3xl font-black text-blue-600 tabular-nums tracking-tighter">
                                    ₹{totalAmount.toLocaleString('en-IN')}
                                </span>
                            </div>
                        </div>

                        <div className="mt-10 space-y-3">
                            <Button
                                type="button"
                                onClick={() => handleSubmit('sent')}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black h-16 rounded-2xl shadow-lg shadow-blue-600/20 gap-3 text-lg group transition-all"
                                disabled={loading}
                            >
                                {loading ? (
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                ) : (
                                    <>
                                        Generate & Download
                                        <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => handleSubmit('draft')}
                                className="w-full border-slate-200 text-slate-600 font-bold h-14 rounded-2xl hover:bg-slate-50"
                                disabled={loading}
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save as Draft'}
                            </Button>
                        </div>

                        <div className="mt-8 flex items-center gap-3 p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
                            <Calculator className="w-5 h-5 text-blue-500" />
                            <p className="text-[10px] font-bold text-blue-600 leading-tight">
                                All calculations are GST-compliant and double-verified.
                            </p>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
