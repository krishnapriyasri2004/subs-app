'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useProducts } from '@/lib/products-context';

interface AddonDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    productId: string;
}

export function AddonDialog({ open, onOpenChange, productId }: AddonDialogProps) {
    const { products } = useProducts();
    const product = products.find(p => p.id === productId);

    const [formData, setFormData] = useState({
        name: '',
        price: 0,
        description: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would normally call a logic to add the addon
        console.log('Adding addon:', formData, 'to product:', productId);
        onOpenChange(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) || 0 : value
        }));
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] rounded-3xl border-border/50 shadow-2xl">
                <DialogHeader className="p-1">
                    <DialogTitle className="text-xl font-black tracking-tight">Add New Addon</DialogTitle>
                    <DialogDescription className="text-sm font-medium text-muted-foreground mt-1">
                        Create a new addon for <span className="text-foreground font-bold">{product?.name || 'this product'}</span>.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="addon-name" className="text-xs font-black uppercase tracking-widest text-muted-foreground/70">Addon Name</Label>
                            <Input
                                id="addon-name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g. Extra Rice (5kg)"
                                className="h-12 bg-muted/20 rounded-xl font-medium border-border/40 focus:border-primary/50"
                                required
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="addon-price" className="text-xs font-black uppercase tracking-widest text-muted-foreground/70">Price (₹)</Label>
                            <Input
                                id="addon-price"
                                name="price"
                                type="number"
                                min="0"
                                value={formData.price}
                                onChange={handleChange}
                                className="h-12 bg-muted/20 rounded-xl font-mono font-bold border-border/40 focus:border-primary/50"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="addon-desc" className="text-xs font-black uppercase tracking-widest text-muted-foreground/70">Description</Label>
                            <Textarea
                                id="addon-desc"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Describe what this addon includes..."
                                className="bg-muted/20 rounded-xl min-h-[100px] font-medium border-border/40 focus:border-primary/50"
                            />
                        </div>
                    </div>

                    <DialogFooter className="pt-2 gap-3 sm:gap-0">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => onOpenChange(false)}
                            className="rounded-xl font-bold h-12 px-6"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="rounded-xl font-bold h-12 px-8 bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                        >
                            Save Addon
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
