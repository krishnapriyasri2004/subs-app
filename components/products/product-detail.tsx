'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from 'sonner';
import { ArrowLeft, Package, Edit, Plus, Share2, Layers, Tag, Ticket, Settings, Activity } from 'lucide-react';
import Link from 'next/link';
import { Product } from '@/types';
import { cn } from '@/lib/utils';
import { useProducts } from '@/lib/products-context';
import { ProductForm } from './product-form';

export function ProductDetail({ id }: { id: string }) {
    const [isEditing, setIsEditing] = useState(false);
    const searchParams = useSearchParams();
    const tabParam = searchParams.get('tab');

    // Set initial tab based on query param, default to 'plans'
    const [activeTab, setActiveTab] = useState(tabParam || 'plans');
    const { getProductById, addPlan, addAddon } = useProducts();
    const product = getProductById(id);

    // Dialog states
    const [isAddPlanOpen, setIsAddPlanOpen] = useState(false);
    const [isAddAddonOpen, setIsAddAddonOpen] = useState(false);

    // Plan form state
    const [planForm, setPlanForm] = useState({
        name: '',
        price: '',
        interval: 'monthly',
        status: 'active'
    });

    // Addon form state
    const [addonForm, setAddonForm] = useState({
        name: '',
        price: ''
    });

    const handleAddPlan = async () => {
        if (!planForm.name || !planForm.price) {
            toast.error("Please fill in all required fields");
            return;
        }
        await addPlan(id, {
            ...planForm,
            price: parseFloat(planForm.price)
        });
        toast.success("Plan added successfully");
        setIsAddPlanOpen(false);
        setPlanForm({ name: '', price: '', interval: 'monthly', status: 'active' });
    };

    const handleAddAddon = async () => {
        if (!addonForm.name || !addonForm.price) {
            toast.error("Please fill in all required fields");
            return;
        }
        await addAddon(id, {
            ...addonForm,
            price: parseFloat(addonForm.price)
        });
        toast.success("Addon added successfully");
        setIsAddAddonOpen(false);
        setAddonForm({ name: '', price: '' });
    };

    // Update active tab if URL parameter changes
    useEffect(() => {
        if (tabParam) {
            setActiveTab(tabParam);
        }
    }, [tabParam]);

    if (!product) {
        return (
            <div className="flex flex-col items-center justify-center p-20 text-center">
                <Package className="w-16 h-16 text-muted-foreground/30 mb-4" />
                <h2 className="text-2xl font-black text-foreground">Product Not Found</h2>
                <p className="text-muted-foreground mt-2">The product you are looking for does not exist or has been removed.</p>
                <Link href="/vendor/products" className="mt-6">
                    <Button variant="outline" className="font-bold"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Products</Button>
                </Link>
            </div>
        );
    }

    if (isEditing) {
        return (
            <div>
                <div className="mb-4">
                    <Button onClick={() => setIsEditing(false)} variant="ghost" className="font-bold">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Cancel Edit
                    </Button>
                </div>
                <ProductForm initialData={product} />
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-6xl mx-auto pb-10">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/vendor/products">
                    <Button variant="outline" size="icon" className="h-10 w-10 rounded-full border-border/50">
                        <ArrowLeft className="w-5 h-5 text-muted-foreground" />
                    </Button>
                </Link>
                <div className="flex-1">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-black tracking-tighter text-foreground">{product.name}</h1>
                        {product.exclusive && (
                            <Badge className="bg-primary/10 text-primary border-none font-black text-[10px] tracking-widest uppercase">Exclusive</Badge>
                        )}
                        <Badge
                            variant="outline"
                            className={cn(
                                "font-black text-[10px] tracking-widest uppercase",
                                product.status === 'active' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-muted text-muted-foreground border-border/50"
                            )}
                        >
                            {product.status}
                        </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm font-medium mt-1 pr-10">{product.description}</p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={() => setIsEditing(true)} variant="outline" className="font-bold h-10 border-border/50"><Edit className="w-4 h-4 mr-2" /> Edit</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card className="glass-card p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Layers className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Pricing Plans</p>
                        <h3 className="text-2xl font-black text-foreground leading-none mt-1">{product.plans.length}</h3>
                    </div>
                </Card>
                <Card className="glass-card p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                        <Tag className="w-6 h-6 text-indigo-500" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Active Addons</p>
                        <h3 className="text-2xl font-black text-foreground leading-none mt-1">{product.addons.length}</h3>
                    </div>
                </Card>
                <Card className="glass-card p-4 flex items-center gap-4 md:col-span-2">
                    <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                        <Settings className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Configuration</p>
                        <div className="text-xs text-foreground mt-1 flex flex-wrap gap-x-4 gap-y-1">
                            <span className="font-medium text-muted-foreground">Category: <span className="font-bold text-foreground">{product.category}</span></span>
                            <span className="font-medium text-muted-foreground">Emails: <span className="font-bold text-foreground">{product.notificationEmail || 'N/A'}</span></span>
                            <span className="font-medium text-muted-foreground flex items-center gap-1">
                                Auto Generate IDs: {product.autoGenerateNumbers ? <Activity className="w-3 h-3 text-emerald-500" /> : <span className="font-bold text-foreground">No</span>}
                            </span>
                            {product.exclusive && (
                                <span className="font-medium text-muted-foreground flex items-center gap-1">
                                    Exclusive: <span className="font-bold text-primary">Yes</span>
                                </span>
                            )}
                        </div>
                    </div>
                </Card>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="bg-muted/50 p-1 border border-border/50 rounded-2xl w-full justify-start h-auto">
                    <TabsTrigger value="plans" className="rounded-xl px-6 py-2.5 font-bold flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                        <Layers className="w-4 h-4" /> Plans
                    </TabsTrigger>
                    <TabsTrigger value="addons" className="rounded-xl px-6 py-2.5 font-bold flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                        <Tag className="w-4 h-4" /> Addons
                    </TabsTrigger>
                    <TabsTrigger value="coupons" className="rounded-xl px-6 py-2.5 font-bold flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                        <Ticket className="w-4 h-4" /> Coupons
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="plans" className="focus-visible:outline-none space-y-4">
                    <div className="flex justify-between items-center h-10">
                        <h3 className="text-lg font-bold">Pricing Plans</h3>
                        <div className="flex-shrink-0">
                            <Dialog open={isAddPlanOpen} onOpenChange={setIsAddPlanOpen}>
                                <DialogTrigger asChild>
                                    <Button size="sm" className="font-bold h-9 bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary border-0 shrink-0 whitespace-nowrap">
                                        <Plus className="w-4 h-4 mr-2" /> Add Plan
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px] glass-card border-border/50">
                                    <DialogHeader className="space-y-0.5">
                                        <DialogTitle className="font-black text-base tracking-tight">Add New Plan</DialogTitle>
                                    </DialogHeader>
                                    <div className="grid gap-2 py-1">
                                        <div className="space-y-1">
                                            <Label htmlFor="planName" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Plan Name</Label>
                                            <Input
                                                id="planName"
                                                placeholder="e.g. Premium Monthly"
                                                value={planForm.name}
                                                onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })}
                                                className="h-9 border-border/50"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="space-y-1">
                                                <Label htmlFor="planPrice" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Price (₹)</Label>
                                                <Input
                                                    id="planPrice"
                                                    type="number"
                                                    placeholder="999"
                                                    value={planForm.price}
                                                    onChange={(e) => setPlanForm({ ...planForm, price: e.target.value })}
                                                    className="h-9 border-border/50"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <Label htmlFor="interval" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Interval</Label>
                                                <Select value={planForm.interval} onValueChange={(val) => setPlanForm({ ...planForm, interval: val })}>
                                                    <SelectTrigger id="interval" className="h-9 border-border/50">
                                                        <SelectValue placeholder="Select" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="monthly">Monthly</SelectItem>
                                                        <SelectItem value="quarterly">Quarterly</SelectItem>
                                                        <SelectItem value="yearly">Yearly</SelectItem>
                                                        <SelectItem value="one-time">One-time</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button onClick={handleAddPlan} className="w-full font-black h-9 shadow-xl shadow-primary/20 mt-1">Create Plan</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                    <Card className="glass-card overflow-hidden">
                        <Table>
                            <TableHeader className="bg-muted/30">
                                <TableRow className="border-border/50">
                                    <TableHead className="font-black text-xs uppercase tracking-widest h-10">Plan Name</TableHead>
                                    <TableHead className="font-black text-xs uppercase tracking-widest h-10 text-right">Price</TableHead>
                                    <TableHead className="font-black text-xs uppercase tracking-widest h-10">Interval</TableHead>
                                    <TableHead className="font-black text-xs uppercase tracking-widest h-10">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {product.plans.map(plan => (
                                    <TableRow key={plan.id} className="border-border/50 hover:bg-muted/10">
                                        <TableCell className="font-bold">{plan.name}</TableCell>
                                        <TableCell className="text-right font-mono font-medium">₹{plan.price.toLocaleString()}</TableCell>
                                        <TableCell className="capitalize text-muted-foreground text-sm">{plan.interval}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={plan.status === 'active' ? "bg-emerald-500/10 text-emerald-500 border-0" : "bg-muted text-muted-foreground border-0"}>
                                                {plan.status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {product.plans.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground text-sm">No plans configured yet.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </Card>
                </TabsContent>

                <TabsContent value="addons" className="focus-visible:outline-none space-y-4">
                    <div className="flex justify-between items-center h-10">
                        <h3 className="text-lg font-bold">Available Addons</h3>
                        <div className="flex-shrink-0">
                            <Dialog open={isAddAddonOpen} onOpenChange={setIsAddAddonOpen}>
                                <DialogTrigger asChild>
                                    <Button size="sm" className="font-bold h-9 bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary border-0 shrink-0 whitespace-nowrap">
                                        <Plus className="w-4 h-4 mr-2" /> Add Addon
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px] glass-card border-border/50">
                                    <DialogHeader className="space-y-0.5">
                                        <DialogTitle className="font-black text-base tracking-tight">Add New Addon</DialogTitle>
                                    </DialogHeader>
                                    <div className="grid gap-2 py-1">
                                        <div className="grid grid-cols-3 gap-2">
                                            <div className="col-span-2 space-y-1">
                                                <Label htmlFor="addonName" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Addon Name</Label>
                                                <Input
                                                    id="addonName"
                                                    placeholder="e.g. Extra Milk"
                                                    value={addonForm.name}
                                                    onChange={(e) => setAddonForm({ ...addonForm, name: e.target.value })}
                                                    className="h-9 border-border/50"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <Label htmlFor="addonPrice" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Price (₹)</Label>
                                                <Input
                                                    id="addonPrice"
                                                    type="number"
                                                    placeholder="50"
                                                    value={addonForm.price}
                                                    onChange={(e) => setAddonForm({ ...addonForm, price: e.target.value })}
                                                    className="h-9 border-border/50"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button onClick={handleAddAddon} className="w-full font-black h-9 shadow-xl shadow-primary/20 mt-1">Create Addon</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                    <Card className="glass-card overflow-hidden">
                        <Table>
                            <TableHeader className="bg-muted/30">
                                <TableRow className="border-border/50">
                                    <TableHead className="font-black text-xs uppercase tracking-widest h-10">Addon Name</TableHead>
                                    <TableHead className="font-black text-xs uppercase tracking-widest h-10 text-right">Price (Fixed)</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {product.addons?.map(addon => (
                                    <TableRow key={addon.id} className="border-border/50 hover:bg-muted/10">
                                        <TableCell className="font-bold">{addon.name}</TableCell>
                                        <TableCell className="text-right font-mono font-medium">₹{addon.price.toLocaleString()}</TableCell>
                                    </TableRow>
                                ))}
                                {(!product.addons || product.addons.length === 0) && (
                                    <TableRow>
                                        <TableCell colSpan={2} className="text-center py-8 text-muted-foreground text-sm">No addons available for this product.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </Card>
                </TabsContent>

                <TabsContent value="coupons" className="focus-visible:outline-none space-y-4">
                    <div className="flex justify-between items-center h-10">
                        <h3 className="text-lg font-bold">Applicable Coupons</h3>
                        <div className="flex-shrink-0">
                            <Button size="sm" asChild className="font-bold h-9 bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary border-0 shrink-0 whitespace-nowrap">
                                <Link href="/vendor/coupons">Manage Coupons</Link>
                            </Button>
                        </div>
                    </div>
                    <Card className="p-12 border-dashed border-2 bg-transparent flex flex-col items-center justify-center text-center">
                        <Ticket className="w-10 h-10 text-muted-foreground/30 mb-3" />
                        <p className="font-bold text-muted-foreground">Coupons are managed globally</p>
                        <p className="text-xs text-muted-foreground mt-1 max-w-sm">You can restrict coupons to specific products in the Global Coupons section of your settings.</p>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}