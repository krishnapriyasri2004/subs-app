'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
    MoreVertical, Download, Clock, ChevronRight, Package, Loader2, FileText, Settings, Bell, ArrowUpRight, Wallet, Calendar as CalendarIcon, HelpCircle, Activity, LineChart as LucideLineChart, RefreshCw, Trash2, PauseCircle, PlayCircle, Plus, Minus, MapPin, ShieldAlert, CreditCard
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { MockPaymentModal } from './mock-payment-modal';

type Subscription = {
    id: string;
    name: string;
    status: 'active' | 'paused' | 'cancelled';
    price: string;
    period: string;
    nextBilling: string;
    provider: string;
    usage: number;
    color: string;
    quantity: number;
};

export default function CustomerDashboard() {
    const { user } = useAuth();

    // 1. RBAC Guard: only role='customer' can see this component (simulated for dev env if user is undefined we assume customer)
    if (user?.role && user.role !== 'customer' && typeof window !== 'undefined') {
        return (
            <div className="flex h-[50vh] flex-col items-center justify-center space-y-4">
                <ShieldAlert className="w-12 h-12 text-red-500" />
                <h2 className="text-xl font-bold">Unauthorized Access</h2>
                <p className="text-slate-500">Only customers can view this dashboard.</p>
            </div>
        );
    }

    const [subs, setSubs] = useState<Subscription[]>([
        { id: '1', name: 'Premium Milk Delivery', status: 'active', price: '₹1,200', period: 'Month', nextBilling: 'Mar 15, 2024', provider: 'Pure Dairy Milk', usage: 65, color: 'indigo', quantity: 2 },
        { id: '2', name: 'Organic Basmati Rice Plan', status: 'active', price: '₹850', period: 'Month', nextBilling: 'Mar 10, 2024', provider: 'Priya Rice Depot', usage: 40, color: 'emerald', quantity: 1 }
    ]);

    const [invoices, setInvoices] = useState([
        { id: 'INV-2024-001', amount: '₹1,200', date: 'Feb 15, 2024', status: 'overdue' },
        { id: 'INV-2024-002', amount: '₹850', date: 'Feb 10, 2024', status: 'paid' },
        { id: 'INV-2024-003', amount: '₹1,200', date: 'Jan 15, 2024', status: 'paid' },
        { id: 'INV-2024-004', amount: '₹850', date: 'Jan 10, 2024', status: 'paid' },
        { id: 'INV-2024-005', amount: '₹1,200', date: 'Dec 15, 2023', status: 'paid' }
    ]);

    useEffect(() => {
        const localInvoicesJson = localStorage.getItem('vendor_invoices');
        if (localInvoicesJson) {
            try {
                const localInvoices = JSON.parse(localInvoicesJson);
                // Filter invoices for this specific customer
                const myInvoices = localInvoices
                    .filter((inv: any) => inv.customerId === user?.id || inv.customerEmail === user?.email)
                    .map((inv: any) => ({
                        id: inv.invoiceNumber || inv.id,
                        amount: `₹${inv.totalAmount.toLocaleString('en-IN')}`,
                        date: format(new Date(inv.issueDate), 'MMM dd, yyyy'),
                        status: inv.status
                    }));

                if (myInvoices.length > 0) {
                    setInvoices(prev => [...myInvoices, ...prev]);
                }
            } catch (e) {
                console.error("Failed to load local invoices", e);
            }
        }
    }, [user]);

    const [addresses, setAddresses] = useState([
        { id: '1', address: '123 Example Street, Apt 4B, Bangalore, KA', timing: 'Morning 6-8am', isDefault: true },
        { id: '2', address: '45 Second Avenue, Block C, Bangalore, KA', timing: 'Evening 4-6pm', isDefault: false }
    ]);

    const [isActionLoading, setIsActionLoading] = useState(false);

    // Mock Payment State
    const [isMockPaymentOpen, setIsMockPaymentOpen] = useState(false);
    const [mockPaymentAmount, setMockPaymentAmount] = useState(0);
    const [mockPaymentTitle, setMockPaymentTitle] = useState('');
    const [mockPaymentId, setMockPaymentId] = useState('');

    // --- Actions Handlers (Simulating API calls with loading states & toasts) ---
    const handleSubscriptionAction = async (id: string, action: string) => {
        setIsActionLoading(true);
        try {
            // Mock API call
            await new Promise(resolve => setTimeout(resolve, 800));
            if (action === 'resume' || action === 'reactivate') {
                updateSubStatus(id, 'active');
                toast.success(`Subscription successfully ${action}d!`);
            }
        } catch (error) {
            toast.error("An error occurred while communicating with the server.");
        } finally {
            setIsActionLoading(false);
        }
    };

    const updateSubStatus = (id: string, status: Subscription['status']) => {
        setSubs(prev => prev.map(s => s.id === id ? { ...s, status } : s));
    };

    const handleQuantity = async (id: string, delta: number) => {
        // Optimistic UI update could go here, but doing it properly with loading state:
        const sub = subs.find(s => s.id === id);
        if (!sub) return;

        const newQuantity = Math.max(1, sub.quantity + delta);
        if (newQuantity === sub.quantity) return;

        try {
            // Mock API call to update quantity for milk/rice vendors
            await new Promise(resolve => setTimeout(resolve, 300));
            toast.success(`Quantity updated to ${newQuantity}`);
            setSubs(prev => prev.map(s => s.id === id ? { ...s, quantity: newQuantity } : s));
        } catch (e) {
            toast.error("Failed to update quantity.");
        }
    };

    const handlePayNow = (id: string, amount: number = 1999) => {
        setMockPaymentId(id);
        setMockPaymentAmount(amount);
        setMockPaymentTitle(`Pay for ${id}`);
        setIsMockPaymentOpen(true);
    };

    const handleMockPaymentSuccess = () => {
        if (mockPaymentId === 'update_payment') {
            toast.success('Payment method updated successfully');
        } else if (mockPaymentId) {
            setInvoices(prev => prev.map(inv => inv.id === mockPaymentId ? { ...inv, status: 'paid' } : inv));
        }
    };

    const handleUpdatePayment = () => {
        setMockPaymentId('update_payment');
        setMockPaymentAmount(0);
        setMockPaymentTitle('Verify Payment Method');
        setIsMockPaymentOpen(true);
    };

    const handleDownload = async (id: string) => {
        try {
            toast.loading(`Preparing PDF for ${id}...`);
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.dismiss();
            toast.success(`PDF downloaded successfully!`);
        } catch (e) {
            toast.error("Failed to generate PDF");
        }
    };

    // Sub-components for Modals
    const PauseModal = ({ sub }: { sub: Subscription }) => {
        const [date, setDate] = useState<Date | undefined>(new Date());
        const [reason, setReason] = useState("");
        const [open, setOpen] = useState(false);
        const [loading, setLoading] = useState(false);

        const handlePause = async () => {
            setLoading(true);
            try {
                await new Promise(r => setTimeout(r, 1000));
                updateSubStatus(sub.id, 'paused');
                setOpen(false);
                toast.success(`Subscription paused until ${date ? format(date, 'MMM do') : 'further notice'}.`);
            } catch (e) {
                toast.error("Failed to pause subscription.");
            } finally {
                setLoading(false);
            }
        };

        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild><DropdownMenuItem onSelect={(e) => e.preventDefault()}><PauseCircle className="w-4 h-4 mr-2" /> Pause Subscription</DropdownMenuItem></DialogTrigger>
                <DialogContent>
                    <DialogHeader><DialogTitle>Pause Subscription</DialogTitle><DialogDescription>Select when you'd like to resume services automatically.</DialogDescription></DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Resume Date (Optional)</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-full justify-start text-left font-normal border-slate-200">
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={date} onSelect={setDate} initialFocus /></PopoverContent>
                            </Popover>
                        </div>
                        <div className="space-y-2">
                            <Label>Reason</Label>
                            <Input placeholder="e.g. Going on vacation" value={reason} onChange={e => setReason(e.target.value)} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button onClick={handlePause} disabled={loading}>{loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : 'Confirm Pause'}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        );
    };

    // Updated Cancel Modal (Multi-step logic: reason dropdown + confirmation)
    const CancelModal = ({ sub }: { sub: Subscription }) => {
        const [reason, setReason] = useState("");
        const [open, setOpen] = useState(false);
        const [step, setStep] = useState(1);
        const [loading, setLoading] = useState(false);

        const handleCancel = async () => {
            setLoading(true);
            try {
                await new Promise(r => setTimeout(r, 1500));
                updateSubStatus(sub.id, 'cancelled');
                setOpen(false);
                setTimeout(() => setStep(1), 500); // reset state after close
                toast.success(`Subscription cancelled. You can reactivate within 30 days.`);
            } catch (e) {
                toast.error("Failed to cancel subscription.");
            } finally {
                setLoading(false);
            }
        };

        return (
            <Dialog open={open} onOpenChange={(val) => { setOpen(val); if (!val) setTimeout(() => setStep(1), 500); }}>
                <DialogTrigger asChild><DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600 focus:text-red-600"><Trash2 className="w-4 h-4 mr-2" /> Cancel Subscription</DropdownMenuItem></DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{step === 1 ? 'Cancel Subscription' : 'Are you absolutely sure?'}</DialogTitle>
                        <DialogDescription>
                            {step === 1
                                ? 'We are sorry to see you go. Please tell us why you are leaving.'
                                : 'You will lose access to this product at the end of the current billing cycle.'}
                        </DialogDescription>
                    </DialogHeader>

                    {step === 1 ? (
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Why are you leaving?</Label>
                                <Select value={reason} onValueChange={setReason}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a reason" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="too_expensive">Too expensive</SelectItem>
                                        <SelectItem value="not_using">Not using it enough</SelectItem>
                                        <SelectItem value="moving">Moving/Relocating</SelectItem>
                                        <SelectItem value="quality">Product quality issues</SelectItem>
                                        <SelectItem value="other">Other reason</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    ) : (
                        <div className="py-6 flex flex-col items-center justify-center text-center space-y-4 bg-red-50 rounded-xl my-4">
                            <ShieldAlert className="w-12 h-12 text-red-500" />
                            <p className="text-sm text-red-800 font-medium px-4">This action cannot be undone after 30 days. All associated data will be flagged for deletion.</p>
                        </div>
                    )}

                    <DialogFooter>
                        {step === 1 ? (
                            <>
                                <Button variant="outline" onClick={() => setOpen(false)}>Keep Subscription</Button>
                                <Button onClick={() => setStep(2)} disabled={!reason}>Next Step</Button>
                            </>
                        ) : (
                            <>
                                <Button variant="outline" onClick={() => setStep(1)}>Go Back</Button>
                                <Button variant="destructive" onClick={handleCancel} disabled={loading}>{loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : 'Yes, Cancel Immediately'}</Button>
                            </>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        );
    };

    // Plan Switching component
    const PlanSwitchModal = ({ sub }: { sub: Subscription }) => {
        const [open, setOpen] = useState(false);
        const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

        const handleSwitch = async (plan: string) => {
            setLoadingPlan(plan);
            try {
                await new Promise(r => setTimeout(r, 1000));
                toast.success(`Successfully switched to ${plan}! Changes reflect next cycle.`);
                setOpen(false);
            } catch (e) {
                toast.error("Failed to switch plan.");
            } finally {
                setLoadingPlan(null);
            }
        };

        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild><DropdownMenuItem onSelect={(e) => e.preventDefault()}><RefreshCw className="w-4 h-4 mr-2" /> Switch Plan</DropdownMenuItem></DialogTrigger>
                <DialogContent>
                    <DialogHeader><DialogTitle>Available Plans</DialogTitle><DialogDescription>Choose a different plan for {sub.name}.</DialogDescription></DialogHeader>
                    <div className="space-y-3 py-4">
                        {['Basic - ₹800/mo', 'Family - ₹2,000/mo', 'Pro - ₹3,500/mo'].map((plan, i) => (
                            <div key={i} className="flex justify-between items-center p-4 border rounded-xl hover:border-indigo-200 hover:bg-indigo-50 transition-colors">
                                <span className="font-medium text-sm">{plan}</span>
                                <Button size="sm" variant={plan.includes('Pro') ? 'default' : 'outline'} onClick={() => handleSwitch(plan)} disabled={!!loadingPlan}>
                                    {loadingPlan === plan ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Select'}
                                </Button>
                            </div>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>
        );
    };

    // Multi-Address Management Component (India specific)
    const DeliveryModal = () => {
        const [open, setOpen] = useState(false);
        const [isSaving, setIsSaving] = useState(false);
        const [newAddr, setNewAddr] = useState("");

        const handleSave = async () => {
            setIsSaving(true);
            try {
                // mock api
                await new Promise(r => setTimeout(r, 1000));

                if (newAddr.length > 5) {
                    setAddresses(prev => [...prev, { id: Math.random().toString(), address: newAddr, timing: 'Morning 6-8am', isDefault: false }]);
                    setNewAddr('');
                }

                toast.success("Delivery preferences successfully saved.");
                setOpen(false);
            } catch (e) {
                toast.error("Failed to update delivery preferences.");
            } finally {
                setIsSaving(false);
            }
        };

        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild><Button variant="outline" size="sm" className="h-8 shadow-sm">Manage Addresses</Button></DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader><DialogTitle>Delivery Preferences</DialogTitle><DialogDescription>Manage your delivery addresses and timing preferences.</DialogDescription></DialogHeader>
                    <div className="space-y-6 py-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">

                        {/* Current Addresses */}
                        <div className="space-y-4">
                            <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Saved Addresses</Label>
                            {addresses.map((addr) => (
                                <div key={addr.id} className={`p-4 rounded-xl border ${addr.isDefault ? 'border-indigo-200 bg-indigo-50/50' : 'border-slate-200'} space-y-3`}>
                                    <div className="flex justify-between items-start gap-4">
                                        <p className="text-sm font-medium leading-relaxed">{addr.address}</p>
                                        {addr.isDefault && <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100 border-none px-2 py-0">Default</Badge>}
                                    </div>
                                    <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                                        <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {addr.timing}</span>
                                        {!addr.isDefault && (
                                            <Button variant="link" className="h-auto p-0 text-indigo-600 text-[10px] uppercase font-bold" onClick={(e) => {
                                                e.preventDefault();
                                                setAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === addr.id })));
                                            }}>Make Default</Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Add New */}
                        <div className="space-y-4 pt-4 border-t border-slate-100">
                            <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Add New Address</Label>

                            <div className="space-y-2">
                                <Label>Full Address</Label>
                                <Textarea placeholder="Flat No, Wing, Society Name..." className="resize-none" value={newAddr} onChange={e => setNewAddr(e.target.value)} />
                            </div>

                            <div className="space-y-2">
                                <Label>Preferred Timing</Label>
                                <div className="grid grid-cols-2 gap-4">
                                    <Label className="flex items-center gap-2 border border-slate-200 p-3 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors [&:has(:checked)]:border-indigo-500 [&:has(:checked)]:bg-indigo-50">
                                        <input type="radio" name="timing" defaultChecked className="text-indigo-600" /> Morning (6-8 AM)
                                    </Label>
                                    <Label className="flex items-center gap-2 border border-slate-200 p-3 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors [&:has(:checked)]:border-indigo-500 [&:has(:checked)]:bg-indigo-50">
                                        <input type="radio" name="timing" className="text-indigo-600" /> Evening (4-6 PM)
                                    </Label>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Delivery Instructions</Label>
                                <Input placeholder="e.g. Leave at the front door / call security" />
                            </div>
                        </div>

                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button onClick={handleSave} disabled={isSaving}>{isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : 'Save Settings'}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        );
    };

    return (
        <div className="space-y-6 sm:space-y-8 pb-10 max-w-7xl mx-auto">
            <MockPaymentModal
                isOpen={isMockPaymentOpen}
                onClose={() => setIsMockPaymentOpen(false)}
                onSuccess={handleMockPaymentSuccess}
                amount={mockPaymentAmount}
                title={mockPaymentTitle}
            />
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white px-5 sm:px-6 py-5 rounded-lg border border-slate-200 shadow-sm gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Consumer <span className="text-indigo-600">Console</span></h1>
                    <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Member ID: SUB-CU-9921 • {user?.name || 'Guest User'}</p>
                </div>
                <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="hidden sm:flex flex-col text-right">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Current Credit Balance</p>
                        <p className="text-lg font-black text-emerald-600">₹450.00</p>
                    </div>
                    <Button variant="ghost" className="h-12 w-12 rounded-2xl bg-slate-50 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all border border-slate-100 shadow-inner ml-auto sm:ml-0">
                        <Bell className="w-5 h-5" />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
                {/* Left Section (3 cols) */}
                <div className="lg:col-span-3 space-y-6 sm:space-y-8">

                    {/* Active Subscriptions Grid */}
                    <div className="space-y-5">
                        <div className="flex items-center justify-between px-2">
                            <h2 className="text-lg font-black text-slate-900 uppercase tracking-widest">Active Services</h2>
                            <Link href="/portal/my-awesome-org/subscriptions">
                                <Button variant="link" className="text-xs font-black text-indigo-600 uppercase tracking-widest p-0">Manage All <ArrowUpRight className="w-3 h-3 ml-1" /></Button>
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                            {subs.map((sub) => (
                                <Card key={sub.id} className="p-5 sm:p-6 bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all rounded-lg group relative">
                                    <div className="absolute top-6 right-6">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"><MoreVertical className="w-4 h-4" /></Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-56 rounded-xl p-2 shadow-xl border-slate-100">
                                                <DropdownMenuLabel className="text-xs text-slate-400 uppercase tracking-widest">Actions</DropdownMenuLabel>
                                                <DropdownMenuSeparator className="opacity-50" />

                                                {sub.status === 'paused' ? (
                                                    <DropdownMenuItem onClick={() => handleSubscriptionAction(sub.id, 'resume')} className="cursor-pointer py-2.5"><PlayCircle className="w-4 h-4 mr-2" /> Resume Subscription</DropdownMenuItem>
                                                ) : sub.status === 'cancelled' ? (
                                                    <DropdownMenuItem onClick={() => handleSubscriptionAction(sub.id, 'reactivate')} className="cursor-pointer py-2.5"><RefreshCw className="w-4 h-4 mr-2" /> Reactivate</DropdownMenuItem>
                                                ) : (
                                                    <PauseModal sub={sub} />
                                                )}

                                                {sub.status !== 'cancelled' && <PlanSwitchModal sub={sub} />}

                                                {sub.status !== 'cancelled' && (
                                                    <>
                                                        <DropdownMenuSeparator className="opacity-50" />
                                                        <CancelModal sub={sub} />
                                                    </>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>

                                    <div className="flex justify-between items-start mb-6 pr-10">
                                        <div className={`p-4 rounded-2xl bg-${sub.color}-50 text-${sub.color}-600`}>
                                            <Package className="w-6 h-6" />
                                        </div>
                                        <Badge className={`bg-${sub.status === 'active' ? sub.color : sub.status === 'paused' ? 'amber' : 'red'}-50 text-${sub.status === 'active' ? sub.color : sub.status === 'paused' ? 'amber' : 'red'}-600 border-none font-black text-[10px] uppercase px-3 py-1`}>
                                            {sub.status}
                                        </Badge>
                                    </div>

                                    <h3 className="text-xl font-black text-slate-900 mb-1 leading-tight">{sub.name}</h3>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">{sub.provider}</p>

                                    {/* Edit Quantity specifically for Rice/Milk/Physical products */}
                                    {sub.status === 'active' && (
                                        <div className="flex items-center justify-between bg-slate-50/80 border border-slate-100 p-3 rounded-2xl mb-6">
                                            <span className="text-xs font-bold text-slate-500 uppercase tracking-tight pl-2">Daily Deliveries</span>
                                            <div className="flex items-center gap-1 bg-white p-1 rounded-xl shadow-sm border border-slate-100">
                                                <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-slate-100 rounded-lg text-slate-500" onClick={() => handleQuantity(sub.id, -1)}><Minus className="h-3.5 w-3.5" /></Button>
                                                <span className="font-black text-sm w-6 text-center text-slate-800">{sub.quantity}</span>
                                                <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-slate-100 rounded-lg text-slate-500" onClick={() => handleQuantity(sub.id, 1)}><Plus className="h-3.5 w-3.5" /></Button>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between pt-6 border-t border-slate-100/60">
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase mb-1 tracking-tighter italic">Recurring</p>
                                            <p className="text-2xl font-black text-slate-900">{sub.price}<span className="text-xs text-slate-400 font-medium">/{sub.period}</span></p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-slate-400 uppercase mb-1 tracking-tighter italic">Next Billing</p>
                                            <p className="text-sm font-bold text-slate-700">{sub.status === 'active' ? sub.nextBilling : '-'}</p>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Delivery & Notifications (2 cols within Left Section) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Delivery Settings Card */}
                        <Card className="p-5 bg-white border border-slate-200 rounded-lg shadow-sm">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="font-black text-slate-900 flex items-center gap-2 text-base"><MapPin className="w-4 h-4 text-indigo-500" /> Delivery Address</h3>
                                    <p className="text-[10px] font-medium text-slate-400 mt-1 uppercase tracking-widest pl-6">Active Route Map</p>
                                </div>
                                <DeliveryModal />
                            </div>

                            <div className="space-y-4">
                                <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-indigo-50 to-transparent rounded-bl-3xl opacity-50" />
                                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                        Primary <Badge variant="outline" className="text-[8px] h-4 py-0 px-1 border-indigo-200 text-indigo-500 bg-white">DEFAULT</Badge>
                                    </p>
                                    <p className="text-sm font-semibold text-slate-800 leading-relaxed pr-6 relative z-10">{addresses.find(a => a.isDefault)?.address}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-3 border border-slate-100 rounded-xl bg-white">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1"><Clock className="w-3 h-3" /> Time Preference</p>
                                        <p className="text-xs font-bold text-slate-700">{addresses.find(a => a.isDefault)?.timing}</p>
                                    </div>
                                    <div className="p-3 border border-slate-100 rounded-xl bg-white">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Instructions</p>
                                        <p className="text-xs font-medium text-slate-500 truncate" title="Leave at front door">Leave at front door</p>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Notification Preferences Card */}
                        <Card className="p-5 bg-white border border-slate-200 rounded-lg shadow-sm">
                            <h3 className="font-black text-slate-900 flex items-center gap-2 mb-1 text-base"><Bell className="w-4 h-4 text-emerald-500" /> Notifications</h3>
                            <p className="text-[10px] font-medium text-slate-400 mb-6 uppercase tracking-widest pl-6">Communication Channels</p>

                            <div className="space-y-5">
                                <div className="flex items-center justify-between group">
                                    <div className="space-y-1">
                                        <Label className="text-sm font-bold text-slate-800 cursor-pointer">Email Invoices</Label>
                                        <p className="text-xs text-slate-500 font-medium">Monthly receipts & renew reminders</p>
                                    </div>
                                    <Switch defaultChecked onCheckedChange={(c) => toast.success(c ? "Email receipts enabled" : "Email receipts disabled")} />
                                </div>
                                <div className="flex items-center justify-between group">
                                    <div className="space-y-1">
                                        <Label className="text-sm font-bold text-slate-800 cursor-pointer">WhatsApp Alerts</Label>
                                        <p className="text-xs text-slate-500 font-medium">Daily delivery dispatch status</p>
                                    </div>
                                    <Switch defaultChecked onCheckedChange={(c) => toast.success(c ? "WhatsApp alerts enabled" : "WhatsApp alerts disabled")} />
                                </div>
                                <div className="flex items-center justify-between pt-5 border-t border-slate-100">
                                    <div className="space-y-1">
                                        <Label className="text-sm font-bold text-slate-800">Critical Failed Payments</Label>
                                        <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Mandatory alert</p>
                                    </div>
                                    <Switch checked disabled />
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Right Section (1 col) */}
                <div className="space-y-6 sm:space-y-8">

                    {/* Compact Invoices Table */}
                    <Card className="p-5 bg-white border border-slate-200 rounded-lg shadow-sm hidden lg:block overflow-hidden">
                        <div className="flex justify-between items-end mb-6">
                            <div>
                                <h4 className="text-base font-black text-slate-900">Recent Invoices</h4>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Last 30 Days</p>
                            </div>
                            <Link href="/portal/my-awesome-org/invoices"><Button variant="link" className="text-xs p-0 h-auto text-indigo-600 font-bold">View All</Button></Link>
                        </div>

                        <div className="-mx-6 border-y border-slate-100">
                            <Table>
                                <TableHeader className="bg-slate-50/50">
                                    <TableRow className="border-b-slate-100 hover:bg-transparent">
                                        <TableHead className="w-[100px] text-[10px] font-black uppercase text-slate-400 py-3 pl-6">Invoice #</TableHead>
                                        <TableHead className="text-[10px] font-black uppercase text-slate-400 py-3">Status / Amt</TableHead>
                                        <TableHead className="text-right text-[10px] font-black uppercase text-slate-400 py-3 pr-6">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {invoices.slice(0, 5).map((inv) => (
                                        <TableRow key={inv.id} className="border-b-slate-50">
                                            <TableCell className="font-medium text-xs py-3 pl-6">
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="text-slate-900 font-bold">{inv.id.split('-').pop()}</span>
                                                    <span className="text-[9px] text-slate-400 uppercase">{inv.date}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-3">
                                                <div className="flex flex-col gap-1 items-start">
                                                    <span className="text-xs font-black">{inv.amount}</span>
                                                    {inv.status === 'overdue' ?
                                                        <Badge variant="destructive" className="h-4 text-[8px] uppercase tracking-wider px-1.5 py-0 leading-none">Overdue</Badge> :
                                                        <Badge variant="outline" className="border-emerald-200 text-emerald-600 bg-emerald-50 h-4 text-[8px] uppercase tracking-wider px-1.5 py-0 leading-none">Paid</Badge>
                                                    }
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right py-3 pr-6">
                                                {inv.status === 'overdue' ? (
                                                    <Button size="sm" className="h-7 text-[10px] font-bold uppercase tracking-wider bg-red-500 hover:bg-red-600 text-white shadow-sm" onClick={() => handlePayNow(inv.id)}>Pay Now</Button>
                                                ) : (
                                                    <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50" onClick={() => handleDownload(inv.id)}>
                                                        <Download className="h-3.5 w-3.5" />
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </Card>

                    {/* Mobile Invoices Stack (visible only below lg) */}
                    <div className="lg:hidden space-y-4">
                        <div className="flex justify-between items-center px-2">
                            <h4 className="text-base font-black text-slate-900">Recent Invoices</h4>
                            <Link href="/portal/my-awesome-org/invoices"><Button variant="link" className="text-xs p-0 text-indigo-600 font-bold">View All</Button></Link>
                        </div>
                        <div className="space-y-3">
                            {invoices.slice(0, 3).map((inv) => (
                                <Card key={inv.id} className="p-4 bg-white border border-slate-200 rounded-lg flex flex-col gap-3 shadow-sm">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center"><FileText className="w-4 h-4" /></div>
                                            <div>
                                                <p className="text-xs font-black text-slate-900">{inv.id}</p>
                                                <p className="text-[10px] text-slate-500 font-medium">{inv.date}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-black text-slate-900">{inv.amount}</p>
                                            {inv.status === 'overdue' ?
                                                <Badge variant="destructive" className="h-4 text-[9px] uppercase px-1.5 py-0">Overdue</Badge> :
                                                <Badge variant="outline" className="border-emerald-200 text-emerald-600 bg-emerald-50 h-4 text-[9px] uppercase px-1.5 py-0">Paid</Badge>
                                            }
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center pt-2 border-t border-slate-50">
                                        <Button variant="ghost" size="sm" className="h-7 text-xs text-slate-500" onClick={() => handleDownload(inv.id)}>
                                            <Download className="w-3.5 h-3.5 mr-1.5" /> PDF
                                        </Button>
                                        {inv.status === 'overdue' && (
                                            <Button size="sm" className="h-7 text-xs bg-red-500 hover:bg-red-600 text-white" onClick={() => handlePayNow(inv.id)}>Pay Now</Button>
                                        )}
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Payment Hub */}
                    <Card className="p-6 bg-slate-900 border-none text-white rounded-lg shadow-md relative overflow-hidden group">
                        <div className="absolute -top-10 -right-10 p-8 opacity-20 rotate-[15deg] group-hover:rotate-[20deg] group-hover:scale-110 transition-all duration-500 ease-out">
                            <Wallet className="w-48 h-48 text-indigo-400" />
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Payment Method</h3>

                            {/* Saved Card/UPI UI */}
                            <div className="bg-white/5 backdrop-blur-md px-5 py-4 rounded-2xl mb-8 border border-white/10 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-full bg-gradient-to-r from-transparent to-indigo-500/10 pointer-events-none" />
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-300">
                                        <CreditCard className="w-5 h-5" />
                                    </div>
                                    <div className="text-left flex-1">
                                        <p className="text-sm font-bold text-white tracking-wide">Secure AutoPay</p>
                                        <p className="text-xs text-blue-400 font-mono mt-0.5 tracking-widest">user@okicici</p>
                                    </div>
                                </div>
                            </div>

                            <Button onClick={handleUpdatePayment} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black h-12 rounded-xl shadow-[0_0_20px_rgb(37,99,235,0.2)] active:scale-[0.98] transition-all border-none">
                                Manage Payment
                            </Button>
                        </div>
                    </Card>

                    {/* Support & Docs Card */}
                    <Card className="p-5 bg-slate-50 border border-slate-200 rounded-lg group cursor-pointer hover:shadow-sm transition-all">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-indigo-600 shadow-sm transition-transform group-hover:rotate-12 group-hover:scale-110 duration-300">
                                <HelpCircle className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-black text-slate-900 tracking-tighter italic text-base">Support Hive</h4>
                                <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-widest">24/7 Priority</p>
                            </div>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed font-medium">Have questions about your billing cycle or recent charges? Our concierge team is ready to assist.</p>
                    </Card>

                </div>
            </div>
        </div>
    );
}