"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ImagePlus, UploadCloud, X } from "lucide-react";

import { OnboardingData } from "./onboarding-wizard";

interface Step2Props {
    data: OnboardingData;
    updateData: (data: Partial<OnboardingData>) => void;
    onNext: () => void;
    onBack: () => void;
}

const INDIAN_STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa",
    "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
    "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
    "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
    "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi"
];

const LANGUAGES = [
    "English", "Hindi", "Tamil", "Telugu", "Kannada", "Gujarati", "Marathi", "Bengali"
];

export default function Step2OrgDetails({ data, updateData, onNext, onBack }: Step2Props) {
    const [localData, setLocalData] = useState(data);
    const [gstError, setGstError] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);

    const handleDragOver = (e: React.DragEvent) => e.preventDefault();

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelected(e.dataTransfer.files[0]);
        }
    };

    const handleFileSelected = (file: File) => {
        if (file && file.type.startsWith("image/")) {
            const url = URL.createObjectURL(file);
            setLogoPreview(url);
            setLocalData({ ...localData, logo: file });
        }
    };

    const validateGst = (val: string) => {
        if (val.length > 0 && val.length !== 15) {
            setGstError("GSTIN must be exactly 15 characters long.");
            return false;
        }
        setGstError("");
        return true;
    };

    const handleSaveAndContinue = () => {
        if (localData.gstin && !validateGst(localData.gstin)) return;

        updateData(localData);
        onNext();
    };

    const isFormValid = localData.orgName.trim().length > 0 && localData.state;

    return (
        <div className="animate-in slide-in-from-right-4 fade-in duration-500">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Organization Profile</h2>
                <p className="text-slate-500 mt-1">
                    Tell us about your business so we can configure your account properly.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {/* Left Column */}
                <div className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="orgName" className="font-semibold text-slate-700">Organization Name *</Label>
                        <Input
                            id="orgName"
                            placeholder="e.g. Acme Corporation"
                            value={localData.orgName}
                            onChange={(e) => setLocalData({ ...localData, orgName: e.target.value })}
                            className="h-11 border-slate-300 focus:border-indigo-500 focus:ring-indigo-500"
                        />
                    </div>

                    <div className="space-y-4">
                        <Label className="font-semibold text-slate-700">Business Location</Label>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Input value="India" disabled className="h-11 bg-slate-50 text-slate-500" />
                            </div>
                            <div className="space-y-2">
                                <Select
                                    value={localData.state}
                                    onValueChange={(val) => setLocalData({ ...localData, state: val })}
                                >
                                    <SelectTrigger className="h-11 border-slate-300">
                                        <SelectValue placeholder="Select State *" />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-[200px]">
                                        {INDIAN_STATES.map((state) => (
                                            <SelectItem key={state} value={state}>
                                                {state}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="gstin" className="font-semibold text-slate-700">GSTIN / Tax ID (Optional)</Label>
                        <Input
                            id="gstin"
                            placeholder="e.g. 29GGGGG1314R9Z6"
                            value={localData.gstin}
                            onChange={(e) => {
                                setLocalData({ ...localData, gstin: e.target.value.toUpperCase() });
                                if (gstError) validateGst(e.target.value);
                            }}
                            onBlur={() => validateGst(localData.gstin)}
                            className="h-11 uppercase border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 placeholder:normal-case"
                            maxLength={15}
                        />
                        {gstError && <p className="text-sm text-red-500 mt-1">{gstError}</p>}
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Logo Upload */}
                    <div className="space-y-2">
                        <Label className="font-semibold text-slate-700">Company Logo (Optional)</Label>
                        <div
                            className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-slate-50
                ${logoPreview ? "border-slate-300 hover:border-indigo-400" : "border-slate-300 hover:bg-slate-100"}
              `}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            onClick={() => !logoPreview && fileInputRef.current?.click()}
                        >
                            {logoPreview ? (
                                <div className="relative group w-24 h-24">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={logoPreview} alt="Logo preview" className="w-full h-full object-contain rounded-md bg-white border border-slate-200" />
                                    <div
                                        className="absolute -top-2 -right-2 bg-slate-800 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md z-10"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setLogoPreview(null);
                                            setLocalData({ ...localData, logo: null });
                                            if (fileInputRef.current) fileInputRef.current.value = "";
                                        }}
                                    >
                                        <X size={14} />
                                    </div>
                                </div>
                            ) : (
                                <div className="py-4 flex flex-col items-center">
                                    <div className="bg-white p-3 rounded-full shadow-sm mb-3">
                                        <ImagePlus className="text-slate-400 w-6 h-6" />
                                    </div>
                                    <p className="text-sm font-medium text-slate-700">Click or drag image to upload</p>
                                    <p className="text-xs text-slate-400 mt-1">SVG, PNG, JPG (max. 2MB)</p>
                                </div>
                            )}
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => e.target.files && handleFileSelected(e.target.files[0])}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="font-semibold text-slate-700">Currency</Label>
                            <Select value={localData.currency} disabled>
                                <SelectTrigger className="h-11 bg-slate-50 text-slate-500">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="INR">INR - Indian Rupee</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="font-semibold text-slate-700">Time Zone</Label>
                            <Select value={localData.timeZone} disabled>
                                <SelectTrigger className="h-11 bg-slate-50 text-slate-500">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="IST">(UTC+05:30) IST</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="font-semibold text-slate-700">Fiscal Year</Label>
                            <Select value={localData.fiscalYear} onValueChange={(val) => setLocalData({ ...localData, fiscalYear: val })}>
                                <SelectTrigger className="h-11 border-slate-300">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Apr-Mar">April - March</SelectItem>
                                    <SelectItem value="Jan-Dec">January - December</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="font-semibold text-slate-700">Language</Label>
                            <Select value={localData.language} onValueChange={(val) => setLocalData({ ...localData, language: val })}>
                                <SelectTrigger className="h-11 border-slate-300">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {LANGUAGES.map((lang) => (
                                        <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-10 flex items-center justify-between border-t border-slate-100 pt-6">
                <Button
                    variant="ghost"
                    onClick={onBack}
                    className="text-slate-600 font-medium"
                >
                    Back
                </Button>
                <Button
                    onClick={handleSaveAndContinue}
                    disabled={!isFormValid || !!gstError}
                    className="h-11 px-8 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm font-medium rounded-lg"
                >
                    Save & Continue
                </Button>
            </div>
        </div>
    );
}