import OnboardingWizard from "@/components/onboarding/onboarding-wizard";

export default function OnboardingPage() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-3xl">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
                    Welcome to your new workspace
                </h2>
                <p className="mt-2 text-center text-sm text-slate-600">
                    Let's get your organization set up in just a few steps.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-3xl">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <OnboardingWizard />
                </div>
            </div>
        </div>
    );
}