'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Plus,
  Search,
  ChevronRight,
  MoreHorizontal,
  LayoutGrid,
  List,
  Filter,
  ChevronDown,
  Download
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { NewSubscriptionDialog } from './new-subscription-dialog';
import { ManageSubscriptionDialog } from './manage-subscription-dialog';
import { useVendorAuth } from '@/lib/vendor-auth';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useData } from '@/lib/data-context';
import { PauseDeliveryDialog } from '@/components/dashboard/pause-delivery-dialog';
import { ScheduleEditorDialog } from '@/components/dashboard/schedule-editor-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const initialSubscriptionData = [
  { id: 'SUB-012', customer: 'Hotha Kapoor', avatar: 'HK', plan: 'Pro Plan', status: 'Active', amount: '₹999.00', nextBilling: '4 Mar 2026' },
  { id: 'SUB-011', customer: 'Naveen Menon', avatar: 'NM', plan: 'Pro Trial', status: 'Trialing', amount: '₹0.00', nextBilling: '3 Mar 2026' },
  { id: 'SUB-010', customer: 'Nishara Deasi', avatar: 'ND', plan: 'Basic Plan', status: 'Active', amount: '₹799.00', nextBilling: '3 Mar 2026' },
  { id: 'SUB-009', customer: 'Krishna Iyer', avatar: 'KI', plan: 'Trial Plan', status: 'Active', amount: '₹999.00', nextBilling: '4 Mar 2026' },
  { id: 'SUB-008', customer: 'Anjali Verma', avatar: 'AV', plan: 'Basic Plan', status: 'Paused', amount: '₹1,594.00', nextBilling: '3 Mar 2026' },
  { id: 'SUB-007', customer: 'Ganesh Kumar', avatar: 'GK', plan: 'Pro Plan', status: 'Active', amount: '₹999.00', nextBilling: '4 Mar 2026' },
  { id: 'SUB-006', customer: 'Vikas Singh', avatar: 'VS', plan: 'Pro Plan', status: 'Active', amount: '₹2,450.00', nextBilling: '4 Mar 2026' },
  { id: 'SUB-005', customer: 'Megha Rao', avatar: 'MR', plan: 'Basic Plan', status: 'Active', amount: '₹999.00', nextBilling: '3 Mar 2026' },
  { id: 'SUB-9921', customer: 'Customer User', avatar: 'CU', plan: 'Premium Milk Delivery', status: 'Active', amount: '₹1,200.00', nextBilling: '3 Mar 2026' },
];

export default function SubscriptionsPage() {
  const { user, updateUser } = useVendorAuth();
  const router = useRouter();
  const isCustomer = user?.role === 'customer' || user?.email === 'customer@user.com';

  const { mockCustomerSubscriptions: firebaseSubscriptions, mockCustomers, mockBusinessPlans, mockInvoices, addDocument, updateDocument, deleteDocument } = useData();

  const formattedFirebaseSubscriptions = firebaseSubscriptions
    .filter(s => s.tenantId === user?.tenantId)
    .map(sub => {
      // Look for the customer across ID, email, and name fields for maximum compatibility
      const customer = mockCustomers.find(c =>
        (sub.customerId && c.id === sub.customerId) ||
        (sub.customerEmail && c.email === sub.customerEmail) ||
        (sub.customer && c.email === sub.customer) ||
        (sub.customerName && c.name === sub.customerName)
      );

      const plan = mockBusinessPlans.find(p => p.id === sub.planId) || { name: sub.plan || 'Standard Service', price: sub.totalAmount || 0 };

      // Try multiple possible fields for the name, prioritizing the linked customer record
      const finalCustomerName = customer?.name || sub.customerName || sub.customer_name || sub.customer || sub.clientName || 'Unregistered Customer';
      const finalPlanName = sub.plan || sub.planName || plan.name;

      return {
        id: sub.id,
        customer: finalCustomerName,
        avatar: finalCustomerName.split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2),
        plan: finalPlanName,
        status: sub.status === 'active' ? 'Active' : sub.status === 'paused' ? 'Paused' : sub.status === 'cancelled' ? 'Canceled' : 'Active',
        amount: `₹${(sub.totalAmount || plan.price).toLocaleString('en-IN')}`,
        nextBilling: new Date(sub.endDate || Date.now()).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        rawSub: sub
      }
    });

  const subscriptions = formattedFirebaseSubscriptions.length > 0 ? formattedFirebaseSubscriptions : initialSubscriptionData;

  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubscription, setSelectedSubscription] = useState<any>(null);
  const [isManageOpen, setIsManageOpen] = useState(false);
  const [isPauseOpen, setIsPauseOpen] = useState(false);
  const [isEditPaymentOpen, setIsEditPaymentOpen] = useState(false);
  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false);
  const [isScheduleEditorOpen, setIsScheduleEditorOpen] = useState(false);

  // States for Customer View simulator
  const [mySubStatus, setMySubStatus] = useState('Active');
  const [mySubPrice, setMySubPrice] = useState('0');
  const [mySubCycle, setMySubCycle] = useState('/month');
  const [mySubId, setMySubId] = useState('N/A');
  const [myNextBilling, setMyNextBilling] = useState('N/A');
  const [outstandingAmountVal, setOutstandingAmountVal] = useState('0');
  const [totalActiveValue, setTotalActiveValue] = useState('0');
  const [myPauseRequests, setMyPauseRequests] = useState<any[]>([]);

  const [vendorRequests, setVendorRequests] = useState<any[]>([]);

  const fetchRequests = () => {
    const stored = localStorage.getItem('subtrack_pause_requests');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (isCustomer) setMyPauseRequests(parsed);
        else setVendorRequests(parsed);
      } catch (e) { }
    }
  };

  useEffect(() => {
    fetchRequests();
    window.addEventListener('requests_updated', fetchRequests);
    return () => window.removeEventListener('requests_updated', fetchRequests);
  }, [isCustomer, isPauseOpen]);

  const handleApproveRequest = (reqId: string) => {
    const stored = JSON.parse(localStorage.getItem('subtrack_pause_requests') || '[]');
    const updated = stored.map((r: any) => r.id === reqId ? { ...r, status: 'Approved' } : r);
    localStorage.setItem('subtrack_pause_requests', JSON.stringify(updated));
    setVendorRequests(updated);
    toast.success('Request approved successfully');
    window.dispatchEvent(new Event('requests_updated'));
  };

  const [todayQuantity, setTodayQuantity] = useState<number>(2);

  const [extraMilkPayment, setExtraMilkPayment] = useState<number>(0);

  // Today's Override Sync
  useEffect(() => {
    if (isCustomer && user) {
      const mySubs = firebaseSubscriptions.filter(s => s.customerId === user.id || s.customerEmail === user.email);
      if (mySubs.length > 0) {
        const activeSubs = mySubs.filter(s => s.status === 'active');
        const primarySub = activeSubs[0] || mySubs[0];

        // Calculate sum of all active subscriptions
        const totalMonthly = activeSubs.reduce((sum, s) => {
          const plan = mockBusinessPlans.find(p => p.id === s.planId);
          return sum + (s.totalAmount || plan?.price || 0);
        }, 0);

        setMySubStatus(primarySub.status === 'active' ? 'Active' : primarySub.status === 'paused' ? 'Paused' : 'Canceled');
        setMySubPrice(totalMonthly.toLocaleString('en-IN'));
        setTotalActiveValue(totalMonthly.toLocaleString('en-IN'));

        const plan = mockBusinessPlans.find(p => p.id === primarySub.planId);
        setMySubCycle(plan?.interval ? `/${plan.interval}` : '/month');
        setMySubId(primarySub.id);
        setMyNextBilling(primarySub.endDate ? new Date(primarySub.endDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A');
      } else {
        setMySubPrice('0');
        setTotalActiveValue('0');
      }

      // Calculate Outstanding Amount
      const myInvoices = mockInvoices.filter(inv => inv.customerId === user.id || inv.customerEmail === user.email);
      const unpaid = myInvoices.filter(inv => inv.status !== 'paid' && inv.status !== 'cancelled' && inv.status !== 'Canceled');
      const totalOutstanding = unpaid.reduce((sum, inv) => {
        const amt = typeof inv.totalAmount === 'number' ? inv.totalAmount : parseFloat(inv.totalAmount?.toString().replace(/[^0-9.]/g, '') || '0');
        return sum + amt;
      }, 0);

      // Calculate extra charges for UNPAID schedule overrides
      const storedRequests = JSON.parse(localStorage.getItem('subtrack_pause_requests') || '[]');
      const paymentPendingRequests = storedRequests.filter((r: any) => r.status === 'Pending');
      let extraCharges = 0;
      paymentPendingRequests.forEach((req: any) => {
        if (req.details && Array.isArray(req.details)) {
          req.details.forEach(([_, qty]: [string, number]) => {
            if (qty > 2) {
              extraCharges += (qty - 2) * 25; // Assume ₹25 per extra 500ml packet
            }
          });
        }
      });

      setOutstandingAmountVal(totalOutstanding.toLocaleString('en-IN'));
      setExtraMilkPayment(extraCharges);
    }
  }, [isCustomer, user, firebaseSubscriptions, mockBusinessPlans, mockInvoices, myPauseRequests]);

  // Today's Override Sync
  useEffect(() => {
    const fetchOverrides = () => {
      const existingOverrides = JSON.parse(localStorage.getItem('subtrack_daily_overrides') || '{}');
      const date = new Date();
      const weekday = date.toLocaleDateString('en-GB', { weekday: 'short' });
      const day = date.toLocaleDateString('en-GB', { day: '2-digit' });
      const month = date.toLocaleDateString('en-GB', { month: 'short' });
      const year = date.toLocaleDateString('en-GB', { year: 'numeric' });
      const dateStr = `${weekday} ${day} ${month} ${year}`;
      setTodayQuantity(existingOverrides[dateStr] !== undefined ? existingOverrides[dateStr] : 2);
    };

    fetchOverrides();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'subtrack_daily_overrides') {
        fetchOverrides();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('overrides_updated', fetchOverrides);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('overrides_updated', fetchOverrides);
    };
  }, []);

  const [isEditBillingOpen, setIsEditBillingOpen] = useState(false);
  const [billingForm, setBillingForm] = useState({
    companyName: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });
  const [isSavingBilling, setIsSavingBilling] = useState(false);

  useEffect(() => {
    if (user?.billingAddress) {
      setBillingForm(user.billingAddress);
    } else {
      // Default placeholder values for visual continuity until changed
      setBillingForm({
        companyName: 'Ganesh Enterprises',
        street: '456 MG Road',
        city: 'Coimbatore',
        state: 'Tamil Nadu',
        zipCode: '641001',
        country: 'India'
      });
    }
  }, [user?.billingAddress]);

  const handleSaveBilling = async () => {
    setIsSavingBilling(true);
    await new Promise(r => setTimeout(r, 800)); // Simulate API payload
    updateUser({ billingAddress: billingForm });
    setIsSavingBilling(false);
    setIsEditBillingOpen(false);
    toast.success('Billing information updated successfully!');
  };

  // Removed localStorage sync since using Firebase

  const tabs = ['All', 'Active', 'Trialing', 'Past Due', 'Paused', 'Canceled'];

  const handleManage = (sub: any) => {
    if (isCustomer) return; // Restrict management for customers
    setSelectedSubscription(sub);
    setIsManageOpen(true);
  };

  const handleAddSubscription = async (newSub: any) => {
    try {
      await addDocument('subscriptions', newSub);
      toast.success('Subscription created successfully!');
    } catch (e) {
      toast.error('Failed to create subscription.');
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const subToUpdate = subscriptions.find(s => s.id === id) as any;
      if (subToUpdate && subToUpdate.rawSub) {
        await updateDocument('subscriptions', subToUpdate.rawSub.id, {
          status: newStatus.toLowerCase()
        });
        toast.success(`Subscription status updated to ${newStatus}.`);
      }
    } catch (e) {
      toast.error('Failed to update status.');
    }
  };

  const handleUpdateSubscription = async (updatedSub: any) => {
    try {
      if (updatedSub.rawSub) {
        await updateDocument('subscriptions', updatedSub.rawSub.id, {
          status: updatedSub.status.toLowerCase(),
          // Map any other properties from updatedSub back to rawSub format if needed
        });
        toast.success('Subscription updated successfully!');
      }
    } catch (e) {
      toast.error('Failed to update subscription.');
    }
  };

  const handleDeleteSubscription = async (id: string) => {
    try {
      const subToDelete = subscriptions.find(s => s.id === id) as any;
      if (subToDelete && subToDelete.rawSub) {
        await deleteDocument('subscriptions', subToDelete.rawSub.id);
        toast.success('Subscription deleted successfully.');
        setIsManageOpen(false);
      }
    } catch (e) {
      toast.error('Failed to delete subscription.');
    }
  };

  const filteredSubscriptions = subscriptions.filter(sub => {
    const matchesTab = activeTab === 'All' || sub.status === activeTab;
    const matchesSearch = sub.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.id.toLowerCase().includes(searchTerm.toLowerCase());

    // If customer, only show their own
    if (isCustomer) {
      return matchesTab && matchesSearch && sub.customer === 'Customer User';
    }

    return matchesTab && matchesSearch;
  });

  if (isCustomer) {
    const handleAction = (action: string) => {
      toast.loading(`Processing...`, { id: 'action' });
      setTimeout(() => {
        toast.dismiss('action');
        toast.success(`${action} completed successfully!`);
        if (action === 'Cancel Subscription') setMySubStatus('Cancelled');
        if (action === 'Downgrade Plan') setMySubPrice('999');
        if (action === 'Change Billing Cycle to Monthly') setMySubCycle('/month');
        if (action === 'Change Billing Cycle to Yearly') setMySubCycle('/year');
      }, 1500);
    };

    const handlePaymentFlow = async (action: string, amount: number) => {
      toast.loading(`Processing ${action}...`, { id: 'pay' });
      setTimeout(() => {
        toast.dismiss('pay');
        toast.success(`${action} completed successfully!`);
        if (action === 'Upgrading to Premium Plan') setMySubPrice('3,499');
        if (action === 'Paying for Extra Milk') {
          const stored = JSON.parse(localStorage.getItem('subtrack_pause_requests') || '[]');
          const updated = stored.map((r: any) => {
            if (r.status === 'Pending' && r.details) {
              const hasExtra = r.details.some((d: any) => d[1] > 2);
              if (hasExtra) return { ...r, status: 'Paid' };
            }
            return r;
          });
          localStorage.setItem('subtrack_pause_requests', JSON.stringify(updated));
          window.dispatchEvent(new Event('requests_updated'));
        }
      }, 1500);
    };

    return (
      <div className="space-y-6 max-w-7xl mx-auto mb-10">

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* LEFT COLUMN */}
          <div className="space-y-6">

            {/* My Subscription */}
            <div className="bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100 p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-slate-900 text-base">My Subscription</h3>
                <span className={cn(
                  "text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded",
                  mySubStatus === 'Active' ? "bg-emerald-50 text-emerald-600" :
                    mySubStatus === 'Cancelled' ? "bg-rose-50 text-rose-600" : "bg-slate-50 text-slate-600"
                )}>{mySubStatus}</span>
              </div>

              <div className="mb-6 border-b border-slate-100 pb-4">
                <div className="flex items-end gap-1 mt-1">
                  <span className="text-2xl font-black text-slate-900">₹{mySubPrice}</span>
                  <span className="text-slate-500 text-sm mb-1 font-medium">{mySubCycle}</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 font-medium">Next Billing: {myNextBilling} <span className="mx-2 text-slate-200">|</span> {mySubId}</p>
              </div>

              <div className="mb-6">
                <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-2">Today's Delivery</p>
                <div className="flex items-center gap-3 bg-blue-50/50 p-3 rounded-lg border border-blue-100/50">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-black">
                    {todayQuantity}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      {todayQuantity === 0 ? <span className="text-rose-500">Skipped for Today</span> : 'Packets Scheduled'}
                    </p>
                    <p className="text-xs font-medium text-slate-500">
                      {todayQuantity === 0 ? 'No delivery scheduled.' : '500ml Fresh Cow Milk'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button onClick={() => router.push('/vendor/discover-plans')} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold flex-1 sm:flex-none">Upgrade Plan</Button>
                <Button onClick={() => router.push('/vendor/discover-plans')} variant="outline" className="border-slate-200 font-semibold text-slate-700 flex-1 sm:flex-none shadow-sm">Downgrade</Button>
              </div>
            </div>

            {/* Billing Information Card */}
            <div className="bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100 p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-slate-900 text-base">Billing Information</h3>
                <button onClick={() => setIsEditBillingOpen(true)} className="text-xs text-slate-400 hover:text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22h6a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v10" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M10.4 12.6a2 2 0 1 1 3 3L8 21l-4 1 1-4Z" /></svg>
                </button>
              </div>

              <div className="mb-6">
                <p className="font-bold text-slate-800 text-sm mb-1">{user?.billingAddress?.companyName || 'Ganesh Enterprises'}</p>
                <p className="text-[12px] text-slate-500 leading-relaxed font-medium">
                  {user?.billingAddress?.street || '456 MG Road'}<br />
                  {user?.billingAddress?.city || 'Coimbatore'}, {user?.billingAddress?.state || 'Karnataka'} {user?.billingAddress?.zipCode || '560001'}<br />
                  {user?.billingAddress?.country || 'India'}
                </p>
              </div>

              <div className="flex justify-between items-center pt-5 border-t border-slate-100 border-dashed">
                <span className="font-bold text-slate-900 text-sm">Total Active</span>
                <span className="font-black text-lg text-slate-900">₹ {totalActiveValue}</span>
              </div>
            </div>



          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">

            {/* Outstanding Amount Card */}
            <div className="bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100 p-6">
              <h3 className="font-bold text-slate-900 text-base mb-2">Outstanding Amount</h3>

              <div className="mb-6">
                <div className="flex items-end gap-1 mt-1">
                  <span className="text-2xl font-black text-rose-500">₹{outstandingAmountVal}</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 font-medium">Updated based on current invoices</p>
              </div>

              {extraMilkPayment > 0 && (
                <div className="mb-6 p-4 rounded-xl bg-indigo-50/50 border border-indigo-100/50 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-bold text-indigo-900 flex items-center gap-1.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600"><path d="M4 2v20l2-2 2 2 2-2 2 2 2-2 2 2 2-2V2l-2 2-2-2-2 2-2-2-2 2-2-2-2 2-2-2Z" /><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" /><path d="M12 17.5v-11" /></svg>
                      Extra Milk Payment
                    </p>
                    <p className="text-[11px] text-indigo-600/80 font-medium mt-0.5 tracking-tight">For approved extra quantities</p>
                  </div>
                  <Button
                    onClick={() => handlePaymentFlow('Paying for Extra Milk', extraMilkPayment)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm h-9 px-5 w-full sm:w-auto font-bold tracking-tight rounded-lg"
                  >
                    Pay ₹{extraMilkPayment} Now
                  </Button>
                </div>
              )}

              <div className="flex items-center justify-between gap-3 flex-wrap">
                <Button onClick={() => setIsPauseOpen(true)} className="bg-amber-100 hover:bg-amber-200 text-amber-700 font-bold shadow-none flex-1 border border-amber-300 h-10 w-full sm:w-auto">
                  Pause / Skip Delivery
                </Button>
                <Button onClick={() => handleAction('Cancel Subscription')} className="bg-rose-50 font-bold shadow-none flex-1 hover:bg-rose-100 border border-transparent shadow-[inset_0_0_0_1px_rgba(244,63,94,0.3)] !text-rose-600 hover:!bg-rose-50 h-10 w-full sm:w-auto">
                  Cancel Subscription
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="border-slate-200 text-slate-600 font-bold flex-1 shadow-sm flex items-center justify-center gap-1 text-xs h-10 hover:bg-slate-50">
                      Change Billing Cycle <ChevronDown className="w-3.5 h-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40 font-medium">
                    <DropdownMenuItem onClick={() => handleAction('Change Billing Cycle to Monthly')} className="cursor-pointer">
                      Monthly
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleAction('Change Billing Cycle to Yearly')} className="cursor-pointer">
                      Yearly
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100 p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-slate-900 text-base">Payment Method</h3>
                <button onClick={() => setIsEditPaymentOpen(true)} className="text-xs text-slate-400 hover:text-blue-600 flex items-center gap-1.5 font-medium">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg> Edit
                </button>
              </div>

              <div className="border border-slate-100 bg-slate-50/50 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-4">
                  <div className="min-w-12 h-8 bg-[#02042B] rounded-md shadow-sm flex items-center justify-center relative flex-shrink-0">
                    <span className="text-white text-[11px] font-black italic tracking-tighter">Card</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-black tracking-widest text-slate-800 text-sm">••••</span>
                      <span className="font-bold text-slate-900 text-sm">4242</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">Exp 09/2026 • Saved Card</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button onClick={() => setIsAddPaymentOpen(true)} className="text-[12px] text-blue-600 font-bold hover:underline tracking-tight">+ Add New Payment Method</button>
              </div>
            </div>

            {/* Pause Requests History */}
            {myPauseRequests.length > 0 && (
              <div className="bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100 p-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <h3 className="font-bold text-slate-900 text-base mb-4">Schedule Requests</h3>
                <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1 custom-scrollbar">
                  {myPauseRequests.map((req, i) => (
                    <div key={i} className="flex justify-between items-center p-3 border border-slate-100 rounded-lg bg-slate-50/50">
                      <div>
                        <p className="text-xs font-bold text-slate-800">
                          {req.details ? `Modified ${req.details.length} days` : `${req.startDate} ${req.endDate && req.endDate !== req.startDate ? `to ${req.endDate}` : ''}`}
                        </p>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          {req.details ? req.details.map((d: any) => `${d[0]}: ${d[1]} Pkts`).join(' | ') : `${req.days} Day(s)`}
                        </p>
                      </div>
                      <span className={cn(
                        "text-[10px] uppercase font-black px-2 py-1 rounded border whitespace-nowrap ml-3",
                        req.status === 'Approved' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                          req.status === 'Rejected' ? "bg-rose-50 text-rose-600 border-rose-100" :
                            "bg-amber-50 text-amber-600 border-amber-100"
                      )}>
                        {req.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>

        <Dialog open={isEditBillingOpen} onOpenChange={setIsEditBillingOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Billing Details</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Company Name / Name</label>
                <Input
                  value={billingForm.companyName}
                  onChange={(e) => setBillingForm({ ...billingForm, companyName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Street Address</label>
                <Input
                  value={billingForm.street}
                  onChange={(e) => setBillingForm({ ...billingForm, street: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">City</label>
                  <Input
                    value={billingForm.city}
                    onChange={(e) => setBillingForm({ ...billingForm, city: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">State / Province</label>
                  <Input
                    value={billingForm.state}
                    onChange={(e) => setBillingForm({ ...billingForm, state: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">ZIP / Postal Code</label>
                  <Input
                    value={billingForm.zipCode}
                    onChange={(e) => setBillingForm({ ...billingForm, zipCode: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Country</label>
                  <Input
                    value={billingForm.country}
                    onChange={(e) => setBillingForm({ ...billingForm, country: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditBillingOpen(false)}>Cancel</Button>
              <Button onClick={handleSaveBilling} disabled={isSavingBilling}>
                {isSavingBilling && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isEditPaymentOpen} onOpenChange={setIsEditPaymentOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Payment Method</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name on Card</label>
                <Input defaultValue={user?.name || "Customer User"} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Card Number</label>
                <Input defaultValue="**** **** **** 4242" disabled />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Expiry</label>
                  <Input defaultValue="09/2026" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">CVV</label>
                  <Input placeholder="***" type="password" />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditPaymentOpen(false)}>Cancel</Button>
              <Button onClick={() => {
                toast.success('Payment method updated successfully!');
                setIsEditPaymentOpen(false);
              }}>
                Update Card
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isAddPaymentOpen} onOpenChange={setIsAddPaymentOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Payment Method</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name on Card</label>
                <Input placeholder="e.g. John Doe" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Card Number</label>
                <Input placeholder="0000 0000 0000 0000" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Expiry</label>
                  <Input placeholder="MM/YY" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">CVV</label>
                  <Input placeholder="CVV" type="password" />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddPaymentOpen(false)}>Cancel</Button>
              <Button onClick={() => {
                toast.success('New payment method added securely!');
                setIsAddPaymentOpen(false);
              }}>
                Save Card
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <PauseDeliveryDialog
          open={isPauseOpen}
          onOpenChange={setIsPauseOpen}
          onEdit={() => {
            setIsPauseOpen(false);
            setIsScheduleEditorOpen(true);
          }}
          onSubmit={(data) => {
            toast.success(`Successfully submitted pause request for ${data.days} day(s).`);
            setMyPauseRequests(prev => [data, ...prev]);
          }}
        />

        <ScheduleEditorDialog
          open={isScheduleEditorOpen}
          onOpenChange={setIsScheduleEditorOpen}
          onCancel={() => {
            setIsScheduleEditorOpen(false);
            setIsPauseOpen(true);
          }}
          onSubmit={(data) => {
            toast.success(`Successfully updated delivery schedule.`);
            setMyPauseRequests(prev => [data, ...prev]);
            setIsScheduleEditorOpen(false);
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumbs & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
            <span className="hover:text-blue-600 cursor-pointer">Dashboard</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-900">Subscriptions</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Subscriptions
          </h1>
        </div>
        {!isCustomer && (
          <div className="flex items-center gap-3">
            <NewSubscriptionDialog onAdd={handleAddSubscription} />
          </div>
        )}
      </div>

      {/* Pending Schedule Requests (Vendor Only) */}
      {!isCustomer && vendorRequests.filter(r => r.status === 'Pending' || r.status === 'Paid').length > 0 && (
        <Card className="p-6 border-slate-100 shadow-sm border-orange-100 bg-orange-50/10 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 text-base">Pending Schedule Requests</h3>
            <span className="bg-orange-100 text-orange-600 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">{vendorRequests.filter(r => r.status === 'Pending' || r.status === 'Paid').length} Action Required</span>
          </div>
          <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1 custom-scrollbar">
            {vendorRequests.filter(r => r.status === 'Pending' || r.status === 'Paid').map((req, i) => (
              <div key={i} className="flex justify-between items-center p-3 border border-orange-100 rounded-lg bg-white shadow-sm">
                <div>
                  <p className="flex items-center gap-2 text-sm font-bold text-slate-800">
                    {req.customer}
                    {req.status === 'Paid' && <span className="text-[9px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded uppercase tracking-widest font-black">Paid Extra</span>}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {req.details ? `Modified ${req.details.length} days (${req.details.map((d: any) => `${d[0]}: ${d[1]} Pkts`).join(', ')})` : `Pause request: ${req.startDate} to ${req.endDate} (${req.days} days)`}
                  </p>
                </div>
                <Button onClick={() => handleApproveRequest(req.id)} size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold h-8 ml-4 shrink-0">
                  Approve
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Filters & Search View */}
      <Card className="p-6 border-slate-100 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-lg">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-4 py-1.5 text-xs font-bold rounded-md transition-all",
                  activeTab === tab
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-slate-400 hover:text-slate-600"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
            <span>{filteredSubscriptions.length} Subscriptions Found</span>
            <span className="w-px h-4 bg-slate-200" />
            <span>{searchTerm ? `${filteredSubscriptions.length} Search Found` : 'Search for more'}</span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search customers..."
              className="pl-10 h-10 border-slate-200 focus-visible:ring-1 focus-visible:ring-blue-500 rounded-lg text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Subscriptions Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-50 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                <th className="text-left py-4 px-4 w-1 flex items-center gap-2">
                  <Input type="checkbox" className="w-4 h-4 rounded-sm border-slate-200" />
                </th>
                <th className="text-left py-4 px-4">Customer</th>
                <th className="text-left py-4 px-4">ID</th>
                <th className="text-left py-4 px-4">Plan</th>
                <th className="text-left py-4 px-4">Status</th>
                <th className="text-left py-4 px-4">Amount</th>
                <th className="text-left py-4 px-4">Next Billing</th>
                <th className="text-right py-4 px-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredSubscriptions.map((sub) => (
                <tr key={sub.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-4">
                    <Input type="checkbox" className="w-4 h-4 rounded-sm border-slate-200" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500 border border-slate-200">
                        {sub.avatar}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900">{sub.customer}</span>
                        {sub.customer === 'Customer User' && todayQuantity !== 2 && (
                          <span className={cn(
                            "text-[9px] uppercase font-black px-1.5 py-0.5 rounded mt-0.5 w-fit border",
                            todayQuantity === 0 ? "bg-rose-50 border-rose-100 text-rose-600" : "bg-blue-50 border-blue-100 text-blue-600"
                          )}>
                            Today's Override: {todayQuantity} Pkts
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-xs font-bold text-slate-400">#{sub.id}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-xs font-bold text-slate-600">{sub.plan}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={cn(
                      "text-[10px] font-black uppercase px-2 py-0.5 rounded-full",
                      sub.status === 'Active' ? "bg-emerald-50 text-emerald-600" :
                        sub.status === 'Trialing' ? "bg-amber-50 text-amber-600 text-amber-500/80 border border-amber-200/50" :
                          "bg-slate-100 text-slate-500"
                    )}>
                      {sub.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm font-black text-slate-900">{sub.amount}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-xs font-bold text-slate-600">{sub.nextBilling}</span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    {!isCustomer && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleManage(sub)}
                      >
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {!isCustomer && (
        <ManageSubscriptionDialog
          subscription={selectedSubscription}
          open={isManageOpen}
          onOpenChange={setIsManageOpen}
          onUpdateStatus={handleUpdateStatus}
          onUpdateSubscription={handleUpdateSubscription}
          onDeleteSubscription={handleDeleteSubscription}
        />
      )}
    </div>
  );
}