"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { OnboardingData } from "./onboarding-wizard";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export function Step3FirstProduct({
    data,
    updateData,
    onBack
}: {
    data: OnboardingData;
    updateData: (d: Partial<OnboardingData>) => void;
    onBack: () => void;
}) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFinish = async () => {
        setIsSubmitting(true);
        // Simulate API call to create org and product
        await new Promise(resolve => setTimeout(resolve, 1500));
        router.push("/vendor/dashboard");
    };

    const handleSkip = async () => {
        setIsSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        router.push("/vendor/dashboard");
    };

    const isFormValid = data.productName.trim().length > 0;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h2 className="text-xl font-semibold text-slate-800">Create First Product</h2>
                <p className="text-sm text-slate-500 mt-1">Set up your first subscription product or skip to do this later.</p>
            </div>

            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 space-y-5">
                <div className="space-y-2">
                    <Label htmlFor="productName">Product Name *</Label>
                    <Input
                        id="productName"
                        value={data.productName}
                        onChange={(e) => updateData({ productName: e.target.value })}
                        placeholder="e.g. Daily Milk Delivery"
                        className="bg-white"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="productDesc">Description</Label>
                    <Textarea
                        id="productDesc"
                        value={data.productDescription}
                        onChange={(e) => updateData({ productDescription: e.target.value })}
                        placeholder="Describe what customers get with this subscription."
                        rows={2}
                        className="bg-white"
                    />
                </div>

                <div className="border-t border-slate-200 pt-5 mt-5">
                    <h3 className="text-sm font-semibold text-slate-700 mb-4">Quick Plan Setup</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="planName">Plan Name</Label>
                            <Input
                                id="planName"
                                value={data.planName}
                                onChange={(e) => updateData({ planName: e.target.value })}
                                placeholder="e.g. Basic"
                                className="bg-white"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="planPrice">Price ({data.currency})</Label>
                            <Input
                                id="planPrice"
                                type="number"
                                value={data.planPrice}
                                onChange={(e) => updateData({ planPrice: e.target.value })}
                                placeholder="0.00"
                                className="bg-white"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="planInterval">Interval</Label>
                            <Select value={data.planInterval} onValueChange={(v) => updateData({ planInterval: v })}>
                                <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Daily">Daily</SelectItem>
                                    <SelectItem value="Weekly">Weekly</SelectItem>
                                    <SelectItem value="Monthly">Monthly</SelectItem>
                                    <SelectItem value="Yearly">Yearly</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-6 flex flex-col-reverse sm:flex-row justify-between items-center gap-4">
                <div className="flex gap-4 w-full sm:w-auto">
                    <Button variant="outline" onClick={onBack} disabled={isSubmitting} className="w-full sm:w-auto">Back</Button>
                    <Button variant="ghost" onClick={handleSkip} disabled={isSubmitting} className="w-full sm:w-auto text-slate-500 hover:text-slate-700">
                        Skip for now
                    </Button>
                </div>
                <Button onClick={handleFinish} disabled={!isFormValid || isSubmitting} className="w-full sm:w-auto px-8 gap-2 bg-blue-600 hover:bg-blue-700">
                    {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                    Get Started
                </Button>
            </div>
        </div>
    );
}
