'use client';

import { useState, Suspense, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useData } from '@/lib/data-context';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Users,
    Search,
    Filter,
    Plus,
    MoreVertical,
    Mail,
    Phone,
    MapPin,
    Calendar,
    CheckCircle2,
    XCircle,
    ArrowUpRight,
    ChevronLeft,
    Download
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { CustomerProfileDialog } from '@/components/dashboard/customer-profile-dialog';
import { CustomerEditDialog } from '@/components/dashboard/customer-edit-dialog';
import { CustomerSettingsDialog } from '@/components/dashboard/customer-settings-dialog';
import { CustomerAddDialog } from '@/components/dashboard/customer-add-dialog';

function CustomersContent() {
    const { user } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const queryTenantId = searchParams.get('tenantId');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
    const [selectedViewCustomer, setSelectedViewCustomer] = useState<any>(null);
    const [selectedEditCustomer, setSelectedEditCustomer] = useState<any>(null);
    const [selectedSettingsCustomer, setSelectedSettingsCustomer] = useState<any>(null);
    const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);

    const { mockCustomers, mockCustomerSubscriptions, mockBusinessPlans, mockTenants, addDocument, updateDocument, deleteDocument } = useData();

    const tenantId = queryTenantId || user?.tenantId || 'tenant-1';

    // Filter to current tenant
    const customers = mockCustomers.filter(c => c.tenantId === tenantId);

    // Get tenant name if we are filtering by a specific tenant
    const selectedTenant = mockTenants.find(t => t.id === tenantId);

    const filteredCustomers = customers.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (c.phone && c.phone.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleDeleteCustomer = async (id: string) => {
        try {
            await deleteDocument('customers', id);
            toast.success("Customer removed successfully.");
        } catch (e) {
            toast.error("Failed to remove customer.");
        }
    };

    const handleUpdateCustomer = async (updatedCustomer: any) => {
        try {
            await updateDocument('customers', updatedCustomer.id, updatedCustomer);
        } catch (e) {
            toast.error("Failed to update customer.");
        }
    };

    const handleAddCustomer = async (newCustomer: any) => {
        try {
            await addDocument('customers', {
                ...newCustomer,
                tenantId: tenantId
            });
        } catch (e) {
            toast.error("Failed to add customer.");
        }
    };

    const handleAction = (message: string) => {
        toast.info(message);
    };

    const handleDownloadCustomers = () => {
        toast.loading("Preparing Excel/CSV export...", { id: "csv-export" });

        setTimeout(() => {
            const headers = ["ID", "Name", "Email", "Phone", "Status", "Address"];
            const csvRows = [headers.join(',')];

            for (const customer of filteredCustomers) {
                // Formatting data carefully to avoid CSV breakdown with commas
                const values = [
                    customer.id,
                    `"${customer.name}"`,
                    `"${customer.email}"`,
                    `"${customer.phone || ''}"`,
                    customer.status,
                    `"${(customer.address || '').replace(/"/g, '""')}"`
                ];
                csvRows.push(values.join(','));
            }

            const csvString = csvRows.join('\n');
            const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `customers_export.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            toast.success("Directory downloaded successfully!", { id: "csv-export" });
        }, 800);
    };

    const getCustomerSubscription = (customerId: string) => {
        const sub = mockCustomerSubscriptions.find(s => s.customerId === customerId);
        if (!sub) return null;
        const plan = mockBusinessPlans.find(p => p.id === sub.planId);
        return { ...sub, planName: plan?.name };
    };

    return (
        <div className="space-y-10 pb-10">
            {/* Context Back Button */}
            {queryTenantId && (
                <Button
                    variant="ghost"
                    onClick={() => router.push('/dashboard/tenants')}
                    className="gap-2 text-muted-foreground hover:text-foreground mb-[-1rem] -ml-2 h-8 px-2"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Back to Directory
                </Button>
            )}

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
                        {queryTenantId ? (
                            <>{selectedTenant?.name || 'Customer'} <span className="text-gradient">Base</span></>
                        ) : (
                            <>Customer <span className="text-gradient">Base</span></>
                        )}
                    </h1>
                    <p className="text-muted-foreground mt-2 text-lg">
                        {queryTenantId
                            ? `Manage delivery directory and customer profiles for ${selectedTenant?.name || 'this partner'}`
                            : 'Manage your delivery directory and customer profiles.'}
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button onClick={handleDownloadCustomers} variant="outline" className="rounded-xl h-12 border-border/50 font-bold shadow-sm hover:bg-muted/50">
                        <Download className="w-5 h-5 mr-2" /> Download
                    </Button>
                    {!queryTenantId && (
                        <Button onClick={() => setIsAddCustomerOpen(true)} className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 rounded-xl px-6 h-12 font-black">
                            <Plus className="w-5 h-5 mr-2" /> ADD CUSTOMER
                        </Button>
                    )}
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="glass-card p-6 flex items-center gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Total Profiles</p>
                        <p className="text-2xl font-black text-foreground">{customers.length}</p>
                    </div>
                </Card>
                <Card className="glass-card p-6 flex items-center gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                        <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Active Members</p>
                        <p className="text-2xl font-black text-emerald-500">{customers.filter(c => c.status === 'active').length}</p>
                    </div>
                </Card>
                <Card className="glass-card p-6 flex items-center gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500">
                        <XCircle className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Churned</p>
                        <p className="text-2xl font-black text-rose-500">{customers.filter(c => c.status === 'inactive').length}</p>
                    </div>
                </Card>
            </div>

            {/* search */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                        placeholder="Search by name, email or mobile..."
                        className="pl-12 h-14 rounded-2xl border-border/50 bg-background/50 backdrop-blur-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="h-14 px-8 rounded-2xl border-border/50 gap-2 font-bold min-w-[140px]">
                            <Filter className="w-5 h-5" />
                            <span className="capitalize">{statusFilter === 'all' ? 'Filters' : `${statusFilter} Only`}</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setStatusFilter('all')}>All Customers</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatusFilter('active')}>Active Only</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatusFilter('inactive')}>Inactive Only</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Customer Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCustomers.map((customer) => {
                    const sub = getCustomerSubscription(customer.id);
                    return (
                        <Card key={customer.id} className="glass-card group overflow-hidden hover:border-primary/30 transition-all duration-300">
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-xl group-hover:scale-110 transition-transform">
                                            {customer.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">{customer.name}</h4>
                                            <p className="text-xs text-muted-foreground">{customer.email}</p>
                                        </div>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="rounded-xl">
                                                <MoreVertical className="w-4 h-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => setSelectedEditCustomer(customer)}>Edit Details</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => setSelectedSettingsCustomer(customer)}>Manage Settings</DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="text-rose-500 focus:text-rose-500 focus:bg-rose-50" onClick={() => handleDeleteCustomer(customer.id)}>Remove Customer</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <Mail className="w-3.5 h-3.5" /> {customer.email}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <MapPin className="w-3.5 h-3.5" /> {customer.address || 'Corporate Park 12, BLR'}
                                    </div>
                                </div>

                                <div className="p-4 rounded-xl bg-muted/30 border border-border/30">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Active Plan</span>
                                        <span className={cn(
                                            "text-[10px] font-bold px-2 py-0.5 rounded-lg uppercase tracking-tighter",
                                            customer.status === 'active' ? "bg-emerald-500/10 text-emerald-500" : "bg-muted text-muted-foreground"
                                        )}>
                                            {customer.status}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm font-bold">
                                        <span className="text-foreground">{sub?.planName || 'No Active Plan'}</span>
                                        {sub && <span className="text-primary">₹{(sub as any).totalAmount}</span>}
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 border-t border-border/30 bg-muted/10 flex justify-between items-center">
                                <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase">
                                    <Calendar className="w-3 h-3" /> Since {new Date(customer.createdAt).toLocaleDateString()}
                                </div>
                                <Button onClick={() => setSelectedViewCustomer(customer)} variant="ghost" className="h-8 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-primary/10 hover:text-primary">
                                    Profile <ArrowUpRight className="ml-1 w-3 h-3" />
                                </Button>
                            </div>
                        </Card>
                    );
                })}
            </div>

            {filteredCustomers.length === 0 && (
                <div className="py-24 text-center">
                    <Users className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-foreground">No matches found</h3>
                    <p className="text-muted-foreground max-w-xs mx-auto mt-2">Try searching for a different customer name or contact detail.</p>
                </div>
            )}

            <CustomerProfileDialog
                customer={selectedViewCustomer}
                open={!!selectedViewCustomer}
                onOpenChange={(open) => !open && setSelectedViewCustomer(null)}
            />

            <CustomerEditDialog
                customer={selectedEditCustomer}
                open={!!selectedEditCustomer}
                onOpenChange={(open) => !open && setSelectedEditCustomer(null)}
                onSave={handleUpdateCustomer}
            />

            <CustomerSettingsDialog
                customer={selectedSettingsCustomer}
                open={!!selectedSettingsCustomer}
                onOpenChange={(open) => !open && setSelectedSettingsCustomer(null)}
                onSave={handleUpdateCustomer}
            />

            <CustomerAddDialog
                open={isAddCustomerOpen}
                onOpenChange={setIsAddCustomerOpen}
                onAdd={handleAddCustomer}
            />
        </div>
    );
}

export default function CustomersPage() {
    return (
        <Suspense fallback={<div className="p-10 text-center">Loading customer data...</div>}>
            <CustomersContent />
        </Suspense>
    );
}