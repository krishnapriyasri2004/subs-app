"use client";

import { UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { OnboardingData } from "./onboarding-wizard";
import { useState } from "react";

export function Step2OrgDetails({
    data,
    updateData,
    onNext,
    onBack
}: {
    data: OnboardingData;
    updateData: (d: Partial<OnboardingData>) => void;
    onNext: () => void;
    onBack: () => void;
}) {
    const [gstinError, setGstinError] = useState("");

    const handleGstinChange = (val: string) => {
        const uppercaseVal = val.toUpperCase();
        updateData({ gstin: uppercaseVal });

        if (uppercaseVal.length > 0 && uppercaseVal.length !== 15) {
            setGstinError("GSTIN must be exactly 15 characters");
        } else {
            setGstinError("");
        }
    };

    const isFormValid = data.orgName.trim().length > 0 && (!data.gstin || data.gstin.length === 15);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h2 className="text-xl font-semibold text-slate-800">Organization Details</h2>
                <p className="text-sm text-slate-500 mt-1">Tell us a bit about your organization.</p>
            </div>

            <div className="flex justify-center mb-6">
                <div className="border-2 border-dashed border-slate-200 rounded-full w-24 h-24 flex flex-col items-center justify-center bg-slate-50 text-slate-400 hover:bg-slate-100 hover:border-slate-300 transition-all cursor-pointer group">
                    <UploadCloud className="h-6 w-6 mb-1 group-hover:text-blue-500 transition-colors" />
                    <span className="text-[10px] uppercase font-semibold">Logo</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="orgName">Organization Name *</Label>
                    <Input
                        id="orgName"
                        value={data.orgName}
                        onChange={(e) => updateData({ orgName: e.target.value })}
                        placeholder="e.g. Acme Corp"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Select value={data.country} onValueChange={(v) => updateData({ country: v })}>
                        <SelectTrigger><SelectValue placeholder="Select Country" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="India">India</SelectItem>
                            <SelectItem value="USA">United States</SelectItem>
                            <SelectItem value="UK">United Kingdom</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Select value={data.state} onValueChange={(v) => updateData({ state: v })}>
                        <SelectTrigger><SelectValue placeholder="Select State" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="maharashtra">Maharashtra</SelectItem>
                            <SelectItem value="karnataka">Karnataka</SelectItem>
                            <SelectItem value="delhi">Delhi</SelectItem>
                            <SelectItem value="tamilnadu">Tamil Nadu</SelectItem>
                            <SelectItem value="gujarat">Gujarat</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="gstin">GSTIN</Label>
                    <Input
                        id="gstin"
                        value={data.gstin}
                        onChange={(e) => handleGstinChange(e.target.value)}
                        placeholder="22AAAAA0000A1Z5"
                        maxLength={15}
                        className={gstinError ? "border-red-500 focus-visible:ring-red-500" : ""}
                    />
                    {gstinError && <p className="text-xs text-red-500">{gstinError}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select value={data.currency} onValueChange={(v) => updateData({ currency: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="INR">INR - Indian Rupee</SelectItem>
                            <SelectItem value="USD">USD - US Dollar</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="fiscalYear">Fiscal Year</Label>
                    <Select value={data.fiscalYear} onValueChange={(v) => updateData({ fiscalYear: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="April-March">April - March</SelectItem>
                            <SelectItem value="Jan-Dec">Jan - Dec</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="timeZone">Time Zone</Label>
                    <Select value={data.timeZone} onValueChange={(v) => updateData({ timeZone: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="IST">IST</SelectItem>
                            <SelectItem value="GMT">GMT</SelectItem>
                            <SelectItem value="EST">EST</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select value={data.language} onValueChange={(v) => updateData({ language: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="English">English</SelectItem>
                            <SelectItem value="Hindi">Hindi</SelectItem>
                            <SelectItem value="Tamil">Tamil</SelectItem>
                            <SelectItem value="Telugu">Telugu</SelectItem>
                            <SelectItem value="Kannada">Kannada</SelectItem>
                            <SelectItem value="Gujarati">Gujarati</SelectItem>
                            <SelectItem value="Marathi">Marathi</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="pt-6 flex justify-between">
                <Button variant="outline" onClick={onBack}>Back</Button>
                <Button onClick={onNext} disabled={!isFormValid} className="bg-blue-600 hover:bg-blue-700">Save & Continue</Button>
            </div>
        </div>
    );
}
