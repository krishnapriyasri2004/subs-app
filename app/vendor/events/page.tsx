'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    Activity,
    AlertCircle,
    Server,
    User,
    Download,
    Calendar,
    Search,
    RefreshCcw,
    Eye,
    XCircle,
    CheckCircle2,
    FilterX,
    Info,
    Smartphone,
    Globe
} from 'lucide-react';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { subDays, startOfDay, isWithinInterval, parseISO } from 'date-fns';

// Mock Data
const MOCK_EVENTS = [
    {
        id: 'evt_98f45a2b1',
        type: 'subscription_created',
        module: 'Subscriptions',
        description: 'New premium subscription created for Acme Corp.',
        performedBy: 'john@acmecorp.com',
        status: 'success',
        timestamp: '2026-03-03T10:15:00Z',
        metadata: { plan_id: 'plan_premium', amount: 4999, currency: 'INR' },
        ipAddress: '192.168.1.105',
        device: 'MacBook Pro / Chrome 120',
        endpoint: 'POST /api/v1/subscriptions'
    },
    {
        id: 'evt_98f45a2b2',
        type: 'invoice_payment_failed',
        module: 'Payments',
        description: 'Payment collection failed. Insufficient funds.',
        performedBy: 'system',
        status: 'failed',
        timestamp: '2026-03-03T09:30:12Z',
        metadata: { invoice_id: 'INV-2026-042', gateway_error: 'insufficient_funds' },
        ipAddress: 'Server Internal',
        device: 'Node.js Runtime',
        endpoint: 'Webhook /stripe/events'
    },
    {
        id: 'evt_98f45a2b3',
        type: 'user_login',
        module: 'Auth',
        description: 'Successful user authentication.',
        performedBy: 'sarah.j@techstart.io',
        status: 'success',
        timestamp: '2026-03-03T09:15:45Z',
        metadata: { method: 'sso_google', session_id: 'sess_x89a' },
        ipAddress: '203.0.113.42',
        device: 'Windows 11 / Edge 118',
        endpoint: 'POST /api/auth/login'
    },
    {
        id: 'evt_98f45a2b4',
        type: 'customer_updated',
        module: 'Customers',
        description: 'Billing address updated.',
        performedBy: 'admin@vendor.com',
        status: 'success',
        timestamp: '2026-03-03T08:05:22Z',
        metadata: { customer_id: 'CUST-304', fields_changed: ['address', 'zip_code'] },
        ipAddress: '198.51.100.12',
        device: 'iPad Pro / Safari',
        endpoint: 'PATCH /api/v1/customers/CUST-304'
    },
    {
        id: 'evt_98f45a2b5',
        type: 'webhook_dispatch_failed',
        module: 'System',
        description: 'Failed to deliver webhook payload to endpoint.',
        performedBy: 'system',
        status: 'failed',
        timestamp: '2026-03-02T23:45:00Z',
        metadata: { target_url: 'https://api.clientapp.com/webhooks', retry_count: 3 },
        ipAddress: 'Server Internal',
        device: 'Background Worker',
        endpoint: 'Internal Event Bus'
    },
    {
        id: 'evt_98f45a2b6',
        type: 'invoice_generated',
        module: 'Invoices',
        description: 'Monthly recurring invoice automatically generated.',
        performedBy: 'system',
        status: 'success',
        timestamp: '2026-03-02T00:01:05Z',
        metadata: { invoice_id: 'INV-2026-043', total: 12000 },
        ipAddress: 'Server Internal',
        device: 'Cron Job',
        endpoint: 'Internal Scheduler'
    },
    {
        id: 'evt_98f45a2b7',
        type: 'password_reset_requested',
        module: 'Auth',
        description: 'User requested a password reset link.',
        performedBy: 'mike.ross@pearson.com',
        status: 'success',
        timestamp: '2026-03-01T14:20:10Z',
        metadata: { status: 'email_sent' },
        ipAddress: '192.168.1.55',
        device: 'iPhone 15 / Safari Mobile',
        endpoint: 'POST /api/auth/forgot-password'
    }
];

export default function EventLogsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [moduleFilter, setModuleFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const [dateRange, setDateRange] = useState('All Time');
    const [selectedEvent, setSelectedEvent] = useState<any | null>(null);

    const filteredEvents = MOCK_EVENTS.filter(evt => {
        const matchesSearch = evt.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            evt.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            evt.performedBy.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesModule = moduleFilter === 'All' || evt.module === moduleFilter;
        const matchesStatus = statusFilter === 'All' || evt.status === statusFilter.toLowerCase();
        
        // Date Filtering
        const evtDate = parseISO(evt.timestamp);
        const now = new Date();
        let matchesDate = true;
        
        if (dateRange === 'Today') {
            matchesDate = isWithinInterval(evtDate, { start: startOfDay(now), end: now });
        } else if (dateRange === 'Yesterday') {
            matchesDate = isWithinInterval(evtDate, { start: startOfDay(subDays(now, 1)), end: startOfDay(now) });
        } else if (dateRange === 'Last 7 Days') {
            matchesDate = isWithinInterval(evtDate, { start: subDays(now, 7), end: now });
        } else if (dateRange === 'Last 30 Days') {
            matchesDate = isWithinInterval(evtDate, { start: subDays(now, 30), end: now });
        }
        
        return matchesSearch && matchesModule && matchesStatus && matchesDate;
    });

    const handleClearFilters = () => {
        setSearchTerm('');
        setModuleFilter('All');
        setStatusFilter('All');
    };

    const handleRetry = () => {
        toast.promise(
            new Promise(resolve => setTimeout(resolve, 1500)),
            {
                loading: 'Retrying event execution...',
                success: 'Event successfully re-processed.',
                error: 'Failed to retry event.'
            }
        );
    };

    const handleExport = () => {
        toast.loading("Compiling audit trail CSV...", { id: "export-events" });
        setTimeout(() => {
            const headers = ["ID", "Type", "Module", "Description", "Performed By", "Status", "Timestamp"];
            const csvRows = [headers.join(",")];

            for (const evt of filteredEvents) {
                const values = [
                    evt.id,
                    evt.type,
                    evt.module,
                    `"${evt.description.replace(/"/g, '""')}"`,
                    evt.performedBy,
                    evt.status,
                    evt.timestamp
                ];
                csvRows.push(values.join(","));
            }

            const csvString = csvRows.join('\n');
            const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `event_audit_trail.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            toast.success("Audit trail downloaded successfully!", { id: "export-events" });
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-[#F9FAFB] -m-6 p-6 md:p-10 font-sans">
            <div className="max-w-[1400px] mx-auto space-y-8">

                {/* Top Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Event Logs</h1>
                        <p className="text-slate-500 mt-1 font-medium">Audit trail of all system activities</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Select value={dateRange} onValueChange={setDateRange}>
                            <SelectTrigger className="w-[160px] bg-white border-slate-200 text-slate-600 font-medium h-10 shadow-sm">
                                <Calendar className="w-4 h-4 mr-2" />
                                <SelectValue placeholder="Date Range" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Today">Today</SelectItem>
                                <SelectItem value="Yesterday">Yesterday</SelectItem>
                                <SelectItem value="Last 7 Days">Last 7 Days</SelectItem>
                                <SelectItem value="Last 30 Days">Last 30 Days</SelectItem>
                                <SelectItem value="All Time">All Time</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium gap-2 shadow-sm h-10"
                            onClick={handleExport}
                        >
                            <Download className="w-4 h-4" />
                            Export
                        </Button>
                    </div>
                </div>

                {/* Summary Cards Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="p-5 border-slate-100 shadow-sm bg-white flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                            <Activity className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Total Events Today</p>
                            <p className="text-2xl font-bold text-slate-900 tracking-tight">1,248</p>
                        </div>
                    </Card>
                    <Card className="p-5 border-slate-100 shadow-sm bg-white flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
                            <AlertCircle className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Failed Events</p>
                            <p className="text-2xl font-bold text-slate-900 tracking-tight">23</p>
                        </div>
                    </Card>
                    <Card className="p-5 border-slate-100 shadow-sm bg-white flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                            <Server className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">System Events</p>
                            <p className="text-2xl font-bold text-slate-900 tracking-tight">854</p>
                        </div>
                    </Card>
                    <Card className="p-5 border-slate-100 shadow-sm bg-white flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
                            <User className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">User Actions</p>
                            <p className="text-2xl font-bold text-slate-900 tracking-tight">394</p>
                        </div>
                    </Card>
                </div>

                {/* Main Content Area */}
                <Card className="border border-slate-200 shadow-sm bg-white overflow-hidden rounded-xl">

                    {/* Filter Bar */}
                    <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row gap-3 items-center sticky top-0 z-10">
                        <div className="relative flex-1 w-full relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <Input
                                placeholder="Search events..."
                                className="pl-9 bg-white border-slate-200 h-10 w-full"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <Select value={moduleFilter} onValueChange={setModuleFilter}>
                            <SelectTrigger className="w-full md:w-[160px] bg-white h-10 border-slate-200 text-slate-600 font-medium">
                                <SelectValue placeholder="Module" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">All Modules</SelectItem>
                                <SelectItem value="Auth">Auth</SelectItem>
                                <SelectItem value="Customers">Customers</SelectItem>
                                <SelectItem value="Subscriptions">Subscriptions</SelectItem>
                                <SelectItem value="Payments">Payments</SelectItem>
                                <SelectItem value="Invoices">Invoices</SelectItem>
                                <SelectItem value="System">System</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full md:w-[140px] bg-white h-10 border-slate-200 text-slate-600 font-medium">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">All Statuses</SelectItem>
                                <SelectItem value="Success">Success</SelectItem>
                                <SelectItem value="Failed">Failed</SelectItem>
                            </SelectContent>
                        </Select>

                    </div>

                    {/* Event Logs Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-200 bg-white">
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Event Type</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Module</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Description</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Performed By</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Timestamp</th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                                {filteredEvents.map((evt, idx) => (
                                    <tr
                                        key={evt.id}
                                        className={cn(
                                            "hover:bg-slate-50 transition-colors duration-200 group",
                                            idx % 2 === 0 ? "bg-white" : "bg-slate-50/30"
                                        )}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="inline-flex items-center px-2.5 py-1 rounded-full border border-slate-200 bg-slate-100 text-xs font-medium text-slate-700">
                                                {evt.type}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm font-medium text-slate-700">{evt.module}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-slate-600 truncate max-w-[250px]" title={evt.description}>
                                                {evt.description}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm text-slate-600 font-mono text-xs">{evt.performedBy}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={cn(
                                                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
                                                evt.status === 'success' ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                                            )}>
                                                {evt.status === 'success' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                                                {evt.status === 'success' ? 'Success' : 'Failed'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                            {new Date(evt.timestamp).toLocaleString('en-US', {
                                                month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'
                                            })}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <Button
                                                variant="ghost"
                                                className="text-indigo-600 hover:text-indigo-700 font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={() => setSelectedEvent(evt)}
                                            >
                                                View <Eye className="w-4 h-4 ml-2" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredEvents.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                                            No events found matching your filters.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination (Visual Only) */}
                    <div className="p-4 border-t border-slate-100 bg-white flex items-center justify-between text-sm text-slate-500">
                        <p>Showing <span className="font-semibold text-slate-900">{filteredEvents.length}</span> results</p>
                        <div className="flex items-center gap-2">
                            <Button onClick={() => toast.info("Loaded previous page of events.")} variant="outline" size="sm" className="h-8 hover:bg-slate-50 text-slate-600">Previous</Button>
                            <Button onClick={() => toast.info("Fetching newer event logs...")} variant="outline" size="sm" className="h-8 hover:bg-slate-50 text-slate-600">Next</Button>
                        </div>
                    </div>
                </Card>

            </div>

            {/* Event Details Drawer */}
            <Sheet open={!!selectedEvent} onOpenChange={(open) => !open && setSelectedEvent(null)}>
                <SheetContent className="sm:max-w-md md:max-w-lg border-l-0 shadow-2xl overflow-y-auto w-full">
                    <SheetHeader className="pb-6 border-b border-slate-100 mb-6 relative">
                        <div className="absolute right-0 top-0 text-slate-400 hover:text-slate-600 cursor-pointer" onClick={() => setSelectedEvent(null)}>
                            {/* Handled by standard SheetClose, but leaving space for visual reference */}
                        </div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className={cn(
                                "p-2 rounded-lg",
                                selectedEvent?.status === 'success' ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"
                            )}>
                                {selectedEvent?.status === 'success' ? <CheckCircle2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
                            </div>
                            <h2 className="text-xl font-bold text-slate-900">Event Details</h2>
                        </div>
                        <SheetTitle className="text-sm font-mono text-slate-500">{selectedEvent?.id}</SheetTitle>
                    </SheetHeader>

                    {selectedEvent && (
                        <div className="space-y-8">

                            {/* General Info */}
                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Description</h4>
                                    <p className="text-base text-slate-800 font-medium">{selectedEvent.description}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Module</h4>
                                        <p className="text-sm text-slate-700 font-medium">{selectedEvent.module}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Timestamp</h4>
                                        <p className="text-sm text-slate-700 font-medium">
                                            {new Date(selectedEvent.timestamp).toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="col-span-2">
                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Performed By</h4>
                                        <p className="text-sm font-mono text-indigo-600 bg-indigo-50 px-2 py-1 rounded inline-block">{selectedEvent.performedBy}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Network & Device Info */}
                            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-4">
                                <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2 border-b border-slate-200 pb-2">
                                    <Info className="w-4 h-4 text-slate-400" /> Origin Information
                                </h4>
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="flex items-start gap-3">
                                        <Globe className="w-4 h-4 text-slate-400 mt-0.5" />
                                        <div>
                                            <p className="text-xs text-slate-500">IP Address</p>
                                            <p className="text-sm font-medium text-slate-800">{selectedEvent.ipAddress}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Smartphone className="w-4 h-4 text-slate-400 mt-0.5" />
                                        <div>
                                            <p className="text-xs text-slate-500">Device Info</p>
                                            <p className="text-sm font-medium text-slate-800">{selectedEvent.device}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Server className="w-4 h-4 text-slate-400 mt-0.5" />
                                        <div>
                                            <p className="text-xs text-slate-500">API Endpoint</p>
                                            <p className="text-sm font-mono text-slate-800">{selectedEvent.endpoint}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Metadata JSON Block */}
                            <div>
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Event Metadata</h4>
                                <div className="bg-[#1E293B] rounded-xl p-4 overflow-x-auto shadow-inner">
                                    <pre className="text-xs text-emerald-400 font-mono leading-relaxed">
                                        <code>{JSON.stringify(selectedEvent.metadata, null, 2)}</code>
                                    </pre>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            {selectedEvent.status === 'failed' && (
                                <div className="pt-4 border-t border-slate-100">
                                    <Button
                                        onClick={handleRetry}
                                        className="w-full bg-slate-900 hover:bg-slate-800 text-white gap-2 font-medium h-12 text-md shadow-lg shadow-black/5"
                                    >
                                        <RefreshCcw className="w-4 h-4" />
                                        Retry Event Processing
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </SheetContent>
            </Sheet>

        </div>
    );
}
