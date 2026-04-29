"use client";

import { useState } from "react";
import { Step1Industry } from "./step1-industry";
import { Step2OrgDetails } from "./step2-org-details";
import { Step3FirstProduct } from "./step3-first-product";

export type OnboardingData = {
    industry: string;
    customIndustry?: string;
    orgName: string;
    country: string;
    state: string;
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
};

const initialData: OnboardingData = {
    industry: "",
    orgName: "",
    country: "India",
    state: "",
    gstin: "",
    currency: "INR",
    fiscalYear: "April-March",
    timeZone: "IST",
    language: "English",
    productName: "",
    productDescription: "",
    planName: "Basic",
    planPrice: "",
    planInterval: "Monthly",
};

export function OnboardingWizard() {
    const [currentStep, setCurrentStep] = useState(1);
    const [data, setData] = useState<OnboardingData>(initialData);

    const updateData = (newData: Partial<OnboardingData>) => {
        setData((prev) => ({ ...prev, ...newData }));
    };

    const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 3));
    const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-200/60 max-w-4xl mx-auto backdrop-blur-sm">
            {/* Progress Bar Header */}
            <div className="bg-slate-50/80 border-b border-slate-200 px-4 sm:px-8 py-6">
                <div className="flex items-center justify-between relative max-w-2xl mx-auto">
                    {/* Track background */}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[3px] bg-slate-200 -z-10 rounded-full" />

                    {/* Active track */}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-[3px] bg-blue-600 -z-10 rounded-full transition-all duration-500 ease-in-out"
                        style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
                    />

                    {[
                        { step: 1, label: "Industry Type" },
                        { step: 2, label: "Org Details" },
                        { step: 3, label: "Create Plan" },
                    ].map((s) => (
                        <div key={s.step} className="flex flex-col items-center bg-transparent z-10 px-2">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ring-4 ring-slate-50
                  ${currentStep > s.step
                                        ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                                        : currentStep === s.step
                                            ? "bg-blue-600 text-white ring-blue-100 shadow-md shadow-blue-200"
                                            : "bg-slate-200 text-slate-500"}`}
                            >
                                {currentStep > s.step ? (
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : s.step}
                            </div>
                            <span className={`mt-3 text-xs sm:text-sm font-medium transition-colors ${currentStep >= s.step ? "text-slate-900" : "text-slate-400"}`}>
                                {s.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="p-6 sm:p-10 min-h-[400px]">
                {currentStep === 1 && (
                    <Step1Industry data={data} updateData={updateData} onNext={nextStep} />
                )}
                {currentStep === 2 && (
                    <Step2OrgDetails data={data} updateData={updateData} onNext={nextStep} onBack={prevStep} />
                )}
                {currentStep === 3 && (
                    <Step3FirstProduct data={data} updateData={updateData} onBack={prevStep} />
                )}
            </div>
        </div>
    );
}
