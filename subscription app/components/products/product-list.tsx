'use client';

import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../ui/table";
import { Plus, Package, MoreHorizontal, Edit, Archive, Trash2, Layers, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { cn } from '../../lib/utils';
import { useProducts } from '../../lib/products-context';

export function ProductList() {
    const { products, archiveProduct, unarchiveProduct, deleteProduct } = useProducts();

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-black tracking-tighter flex items-center gap-2">
                        <Package className="w-6 h-6 text-primary" /> Products
                    </h2>
                    <p className="text-muted-foreground mt-1 text-sm font-medium">Manage your offerings, subscriptions plans, and addons.</p>
                </div>
                <Link href="/vendor/products/new">
                    <Button className="font-bold shadow-xl rounded-xl h-10 px-6">
                        <Plus className="w-4 h-4 mr-2" /> New Product
                    </Button>
                </Link>
            </div>

            <Card className="glass-card overflow-hidden">
                <div className="p-0 overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-muted/30">
                            <TableRow className="hover:bg-transparent border-border/50">
                                <TableHead className="font-black text-xs uppercase tracking-widest h-12">Product Details</TableHead>
                                <TableHead className="font-black text-xs uppercase tracking-widest h-12">Category</TableHead>
                                <TableHead className="font-black text-xs uppercase tracking-widest h-12 text-center">Plans</TableHead>
                                <TableHead className="font-black text-xs uppercase tracking-widest h-12">Status</TableHead>
                                <TableHead className="font-black text-xs uppercase tracking-widest h-12 text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.map((product) => (
                                <TableRow key={product.id} className="border-border/50 hover:bg-muted/10 group">
                                    <TableCell className="py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                <Package className="w-5 h-5 text-primary" />
                                            </div>
                                            <div>
                                                <Link href={`/vendor/products/${product.id}`} className="font-bold text-foreground hover:text-primary transition-colors">
                                                    {product.name}
                                                </Link>
                                                <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-[250px]">{product.description}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className="font-bold text-[10px] tracking-widest uppercase bg-muted/50 border-border/50">
                                            {product.category}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex items-center justify-center gap-1.5 font-bold text-foreground">
                                            <Layers className="w-3.5 h-3.5 text-muted-foreground" />
                                            {product.plans.length}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="outline"
                                            className={cn(
                                                "font-black text-[10px] tracking-widest uppercase",
                                                product.status === 'active' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-muted text-muted-foreground border-border/50"
                                            )}
                                        >
                                            {product.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-[160px] rounded-xl border-border/50 shadow-2xl glass-card">
                                                <DropdownMenuLabel className="text-xs font-black tracking-widest text-muted-foreground uppercase">Options</DropdownMenuLabel>
                                                <DropdownMenuSeparator className="bg-border/50" />
                                                <Link href={`/vendor/products/${product.id}`}>
                                                    <DropdownMenuItem className="text-sm font-bold cursor-pointer focus:bg-primary/10 focus:text-primary">
                                                        <Edit className="w-4 h-4 mr-2" /> Edit
                                                    </DropdownMenuItem>
                                                </Link>
                                                <Link href={`/vendor/products/${product.id}?tab=plans`}>
                                                    <DropdownMenuItem className="text-sm font-bold cursor-pointer focus:bg-primary/10 focus:text-primary">
                                                        <Plus className="w-4 h-4 mr-2" /> Add Plan
                                                    </DropdownMenuItem>
                                                </Link>
                                                <Link href={`/vendor/products/${product.id}?tab=addons`}>
                                                    <DropdownMenuItem className="text-sm font-bold cursor-pointer focus:bg-primary/10 focus:text-primary">
                                                        <Plus className="w-4 h-4 mr-2" /> Add Addon
                                                    </DropdownMenuItem>
                                                </Link>
                                                <DropdownMenuSeparator className="bg-border/50" />
                                                {product.status !== 'archived' ? (
                                                    <DropdownMenuItem onClick={() => archiveProduct(product.id)} className="text-sm font-bold cursor-pointer focus:bg-amber-500/10 focus:text-amber-500">
                                                        <Archive className="w-4 h-4 mr-2" /> Archive
                                                    </DropdownMenuItem>
                                                ) : (
                                                    <DropdownMenuItem onClick={() => unarchiveProduct(product.id)} className="text-sm font-bold cursor-pointer focus:bg-emerald-500/10 focus:text-emerald-500">
                                                        <Package className="w-4 h-4 mr-2" /> Unarchive
                                                    </DropdownMenuItem>
                                                )}
                                                <DropdownMenuItem onClick={() => deleteProduct(product.id)} className="text-sm font-bold cursor-pointer text-rose-500 focus:bg-rose-500/10 focus:text-rose-500">
                                                    <Trash2 className="w-4 h-4 mr-2" /> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {products.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-48 text-center">
                                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                                            <Package className="w-10 h-10 mb-3 opacity-20" />
                                            <p className="font-bold text-sm">No products found</p>
                                            <p className="text-xs mt-1">Create your first product to start offering subscriptions.</p>
                                            <Link href="/vendor/products/new" className="mt-4">
                                                <Button variant="outline" className="font-bold text-xs h-8"><Plus className="w-3 h-3 mr-2" /> Create Product</Button>
                                            </Link>
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