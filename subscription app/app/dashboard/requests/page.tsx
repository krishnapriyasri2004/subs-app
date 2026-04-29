'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    mockDemoRequests
} from '@/lib/mock-data';
import {
    Calendar,
    Clock,
    Search,
    Filter,
    MoreHorizontal,
    Mail,
    Building2,
    Phone,
    ArrowUpRight,
    CheckCircle2,
    XCircle,
    Timer,
    Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from 'sonner';
import { DemoDetailsDialog } from '@/components/dashboard/demo-details-dialog';

export default function RequestsPage() {
    const [requests, setRequests] = useState<any[]>(mockDemoRequests);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    useEffect(() => {
        const localRequests = JSON.parse(localStorage.getItem('subscale_demo_requests') || '[]');
        if (localRequests.length > 0) {
            setRequests([...localRequests, ...mockDemoRequests]);
        }
    }, []);

    const handleStatusChange = (id: string, newStatus: string) => {
        setRequests(prev => prev.map(req =>
            req.id === id ? { ...req, status: newStatus as any } : req
        ));
        toast.success(`Request marked as ${newStatus}`);
    };

    const handleDelete = (id: string) => {
        const updatedRequests = requests.filter(req => req.id !== id);
        setRequests(updatedRequests);

        // Also update localStorage if it was a local request
        const localRequests = JSON.parse(localStorage.getItem('subscale_demo_requests') || '[]');
        const filteredLocal = localRequests.filter((req: any) => req.id !== id);
        localStorage.setItem('subscale_demo_requests', JSON.stringify(filteredLocal));

        toast.error("Request deleted successfully");
    };

    const openDetails = (request: any) => {
        setSelectedRequest(request);
        setIsDetailsOpen(true);
    };

    const formatRevenue = (val: string) => {
        const map: Record<string, string> = {
            '<1-lakh': 'Less than ₹1L',
            '1-5-lakh': '₹1 - ₹5 Lakh',
            '5-10-lakh': '₹5 - ₹10 Lakh',
            '10-50-lakh': '₹10 - ₹50 Lakh',
            '50-lakh+': '₹50 Lakh+'
        };
        return map[val] || val;
    };

    const filteredRequests = requests.filter(req =>
        req.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.workEmail.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 pb-12 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-3">
                        Demo Requests <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full">{requests.length} Total</span>
                    </h1>
                    <p className="text-muted-foreground mt-2 font-medium">
                        Manage incoming demo bookings and prospective clients
                    </p>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search leads..."
                            className="w-full pl-10 pr-4 py-2 rounded-xl border border-border/50 bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" className="rounded-xl border-border/50 font-bold gap-2">
                        <Filter className="w-4 h-4" /> Filter
                    </Button>
                </div>
            </div>

            {/* Stats Quick View */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6 glass-card border-amber-500/20 bg-amber-500/[0.02]">
                    <div className="flex justify-between items-center mb-4">
                        <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
                            <Timer className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-black uppercase text-amber-600 bg-amber-100/50 px-2 py-0.5 rounded-sm">Action Required</span>
                    </div>
                    <h3 className="text-3xl font-black text-foreground">{requests.filter(r => r.status === 'pending').length}</h3>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Pending Review</p>
                </Card>

                <Card className="p-6 glass-card border-blue-500/20 bg-blue-500/[0.02]">
                    <div className="flex justify-between items-center mb-4">
                        <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                            <Calendar className="w-5 h-5" />
                        </div>
                    </div>
                    <h3 className="text-3xl font-black text-foreground">{requests.filter(r => r.status === 'scheduled').length}</h3>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Scheduled Today</p>
                </Card>

                <Card className="p-6 glass-card border-emerald-500/20 bg-emerald-500/[0.02]">
                    <div className="flex justify-between items-center mb-4">
                        <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                            <CheckCircle2 className="w-5 h-5" />
                        </div>
                    </div>
                    <h3 className="text-3xl font-black text-foreground">{requests.filter(r => r.status === 'completed').length}</h3>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Converted</p>
                </Card>
            </div>

            {/* Main Content */}
            <Card className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-muted/30 border-b border-border/50">
                                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground">Prospect Details</th>
                                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground">Company Info</th>
                                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground">Preference</th>
                                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground">Potential</th>
                                <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</th>
                                <th className="px-6 py-4 text-right sizing-0"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/30">
                            {filteredRequests.map((req) => (
                                <tr key={req.id} className="group hover:bg-primary/[0.02] transition-colors">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                {req.fullName.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-foreground text-sm group-hover:text-primary transition-colors">{req.fullName}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                                                    <p className="text-[10px] text-muted-foreground font-medium">{req.workEmail}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
                                            <p className="text-xs font-bold text-foreground uppercase tracking-tight">{req.companyName}</p>
                                        </div>
                                        <p className="text-[10px] text-muted-foreground font-bold mt-1 uppercase tracking-tighter">{req.industry} • {req.companySize} employees</p>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-1.5 text-[11px] font-bold text-foreground uppercase">
                                                <Calendar className="w-3.5 h-3.5 text-primary" /> {req.preferredDate}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">
                                                <Clock className="w-3.5 h-3.5" /> {req.preferredTimeSlot}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <p className="text-xs font-black text-foreground">{formatRevenue(req.expectedRevenue)}</p>
                                        <p className="text-[9px] text-muted-foreground font-bold mt-0.5 uppercase tracking-widest">Est. Revenue</p>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <span className={cn(
                                            "inline-flex px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider",
                                            req.status === 'pending' ? "bg-amber-100 text-amber-600" : (req.status === 'scheduled' ? "bg-blue-100 text-blue-600" : "bg-emerald-100 text-emerald-600")
                                        )}>
                                            {req.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="rounded-xl hover:bg-primary/10 hover:text-primary">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-48 rounded-xl p-2">
                                                <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-2 py-1.5">Actions</DropdownMenuLabel>
                                                <DropdownMenuItem
                                                    className="rounded-lg font-bold text-xs gap-2 cursor-pointer"
                                                    onClick={() => openDetails(req)}
                                                >
                                                    <Mail className="w-3.5 h-3.5" /> View Details
                                                </DropdownMenuItem>

                                                <DropdownMenuSeparator className="my-1" />
                                                <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-2 py-1.5">Update Status</DropdownMenuLabel>

                                                <DropdownMenuItem
                                                    className="rounded-lg font-bold text-xs gap-2 cursor-pointer text-blue-600"
                                                    onClick={() => handleStatusChange(req.id, 'scheduled')}
                                                >
                                                    <Calendar className="w-3.5 h-3.5" /> Mark as Scheduled
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="rounded-lg font-bold text-xs gap-2 cursor-pointer text-emerald-600"
                                                    onClick={() => handleStatusChange(req.id, 'completed')}
                                                >
                                                    <CheckCircle2 className="w-3.5 h-3.5" /> Complete Demo
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="rounded-lg font-bold text-xs gap-2 cursor-pointer text-rose-600"
                                                    onClick={() => handleStatusChange(req.id, 'rejected')}
                                                >
                                                    <XCircle className="w-3.5 h-3.5" /> Reject Request
                                                </DropdownMenuItem>

                                                <DropdownMenuSeparator className="my-1" />
                                                <DropdownMenuItem
                                                    className="rounded-lg font-bold text-xs gap-2 cursor-pointer text-destructive focus:bg-destructive/5"
                                                    onClick={() => handleDelete(req.id)}
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" /> Delete Request
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            <DemoDetailsDialog
                request={selectedRequest}
                isOpen={isDetailsOpen}
                onClose={() => setIsDetailsOpen(false)}
            />
        </div>
    );
}
