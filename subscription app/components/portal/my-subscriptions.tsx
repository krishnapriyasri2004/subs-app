'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MoreVertical, PauseCircle, PlayCircle, RefreshCw, Trash2, Calendar as CalendarIcon, Loader2, Package, Plus, Minus, Truck } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

type Subscription = {
    id: string;
    subNumber: string;
    name: string;
    status: 'active' | 'paused' | 'cancelled';
    price: string;
    period: string;
    nextBilling: string;
    quantity: number;
    color: string;
    vendorType: 'general' | 'daily_needs';
    deliveries: boolean[]; // Mon-Sun
};

export function MySubscriptions() {
    const [subs, setSubs] = useState<Subscription[]>([
        { id: '1', subNumber: 'SUB-00001', name: 'Premium Milk Delivery 1L', status: 'active', price: '₹1,200', period: 'Month', nextBilling: 'Apr 15, 2024', quantity: 2, color: 'indigo', vendorType: 'daily_needs', deliveries: [true, true, true, true, true, true, false] },
        { id: '2', subNumber: 'SUB-00002', name: 'Organic Basmati Rice 5kg', status: 'active', price: '₹850', period: 'Month', nextBilling: 'Apr 10, 2024', quantity: 1, color: 'emerald', vendorType: 'daily_needs', deliveries: [false, false, false, false, false, true, false] },
        { id: '3', subNumber: 'SUB-00003', name: 'Software License Pro', status: 'paused', price: '₹2,500', period: 'Year', nextBilling: '-', quantity: 1, color: 'blue', vendorType: 'general', deliveries: [false, false, false, false, false, false, false] }
    ]);

    const [isActionLoading, setIsActionLoading] = useState(false);

    const updateSubStatus = (id: string, status: Subscription['status']) => {
        setSubs(prev => prev.map(s => s.id === id ? { ...s, status } : s));
    };

    const handleAction = async (id: string, action: string) => {
        setIsActionLoading(true);
        try {
            await new Promise(r => setTimeout(r, 800));
            if (action === 'resume') {
                updateSubStatus(id, 'active');
                toast.success('Subscription resumed successfully.');
            }
        } catch (e) {
            toast.error("An error occurred");
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleQuantity = async (id: string, delta: number) => {
        const sub = subs.find(s => s.id === id);
        if (!sub) return;

        const newQuantity = Math.max(1, sub.quantity + delta);
        if (newQuantity === sub.quantity) return;

        try {
            await new Promise(resolve => setTimeout(resolve, 300));
            toast.success(`Quantity updated to ${newQuantity}`);
            setSubs(prev => prev.map(s => s.id === id ? { ...s, quantity: newQuantity } : s));
        } catch (e) {
            toast.error("Failed to update quantity.");
        }
    };

    const handleExtraDelivery = async (id: string) => {
        toast.loading("Requesting extra delivery...", { id: "extra" });
        await new Promise(r => setTimeout(r, 1000));
        toast.dismiss("extra");
        toast.success("Extra delivery requested for today.");
    };

    const handleSkipDelivery = async (id: string) => {
        toast.loading("Updating schedule...", { id: "skip" });
        await new Promise(r => setTimeout(r, 1000));
        toast.dismiss("skip");
        toast.success("Tomorrow's delivery postponed.");
    };

    const toggleDeliveryDay = async (subId: string, dayIndex: number) => {
        setSubs(prev => prev.map(s => {
            if (s.id === subId) {
                const newDeliveries = [...s.deliveries];
                newDeliveries[dayIndex] = !newDeliveries[dayIndex];
                return { ...s, deliveries: newDeliveries };
            }
            return s;
        }));
        toast.success("Delivery scheduled updated");
    };

    // Sub-components Modals
    const PauseModal = ({ sub }: { sub: Subscription }) => {
        const [date, setDate] = useState<Date | undefined>(new Date());
        const [open, setOpen] = useState(false);
        const [loading, setLoading] = useState(false);

        const handlePause = async () => {
            setLoading(true);
            try {
                await new Promise(r => setTimeout(r, 1000));
                updateSubStatus(sub.id, 'paused');
                setOpen(false);
                toast.success(`Subscription paused until ${date ? format(date, 'MMM do') : 'further notice'}.`);
            } finally {
                setLoading(false);
            }
        };

        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild><DropdownMenuItem onSelect={(e) => e.preventDefault()}><PauseCircle className="w-4 h-4 mr-2" /> Pause Subscription</DropdownMenuItem></DialogTrigger>
                <DialogContent>
                    <DialogHeader><DialogTitle>Pause {sub.subNumber}</DialogTitle><DialogDescription>Select when you'd like to resume services.</DialogDescription></DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Resume Date</Label>
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
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button onClick={handlePause} disabled={loading}>{loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : 'Confirm Pause'}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        );
    };

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
                setTimeout(() => setStep(1), 500);
                toast.success(`Subscription cancelled successfully.`);
            } finally {
                setLoading(false);
            }
        };

        return (
            <Dialog open={open} onOpenChange={(val) => { setOpen(val); if (!val) setTimeout(() => setStep(1), 500); }}>
                <DialogTrigger asChild><DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600 focus:text-red-600"><Trash2 className="w-4 h-4 mr-2" /> Cancel Subscription</DropdownMenuItem></DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{step === 1 ? `Cancel ${sub.name}` : 'Are you absolutely sure?'}</DialogTitle>
                        <DialogDescription>
                            {step === 1 ? 'Please tell us why you are leaving.' : 'You will lose access to this product at the end of the current billing cycle.'}
                        </DialogDescription>
                    </DialogHeader>

                    {step === 1 ? (
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Select Reason</Label>
                                <Select value={reason} onValueChange={setReason}>
                                    <SelectTrigger><SelectValue placeholder="Select a reason" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="too_expensive">Too expensive / Found cheaper alternative</SelectItem>
                                        <SelectItem value="not_using">Not using the service enough</SelectItem>
                                        <SelectItem value="moving">Relocating / Moving away</SelectItem>
                                        <SelectItem value="quality">Unsatisfied with quality</SelectItem>
                                        <SelectItem value="other">Other reason</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    ) : (
                        <div className="py-6 flex flex-col items-center justify-center text-center space-y-4 bg-red-50 rounded-xl my-4">
                            <Trash2 className="w-12 h-12 text-red-500" />
                            <p className="text-sm text-red-800 font-medium px-4">This action cannot be undone. You will continue to receive service until your current billing cycle ends.</p>
                        </div>
                    )}

                    <DialogFooter>
                        {step === 1 ? (
                            <>
                                <Button variant="outline" onClick={() => setOpen(false)}>Keep Subscription</Button>
                                <Button onClick={() => setStep(2)} disabled={!reason}>Next</Button>
                            </>
                        ) : (
                            <>
                                <Button variant="outline" onClick={() => setStep(1)}>Go Back</Button>
                                <Button variant="destructive" onClick={handleCancel} disabled={loading}>{loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : 'Confirm Cancellation'}</Button>
                            </>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        );
    };

    const PlanSwitchModal = ({ sub }: { sub: Subscription }) => {
        const [open, setOpen] = useState(false);
        const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

        const handleSwitch = async (plan: string) => {
            setLoadingPlan(plan);
            try {
                await new Promise(r => setTimeout(r, 1000));
                toast.success(`Subscription upgraded! Changes reflect next cycle.`);
                setOpen(false);
            } finally {
                setLoadingPlan(null);
            }
        };

        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild><DropdownMenuItem onSelect={(e) => e.preventDefault()}><RefreshCw className="w-4 h-4 mr-2" /> Upgrade / Downgrade Plan</DropdownMenuItem></DialogTrigger>
                <DialogContent>
                    <DialogHeader><DialogTitle>Change Plan</DialogTitle><DialogDescription>Current Plan: {sub.name}</DialogDescription></DialogHeader>
                    <div className="space-y-3 py-4">
                        {['Standard Plan', 'Premium Plan', 'Family Combo Plan'].map((plan, i) => (
                            <div key={i} className="flex justify-between items-center p-4 border rounded-xl hover:border-indigo-200 hover:bg-indigo-50 transition-colors">
                                <span className="font-medium text-sm text-slate-700">{plan}</span>
                                <Button size="sm" variant="outline" onClick={() => handleSwitch(plan)} disabled={!!loadingPlan}>
                                    {loadingPlan === plan ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Select'}
                                </Button>
                            </div>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>
        );
    };

    const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">My Subscriptions</h2>
                    <p className="text-sm text-slate-500 mt-1">Manage your active plans and deliveries</p>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {subs.map((sub) => (
                    <Card key={sub.id} className="p-5 bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow rounded-lg relative overflow-hidden">
                        {/* Status Strip */}
                        <div className={`absolute top-0 left-0 w-1.5 h-full bg-${sub.status === 'active' ? 'emerald' : sub.status === 'paused' ? 'amber' : 'red'}-500`} />

                        <div className="pl-2">
                            <div className="flex justify-between items-start mb-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-3">
                                        <Badge variant="outline" className="text-[10px] uppercase font-bold text-slate-500 border-slate-200">{sub.subNumber}</Badge>
                                        <Badge className={`bg-${sub.status === 'active' ? 'emerald' : sub.status === 'paused' ? 'amber' : 'red'}-100 text-${sub.status === 'active' ? 'emerald' : sub.status === 'paused' ? 'amber' : 'red'}-700 border-none font-bold text-[10px] uppercase px-2 py-0.5`}>
                                            {sub.status}
                                        </Badge>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900">{sub.name}</h3>
                                </div>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full"><MoreVertical className="w-4 h-4" /></Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56 rounded-xl">
                                        <DropdownMenuLabel className="text-xs">Manage</DropdownMenuLabel>
                                        <DropdownMenuSeparator />

                                        {sub.status === 'paused' ? (
                                            <DropdownMenuItem onClick={() => handleAction(sub.id, 'resume')}><PlayCircle className="w-4 h-4 mr-2" /> Resume Services</DropdownMenuItem>
                                        ) : sub.status === 'active' ? (
                                            <PauseModal sub={sub} />
                                        ) : null}

                                        {sub.status !== 'cancelled' && <PlanSwitchModal sub={sub} />}

                                        {sub.status !== 'cancelled' && (
                                            <>
                                                <DropdownMenuSeparator />
                                                <CancelModal sub={sub} />
                                            </>
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            <div className="grid grid-cols-2 gap-6 mb-6">
                                <div>
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Pricing</p>
                                    <p className="text-lg font-black text-slate-800">{sub.price} <span className="text-xs font-medium text-slate-500">/{sub.period}</span></p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Next Billing</p>
                                    <p className="text-sm font-semibold text-slate-800">{sub.status === 'active' ? sub.nextBilling : '-'}</p>
                                </div>
                            </div>

                            {/* Daily Needs Section (Rice/Milk) */}
                            {sub.vendorType === 'daily_needs' && sub.status === 'active' && (
                                <div className="mt-6 pt-6 border-t border-slate-100 space-y-5">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div className="space-y-2">
                                            <p className="text-xs font-semibold text-slate-500 uppercase">Delivery Schedule</p>
                                            <div className="flex gap-1.5">
                                                {sub.deliveries.map((isDelivering, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => toggleDeliveryDay(sub.id, i)}
                                                        className={`w-7 h-7 rounded-full text-[10px] font-bold transition-colors ${isDelivering ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                                                    >
                                                        {days[i]}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-xs font-semibold text-slate-500 uppercase">Per Delivery</p>
                                            <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-lg border border-slate-200 w-fit">
                                                <Button size="icon" variant="ghost" className="h-6 w-6 rounded-md hover:bg-white text-slate-600" onClick={() => handleQuantity(sub.id, -1)}><Minus className="h-3 w-3" /></Button>
                                                <span className="font-black text-xs w-6 text-center text-slate-800">{sub.quantity}</span>
                                                <Button size="icon" variant="ghost" className="h-6 w-6 rounded-md hover:bg-white text-slate-600" onClick={() => handleQuantity(sub.id, 1)}><Plus className="h-3 w-3" /></Button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <Button variant="outline" className="w-full text-xs font-semibold border-indigo-200 text-indigo-700 hover:bg-indigo-50" onClick={() => handleExtraDelivery(sub.id)}>
                                            <Plus className="w-3.5 h-3.5 mr-1.5" /> Extra Today
                                        </Button>
                                        <Button variant="outline" className="w-full text-xs font-semibold border-slate-200 text-slate-600 hover:bg-slate-50" onClick={() => handleSkipDelivery(sub.id)}>
                                            <PauseCircle className="w-3.5 h-3.5 mr-1.5" /> Skip Tomorrow
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>
                ))}
            </div>
            {subs.length === 0 && (
                <div className="py-20 text-center bg-white rounded-lg border border-slate-200 border-dashed">
                    <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-900">No Active Subscriptions</h3>
                    <p className="text-slate-500 text-sm mt-1">You do not have any active subscriptions with this vendor.</p>
                </div>
            )}
        </div>
    );
}
