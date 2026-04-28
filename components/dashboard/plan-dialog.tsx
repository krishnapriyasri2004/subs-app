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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Plan, Product } from '@/types';
import { useData } from '@/lib/data-context';

interface PlanDialogProps {
    plan?: Plan | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (planData: Partial<Plan>) => void;
}

export function PlanDialog({ plan, open, onOpenChange, onSave }: PlanDialogProps) {
    const { mockProducts: products } = useData();

    // Default form state mimicking Zoho's Add Plan defaults
    const [formData, setFormData] = useState<Partial<Plan>>({
        name: '',
        planCode: '',
        unitName: 'user',
        productId: products.length > 0 ? products[0].id : '',
        price: 0,
        billEveryValue: 1,
        interval: 'monthly',
        billingCyclesAutoRenew: true,
        billingCyclesCount: 1,
        freeTrialDays: 0,
        setupFee: 0,
        taxLiability: 'Taxable',
        gstRate: 18,
        hsnSacCode: '',
        description: '',
        includeInWidget: true,
        allowCustomerSwitch: true,
        features: [],
        planAccount: 'Sales',
        setupFeeAccount: 'Sales',
        status: 'active'
    });

    const [featureInput, setFeatureInput] = useState('');
    const [touchedCode, setTouchedCode] = useState(false);

    useEffect(() => {
        if (open) {
            if (plan) {
                setFormData({ ...plan });
                setTouchedCode(true); // Don't auto-suggest if editing an existing plan
            } else {
                setFormData({
                    name: '',
                    planCode: '',
                    unitName: 'user',
                    productId: products.length > 0 ? products[0].id : '',
                    price: 0,
                    billEveryValue: 1,
                    interval: 'monthly',
                    billingCyclesAutoRenew: true,
                    billingCyclesCount: 1,
                    freeTrialDays: 0,
                    setupFee: 0,
                    taxLiability: 'Taxable',
                    gstRate: 18,
                    hsnSacCode: '',
                    description: '',
                    includeInWidget: true,
                    allowCustomerSwitch: true,
                    features: [],
                    planAccount: 'Sales',
                    setupFeeAccount: 'Sales',
                    status: 'active'
                });
                setTouchedCode(false);
            }
        }
    }, [plan, open, products]);

    // Auto-generate plan code based on name if the user hasn't manually edited it
    useEffect(() => {
        if (!touchedCode && formData.name) {
            const suggested = formData.name.toUpperCase().replace(/[^A-Z0-9]/g, '-').replace(/-+/g, '-');
            setFormData(prev => ({ ...prev, planCode: suggested }));
        }
    }, [formData.name, touchedCode]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData as Partial<Plan>);
        onOpenChange(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        if (name === 'planCode') {
            setTouchedCode(true);
        }

        setFormData((prev) => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) || 0 : value
        }));
    };

    const handleSelectChange = (name: keyof Plan, value: any) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (name: keyof Plan, checked: boolean) => {
        setFormData(prev => ({ ...prev, [name]: checked }));
    };

    const addFeature = () => {
        if (featureInput.trim()) {
            setFormData(prev => ({
                ...prev,
                features: [...(prev.features || []), featureInput.trim()]
            }));
            setFeatureInput('');
        }
    };

    const removeFeature = (index: number) => {
        setFormData(prev => ({
            ...prev,
            features: (prev.features || []).filter((_, i) => i !== index)
        }));
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[800px] bg-background border-border/50 text-foreground p-0 overflow-hidden flex flex-col max-h-[90vh] fixed left-[50%] top-[5vh] translate-x-[-50%] translate-y-0 duration-200">
                <DialogHeader className="p-6 pb-4 border-b border-border/50 bg-muted/20">
                    <DialogTitle className="text-xl font-bold">
                        {plan ? 'Edit Plan' : 'New Plan'}
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground text-xs mt-1">
                        Configure pricing, billing intervals, syntax, and tax treatments for this plan.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-6 space-y-10 custom-scrollbar">

                        {/* BASIC INFO */}
                        <div className="space-y-6">
                            <h3 className="text-sm font-black text-foreground uppercase tracking-widest border-b border-border/30 pb-2">Basic Info</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="plan-name" className="text-xs font-bold text-muted-foreground">Plan Name <span className="text-rose-500">*</span></Label>
                                    <Input
                                        id="plan-name"
                                        name="name"
                                        value={formData.name || ''}
                                        onChange={handleChange}
                                        placeholder="e.g. Standard Monthly"
                                        className="h-10 bg-muted/20"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="plan-code" className="text-xs font-bold text-muted-foreground">Plan Code <span className="text-rose-500">*</span></Label>
                                    <Input
                                        id="plan-code"
                                        name="planCode"
                                        value={formData.planCode || ''}
                                        onChange={handleChange}
                                        placeholder="e.g. STD-MTH"
                                        className="h-10 bg-muted/20 uppercase font-mono text-sm"
                                        required
                                    />
                                    <p className="text-[10px] text-muted-foreground">A unique code used to identify this plan via APIs.</p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="unit-name" className="text-xs font-bold text-muted-foreground">Unit Name</Label>
                                    <Select value={formData.unitName} onValueChange={(val) => handleSelectChange('unitName', val)}>
                                        <SelectTrigger id="unit-name" className="h-10 bg-muted/20">
                                            <SelectValue placeholder="Select unit" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="user">User</SelectItem>
                                            <SelectItem value="litre">Litre</SelectItem>
                                            <SelectItem value="kg">Kg</SelectItem>
                                            <SelectItem value="piece">Piece</SelectItem>
                                            <SelectItem value="bottle">Bottle</SelectItem>
                                            <SelectItem value="pack">Pack</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="product-id" className="text-xs font-bold text-muted-foreground">Product</Label>
                                    <Select value={formData.productId} onValueChange={(val) => handleSelectChange('productId', val)}>
                                        <SelectTrigger id="product-id" className="h-10 bg-muted/20">
                                            <SelectValue placeholder="Link to a product" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {products.map(p => (
                                                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        {/* PRICING */}
                        <div className="space-y-6">
                            <h3 className="text-sm font-black text-foreground uppercase tracking-widest border-b border-border/30 pb-2">Pricing</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="price" className="text-xs font-bold text-muted-foreground">Price (₹) <span className="text-rose-500">*</span></Label>
                                    <Input
                                        id="price"
                                        name="price"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={formData.price}
                                        onChange={handleChange}
                                        className="h-10 bg-muted/20"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-muted-foreground">Bill Every <span className="text-rose-500">*</span></Label>
                                    <div className="flex gap-2">
                                        <Input
                                            name="billEveryValue"
                                            type="number"
                                            min="1"
                                            value={formData.billEveryValue}
                                            onChange={handleChange}
                                            className="h-10 bg-muted/20 w-1/3"
                                            required
                                        />
                                        <Select value={formData.interval} onValueChange={(val) => handleSelectChange('interval', val)}>
                                            <SelectTrigger className="h-10 bg-muted/20 w-2/3">
                                                <SelectValue placeholder="Select interval" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="weekly">Week(s)</SelectItem>
                                                <SelectItem value="monthly">Month(s)</SelectItem>
                                                <SelectItem value="yearly">Year(s)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-4 md:col-span-2">
                                    <Label className="text-xs font-bold text-muted-foreground">Billing Cycles <span className="text-rose-500">*</span></Label>
                                    <RadioGroup
                                        value={formData.billingCyclesAutoRenew ? 'auto_renew' : 'fixed_cycles'}
                                        onValueChange={(val) => handleSelectChange('billingCyclesAutoRenew', val === 'auto_renew')}
                                        className="flex flex-col gap-3"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="auto_renew" id="auto_renew" />
                                            <Label htmlFor="auto_renew" className="text-sm font-normal cursor-pointer">Auto-renews until cancelled</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="fixed_cycles" id="fixed_cycles" />
                                            <Label htmlFor="fixed_cycles" className="text-sm font-normal cursor-pointer flex items-center gap-2">
                                                Expires after
                                                <Input
                                                    name="billingCyclesCount"
                                                    type="number"
                                                    min="1"
                                                    value={formData.billingCyclesCount}
                                                    onChange={handleChange}
                                                    disabled={formData.billingCyclesAutoRenew}
                                                    className="w-20 h-8"
                                                />
                                                billing cycles
                                            </Label>
                                        </div>
                                    </RadioGroup>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="freeTrialDays" className="text-xs font-bold text-muted-foreground">Free Trial (Days)</Label>
                                    <Input
                                        id="freeTrialDays"
                                        name="freeTrialDays"
                                        type="number"
                                        min="0"
                                        value={formData.freeTrialDays}
                                        onChange={handleChange}
                                        className="h-10 bg-muted/20"
                                    />
                                    <p className="text-[10px] text-muted-foreground">Set 0 for no trial.</p>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="setupFee" className="text-xs font-bold text-muted-foreground">Setup Fee (₹)</Label>
                                    <Input
                                        id="setupFee"
                                        name="setupFee"
                                        type="number"
                                        min="0"
                                        value={formData.setupFee}
                                        onChange={handleChange}
                                        className="h-10 bg-muted/20"
                                    />
                                    <p className="text-[10px] text-muted-foreground">A one-time charge added to the first invoice.</p>
                                </div>
                            </div>
                        </div>

                        {/* TAX */}
                        <div className="space-y-6">
                            <h3 className="text-sm font-black text-foreground uppercase tracking-widest border-b border-border/30 pb-2">Tax</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <Label className="text-xs font-bold text-muted-foreground">Tax Treatment</Label>
                                    <RadioGroup
                                        value={formData.taxLiability}
                                        onValueChange={(val) => handleSelectChange('taxLiability', val)}
                                        className="flex gap-6"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="Taxable" id="taxable" />
                                            <Label htmlFor="taxable" className="text-sm font-normal cursor-pointer">Taxable</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="Non-Taxable" id="non_taxable" />
                                            <Label htmlFor="non_taxable" className="text-sm font-normal cursor-pointer">Non-Taxable</Label>
                                        </div>
                                    </RadioGroup>
                                </div>

                                {formData.taxLiability === 'Taxable' && (
                                    <>
                                        <div className="space-y-2">
                                            <Label htmlFor="gstRate" className="text-xs font-bold text-muted-foreground">GST Rate (%)</Label>
                                            <Select value={formData.gstRate?.toString()} onValueChange={(val) => handleSelectChange('gstRate', parseInt(val))}>
                                                <SelectTrigger id="gstRate" className="h-10 bg-muted/20">
                                                    <SelectValue placeholder="Select GST Rate" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="0">0%</SelectItem>
                                                    <SelectItem value="5">5%</SelectItem>
                                                    <SelectItem value="12">12%</SelectItem>
                                                    <SelectItem value="18">18%</SelectItem>
                                                    <SelectItem value="28">28%</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="hsnSacCode" className="text-xs font-bold text-muted-foreground">HSN/SAC Code</Label>
                                            <Input
                                                id="hsnSacCode"
                                                name="hsnSacCode"
                                                value={formData.hsnSacCode || ''}
                                                onChange={handleChange}
                                                placeholder="e.g. 0402"
                                                className="h-10 bg-muted/20"
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* DISPLAY */}
                        <div className="space-y-6">
                            <h3 className="text-sm font-black text-foreground uppercase tracking-widest border-b border-border/30 pb-2">Display Details</h3>

                            <div className="space-y-2">
                                <Label htmlFor="description" className="text-xs font-bold text-muted-foreground">Plan Description</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    value={formData.description || ''}
                                    onChange={handleChange}
                                    placeholder="Brief description shown to customers..."
                                    className="bg-muted/20 min-h-[80px]"
                                />
                            </div>

                            <div className="flex flex-col gap-4">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="includeInWidget"
                                        checked={formData.includeInWidget}
                                        onCheckedChange={(val) => handleCheckboxChange('includeInWidget', val as boolean)}
                                    />
                                    <Label htmlFor="includeInWidget" className="text-sm font-normal cursor-pointer">Include this plan in the pricing widget / hosted payment page</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="allowCustomerSwitch"
                                        checked={formData.allowCustomerSwitch}
                                        onCheckedChange={(val) => handleCheckboxChange('allowCustomerSwitch', val as boolean)}
                                    />
                                    <Label htmlFor="allowCustomerSwitch" className="text-sm font-normal cursor-pointer">Allow customers to switch to this plan from Customer Portal</Label>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label className="text-xs font-bold text-muted-foreground">Plan Features</Label>
                                <div className="flex gap-2">
                                    <Input
                                        value={featureInput}
                                        onChange={(e) => setFeatureInput(e.target.value)}
                                        placeholder="Add a core feature (e.g., '10 API Calls/sec')"
                                        className="h-10 bg-muted/20"
                                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                                    />
                                    <Button type="button" onClick={addFeature} variant="secondary" className="h-10">Add</Button>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {formData.features?.map((f, i) => (
                                        <div key={i} className="flex items-center gap-2 px-3 py-1 bg-muted rounded-full text-xs font-medium">
                                            {f}
                                            <button type="button" onClick={() => removeFeature(i)} className="text-muted-foreground hover:text-rose-500">×</button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* ACCOUNTING */}
                        <div className="space-y-6">
                            <h3 className="text-sm font-black text-foreground uppercase tracking-widest border-b border-border/30 pb-2">Accounting</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="planAccount" className="text-xs font-bold text-muted-foreground">Plan Account</Label>
                                    <Select value={formData.planAccount} onValueChange={(val) => handleSelectChange('planAccount', val)}>
                                        <SelectTrigger id="planAccount" className="h-10 bg-muted/20">
                                            <SelectValue placeholder="Select account" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Sales">Sales Account</SelectItem>
                                            <SelectItem value="Services">Services Account</SelectItem>
                                            <SelectItem value="Other">Other Revenue</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="setupFeeAccount" className="text-xs font-bold text-muted-foreground">Setup Fee Account</Label>
                                    <Select value={formData.setupFeeAccount} onValueChange={(val) => handleSelectChange('setupFeeAccount', val)}>
                                        <SelectTrigger id="setupFeeAccount" className="h-10 bg-muted/20">
                                            <SelectValue placeholder="Select account" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Sales">Sales Account</SelectItem>
                                            <SelectItem value="Services">Services Account</SelectItem>
                                            <SelectItem value="Other">Other Revenue</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                    </div>

                    <DialogFooter className="p-6 border-t border-border/50 bg-muted/10">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => onOpenChange(false)}
                            className="font-bold"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="font-bold bg-primary text-primary-foreground"
                            disabled={!formData.name || !formData.planCode || formData.price === undefined || formData.price < 0}
                        >
                            {plan ? 'Update Plan' : 'Save Plan'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}