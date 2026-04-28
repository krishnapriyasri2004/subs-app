"use client";

import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import Step1Industry from "./step1-industry";
import Step2OrgDetails from "./step2-org-details";
import Step3FirstProduct from "./step3-first-product";
import { useRouter } from "next/navigation";

import { useVendorAuth } from "@/lib/vendor-auth";
import { useData } from "@/lib/data-context";
import { toast } from "sonner";

export interface OnboardingData {
    industry: string;
    customIndustry: string;
    orgName: string;
    country: string;
    state: string;
    logo: File | null;
    gstin: string;
    currency: string;
    fiscalYear: string;
    timeZone: string;
    language: string;
    productName: string;
    productDescription: string;
    planName: string;
    planPrice: string;
    planInterval: string;
}

const defaultData: OnboardingData = {
    industry: "",
    customIndustry: "",
    orgName: "",
    country: "India",
    state: "",
    logo: null,
    gstin: "",
    currency: "INR",
    fiscalYear: "Apr-Mar",
    timeZone: "IST",
    language: "English",
    productName: "",
    productDescription: "",
    planName: "",
    planPrice: "",
    planInterval: "Monthly",
};

export default function OnboardingWizard() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<OnboardingData>(defaultData);
    const { updateUser, user } = useVendorAuth();
    const { addDocument } = useData();
    const router = useRouter();

    const handleNext = () => setStep((s) => s + 1);
    const handleBack = () => setStep((s) => s - 1);

    const handleUpdateData = (newData: Partial<OnboardingData>) => {
        setFormData({ ...formData, ...newData });
    };

    const handleComplete = async () => {
        try {
            // 1. Save the gathered profile data to the user profile
            await updateUser({
                businessName: formData.orgName,
                businessType: formData.industry.toLowerCase(),
                address: `${formData.state}, ${formData.country}`,
            });

            // 2. Create the first product if provided
            if (formData.productName) {
                const industry = formData.industry.toLowerCase();
                let category = 'General';
                let type = 'other';
                let color = '#4F46E5';

                if (industry.includes('dairy') || industry.includes('milk')) {
                    category = 'Dairy';
                    type = 'milk';
                    color = '#3B82F6'; // Blue
                } else if (industry.includes('grains') || industry.includes('rice') || industry.includes('agriculture')) {
                    category = 'Grains';
                    type = 'rice';
                    color = '#F59E0B'; // Amber
                } else if (industry.includes('gym') || industry.includes('fitness') || industry.includes('membership')) {
                    category = 'Fitness';
                    type = 'gym';
                    color = '#E11D48'; // Rose
                } else if (industry.includes('water')) {
                    category = 'Supplies';
                    type = 'water';
                    color = '#0EA5E9'; // Sky
                } else if (industry.includes('food') || industry.includes('tiffin')) {
                    category = 'Food';
                    type = 'food';
                    color = '#F97316'; // Orange
                }

                const planId = `plan-${Date.now()}`;

                // Create Product
                await addDocument('products', {
                    name: formData.productName,
                    description: formData.productDescription,
                    category: category,
                    status: 'active',
                    plans: [
                        {
                            id: planId,
                            name: formData.planName,
                            price: Number(formData.planPrice),
                            interval: formData.planInterval.toLowerCase(),
                            status: 'active'
                        }
                    ]
                });

                // Create Plan as a separate entity for the Plans page
                await addDocument('plans', {
                    id: planId,
                    name: formData.planName,
                    price: Number(formData.planPrice),
                    frequency: formData.planInterval,
                    interval: formData.planInterval.toLowerCase(),
                    category: type,
                    type: type,
                    provider: formData.orgName,
                    providerType: type, // Added providerType for easier discovery
                    description: formData.productDescription || `Standard subscription for ${formData.productName}`,
                    features: ["Doorstep Delivery", "Manage via App", "Pause Anytime"],
                    color: color
                });
            }

            toast.success("Onboarding complete! Your first plan is now active.");
            router.push("/vendor/dashboard");
        } catch (error) {
            console.error("Failed to complete onboarding:", error);
            toast.error("Something went wrong while saving your details.");
        }
    };

    const calculateProgress = () => {
        return ((step - 1) / 3) * 100; // 3 steps, so progress goes 0%, 33%, 66%, 100%
    };

    return (
        <div className="w-full">
            {/* Progress Bar Header */}
            <div className="mb-8">
                <div className="flex justify-between text-sm font-medium text-slate-500 mb-2 px-1">
                    <span className={step >= 1 ? "text-indigo-600 font-bold" : ""}>Industry Type</span>
                    <span className={step >= 2 ? "text-indigo-600 font-bold" : ""}>Org Details</span>
                    <span className={step >= 3 ? "text-indigo-600 font-bold" : ""}>Create Plan</span>
                </div>
                <Progress value={step === 1 ? 33 : step === 2 ? 66 : 100} className="h-2 w-full" />
            </div>

            {/* Steps Content */}
            <div className="min-h-[400px]">
                {step === 1 && (
                    <Step1Industry
                        data={formData}
                        updateData={handleUpdateData}
                        onNext={handleNext}
                    />
                )}
                {step === 2 && (
                    <Step2OrgDetails
                        data={formData}
                        updateData={handleUpdateData}
                        onNext={handleNext}
                        onBack={handleBack}
                    />
                )}
                {step === 3 && (
                    <Step3FirstProduct
                        data={formData}
                        updateData={handleUpdateData}
                        onComplete={handleComplete}
                        onBack={handleBack}
                    />
                )}
            </div>
        </div>
    );
}