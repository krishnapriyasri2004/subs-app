'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, ArrowLeft, PackagePlus, HelpCircle, UploadCloud } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useProducts } from '@/lib/products-context';
import { useAuth } from '@/lib/auth-context';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';

export function ProductForm({ initialData }: { initialData?: any }) {
    const router = useRouter();
    const { addProduct, updateProduct } = useProducts();
    const { user } = useAuth();
    
    const isRice = user?.businessType?.toLowerCase().includes('rice');

    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        description: initialData?.description || '',
        notificationEmail: initialData?.notificationEmail || '',
        redirectUrl: initialData?.redirectUrl || '',
        autoGenerateNumbers: initialData?.autoGenerateNumbers ?? true,
        category: initialData?.category || '',
        size: initialData?.size || '',
        compareAtPrice: initialData?.compareAtPrice || '',
        imageUrl: initialData?.imageUrl || '',
        exclusive: initialData?.exclusive ?? false,
    });

    const categories = ["Dairy", "Grains", "Grocery", "Water", "Tiffin", "SaaS", "Other"];

    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            toast.error("Image must be less than 2MB");
            return;
        }

        setIsUploading(true);
        const storageRef = ref(storage, `product_images/${Date.now()}_${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            'state_changed',
            (snapshot) => {},
            (error) => {
                console.error("Upload error:", error);
                toast.error("Failed to upload image.");
                setIsUploading(false);
            },
            async () => {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                setFormData(prev => ({ ...prev, imageUrl: downloadURL }));
                toast.success("Image uploaded successfully!");
                setIsUploading(false);
            }
        );
    };

    const handleSave = async () => {
        if (!formData.name) {
            toast.error('Product Name is required.');
            return;
        }

        setIsSaving(true);
        try {
            if (initialData?.id) {
                await updateProduct(initialData.id, formData);
                toast.success('Product updated successfully.');
            } else {
                await addProduct(formData as any);
                toast.success('Product created successfully.');
            }

            setTimeout(() => {
                router.push('/vendor/products');
            }, 500);
        } catch (error) {
            console.error("Save error:", error);
            toast.error('Failed to save product.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-10">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/vendor/products">
                    <Button variant="outline" size="icon" className="h-10 w-10 rounded-full border-border/50">
                        <ArrowLeft className="w-5 h-5 text-muted-foreground" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-black tracking-tighter flex items-center gap-2 text-foreground">
                        <PackagePlus className="w-6 h-6 text-primary" />
                        {initialData ? 'Edit Product' : 'Create New Product'}
                    </h1>
                    <p className="text-muted-foreground text-sm font-medium mt-1">Configure your product details and settings.</p>
                </div>
            </div>

            <Card className="glass-card p-6 md:p-8 space-y-8">
                {/* Basic Info */}
                <div className="space-y-6">
                    <h3 className="text-lg font-bold border-b border-border/50 pb-2">Basic Information</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <Label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Product Name <span className="text-rose-500">*</span></Label>
                            <Input
                                id="name"
                                placeholder={isRice ? "e.g. Premium Sona Masoori Rice (25kg)" : "e.g. Daily Fresh Milk (1L)"}
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="h-12 border-border/50 bg-background/50 font-medium"
                            />
                        </div>
                        <div className="space-y-3">
                            <Label htmlFor="category" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Industry / Category</Label>
                            <Select value={formData.category} onValueChange={(val) => setFormData({ ...formData, category: val })}>
                                <SelectTrigger id="category" className="h-12 border-border/50 bg-background/50 font-medium">
                                    <SelectValue placeholder="Select Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map(cat => (
                                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label htmlFor="description" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Description</Label>
                        <Textarea
                            id="description"
                            placeholder="Describe your product offering..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="min-h-[100px] border-border/50 bg-background/50 resize-y"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <Label htmlFor="size" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Size / Quantity Label</Label>
                            <Input
                                id="size"
                                placeholder={isRice ? "e.g. 25 Kg, 10 Kg" : "e.g. 500 ML, 1 L"}
                                value={formData.size}
                                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                                className="h-12 border-border/50 bg-background/50 font-medium"
                            />
                        </div>
                        <div className="space-y-3">
                            <Label htmlFor="compareAtPrice" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Compare At Price (₹)</Label>
                            <Input
                                id="compareAtPrice"
                                type="number"
                                placeholder="e.g. 60 (Strikethrough Price)"
                                value={formData.compareAtPrice}
                                onChange={(e) => setFormData({ ...formData, compareAtPrice: e.target.value })}
                                className="h-12 border-border/50 bg-background/50 font-medium"
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label htmlFor="imageUpload" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Product Image Upload</Label>
                        <div className="flex items-center gap-4">
                            <Input
                                id="imageUpload"
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                disabled={isUploading}
                                className="h-12 border-border/50 bg-background/50 font-medium cursor-pointer file:h-full file:bg-primary/10 file:text-primary file:border-0 file:mr-4 file:px-4 file:cursor-pointer"
                            />
                            {formData.imageUrl && (
                                <div className="w-12 h-12 rounded-xl border border-border/50 overflow-hidden shrink-0 flex items-center justify-center bg-muted/20 relative group">
                                    <img src={formData.imageUrl} alt="Preview" className="w-auto h-full object-contain" />
                                </div>
                            )}
                        </div>
                        {isUploading && <p className="text-xs text-primary font-bold animate-pulse flex items-center gap-1.5"><UploadCloud className="w-3 h-3"/> Uploading securely...</p>}

                        <div className="flex items-center gap-3 py-1 w-full">
                            <div className="h-px bg-border/60 flex-1"></div>
                            <span className="text-[9px] text-muted-foreground font-black uppercase tracking-widest">OR PASTE URL</span>
                            <div className="h-px bg-border/60 flex-1"></div>
                        </div>

                        <Input
                            id="imageUrl"
                            placeholder="https://example.com/image.png"
                            value={formData.imageUrl}
                            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                            className="h-12 border-border/50 bg-background/50 font-medium"
                        />
                        <p className="text-[10px] text-muted-foreground font-medium flex items-center gap-1">
                            <HelpCircle className="w-3.5 h-3.5" /> Upload a file or paste a direct link to a hosted image (PNG/JPG). Max 2MB.
                        </p>
                    </div>
                </div>

                {/* Email & Redirects */}
                <div className="space-y-6 pt-4">
                    <h3 className="text-lg font-bold border-b border-border/50 pb-2">Communication & Redirects</h3>

                    <div className="space-y-3">
                        <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Notification Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="orders@yourcompany.com"
                            value={formData.notificationEmail}
                            onChange={(e) => setFormData({ ...formData, notificationEmail: e.target.value })}
                            className="h-12 border-border/50 bg-background/50"
                        />
                        <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                            <HelpCircle className="w-3.5 h-3.5" /> Sent from this email for product-specific events.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <Label htmlFor="redirect" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Redirect URL after Subscription</Label>
                        <Input
                            id="redirect"
                            placeholder="https://yourwebsite.com/success?invoice=%InvoiceNumber%"
                            value={formData.redirectUrl}
                            onChange={(e) => setFormData({ ...formData, redirectUrl: e.target.value })}
                            className="h-12 border-border/50 bg-background/50 font-mono text-sm"
                        />
                        <div className="text-xs text-muted-foreground bg-muted/20 p-3 rounded-xl border border-border/30">
                            <span className="font-bold block mb-1">Supported Placeholders:</span>
                            <code className="text-[10px] bg-muted/50 px-1 py-0.5 rounded text-primary mr-2">%SubscriptionName%</code>
                            <code className="text-[10px] bg-muted/50 px-1 py-0.5 rounded text-primary mr-2">%PlanName%</code>
                            <code className="text-[10px] bg-muted/50 px-1 py-0.5 rounded text-primary mr-2">%InvoiceNumber%</code>
                            <code className="text-[10px] bg-muted/50 px-1 py-0.5 rounded text-primary">%NextBillingDate%</code>
                        </div>
                    </div>
                </div>

                {/* Advanced Settings */}
                <div className="space-y-6 pt-4">
                    <h3 className="text-lg font-bold border-b border-border/50 pb-2">Advanced Settings</h3>

                    <div className="flex items-center space-x-3 bg-muted/20 p-4 rounded-xl border border-border/30 hover:bg-muted/30 transition-colors">
                        <Checkbox
                            id="autoGenerate"
                            checked={formData.autoGenerateNumbers}
                            onCheckedChange={(checked) => setFormData({ ...formData, autoGenerateNumbers: checked === true })}
                            className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground border-border/50 w-5 h-5 rounded"
                        />
                        <div className="grid gap-1.5 leading-none">
                            <Label htmlFor="autoGenerate" className="text-sm font-bold cursor-pointer">
                                Auto-generate Product Numbers
                            </Label>
                            <p className="text-xs text-muted-foreground">
                                Let the system automatically assign unique internal ID numbers for this product and its plans.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3 bg-primary/5 p-4 rounded-xl border border-primary/20 hover:bg-primary/10 transition-colors">
                        <Checkbox
                            id="exclusive"
                            checked={formData.exclusive}
                            onCheckedChange={(checked) => setFormData({ ...formData, exclusive: checked === true })}
                            className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground border-primary/50 w-5 h-5 rounded"
                        />
                        <div className="grid gap-1.5 leading-none">
                            <Label htmlFor="exclusive" className="text-sm font-bold cursor-pointer flex items-center gap-2">
                                Exclusive Product
                                <span className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-black">Limited</span>
                            </Label>
                            <p className="text-xs text-muted-foreground">
                                Mark this product as exclusive. This will be highlighted to customers with a special badge.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="pt-6 flex justify-end gap-3 border-t border-border/50">
                    <Link href="/vendor/products">
                        <Button variant="ghost" className="h-12 px-6 font-bold hover:bg-muted">Cancel</Button>
                    </Link>
                    <Button onClick={handleSave} disabled={isSaving} className="h-12 px-8 font-black shadow-xl hover:bg-primary/90">
                        <Save className="w-4 h-4 mr-2" /> {isSaving ? 'Saving...' : 'Save Product'}
                    </Button>
                </div>
            </Card>
        </div>
    );
}