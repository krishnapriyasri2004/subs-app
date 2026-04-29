'use client';

import React, { useState } from 'react';
import { 
  Package, 
  Search, 
  Filter as FilterIcon, 
  ArrowUpDown, 
  Download, 
  Plus, 
  History, 
  Warehouse, 
  ChevronRight,
  Loader2,
  Trash2,
  Edit,
  MoreVertical,
  AlertCircle
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
import { useVendorAuth } from '@/lib/vendor-auth';

// Define the Inventory Item type extending the Product-like structure
interface InventoryItem {
  id: string;
  name: string;
  category: string;
  sku: string;
  stock: number;
  unit: string;
  warehouse: string;
  lastUpdated: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  price: number;
}

const initialInventoryData: InventoryItem[] = [
  {
    id: 'SKU-001',
    name: 'Basmati Rice Premium',
    category: 'Long Grain',
    sku: 'BR-PRM-001',
    stock: 2500,
    unit: 'kg',
    warehouse: 'Main Warehouse',
    lastUpdated: '2026-03-22',
    status: 'In Stock',
    price: 120,
  },
  {
    id: 'SKU-002',
    name: 'Sona Masoori Rice',
    category: 'Medium Grain',
    sku: 'SM-MED-002',
    stock: 1200,
    unit: 'kg',
    warehouse: 'Main Warehouse',
    lastUpdated: '2026-03-21',
    status: 'In Stock',
    price: 65,
  },
  {
    id: 'SKU-003',
    name: 'Brown Rice Organic',
    category: 'Specialty',
    sku: 'BRN-ORG-003',
    stock: 150,
    unit: 'kg',
    warehouse: 'South Warehouse',
    lastUpdated: '2026-03-23',
    status: 'Low Stock',
    price: 145,
  },
  {
    id: 'SKU-004',
    name: 'Jasmine Rice',
    category: 'Fragrant',
    sku: 'JAS-FRG-004',
    stock: 0,
    unit: 'kg',
    warehouse: 'East Warehouse',
    lastUpdated: '2026-03-20',
    status: 'Out of Stock',
    price: 180,
  },
  {
    id: 'SKU-005',
    name: 'Ponni Rice',
    category: 'Short Grain',
    sku: 'PON-SHR-005',
    stock: 850,
    unit: 'kg',
    warehouse: 'Main Warehouse',
    lastUpdated: '2026-03-22',
    status: 'In Stock',
    price: 55,
  }
];

export default function InventoryPage() {
  const { user } = useVendorAuth();
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventoryData);
  const [searchTerm, setSearchTerm] = useState('');
  const [isUpdateStockOpen, setIsUpdateStockOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Update Stock Form State
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [updateQuantity, setUpdateQuantity] = useState<string>('');
  const [updateType, setUpdateType] = useState<'addition' | 'subtraction' | 'set'>('addition');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter States
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterWarehouse, setFilterWarehouse] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    const matchesWarehouse = filterWarehouse === 'all' || item.warehouse === filterWarehouse;
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesWarehouse && matchesStatus;
  });

  const handleUpdateStock = async () => {
    if (!selectedProduct || !updateQuantity) {
      toast.error('Please select a product and enter quantity');
      return;
    }

    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));

    const qty = parseFloat(updateQuantity);
    setInventory(prev => prev.map(item => {
      if (item.id === selectedProduct) {
        let newStock = item.stock;
        if (updateType === 'addition') newStock += qty;
        else if (updateType === 'subtraction') newStock = Math.max(0, newStock - qty);
        else newStock = qty;

        let newStatus: 'In Stock' | 'Low Stock' | 'Out of Stock' = 'In Stock';
        if (newStock === 0) newStatus = 'Out of Stock';
        else if (newStock < 200) newStatus = 'Low Stock';

        return {
          ...item,
          stock: newStock,
          status: newStatus,
          lastUpdated: new Date().toISOString().split('T')[0]
        };
      }
      return item;
    }));

    setIsSubmitting(false);
    setIsUpdateStockOpen(false);
    toast.success('Stock updated successfully');
    setUpdateQuantity('');
    setSelectedProduct('');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'In Stock':
        return <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-50">In Stock</Badge>;
      case 'Low Stock':
        return <Badge className="bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-50">Low Stock</Badge>;
      case 'Out of Stock':
        return <Badge className="bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-50">Out of Stock</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Stock Inventory</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">Manage and track your rice stock levels across warehouses.</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Main Sidebar Filter Button */}
          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="h-11 rounded-xl font-bold gap-2 border-slate-200 bg-white shadow-sm hover:bg-slate-50 transition-all">
                <FilterIcon className="w-4 h-4 text-slate-500" />
                <span>Filter</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[350px] sm:w-[450px] border-l border-slate-100 shadow-2xl bg-white/95 backdrop-blur-xl">
              <SheetHeader className="mb-8">
                <SheetTitle className="text-2xl font-black text-slate-900 tracking-tight">Inventory Filters</SheetTitle>
                <SheetDescription className="font-medium text-slate-500">Refine your stock view by category, warehouse, or status.</SheetDescription>
              </SheetHeader>
              <div className="space-y-8 py-4">
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500">Warehouse Location</label>
                  <Select value={filterWarehouse} onValueChange={setFilterWarehouse}>
                    <SelectTrigger className="h-12 rounded-xl border-slate-100 bg-slate-50/50 focus:ring-primary/20">
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
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500">Product Category</label>
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="h-12 rounded-xl border-slate-100 bg-slate-50/50 focus:ring-primary/20">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="Long Grain">Long Grain</SelectItem>
                      <SelectItem value="Medium Grain">Medium Grain</SelectItem>
                      <SelectItem value="Short Grain">Short Grain</SelectItem>
                      <SelectItem value="Fragrant">Fragrant</SelectItem>
                      <SelectItem value="Specialty">Specialty</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500">Stock Status</label>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="h-12 rounded-xl border-slate-100 bg-slate-50/50 focus:ring-primary/20">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="In Stock">In Stock</SelectItem>
                      <SelectItem value="Low Stock">Low Stock</SelectItem>
                      <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <SheetFooter className="absolute bottom-6 left-6 right-6 gap-2">
                <Button variant="outline" className="flex-1 h-12 rounded-xl font-bold border-slate-100" onClick={() => {
                  setFilterCategory('all');
                  setFilterWarehouse('all');
                  setFilterStatus('all');
                }}>Reset</Button>
                <Button className="flex-1 h-12 rounded-xl font-bold" onClick={() => setIsFilterOpen(false)}>Apply Filters</Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>

          <Dialog open={isUpdateStockOpen} onOpenChange={setIsUpdateStockOpen}>
            <DialogTrigger asChild>
              <Button className="h-11 rounded-xl font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 px-6 gap-2">
                <Plus className="w-4 h-4" />
                Update Stock
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] rounded-3xl border-none shadow-2xl p-0 overflow-hidden">
              <div className="p-8 pb-4">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-black text-slate-900 tracking-tight">Manual Stock Adjustment</DialogTitle>
                  <DialogDescription className="font-medium text-slate-500 pt-1">Update your inventory levels for specific warehouse locations.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-8">
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                      <Package className="w-3.5 h-3.5" /> Select Product
                    </label>
                    <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                      <SelectTrigger className="h-12 rounded-xl border-slate-100 bg-slate-50/50 focus:ring-primary/20">
                        <SelectValue placeholder="Choose a product to update..." />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                        {inventory.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            <div className="flex flex-col items-start py-0.5">
                              <span className="font-bold text-slate-900">{item.name}</span>
                              <span className="text-[10px] text-slate-400 font-medium">SKU: {item.sku} • Current: {item.stock}{item.unit}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-500">Action Type</label>
                      <Select value={updateType} onValueChange={(val: any) => setUpdateType(val)}>
                        <SelectTrigger className="h-12 rounded-xl border-slate-100 bg-slate-50/50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                          <SelectItem value="addition">Add Stock (+)</SelectItem>
                          <SelectItem value="subtraction">Remove Stock (-)</SelectItem>
                          <SelectItem value="set">Set Fixed Amount (=)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-3">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-500">Quantity</label>
                      <div className="relative">
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={updateQuantity}
                          onChange={(e) => setUpdateQuantity(e.target.value)}
                          className="h-12 rounded-xl border-slate-100 bg-slate-50/50 focus-visible:ring-primary/20 pr-12 font-bold"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">kg</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter className="bg-slate-50/50 border-t border-slate-100 p-6 flex items-center justify-between gap-4">
                <p className="text-[11px] text-slate-400 font-medium max-w-[200px]">Stock adjustments will be logged for audit purposes.</p>
                <div className="flex gap-2">
                  <Button variant="ghost" className="h-11 rounded-xl font-bold px-6 text-slate-500 hover:text-slate-900 hover:bg-slate-100" onClick={() => setIsUpdateStockOpen(false)}>Cancel</Button>
                  <Button 
                    className="h-11 rounded-xl font-black shadow-lg shadow-primary/20 px-8"
                    onClick={handleUpdateStock}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Update'}
                  </Button>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Analytics Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Stock Volume', value: '4,700 kg', sub: 'Across 5 categories', icon: Package, color: 'indigo' },
          { label: 'Low Stock Alerts', value: '1 Item', sub: 'Needs reordering soon', icon: AlertCircle, color: 'amber' },
          { label: 'Out of Stock', value: '1 Item', sub: 'Check procurement status', icon: History, color: 'rose' },
          { label: 'Main Warehouse', value: '4,550 kg', sub: 'Primary storage facility', icon: Warehouse, color: 'blue' }
        ].map((stat, i) => (
          <Card key={i} className="p-5 rounded-2xl border-slate-100/60 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
            <div className={`absolute top-0 right-0 p-8 opacity-[0.03] transition-transform group-hover:scale-110 group-hover:rotate-6`}>
              <stat.icon className="w-20 h-20" />
            </div>
            <div className="flex items-start justify-between mb-4">
              <div className={`p-2.5 rounded-xl bg-${stat.color}-50 text-${stat.color}-600`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{stat.label}</p>
              <h3 className="text-2xl font-black text-slate-900">{stat.value}</h3>
              <p className="text-xs font-medium text-slate-500 mt-0.5">{stat.sub}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Content Area */}
      <Card className="rounded-2xl border-slate-100 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/20">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Search by product name or SKU..." 
              className="pl-10 h-10 rounded-xl border-slate-100 bg-white/80 focus-visible:ring-primary/20 text-sm font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-10 w-10 border border-slate-200 rounded-xl hover:bg-slate-50">
              <Download className="w-4 h-4 text-slate-500" />
            </Button>
            <Button variant="ghost" size="icon" className="h-10 w-10 border border-slate-200 rounded-xl hover:bg-slate-50">
              <ArrowUpDown className="w-4 h-4 text-slate-500" />
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="hover:bg-transparent border-slate-50">
                <TableHead className="py-4 pl-6 text-xs font-black uppercase tracking-widest text-slate-400">Product Details</TableHead>
                <TableHead className="text-xs font-black uppercase tracking-widest text-slate-400">Category</TableHead>
                <TableHead className="text-xs font-black uppercase tracking-widest text-slate-400">Warehouse</TableHead>
                <TableHead className="text-xs font-black uppercase tracking-widest text-slate-400 text-right">Available Stock</TableHead>
                <TableHead className="text-xs font-black uppercase tracking-widest text-slate-400 text-center">Status</TableHead>
                <TableHead className="text-xs font-black uppercase tracking-widest text-slate-400 pr-6 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInventory.map((item) => (
                <TableRow key={item.id} className="hover:bg-slate-50/50 border-slate-50 group">
                  <TableCell className="py-5 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                        <Package className="w-5 h-5 text-slate-400" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 group-hover:text-primary transition-colors">{item.name}</p>
                        <p className="text-[10px] text-slate-400 font-medium">SKU: {item.sku} • Updated: {item.lastUpdated}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-slate-100 text-slate-600 font-bold border-none hover:bg-slate-200">
                      {item.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Warehouse className="w-3.5 h-3.5 opacity-50" />
                      <span className="text-sm font-semibold">{item.warehouse}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="text-sm font-black text-slate-900">{item.stock.toLocaleString()}</span>
                    <span className="text-[11px] font-bold text-slate-400 ml-1">{item.unit}</span>
                  </TableCell>
                  <TableCell className="text-center">
                    {getStatusBadge(item.status)}
                  </TableCell>
                  <TableCell className="pr-6 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[180px] rounded-xl shadow-xl border-slate-100 p-1">
                        <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2 py-2">Inventory Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-slate-50" />
                        <DropdownMenuItem className="text-sm font-bold rounded-lg cursor-pointer focus:bg-primary/10 focus:text-primary" onClick={() => {
                          setSelectedProduct(item.id);
                          setIsUpdateStockOpen(true);
                        }}>
                          <Plus className="w-4 h-4 mr-2" /> Adjust Stock
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-sm font-bold rounded-lg cursor-pointer focus:bg-primary/10 focus:text-primary">
                          <Edit className="w-4 h-4 mr-2" /> Edit Specs
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-sm font-bold rounded-lg cursor-pointer focus:bg-primary/10 focus:text-primary">
                          <History className="w-4 h-4 mr-2" /> View Logs
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-slate-50" />
                        <DropdownMenuItem className="text-sm font-bold rounded-lg cursor-pointer text-rose-500 focus:bg-rose-50 focus:text-rose-600">
                          <Trash2 className="w-4 h-4 mr-2" /> Archive Product
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filteredInventory.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-72 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
                        <Package className="w-8 h-8 text-slate-200" />
                      </div>
                      <h3 className="text-lg font-black text-slate-900">No matching stock items</h3>
                      <p className="text-slate-500 text-sm font-medium mt-1">Try adjusting your filters or search keywords.</p>
                      <Button variant="outline" className="mt-6 rounded-xl font-bold border-slate-200" onClick={() => {
                        setFilterCategory('all');
                        setFilterWarehouse('all');
                        setFilterStatus('all');
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
