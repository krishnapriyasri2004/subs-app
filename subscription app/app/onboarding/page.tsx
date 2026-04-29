import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Onboarding | SubscriptionPro",
    description: "Get started with setting up your subscription organization.",
};

export default function OnboardingPage() {
    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-blue-50/30">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-3">
                        Welcome to <span className="text-blue-600">SubscriptionPro</span>
                    </h1>
                    <p className="text-base text-slate-600 max-w-xl mx-auto">
                        Let's get your business set up completely. Complete these 3 quick steps to launch your vendor dashboard.
                    </p>
                </div>

                <OnboardingWizard />
            </div>
        </div>
    );
}
