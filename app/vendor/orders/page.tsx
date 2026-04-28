'use client';

import React, { useState } from 'react';
import { 
  Container, 
  Package, 
  Search, 
  Filter as FilterIcon, 
  Plus, 
  Download, 
  ArrowUpDown, 
  Warehouse, 
  Truck, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  MoreVertical,
  ChevronRight,
  User,
  ExternalLink,
  Calendar,
  Loader2,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from 'sonner';

// Define the Order type
interface BulkOrder {
  id: string;
  distributor: string;
  riceType: string;
  quantity: number;
  unit: 'Bags' | 'Tons';
  totalValue: number;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Pending Payment';
  orderDate: string;
  deliveryDate: string;
  warehouse: string;
}

const initialOrders: BulkOrder[] = [
  {
    id: 'ORD-1001',
    distributor: 'Vignesh Traders',
    riceType: 'Basmati Premium',
    quantity: 50,
    unit: 'Bags',
    totalValue: 125000,
    status: 'Delivered',
    orderDate: '2026-03-20',
    deliveryDate: '2026-03-22',
    warehouse: 'Main Warehouse',
  },
  {
    id: 'ORD-1002',
    distributor: 'RKG Exports',
    riceType: 'Sona Masoori',
    quantity: 5,
    unit: 'Tons',
    totalValue: 325000,
    status: 'Shipped',
    orderDate: '2026-03-22',
    deliveryDate: '2026-03-25',
    warehouse: 'Main Warehouse',
  },
  {
    id: 'ORD-1003',
    distributor: 'Annapoorna Supermarket',
    riceType: 'Ponni Rice',
    quantity: 20,
    unit: 'Bags',
    totalValue: 45000,
    status: 'Processing',
    orderDate: '2026-03-23',
    deliveryDate: '2026-03-26',
    warehouse: 'South Warehouse',
  },
  {
    id: 'ORD-1004',
    distributor: 'Global Rice Hub',
    riceType: 'Brown Rice',
    quantity: 100,
    unit: 'Bags',
    totalValue: 280000,
    status: 'Pending Payment',
    orderDate: '2026-03-23',
    deliveryDate: '2026-03-28',
    warehouse: 'East Warehouse',
  },
  {
    id: 'ORD-1005',
    distributor: 'Priya Rice Depot',
    riceType: 'Jasmine Fragrant',
    quantity: 15,
    unit: 'Bags',
    totalValue: 37500,
    status: 'Delivered',
    orderDate: '2026-03-18',
    deliveryDate: '2026-03-20',
    warehouse: 'Main Warehouse',
  }
];

export default function BulkOrdersPage() {
  const [orders, setOrders] = useState<BulkOrder[]>(initialOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Create Order Form State
  const [newOrder, setNewOrder] = useState({
    distributor: '',
    riceType: 'Basmati Premium',
    quantity: '',
    unit: 'Bags' as 'Bags' | 'Tons',
    warehouse: 'Main Warehouse',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter States
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterWarehouse, setFilterWarehouse] = useState<string>('all');

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.distributor.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesWarehouse = filterWarehouse === 'all' || order.warehouse === filterWarehouse;
    
    return matchesSearch && matchesStatus && matchesWarehouse;
  });

  const handleCreateOrder = async () => {
    if (!newOrder.distributor || !newOrder.quantity) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const order: BulkOrder = {
      id: `ORD-${1000 + orders.length + 1}`,
      distributor: newOrder.distributor,
      riceType: newOrder.riceType,
      quantity: parseFloat(newOrder.quantity),
      unit: newOrder.unit,
      totalValue: parseFloat(newOrder.quantity) * (newOrder.unit === 'Tons' ? 65000 : 2500),
      status: 'Processing',
      orderDate: new Date().toISOString().split('T')[0],
      deliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      warehouse: newOrder.warehouse,
    };

    setOrders([order, ...orders]);
    setIsSubmitting(false);
    setIsCreateOpen(false);
    toast.success('Bulk order created successfully');
    setNewOrder({
      distributor: '',
      riceType: 'Basmati Premium',
      quantity: '',
      unit: 'Bags',
      warehouse: 'Main Warehouse',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Delivered':
        return <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-50">Delivered</Badge>;
      case 'Shipped':
        return <Badge className="bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-50">Shipped</Badge>;
      case 'Processing':
        return <Badge className="bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-50">Processing</Badge>;
      case 'Pending Payment':
        return <Badge className="bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-50">Pending Payment</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Bulk Orders</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">Manage wholesale rice distribution and bulk deliveries.</p>
        </div>
        <div className="flex items-center gap-3">
          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="h-11 rounded-xl font-bold gap-2 border-slate-200 bg-white shadow-sm hover:bg-slate-50">
                <FilterIcon className="w-4 h-4 text-slate-500" />
                <span>Filter</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[350px] sm:w-[450px] border-l border-slate-100 shadow-2xl bg-white/95 backdrop-blur-xl">
              <SheetHeader className="mb-8">
                <SheetTitle className="text-2xl font-black text-slate-900 tracking-tight">Order Filters</SheetTitle>
                <SheetDescription className="font-medium text-slate-500">Filter your bulk orders by status or shipping warehouse.</SheetDescription>
              </SheetHeader>
              <div className="space-y-8 py-4">
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500">Shipment Status</label>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="h-12 rounded-xl border-slate-100 bg-slate-50/50">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="Processing">Processing</SelectItem>
                      <SelectItem value="Shipped">Shipped</SelectItem>
                      <SelectItem value="Delivered">Delivered</SelectItem>
                      <SelectItem value="Pending Payment">Pending Payment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500">Warehouse Source</label>
                  <Select value={filterWarehouse} onValueChange={setFilterWarehouse}>
                    <SelectTrigger className="h-12 rounded-xl border-slate-100 bg-slate-50/50">
                      <SelectValue placeholder="All Warehouses" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                      <SelectItem value="all">All Warehouses</SelectItem>
                      <SelectItem value="Main Warehouse">Main Warehouse</SelectItem>
                      <SelectItem value="South Warehouse">South Warehouse</SelectItem>
                      <SelectItem value="East Warehouse">East Warehouse</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <SheetFooter className="absolute bottom-6 left-6 right-6 gap-2">
                <Button variant="outline" className="flex-1 h-12 rounded-xl font-bold border-slate-100" onClick={() => {
                  setFilterStatus('all');
                  setFilterWarehouse('all');
                }}>Reset</Button>
                <Button className="flex-1 h-12 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => setIsFilterOpen(false)}>Apply Filters</Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>

          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="h-11 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 px-6 gap-2 text-white">
                <Plus className="w-4 h-4" />
                Create Order
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] rounded-3xl border-none shadow-2xl p-0 overflow-hidden">
              <div className="p-10 pb-6">
                <DialogHeader className="mb-8">
                  <DialogTitle className="text-3xl font-black text-slate-900 tracking-tight">New Bulk Rice Order</DialogTitle>
                  <DialogDescription className="font-medium text-slate-500 text-base">Generate a wholesale invoice and delivery request.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-8 py-4">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                        <User className="w-3.5 h-3.5" /> Distributor Name
                      </label>
                      <Input
                        placeholder="e.g. Annapoorna Traders"
                        className="h-12 rounded-xl border-slate-100 bg-slate-50/50 focus-visible:ring-indigo-500/20 font-bold"
                        value={newOrder.distributor}
                        onChange={(e) => setNewOrder({ ...newOrder, distributor: e.target.value })}
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                        <Warehouse className="w-3.5 h-3.5" /> Stock Source
                      </label>
                      <Select value={newOrder.warehouse} onValueChange={(val) => setNewOrder({ ...newOrder, warehouse: val })}>
                        <SelectTrigger className="h-12 rounded-xl border-slate-100 bg-slate-50/50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                          <SelectItem value="Main Warehouse">Main Warehouse</SelectItem>
                          <SelectItem value="South Warehouse">South Warehouse</SelectItem>
                          <SelectItem value="East Warehouse">East Warehouse</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-3">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                        <Package className="w-3.5 h-3.5" /> Rice Variety
                      </label>
                      <Select value={newOrder.riceType} onValueChange={(val) => setNewOrder({ ...newOrder, riceType: val })}>
                        <SelectTrigger className="h-12 rounded-xl border-slate-100 bg-slate-50/50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                          <SelectItem value="Basmati Premium">Basmati Premium (Long Grain)</SelectItem>
                          <SelectItem value="Sona Masoori">Sona Masoori (Medium Grain)</SelectItem>
                          <SelectItem value="Ponni Rice">Ponni Rice (Short Grain)</SelectItem>
                          <SelectItem value="Brown Rice">Brown Rice (Specialty)</SelectItem>
                          <SelectItem value="Jasmine Fragrant">Jasmine Fragrant (Imported)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                        <ArrowUpDown className="w-3.5 h-3.5" /> Order Quantity
                      </label>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          placeholder="0"
                          className="h-12 rounded-xl border-slate-100 bg-slate-50/50 focus-visible:ring-indigo-500/20 font-black text-lg w-full"
                          value={newOrder.quantity}
                          onChange={(e) => setNewOrder({ ...newOrder, quantity: e.target.value })}
                        />
                        <Select value={newOrder.unit} onValueChange={(val: any) => setNewOrder({ ...newOrder, unit: val })}>
                          <SelectTrigger className="h-12 w-32 rounded-xl border-slate-100 bg-slate-50/50 font-bold">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                            <SelectItem value="Bags">Bags</SelectItem>
                            <SelectItem value="Tons">Tons</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-3 flex flex-col justify-end">
                       <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100/50 flex flex-col items-end">
                          <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Estimated Value</span>
                          <span className="text-xl font-black text-indigo-700">₹{(parseFloat(newOrder.quantity || '0') * (newOrder.unit === 'Tons' ? 65000 : 2500)).toLocaleString('en-IN')}</span>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter className="bg-slate-50/50 border-t border-slate-100 p-8 pt-6 pb-6 mt-8 flex items-center justify-between gap-6">
                <div className="flex items-center gap-2 text-slate-400 font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span className="text-xs leading-tight">Order confirmation will trigger a stock hold and notify logistics partners.</span>
                </div>
                <div className="flex gap-3">
                  <Button variant="ghost" className="h-12 rounded-xl font-bold px-8 text-slate-500" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                  <Button 
                    className="h-12 rounded-xl font-black bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-600/30 px-10 text-white"
                    onClick={handleCreateOrder}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : 'Confirm Bulk Order'}
                  </Button>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Shipments', value: '12 Orders', sub: 'In transit to distributors', icon: Truck, color: 'blue' },
          { label: 'Processing', value: '4 Orders', sub: 'Awaiting packaging', icon: Clock, color: 'amber' },
          { label: 'Monthly Volume', value: '42.5 Tons', sub: 'Total rice distributed', icon: Container, color: 'indigo' },
          { label: 'Delivered (Last 7d)', value: '18 Orders', sub: 'Successfully completed', icon: CheckCircle2, color: 'emerald' }
        ].map((stat, i) => (
          <Card key={i} className="p-6 rounded-2xl border-slate-100 shadow-sm transition-all group relative overflow-hidden">
            <div className={`absolute top-0 right-0 p-8 opacity-[0.03] transition-transform group-hover:scale-110`}>
              <stat.icon className="w-20 h-20" />
            </div>
            <div className={`w-10 h-10 rounded-xl bg-${stat.color}-50 flex items-center justify-center text-${stat.color}-600 mb-4`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{stat.label}</p>
              <h3 className="text-2xl font-black text-slate-900">{stat.value}</h3>
              <p className="text-xs font-medium text-slate-500 mt-0.5">{stat.sub}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Table Content */}
      <Card className="rounded-2xl border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/10">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Search by Order ID or Distributor..." 
              className="pl-10 h-10 rounded-xl border-slate-100 bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-10 w-10 border border-slate-200 rounded-xl">
              <Download className="w-4 h-4 text-slate-500" />
            </Button>
            <Button variant="ghost" size="icon" className="h-10 w-10 border border-slate-200 rounded-xl">
              <ArrowUpDown className="w-4 h-4 text-slate-500" />
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/30">
              <TableRow className="hover:bg-transparent border-slate-100">
                <TableHead className="py-4 pl-6 text-xs font-black uppercase tracking-widest text-slate-400">Order Information</TableHead>
                <TableHead className="text-xs font-black uppercase tracking-widest text-slate-400">Distributor</TableHead>
                <TableHead className="text-xs font-black uppercase tracking-widest text-slate-400">Quantity</TableHead>
                <TableHead className="text-xs font-black uppercase tracking-widest text-slate-400 text-center">Status</TableHead>
                <TableHead className="text-xs font-black uppercase tracking-widest text-slate-400">Delivery Est.</TableHead>
                <TableHead className="text-xs font-black uppercase tracking-widest text-slate-400 pr-6 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id} className="hover:bg-slate-50/50 border-slate-100 group">
                  <TableCell className="py-5 pl-6">
                    <div>
                      <p className="font-bold text-slate-900 flex items-center gap-2">
                        {order.id}
                        <ExternalLink className="w-3 h-3 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium mt-0.5">{order.riceType}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-700">{order.distributor}</span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1 font-medium italic">
                        <Warehouse className="w-2.5 h-2.5" /> {order.warehouse}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-slate-900">{order.quantity} {order.unit}</span>
                      <span className="text-[10px] text-slate-400 font-medium">₹{order.totalValue.toLocaleString()}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {getStatusBadge(order.status)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                      <Calendar className="w-3.5 h-3.5 opacity-40" />
                      {order.deliveryDate}
                    </div>
                  </TableCell>
                  <TableCell className="pr-6 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-400 hover:text-slate-900">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[180px] rounded-xl shadow-xl border-slate-100 p-1">
                        <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2 py-2">Order Management</DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-slate-50" />
                        <DropdownMenuItem className="text-sm font-bold rounded-lg cursor-pointer focus:bg-indigo-50 focus:text-indigo-600">
                          <ExternalLink className="w-4 h-4 mr-2" /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-sm font-bold rounded-lg cursor-pointer focus:bg-indigo-50 focus:text-indigo-600">
                          <Truck className="w-4 h-4 mr-2" /> Track Logistics
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-sm font-bold rounded-lg cursor-pointer focus:bg-indigo-50 focus:text-indigo-600">
                          <Package className="w-4 h-4 mr-2" /> Print Manifest
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-slate-50" />
                        <DropdownMenuItem className="text-sm font-bold rounded-lg cursor-pointer text-rose-500 focus:bg-rose-50 focus:text-rose-600">
                          <Trash2 className="w-4 h-4 mr-2" /> Cancel Order
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filteredOrders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-72 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
                        <Container className="w-8 h-8 text-slate-200" />
                      </div>
                      <h3 className="text-lg font-black text-slate-900">No bulk orders found</h3>
                      <p className="text-slate-500 text-sm font-medium mt-1">Adjust your search or filters to see other orders.</p>
                      <Button variant="outline" className="mt-6 rounded-xl font-bold border-slate-200" onClick={() => {
                        setFilterStatus('all');
                        setFilterWarehouse('all');
                        setSearchTerm('');
                      }}>Clear All Filters</Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
