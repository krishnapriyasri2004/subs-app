"use client";

import { Droplets, Wheat, ShoppingCart, Waves, UtensilsCrossed, Newspaper, Code, Users, GraduationCap, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OnboardingData } from "./onboarding-wizard";

const industries = [
    { id: "dairy", label: "Dairy / Milk", icon: Droplets },
    { id: "grains", label: "Rice / Grains", icon: Wheat },
    { id: "grocery", label: "Grocery", icon: ShoppingCart },
    { id: "water", label: "Water Supply", icon: Waves },
    { id: "food", label: "Tiffin / Food Service", icon: UtensilsCrossed },
    { id: "newspaper", label: "Newspaper", icon: Newspaper },
    { id: "saas", label: "SaaS / Software", icon: Code },
    { id: "membership", label: "Membership", icon: Users },
    { id: "education", label: "Education", icon: GraduationCap },
    { id: "other", label: "Other", icon: PlusCircle },
];

export function Step1Industry({
    data,
    updateData,
    onNext
}: {
    data: OnboardingData;
    updateData: (d: Partial<OnboardingData>) => void;
    onNext: () => void;
}) {
    const isSelected = (id: string) => data.industry === id;

    const handleNext = () => {
        if (data.industry) {
            // Set a default product name based on industry for step 3
            const industryObj = industries.find(i => i.id === data.industry);
            const defaultProductName = data.industry === 'other' && data.customIndustry
                ? `${data.customIndustry} Subscription`
                : industryObj ? `${industryObj.label.split('/')[0].trim()} Plan` : 'Monthly Subscription';

            if (!data.productName) updateData({ productName: defaultProductName });
            onNext();
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h2 className="text-xl font-semibold text-slate-800">What is your industry?</h2>
                <p className="text-sm text-slate-500 mt-1">Select the category that best describes your business.</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {industries.map((industry) => (
                    <button
                        key={industry.id}
                        onClick={() => updateData({ industry: industry.id })}
                        className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-blue-500
              ${isSelected(industry.id)
                                ? "border-blue-600 bg-blue-50/50 text-blue-700"
                                : "border-slate-100 bg-white text-slate-600 hover:border-slate-200 hover:bg-slate-50"
                            }`}
                    >
                        <industry.icon className={`h-8 w-8 mb-3 transition-colors ${isSelected(industry.id) ? "text-blue-600" : "text-slate-400"}`} />
                        <span className="text-sm font-medium text-center">{industry.label}</span>
                    </button>
                ))}
            </div>

            {data.industry === "other" && (
                <div className="pt-2 animate-in fade-in slide-in-from-top-2">
                    <label htmlFor="customIndustry" className="block text-sm font-medium text-slate-700 mb-1">
                        Please specify your industry
                    </label>
                    <Input
                        id="customIndustry"
                        value={data.customIndustry || ""}
                        onChange={(e) => updateData({ customIndustry: e.target.value })}
                        placeholder="e.g. Gym, Car Wash, Consulting"
                        className="max-w-md"
                    />
                </div>
            )}

            <div className="pt-6 flex justify-end">
                <Button
                    onClick={handleNext}
                    disabled={!data.industry || (data.industry === "other" && !data.customIndustry)}
                    className="px-8 bg-blue-600 hover:bg-blue-700"
                >
                    Continue
                </Button>
            </div>
        </div>
    );
}
