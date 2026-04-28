'use client';

import React, { useState } from 'react';
import { Invoice } from '@/types';
import { useVendorAuth } from '@/lib/vendor-auth';
import { format } from 'date-fns';
import { Edit, Eye, MoreHorizontal, Download, IndianRupee } from 'lucide-react';
import Link from 'next/link';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface InvoiceListProps {
    initialInvoices: Invoice[];
}

const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
        case 'paid': return 'bg-green-500/10 text-green-500 border-green-500/20';
        case 'sent': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
        case 'overdue': return 'bg-red-500/10 text-red-500 border-red-500/20';
        case 'draft': return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
        case 'cancelled': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
        default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
};

export const InvoiceList = ({ initialInvoices }: InvoiceListProps) => {
    const { user } = useVendorAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');

    // Securely isolate visible invoices primarily to current user
    const tenantInvoices = initialInvoices.filter(inv => inv.tenantId === user?.tenantId);

    // Apply filters
    const filteredInvoices = tenantInvoices.filter(inv => {
        const matchesSearch =
            inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (inv.customerName || '').toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'ALL' || inv.status.toLowerCase() === statusFilter.toLowerCase();
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div className="flex flex-1 gap-4">
                    <Input
                        placeholder="Search invoices..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="max-w-xs"
                    />
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All Statuses</SelectItem>
                            <SelectItem value="PAID">Paid</SelectItem>
                            <SelectItem value="SENT">Sent</SelectItem>
                            <SelectItem value="DRAFT">Draft</SelectItem>
                            <SelectItem value="OVERDUE">Overdue</SelectItem>
                            <SelectItem value="CANCELLED">Cancelled</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="rounded-xl border border-border/50 bg-card/50 overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            <TableHead className="font-semibold px-4">Invoice #</TableHead>
                            <TableHead className="font-semibold">Customer</TableHead>
                            <TableHead className="font-semibold">Date</TableHead>
                            <TableHead className="font-semibold">Due Date</TableHead>
                            <TableHead className="font-semibold text-right">Amount</TableHead>
                            <TableHead className="font-semibold">Status</TableHead>
                            <TableHead className="text-right px-4">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredInvoices.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                                    No invoices found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredInvoices.map((invoice) => (
                                <TableRow key={invoice.id} className="cursor-pointer hover:bg-muted/30">
                                    <TableCell className="font-medium px-4">{invoice.invoiceNumber}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{invoice.customerName || (invoice as any).customerId || 'Unknown'}</span>
                                            <span className="text-xs text-muted-foreground">{invoice.customerEmail}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {format(new Date(invoice.issueDate), 'MMM dd, yyyy')}
                                    </TableCell>
                                    <TableCell>
                                        {format(new Date(invoice.dueDate), 'MMM dd, yyyy')}
                                    </TableCell>
                                    <TableCell className="text-right font-medium">
                                        <div className="flex items-center justify-end gap-1">
                                            <IndianRupee className="h-3 w-3 text-muted-foreground" />
                                            {invoice.totalAmount.toLocaleString('en-IN')}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={`capitalize ${getStatusColor(invoice.status)}`}>
                                            {invoice.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right px-4">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/vendor/invoices/${invoice.id}`} className="flex items-center cursor-pointer">
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        View Details
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/vendor/invoices/${invoice.id}`} className="flex items-center cursor-pointer">
                                                        <Download className="mr-2 h-4 w-4" />
                                                        Download PDF
                                                    </Link>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};
