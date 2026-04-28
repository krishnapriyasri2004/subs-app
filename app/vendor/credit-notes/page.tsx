'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Receipt, Loader2, Edit2, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

type CreditNote = {
    id: string;
    customer: string;
    amount: string;
    reason: string;
    date: string;
};

export default function CreditNotesPage() {
    const [open, setOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [notes, setNotes] = useState<CreditNote[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const savedNotes = localStorage.getItem('vendor_credit_notes');
        if (savedNotes) {
            try {
                setNotes(JSON.parse(savedNotes));
            } catch (e) {
                console.error("Failed to parse saved credit notes", e);
            }
        }
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('vendor_credit_notes', JSON.stringify(notes));
        }
    }, [notes, isLoaded]);

    const [editOpen, setEditOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        customer: '',
        amount: '',
        reason: '',
    });

    const handleSave = async () => {
        if (!formData.customer || !formData.amount) {
            toast.error("Please fill in the required fields");
            return;
        }

        setSaving(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 800));

            const newNote: CreditNote = {
                id: `CRN-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
                customer: formData.customer,
                amount: `₹${parseFloat(formData.amount).toLocaleString('en-IN')}`,
                reason: formData.reason || 'Refund',
                date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
            };

            setNotes(prev => [newNote, ...prev]);
            setFormData({ customer: '', amount: '', reason: '' });
            toast.success("Credit note issued successfully!");
            setOpen(false);
        } catch (e) {
            toast.error("Failed to issue credit note");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = (id: string) => {
        setNotes(prev => prev.filter(n => n.id !== id));
        toast.success("Credit note deleted successfully");
    };

    const handleEditClick = (note: CreditNote) => {
        setEditingId(note.id);
        const amtStr = note.amount.replace('₹', '').replace(/,/g, '');
        setFormData({
            customer: note.customer,
            amount: amtStr,
            reason: note.reason,
        });
        setEditOpen(true);
    };

    const handleUpdate = async () => {
        if (!formData.customer || !formData.amount) {
            toast.error("Please fill in the required fields");
            return;
        }

        setSaving(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 500));

            setNotes(prev => prev.map(n => {
                if (n.id === editingId) {
                    return {
                        ...n,
                        customer: formData.customer,
                        amount: `₹${parseFloat(formData.amount).toLocaleString('en-IN')}`,
                        reason: formData.reason || 'Refund',
                    };
                }
                return n;
            }));

            toast.success("Credit note updated successfully!");
            setEditOpen(false);
        } catch (e) {
            toast.error("Failed to update credit note");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Credit Notes</h1>
                    <p className="text-sm text-slate-500">Manage refunds and account credits</p>
                </div>
                <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={() => setOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    New Credit Note
                </Button>
            </div>

            {notes.length === 0 ? (
                <Card className="p-12 text-center border-dashed border-2 bg-slate-50/50">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">No Credit Notes Yet</h3>
                    <p className="text-slate-500 max-w-sm mx-auto">
                        Credit notes allow you to refund or apply credit balance to your customers. Once issued, they'll appear here.
                    </p>
                </Card>
            ) : (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-bold text-slate-500 tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Credit Note ID</th>
                                    <th className="px-6 py-4">Customer</th>
                                    <th className="px-6 py-4">Date Issued</th>
                                    <th className="px-6 py-4">Reason</th>
                                    <th className="px-6 py-4 text-right">Amount</th>
                                    <th className="px-6 py-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {notes.map((note) => (
                                    <tr key={note.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 font-bold text-slate-900">
                                            <div className="flex items-center gap-2">
                                                <Receipt className="w-4 h-4 text-indigo-500" />
                                                {note.id}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-slate-700">{note.customer}</td>
                                        <td className="px-6 py-4 text-slate-500">{note.date}</td>
                                        <td className="px-6 py-4 text-slate-500 truncate max-w-[200px]">{note.reason}</td>
                                        <td className="px-6 py-4 text-right font-black text-emerald-600">{note.amount}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50" onClick={() => handleEditClick(note)}>
                                                    <Edit2 className="w-4 h-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(note.id)}>
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Issue Credit Note</DialogTitle>
                        <DialogDescription>
                            Create a new credit note for a customer refund or balance adjustment.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Customer Name</Label>
                            <Input
                                placeholder="E.g., Rahul Sharma"
                                value={formData.customer}
                                onChange={e => setFormData({ ...formData, customer: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Amount (₹)</Label>
                            <Input
                                type="number"
                                placeholder="0.00"
                                value={formData.amount}
                                onChange={e => setFormData({ ...formData, amount: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Reason for Credit</Label>
                            <Textarea
                                placeholder="E.g., Defective product, overcharged..."
                                className="resize-none"
                                value={formData.reason}
                                onChange={e => setFormData({ ...formData, reason: e.target.value })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button onClick={handleSave} disabled={saving} className="bg-indigo-600 hover:bg-indigo-700">
                            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : 'Issue Credit'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit Credit Note</DialogTitle>
                        <DialogDescription>
                            Update details for this credit note.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Customer Name</Label>
                            <Input
                                placeholder="E.g., Rahul Sharma"
                                value={formData.customer}
                                onChange={e => setFormData({ ...formData, customer: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Amount (₹)</Label>
                            <Input
                                type="number"
                                placeholder="0.00"
                                value={formData.amount}
                                onChange={e => setFormData({ ...formData, amount: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Reason for Credit</Label>
                            <Textarea
                                placeholder="E.g., Defective product, overcharged..."
                                className="resize-none"
                                value={formData.reason}
                                onChange={e => setFormData({ ...formData, reason: e.target.value })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
                        <Button onClick={handleUpdate} disabled={saving} className="bg-blue-600 hover:bg-blue-700">
                            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : 'Save Changes'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}