'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tenant } from '@/types';
import { cn } from '@/lib/utils';
import { CheckCircle2, XCircle, Info, Clock, Building2, User, Mail, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface TenantApprovalPanelProps {
    tenants: Tenant[];
    onUpdateTenantStatus: (tenantId: string, status: string, notes?: string) => void;
    approvalHistory: any[];
}

export function TenantApprovalPanel({ tenants, onUpdateTenantStatus, approvalHistory }: TenantApprovalPanelProps) {
    const pendingTenants = tenants.filter(t => t.status === 'pending' || t.status === 'info_requested');
    const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
    const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
    const [rejectReason, setRejectReason] = useState('');
    const [requestInfoDialogOpen, setRequestInfoDialogOpen] = useState(false);
    const [infoRequest, setInfoRequest] = useState('');

    const handleApprove = (tenant: Tenant) => {
        // 4. Auto-create Admin user and simulate sending welcome email
        onUpdateTenantStatus(tenant.id, 'active', 'Approved onboarding application.');
        toast.success('Tenant Approved!', {
            description: `Admin user created for ${tenant.name} and welcome email dispatched.`
        });
    };

    const handleReject = () => {
        if (!selectedTenant || !rejectReason.trim()) return;
        onUpdateTenantStatus(selectedTenant.id, 'rejected', rejectReason);
        setRejectDialogOpen(false);
        setRejectReason('');
        setSelectedTenant(null);
        toast.error('Tenant Rejected', {
            description: `${selectedTenant.name} application has been rejected.`
        });
    };

    const handleRequestInfo = () => {
        if (!selectedTenant || !infoRequest.trim()) return;
        onUpdateTenantStatus(selectedTenant.id, 'info_requested', infoRequest);
        setRequestInfoDialogOpen(false);
        setInfoRequest('');
        setSelectedTenant(null);
        toast.info('Information Requested', {
            description: `Requested more info from ${selectedTenant.name}.`
        });
    };

    return (
        <div className="space-y-8">
            {/* PENDING APPROVALS TABLE */}
            <Card className="glass-card overflow-hidden">
                <div className="p-6 border-b border-border/50 bg-muted/20 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-amber-500" />
                        <h3 className="text-lg font-bold">Pending Onboarding Approvals</h3>
                    </div>
                    <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20 font-bold">
                        {pendingTenants.length} Pending
                    </Badge>
                </div>

                <div className="p-0 overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent border-border/50">
                                <TableHead className="font-bold">Organization</TableHead>
                                <TableHead className="font-bold">GSTIN</TableHead>
                                <TableHead className="font-bold">Industry</TableHead>
                                <TableHead className="font-bold">Contact</TableHead>
                                <TableHead className="font-bold">Applied Date</TableHead>
                                <TableHead className="font-bold text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {pendingTenants.map((tenant) => (
                                <TableRow key={tenant.id} className="border-border/50 hover:bg-muted/10">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center font-bold text-xs">{tenant.name.charAt(0)}</div>
                                            <div>
                                                <p className="font-bold">{tenant.name}</p>
                                                {tenant.status === 'info_requested' && (
                                                    <Badge variant="outline" className="text-[9px] h-4 mt-1 bg-cyan-500/10 text-cyan-500 border-cyan-500/20">INFO REQUESTED</Badge>
                                                )}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-mono text-xs text-muted-foreground">{tenant.gstNumber || 'N/A'}</TableCell>
                                    <TableCell className="text-xs">{tenant.industryType || 'N/A'}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                            <Mail className="w-3 h-3" /> {tenant.email}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">{new Date(tenant.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell className="text-right space-x-2 whitespace-nowrap">
                                        <Button
                                            size="sm"
                                            className="h-8 text-xs font-bold bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 hover:text-emerald-600"
                                            onClick={() => handleApprove(tenant)}
                                        >
                                            <CheckCircle2 className="w-4 h-4 mr-1" /> Approve
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-8 text-xs font-bold border-border/50"
                                            onClick={() => { setSelectedTenant(tenant); setRequestInfoDialogOpen(true); }}
                                        >
                                            <Info className="w-4 h-4 mr-1" /> Request Info
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 text-xs font-bold text-rose-500 hover:text-rose-600 hover:bg-rose-500/10"
                                            onClick={() => { setSelectedTenant(tenant); setRejectDialogOpen(true); }}
                                        >
                                            <XCircle className="w-4 h-4 mr-1" /> Reject
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {pendingTenants.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-12 text-muted-foreground text-sm flex flex-col items-center gap-2">
                                        <CheckCircle2 className="w-8 h-8 text-muted-foreground/30" />
                                        No pending approvals. Inbox zero!
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </Card>

            {/* APPROVAL HISTORY LOG */}
            <Card className="glass-card flex flex-col">
                <div className="p-6 border-b border-border/50 bg-muted/20">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <FileText className="w-5 h-5 text-primary" /> Approval History Log
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 font-medium">Historical record of all onboarding decisions</p>
                </div>
                <div className="p-0 overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent border-border/50">
                                <TableHead className="font-bold text-xs h-10 w-[180px]">Timestamp</TableHead>
                                <TableHead className="font-bold text-xs h-10">Tenant</TableHead>
                                <TableHead className="font-bold text-xs h-10">Action</TableHead>
                                <TableHead className="font-bold text-xs h-10">Notes / Reason</TableHead>
                                <TableHead className="font-bold text-xs h-10 text-right">Admin</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {approvalHistory.map((log) => (
                                <TableRow key={log.id} className="border-border/50 text-xs hover:bg-muted/10">
                                    <TableCell className="whitespace-nowrap text-muted-foreground">
                                        {new Date(log.timestamp).toLocaleDateString()} {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </TableCell>
                                    <TableCell className="font-bold text-foreground">{log.tenantName}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="outline"
                                            className={cn(
                                                "text-[10px] uppercase font-bold",
                                                log.action === 'approved' && "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
                                                log.action === 'rejected' && "bg-rose-500/10 text-rose-500 border-rose-500/20",
                                                log.action === 'info_requested' && "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
                                            )}
                                        >
                                            {log.action.replace('_', ' ')}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground italic max-w-md truncate" title={log.notes}>{log.notes || '-'}</TableCell>
                                    <TableCell className="text-right font-mono text-muted-foreground">{log.actedBy}</TableCell>
                                </TableRow>
                            ))}
                            {approvalHistory.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground text-sm">No history available.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </Card>

            {/* REJECT DIALOG */}
            <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="text-rose-500 flex items-center gap-2"><XCircle className="w-5 h-5" /> Reject Application</DialogTitle>
                        <DialogDescription>
                            You are rejecting the onboarding application for <span className="font-bold text-foreground">{selectedTenant?.name}</span>. Please provide a reason.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="reason" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Rejection Reason</Label>
                            <Input
                                id="reason"
                                placeholder="e.g. Invalid GSTIN, Failed KYC"
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleReject} disabled={!rejectReason.trim()}>Confirm Rejection</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* REQUEST INFO DIALOG */}
            <Dialog open={requestInfoDialogOpen} onOpenChange={setRequestInfoDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="text-primary flex items-center gap-2"><Info className="w-5 h-5" /> Request Information</DialogTitle>
                        <DialogDescription>
                            Pause onboarding and request additional details from <span className="font-bold text-foreground">{selectedTenant?.name}</span>.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="info" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Information Required</Label>
                            <Input
                                id="info"
                                placeholder="e.g. Please upload incorporation certificate"
                                value={infoRequest}
                                onChange={(e) => setInfoRequest(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setRequestInfoDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleRequestInfo} disabled={!infoRequest.trim()}>Send Request</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
