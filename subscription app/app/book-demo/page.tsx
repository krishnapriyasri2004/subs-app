'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  ChevronRight,
  Building2,
  Globe,
  Calendar,
  Clock,
  ArrowRight,
  ShieldCheck,
  Zap,
  LayoutDashboard,
  PieChart
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Logo } from '@/components/ui/logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function BookDemoPage() {
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    workEmail: '',
    companyName: '',
    companySize: '',
    industry: '',
    phone: '',
    expectedRevenue: '',
    preferredDate: '',
    preferredTimeSlot: ''
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Save to localStorage for demo persistence
    const newRequest = {
      ...formData,
      id: `demo-local-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    const existingRequests = JSON.parse(localStorage.getItem('subscale_demo_requests') || '[]');
    localStorage.setItem('subscale_demo_requests', JSON.stringify([newRequest, ...existingRequests]));

    setIsSubmitting(false);
    setIsSubmitted(true);
    toast.success('Demo request submitted successfully!');
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-slate-50/50 font-sans selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">

      {/* Background Decoration */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-100/30 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] bg-indigo-100/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[0%] left-[20%] w-[50%] h-[30%] bg-blue-50/40 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10">
        {/* Navigation */}
        <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group transition-transform hover:-translate-x-1">
            <Logo size={28} />
          </Link>
          <Link href="/contact" className="flex items-center gap-1 text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors group">
            Contact Sales <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </nav>

        <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">

            {/* Left Column: Content */}
            <div className="space-y-10 animate-in-up">
              <div className="space-y-6">
                <Badge variant="outline" className="bg-blue-50/50 text-blue-600 border-blue-100 py-1 px-3 text-xs font-bold tracking-wide uppercase">
                  Personalized Walkthrough
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.1]">
                  Schedule a <span className="text-blue-600">Personalized</span> Demo
                </h1>
                <p className="text-xl font-bold text-slate-600 tracking-tight">
                  See How SubScale Can Automate Your Subscription Billing
                </p>
                <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-xl">
                  Our experts will walk you through GST-ready subscription billing built for Indian enterprises.
                </p>
              </div>

              <div className="space-y-5">
                {[
                  "Live product walkthrough",
                  "GST compliance demo (CGST / SGST / IGST)",
                  "Usage-based billing explanation",
                  "Revenue & MRR reporting demo",
                  "Q&A with billing specialist"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 group">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 group-hover:text-white transition-colors" />
                    </div>
                    <span className="text-slate-700 font-bold">{item}</span>
                  </div>
                ))}
              </div>

            </div>

            {/* Right Column: Form */}
            <div className="animate-in-up delay-100">
              <Card className="p-8 lg:p-10 border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.05)] bg-white/80 backdrop-blur-xl ring-1 ring-white/50 relative overflow-hidden min-h-[600px] flex items-center">
                {/* Subtle Form Accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-[100px] -z-10 transition-transform group-hover:scale-110" />

                {isSubmitted ? (
                  <div className="w-full text-center space-y-6 animate-in fade-in zoom-in duration-500">
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-3xl font-black text-slate-900">Request Received!</h2>
                      <p className="text-slate-500 font-bold">We've received your demo request and will be in touch shortly to confirm your session.</p>
                    </div>
                    <div className="pt-4 flex flex-col gap-3">
                      <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white font-black h-12 px-8 rounded-xl shadow-xl shadow-blue-200 transition-all active:scale-[0.98]">
                        <Link href="/dashboard">Go to Dashboard</Link>
                      </Button>
                      <Button asChild variant="ghost" className="text-slate-500 font-bold h-12 rounded-xl">
                        <Link href="/">Return Home</Link>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8 w-full">
                    <div>
                      <h2 className="text-2xl font-black tracking-tight text-slate-900">Request a Live Demo</h2>
                      <p className="text-slate-500 font-semibold mt-1">Speak with our product experts</p>
                    </div>

                    <form onSubmit={handleSubmit} className="grid gap-6">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="full-name" className="text-xs font-black uppercase tracking-widest text-slate-400">Full Name</Label>
                          <Input
                            required
                            id="full-name"
                            placeholder="John Doe"
                            className="bg-slate-50/50 border-slate-200 h-11 font-medium"
                            value={formData.fullName}
                            onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="work-email" className="text-xs font-black uppercase tracking-widest text-slate-400">Work Email</Label>
                          <Input
                            required
                            id="work-email"
                            type="email"
                            placeholder="john@company.com"
                            className="bg-slate-50/50 border-slate-200 h-11 font-medium"
                            value={formData.workEmail}
                            onChange={(e) => setFormData(prev => ({ ...prev, workEmail: e.target.value }))}
                          />
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="company-name" className="text-xs font-black uppercase tracking-widest text-slate-400">Company Name</Label>
                          <Input
                            required
                            id="company-name"
                            placeholder="Acme Inc."
                            className="bg-slate-50/50 border-slate-200 h-11 font-medium"
                            value={formData.companyName}
                            onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="company-size" className="text-xs font-black uppercase tracking-widest text-slate-400">Company Size</Label>
                          <Select
                            required
                            value={formData.companySize}
                            onValueChange={(val) => setFormData(prev => ({ ...prev, companySize: val }))}
                          >
                            <SelectTrigger id="company-size" className="bg-slate-50/50 border-slate-200 h-11 font-medium">
                              <SelectValue placeholder="Select size" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1-10">1-10 employees</SelectItem>
                              <SelectItem value="11-50">11-50 employees</SelectItem>
                              <SelectItem value="51-200">51-200 employees</SelectItem>
                              <SelectItem value="201-500">201-500 employees</SelectItem>
                              <SelectItem value="500+">500+ employees</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="industry" className="text-xs font-black uppercase tracking-widest text-slate-400">Industry</Label>
                          <Select
                            required
                            value={formData.industry}
                            onValueChange={(val) => setFormData(prev => ({ ...prev, industry: val }))}
                          >
                            <SelectTrigger id="industry" className="bg-slate-50/50 border-slate-200 h-11 font-medium">
                              <SelectValue placeholder="Select industry" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="saas">SaaS</SelectItem>
                              <SelectItem value="ecommerce">E-commerce</SelectItem>
                              <SelectItem value="fintech">Fintech</SelectItem>
                              <SelectItem value="education">Education</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone" className="text-xs font-black uppercase tracking-widest text-slate-400">Phone Number</Label>
                          <div className="flex gap-2">
                            <div className="w-20 flex-shrink-0">
                              <div className="flex h-11 w-full items-center justify-center gap-2 rounded-md border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm font-bold">
                                🇮🇳 +91
                              </div>
                            </div>
                            <Input
                              required
                              id="phone"
                              placeholder="98765-43210"
                              className="bg-slate-50/50 border-slate-200 h-11 font-medium"
                              value={formData.phone}
                              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="revenue" className="text-xs font-black uppercase tracking-widest text-slate-400">Expected Monthly Revenue</Label>
                        <Select
                          required
                          value={formData.expectedRevenue}
                          onValueChange={(val) => setFormData(prev => ({ ...prev, expectedRevenue: val }))}
                        >
                          <SelectTrigger id="revenue" className="bg-slate-50/50 border-slate-200 h-11 font-medium">
                            <SelectValue placeholder="Select revenue range" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="<1-lakh">Less than ₹1 Lakh</SelectItem>
                            <SelectItem value="1-5-lakh">₹1 - ₹5 Lakh</SelectItem>
                            <SelectItem value="5-10-lakh">₹5 - ₹10 Lakh</SelectItem>
                            <SelectItem value="10-50-lakh">₹10 - ₹50 Lakh</SelectItem>
                            <SelectItem value="50-lakh+">₹50 Lakh+</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="demo-date" className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                            <Calendar className="w-3 h-3 text-blue-600" /> Preferred Date
                          </Label>
                          <Input
                            required
                            id="demo-date"
                            type="date"
                            className="bg-slate-50/50 border-slate-200 h-11 font-medium"
                            value={formData.preferredDate}
                            onChange={(e) => setFormData(prev => ({ ...prev, preferredDate: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="demo-time" className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                            <Clock className="w-3 h-3 text-blue-600" /> Preferred Time Slot
                          </Label>
                          <Select
                            required
                            value={formData.preferredTimeSlot}
                            onValueChange={(val) => setFormData(prev => ({ ...prev, preferredTimeSlot: val }))}
                          >
                            <SelectTrigger id="demo-time" className="bg-slate-50/50 border-slate-200 h-11 font-medium">
                              <SelectValue placeholder="Select slot" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="morning">Morning (10 AM - 12 PM)</SelectItem>
                              <SelectItem value="afternoon">Afternoon (2 PM - 4 PM)</SelectItem>
                              <SelectItem value="evening">Evening (4 PM - 6 PM)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-blue-600 hover:bg-slate-900 text-white font-black h-12 text-lg rounded-xl shadow-xl shadow-blue-200 transition-all active:scale-[0.98] group"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Scheduling...
                          </div>
                        ) : (
                          <>
                            Schedule My Demo
                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </Button>

                      <p className="text-center text-[11px] text-slate-400 font-bold leading-relaxed">
                        We'll never share your information with anyone else. <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
                      </p>
                    </form>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Mini-Bar */}
      <div className="border-t border-slate-200 bg-white py-8 relative z-10 font-medium">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-8">
            <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-emerald-500" /> SOC2 Compliant</span>
            <span className="flex items-center gap-2"><Globe className="w-4 h-4 text-blue-500" /> Multi-region Support</span>
            <span className="flex items-center gap-2"><PieChart className="w-4 h-4 text-indigo-500" /> Advanced Analytics</span>
          </div>
          <p>© 2026 SubScale Inc. All rights reserved.</p>
        </div>
      </div>
    </main>
  );
}
