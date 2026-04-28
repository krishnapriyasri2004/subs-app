"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Sparkles, ArrowRight } from "lucide-react";

import { OnboardingData } from "./onboarding-wizard";

interface Step3Props {
    data: OnboardingData;
    updateData: (data: Partial<OnboardingData>) => void;
    onComplete: () => void;
    onBack: () => void;
}

const getDefaultProductName = (industry: string) => {
    switch (industry) {
        case "dairy": return "Daily Milk Delivery";
        case "grains": return "Monthly Groceries / Rice";
        case "grocery": return "Weekly Veg Basket";
        case "water": return "20L Water Can Delivery";
        case "tiffin": return "Daily Lunch Tiffin";
        case "newspaper": return "Morning Newspaper";
        case "saas": return "Basic Software License";
        case "membership": return "Annual Gym Membership";
        case "education": return "Online Course Access";
        default: return "Premium Subscription";
    }
};

export default function Step3FirstProduct({ data, updateData, onComplete, onBack }: Step3Props) {
    const [localData, setLocalData] = useState({
        productName: data.productName || getDefaultProductName(data.industry),
        productDescription: data.productDescription || "",
        planName: data.planName || "Standard Plan",
        planPrice: data.planPrice || "",
        planInterval: data.planInterval || "Monthly",
    });

    const isFormValid = localData.productName.trim().length > 0 && localData.planPrice.trim().length > 0;

    const handleFinish = () => {
        updateData(localData);
        onComplete();
    };

    const handleSkip = () => {
        // Optionally clear product data or just skip
        onComplete();
    };

    return (
        <div className="animate-in slide-in-from-right-4 fade-in duration-500">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                    Create Your First Product <Sparkles className="text-amber-500" size={24} />
                </h2>
                <p className="text-slate-500 mt-1">
                    Let's set up something you can start selling immediately. Don't worry, you can easily edit this later.
                </p>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 md:p-8 space-y-8">
                {/* Product Details Section */}
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-2">Product Information</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="productName" className="font-medium text-slate-700">Product/Service Name *</Label>
                            <Input
                                id="productName"
                                value={localData.productName}
                                onChange={(e) => setLocalData({ ...localData, productName: e.target.value })}
                                className="h-11 border-slate-300 focus:border-indigo-500 bg-white"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="productDescription" className="font-medium text-slate-700">Description (Optional)</Label>
                            <Textarea
                                id="productDescription"
                                placeholder="What exactly are you providing?"
                                value={localData.productDescription}
                                onChange={(e) => setLocalData({ ...localData, productDescription: e.target.value })}
                                className="resize-none h-11 border-slate-300 focus:border-indigo-500 bg-white"
                                rows={1}
                            />
                        </div>
                    </div>
                </div>

                {/* Pricing Plan Section */}
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-2">Quick Pricing Plan</h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="planName" className="font-medium text-slate-700">Plan Name</Label>
                            <Input
                                id="planName"
                                value={localData.planName}
                                onChange={(e) => setLocalData({ ...localData, planName: e.target.value })}
                                className="h-11 border-slate-300 focus:border-indigo-500 bg-white"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="planPrice" className="font-medium text-slate-700">Price ({data.currency}) *</Label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-medium">₹</span>
                                <Input
                                    id="planPrice"
                                    type="number"
                                    placeholder="0.00"
                                    value={localData.planPrice}
                                    onChange={(e) => setLocalData({ ...localData, planPrice: e.target.value })}
                                    className="pl-8 h-11 border-slate-300 focus:border-indigo-500 bg-white"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="font-medium text-slate-700">Billing Interval</Label>
                            <Select
                                value={localData.planInterval}
                                onValueChange={(val) => setLocalData({ ...localData, planInterval: val })}
                            >
                                <SelectTrigger className="h-11 border-slate-300 bg-white">
                                    <SelectValue />
                                </SelectTrigger>
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

            <div className="mt-8 flex items-center justify-between">
                <Button
                    variant="ghost"
                    onClick={onBack}
                    className="text-slate-600 font-medium hover:bg-slate-100"
                >
                    Back
                </Button>
                <div className="flex items-center gap-4">
                    <button
                        type="button"
                        onClick={handleSkip}
                        className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors"
                    >
                        Skip for now
                    </button>
                    <Button
                        onClick={handleFinish}
                        disabled={!isFormValid}
                        className="h-11 px-6 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm font-medium rounded-lg flex items-center gap-2"
                    >
                        Get Started <ArrowRight size={18} />
                    </Button>
                </div>
            </div>
        </div>
    );
}