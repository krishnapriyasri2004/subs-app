"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Droplets,
    Wheat,
    ShoppingCart,
    Waves,
    UtensilsCrossed,
    Newspaper,
    Code,
    Users,
    GraduationCap,
    Boxes,
} from "lucide-react";

import { OnboardingData } from "./onboarding-wizard";

interface Step1Props {
    data: OnboardingData;
    updateData: (data: Partial<OnboardingData>) => void;
    onNext: () => void;
}

const industries = [
    { id: "dairy", label: "Dairy / Milk", icon: Droplets },
    { id: "grains", label: "Rice / Grains", icon: Wheat },
    { id: "grocery", label: "Grocery", icon: ShoppingCart },
    { id: "water", label: "Water Supply", icon: Waves },
    { id: "tiffin", label: "Tiffin / Food Service", icon: UtensilsCrossed },
    { id: "newspaper", label: "Newspaper", icon: Newspaper },
    { id: "saas", label: "SaaS / Software", icon: Code },
    { id: "membership", label: "Membership", icon: Users },
    { id: "education", label: "Education", icon: GraduationCap },
    { id: "other", label: "Other", icon: Boxes },
];

export default function Step1Industry({ data, updateData, onNext }: Step1Props) {
    const [selected, setSelected] = useState<string>(data.industry);
    const [customText, setCustomText] = useState<string>(data.customIndustry);

    const handleContinue = () => {
        updateData({
            industry: selected,
            customIndustry: selected === "other" ? customText : "",
        });
        onNext();
    };

    const isContinueEnabled =
        selected && (selected !== "other" || customText.trim().length > 0);

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 ease-in-out">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">What's your industry?</h2>
                <p className="text-slate-500 mt-1">
                    Select the option that best describes your business to help us tailor your experience.
                </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {industries.map((ind) => {
                    const Icon = ind.icon;
                    const isSelected = selected === ind.id;

                    return (
                        <div
                            key={ind.id}
                            onClick={() => setSelected(ind.id)}
                            className={`relative flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all cursor-pointer hover:shadow-md
                ${isSelected
                                    ? "border-indigo-600 bg-indigo-50/50 shadow-sm"
                                    : "border-slate-100 bg-white hover:border-slate-200"
                                }
              `}
                        >
                            <div
                                className={`p-3 rounded-full mb-3 transition-colors ${isSelected ? "bg-indigo-100 text-indigo-600" : "bg-slate-50 text-slate-500"
                                    }`}
                            >
                                <Icon size={28} strokeWidth={1.5} />
                            </div>
                            <span
                                className={`text-sm font-medium text-center ${isSelected ? "text-indigo-900 font-semibold" : "text-slate-700"
                                    }`}
                            >
                                {ind.label}
                            </span>
                        </div>
                    );
                })}
            </div>

            {selected === "other" && (
                <div className="mt-8 animate-in slide-in-from-top-2 fade-in duration-300">
                    <label htmlFor="custom-industry" className="block text-sm font-medium text-slate-700 mb-2">
                        Please specify your industry
                    </label>
                    <Input
                        id="custom-industry"
                        placeholder="e.g. Pet Care Services"
                        value={customText}
                        onChange={(e) => setCustomText(e.target.value)}
                        className="max-w-md h-12 text-base border-slate-300 focus:border-indigo-500 focus:ring-indigo-500"
                        autoFocus
                    />
                </div>
            )}

            <div className="mt-10 flex justify-end border-t border-slate-100 pt-6">
                <Button
                    onClick={handleContinue}
                    disabled={!isContinueEnabled}
                    className="h-12 px-8 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm font-medium text-base rounded-lg transition-all"
                >
                    Continue to Organization
                </Button>
            </div>
        </div>
    );
}