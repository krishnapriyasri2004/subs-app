'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, MapPin, Search, Check, Home, Bell, Smile, Eye, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useVendorAuth } from '@/lib/vendor-auth';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from 'sonner';

export default function AddressPage() {
    const router = useRouter();
    const { user, updateUser } = useVendorAuth();
    const [residenceType, setResidenceType] = useState('community');
    const [selectedInstructions, setSelectedInstructions] = useState<string[]>([]);
    const [isSaving, setIsSaving] = useState(false);

    const [formData, setFormData] = useState({
        flat: '',
        block: '',
        pincode: '',
        landmark: '',
        location: ''
    });

    const instructions = [
        { id: 'pet', label: 'Pet at home', icon: '🐕' },
        { id: 'door', label: 'Leave at door', icon: '🚪' },
        { id: 'bag', label: 'Place in bag', icon: '🛍️' },
        { id: 'bell', label: 'Ring the bell', icon: '🔔' },
        { id: 'security', label: 'Leave with security', icon: '👮' },
        { id: 'rack', label: 'Leave on shoe rack', icon: '👞' },
    ];

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const toggleInstruction = (id: string) => {
        setSelectedInstructions(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const isFormValid = formData.flat.trim() !== '' &&
        formData.block.trim() !== '' &&
        formData.pincode.trim() !== '' &&
        formData.landmark.trim() !== '' &&
        formData.location.trim() !== '';

    const handleSave = async () => {
        if (!isFormValid || !user) return;

        setIsSaving(true);
        try {
            // 1. Format the full address string
            const fullAddress = `${formData.flat}, ${formData.block}, ${formData.landmark}, ${formData.pincode}. (${formData.location})`;

            // 2. Determine instructions string
            const instructionsString = selectedInstructions.length > 0
                ? selectedInstructions.map(id => instructions.find(i => i.id === id)?.label).join(', ')
                : 'Leave at front door';

            // 3. Update the user profile address (this ensures the dashboard gets the update)
            await updateUser({ address: fullAddress });

            // 4. Also store in localStorage for immediate dashboard hydration
            if (typeof window !== 'undefined') {
                localStorage.setItem('new_user_address', fullAddress);
            }

            // 5. Save to customer_addresses collection for historical/delivery tracking
            await addDoc(collection(db, 'customer_addresses'), {
                customerId: user.id,
                customerName: user.name || 'Unknown Customer',
                customerEmail: user.email,
                address: fullAddress,
                timing: 'Morning 6-8am', // Default timing
                isDefault: true,
                instructions: instructionsString,
                residenceType,
                details: formData,
                createdAt: serverTimestamp()
            });

            toast.success("Address saved successfully!");
            router.push('/onboarding/subscription-type');
        } catch (error) {
            console.error("Error saving address:", error);
            toast.error("Failed to save address. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900 pb-12">
            {/* Header */}
            <div className="px-6 py-8 flex items-center gap-4">
                <button onClick={() => router.back()} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <h1 className="text-2xl font-black tracking-tight">Address</h1>
            </div>

            <div className="px-6 space-y-8 max-w-lg mx-auto">
                {/* Residence Selection */}
                <div className="space-y-4">
                    <label className="text-sm font-bold text-slate-500 tracking-wide uppercase">Select your Residence Type</label>
                    <RadioGroup value={residenceType} onValueChange={setResidenceType} className="flex flex-col gap-3">
                        <div className={cn(
                            "flex items-center space-x-3 p-4 rounded-3xl border-2 transition-all cursor-pointer",
                            residenceType === 'community' ? "border-amber-400 bg-amber-50/20" : "border-slate-100 bg-slate-50/50"
                        )}>
                            <RadioGroupItem value="community" id="community" className="w-6 h-6 border-2 border-slate-300 text-amber-500 focus:ring-amber-500" />
                            <Label htmlFor="community" className="text-lg font-bold cursor-pointer">Community/Apartment</Label>
                        </div>
                        <div className={cn(
                            "flex items-center space-x-3 p-4 rounded-3xl border-2 transition-all cursor-pointer",
                            residenceType === 'independent' ? "border-amber-400 bg-amber-50/20" : "border-slate-100 bg-slate-50/50"
                        )}>
                            <RadioGroupItem value="independent" id="independent" className="w-6 h-6 border-2 border-slate-300 text-amber-500 focus:ring-amber-500" />
                            <Label htmlFor="independent" className="text-lg font-bold cursor-pointer">Independent</Label>
                        </div>
                    </RadioGroup>
                </div>

                {/* Form Fields */}
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-500 tracking-wide">Flat No./Apartment Name/Floor <span className="text-rose-500">*</span></label>
                        <Input
                            value={formData.flat}
                            onChange={(e) => handleInputChange('flat', e.target.value)}
                            placeholder="ex. N2001, Purva Highland, 20th Floor"
                            className="h-14 bg-slate-50/30 border-slate-200 rounded-2xl px-6 text-lg focus:ring-2 focus:ring-amber-400/20"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-500 tracking-wide">Block/Tower <span className="text-rose-500">*</span></label>
                        <Input
                            value={formData.block}
                            onChange={(e) => handleInputChange('block', e.target.value)}
                            placeholder="ex. N Block"
                            className="h-14 bg-slate-50/30 border-slate-200 rounded-2xl px-6 text-lg focus:ring-2 focus:ring-amber-400/20"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-500 tracking-wide">Pincode <span className="text-rose-500">*</span></label>
                            <Input
                                value={formData.pincode}
                                onChange={(e) => handleInputChange('pincode', e.target.value)}
                                placeholder="ex. 637205"
                                className="h-14 bg-slate-50/30 border-slate-200 rounded-2xl px-6 text-lg focus:ring-2 focus:ring-amber-400/20"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-500 tracking-wide">Landmark <span className="text-rose-500">*</span></label>
                            <Input
                                value={formData.landmark}
                                onChange={(e) => handleInputChange('landmark', e.target.value)}
                                placeholder="ex. Near Holiday Village"
                                className="h-14 bg-slate-50/30 border-slate-200 rounded-2xl px-6 text-lg focus:ring-2 focus:ring-amber-400/20"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-500 tracking-wide italic">Current Location <span className="text-rose-500">*</span></label>
                        <div className="relative">
                            <Input
                                value={formData.location}
                                onChange={(e) => handleInputChange('location', e.target.value)}
                                placeholder="ex. 9WF8+XGQ, Kumaramangalam, Tamil Nadu 637205, India"
                                className="h-14 bg-slate-50/30 border-slate-200 rounded-2xl px-6 pr-12 text-lg focus:ring-2 focus:ring-amber-400/20"
                            />
                            <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
                        </div>
                    </div>
                </div>

                {/* Delivery Instructions */}
                <div className="space-y-6 pt-4">
                    <label className="text-sm font-bold text-slate-500 tracking-wide">Delivery Instructions</label>
                    <div className="grid grid-cols-3 gap-3">
                        {instructions.map((item) => (
                            <div
                                key={item.id}
                                onClick={() => toggleInstruction(item.id)}
                                className={cn(
                                    "relative aspect-square p-2 border-2 rounded-2xl flex flex-col items-center justify-center gap-1 text-center transition-all cursor-pointer group select-none",
                                    selectedInstructions.includes(item.id)
                                        ? "border-amber-400 bg-amber-50/30 shadow-sm"
                                        : "border-slate-100 bg-white hover:border-slate-200"
                                )}
                            >
                                <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">{item.icon}</div>
                                <span className="text-[10px] font-bold text-slate-800 leading-tight px-1">{item.label}</span>
                                {selectedInstructions.includes(item.id) && (
                                    <div className="absolute top-1 right-1 bg-amber-400 rounded-md p-0.5">
                                        <Check className="w-3 h-3 text-white" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer Action */}
                <div className="pt-6">
                    <Button
                        disabled={!isFormValid || isSaving}
                        onClick={handleSave}
                        className="w-full h-14 bg-black hover:bg-zinc-800 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold rounded-2xl text-lg shadow-xl transition-all"
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            'Save Address'
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}