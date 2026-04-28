'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useVendorAuth } from '@/lib/vendor-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { AlertCircle, CheckCircle2, ArrowLeft, Smartphone, Mail, ArrowRight } from 'lucide-react';
import { Logo } from '@/components/ui/logo';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { openWhatsApp, getWhatsAppUrl } from '@/lib/whatsapp';
function VendorAuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, signup, loginWithGoogle, loginWithMicrosoft, loginWithOTP } = useVendorAuth();

  const [isSignup, setIsSignup] = useState(false);
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
  const [otpStep, setOtpStep] = useState<'request' | 'verify'>('request');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [roleSelection, setRoleSelection] = useState<'customer' | 'vendor' | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);
  const [isRobotVerified, setIsRobotVerified] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState<string>('Both');
  const [signupPhone, setSignupPhone] = useState('');

  useEffect(() => {
    if (searchParams?.get('mode') === 'signup') {
      setIsSignup(true);
    } else {
      setIsSignup(false);
    }
  }, [searchParams]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const navigateToRoleBasedDashboard = (email: string, role?: string, isNewUser: boolean = false) => {
    if (isNewUser) {
      if (role === 'tenant_owner') {
        router.push('/onboarding');
      } else {
        router.push('/onboarding/welcome');
      }
      return;
    }

    if (email === 'super@admin.com' || role === 'super_admin') {
      router.push('/dashboard');
    } else if (email === 'customer@user.com' || role === 'customer') {
      router.push('/vendor/dashboard');
    } else {
      router.push('/vendor/dashboard');
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    console.log("Attempting login for:", email);
    toast.info("Signing you in...");

    // Safety timeout to prevent permanent "Loading" state
    const loadingTimeout = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false);
        setError("Request timed out. Please try again.");
        toast.error("Login timed out");
      }
    }, 10000);

    try {
      if (!email || !password) {
        throw new Error("Please enter both email and password");
      }
      await login(email, password);
      clearTimeout(loadingTimeout);
      console.log("Login successful, navigating...");
      toast.success("Welcome back!");
      setTimeout(() => navigateToRoleBasedDashboard(email), 300);
    } catch (err) {
      clearTimeout(loadingTimeout);
      console.error("Login component error:", err);
      const msg = err instanceof Error ? err.message : 'Login failed';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isRobotVerified && authMethod === 'email') {
      setError('Please verify that you are not a robot');
      return;
    }
    setIsLoading(true);
    setError('');

    try {
      const dbRole = roleSelection === 'vendor' ? 'tenant_owner' : 'customer';
      await signup(email, password, name, businessName, businessType, dbRole, signupPhone);
      
      // Open WhatsApp chat for the user
      if (signupPhone) {
        toast.info("Redirecting to WhatsApp...");
        const welcomeMsg = `Hello ${name}, welcome to Subtrack! We're excited to have you on board.`;
        const url = getWhatsAppUrl(signupPhone, welcomeMsg);
        
        // Use a more reliable way to open in new tab
        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      
      setTimeout(() => navigateToRoleBasedDashboard(email, dbRole, true), 300);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'microsoft') => {
    setIsLoading(true);
    setError('');
    try {
      if (provider === 'google') await loginWithGoogle();
      else await loginWithMicrosoft();

      if (isSignup) {
        const dbRole = roleSelection === 'vendor' ? 'tenant_owner' : 'customer';
        setTimeout(() => navigateToRoleBasedDashboard('', dbRole, true), 300);
      } else {
        setTimeout(() => navigateToRoleBasedDashboard(''), 300);
      }
    } catch (err) {
      console.error(`${provider} login failed:`, err);
      setError(`${provider === 'google' ? 'Google' : 'Microsoft'} login failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      setError('Please enter a valid phone number with country code (e.g. +1234567890)');
      return;
    }
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to send OTP');

      setOtpStep('verify');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const formattedPhoneValue = phone.startsWith('+91') ? phone.replace('+91', '') : phone;

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    if (val.length <= 10) {
      setPhone(`+91${val}`);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) {
      setError('Please enter the 6-digit code');
      return;
    }
    setIsLoading(true);
    setError('');

    try {
      await loginWithOTP(phone, otp);
      
      setTimeout(() => navigateToRoleBasedDashboard(''), 300);
    } catch (err: any) {
      setError(err.message || 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div suppressHydrationWarning className="min-h-screen bg-slate-50 font-sans flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px] mix-blend-multiply" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] mix-blend-multiply" />
      </div>

      <div className="max-w-[1000px] w-full bg-white/80 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-slate-900/5 flex flex-col md:flex-row min-h-[600px] relative z-10 overflow-hidden">

        {/* Left Form Section */}
        <div className="flex-1 p-8 md:p-14 flex flex-col justify-center relative">
          <div className="max-w-[400px] w-full mx-auto">

            <div className="mb-10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Logo showText={false} size={32} />
                <span className="font-bold text-2xl tracking-tight text-slate-900">Subtrack</span>
              </div>
              <button
                onClick={() => {
                  localStorage.clear();
                  window.location.href = '/vendor/auth';
                }}
                className="text-[10px] font-black text-slate-300 hover:text-rose-500 uppercase tracking-widest transition-colors"
              >
                Reset System
              </button>
            </div>

            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">
                {isSignup ? 'Create an account' : 'Welcome back'}
              </h1>
              <p className="text-slate-500 text-sm">
                {isSignup
                  ? 'Sign up to start managing your subscriptions effortlessly.'
                  : 'Enter your credentials to access your workspace.'}
              </p>
            </div>

            {error && (
              <div className="mb-6 bg-red-50/50 border border-red-100 p-4 rounded-xl flex gap-3 text-sm animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            )}

            {/* Auth Method Toggle */}
            <div className="flex p-1 bg-slate-100/80 rounded-lg mb-8">
              <button
                type="button"
                onClick={() => {
                  setAuthMethod('email');
                  setError('');
                }}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-md transition-all duration-200",
                  authMethod === 'email' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                )}
              >
                <Mail className="w-4 h-4" /> Email
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMethod('phone');
                  setError('');
                  setOtpStep('request');
                }}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-md transition-all duration-200",
                  authMethod === 'phone' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                )}
              >
                <Smartphone className="w-4 h-4" /> Phone
              </button>
            </div>

            {authMethod === 'phone' ? (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                {otpStep === 'request' ? (
                  <form onSubmit={handleSendOTP} className="space-y-5">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-900">Phone Number (India Only)</label>
                      <div className="flex gap-2">
                        <div className="w-20 flex-shrink-0">
                          <div className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm font-bold">
                            +91
                          </div>
                        </div>
                        <Input
                          type="tel"
                          value={formattedPhoneValue}
                          onChange={handlePhoneChange}
                          placeholder="98765-43210"
                          className="h-12 border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 rounded-xl bg-white/50"
                        />
                      </div>
                      <p className="text-xs text-slate-500 mt-1">We will send you a 6-digit verification code.</p>
                    </div>
                    <Button type="submit" disabled={isLoading} className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-medium hover:shadow-md hover:shadow-indigo-500/20 rounded-xl transition-all">
                      {isLoading ? 'Sending...' : 'Send Code'} <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOTP} className="space-y-6">
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-slate-900 flex justify-between items-center">
                        Enter Verification Code
                        <button type="button" onClick={() => setOtpStep('request')} className="text-indigo-600 hover:text-indigo-700 text-xs flex items-center font-semibold">
                          <ArrowLeft className="w-3 h-3 mr-1" /> Change phone
                        </button>
                      </label>
                      <div className="flex justify-center py-4">
                        <InputOTP maxLength={6} value={otp} onChange={(val) => setOtp(val)}>
                          <InputOTPGroup className="gap-2">
                            <InputOTPSlot index={0} className="w-12 h-14 text-lg border border-slate-200 rounded-lg shadow-sm" />
                            <InputOTPSlot index={1} className="w-12 h-14 text-lg border border-slate-200 rounded-lg shadow-sm" />
                            <InputOTPSlot index={2} className="w-12 h-14 text-lg border border-slate-200 rounded-lg shadow-sm" />
                            <InputOTPSlot index={3} className="w-12 h-14 text-lg border border-slate-200 rounded-lg shadow-sm" />
                            <InputOTPSlot index={4} className="w-12 h-14 text-lg border border-slate-200 rounded-lg shadow-sm" />
                            <InputOTPSlot index={5} className="w-12 h-14 text-lg border border-slate-200 rounded-lg shadow-sm" />
                          </InputOTPGroup>
                        </InputOTP>
                      </div>
                      <p className="text-xs text-center text-slate-500">Sent to <span className="font-semibold text-slate-700">{phone}</span></p>
                    </div>
                    <Button type="submit" disabled={isLoading || otp.length < 6} className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white font-medium hover:shadow-md hover:shadow-indigo-500/20 rounded-xl transition-all">
                      {isLoading ? 'Verifying...' : 'Verify & Log in'}
                    </Button>
                  </form>
                )}
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                {isSignup ? (
                  !roleSelection ? (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <h3 className="text-sm font-bold text-slate-900 tracking-tight">Select your account type</h3>
                        <p className="text-xs text-slate-500 font-medium">Choose how you plan to use Subtrack</p>
                      </div>
                      <div className="grid gap-4">
                        <div
                          onClick={() => setRoleSelection('vendor')}
                          className="flex items-start gap-4 p-4 rounded-xl border-2 border-slate-100 hover:border-indigo-500 hover:bg-indigo-50/50 cursor-pointer transition-all group"
                        >
                          <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors shrink-0">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1v1H9V7zm5 0h1v1h-1V7zm-5 4h1v1H9v-1zm5 0h1v1h-1v-1zm-3 4h2a1 1 0 011 1v4h-4v-4a1 1 0 011-1z" /></svg>
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-slate-900 mb-1">Business Vendor</h4>
                            <p className="text-xs text-slate-500 font-medium leading-relaxed">I want to manage subscriptions and deliveries (e.g. Milk, Rice vendor).</p>
                          </div>
                        </div>
                        <div
                          onClick={() => setRoleSelection('customer')}
                          className="flex items-start gap-4 p-4 rounded-xl border-2 border-slate-100 hover:border-emerald-500 hover:bg-emerald-50/50 cursor-pointer transition-all group"
                        >
                          <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors shrink-0">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-slate-900 mb-1">Customer User</h4>
                            <p className="text-xs text-slate-500 font-medium leading-relaxed">I want to subscribe to a business and manage my daily deliveries.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSignup} className="space-y-4">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md uppercase tracking-wider">
                          {roleSelection} Account
                        </span>
                        <button type="button" onClick={() => setRoleSelection(null)} className="text-xs text-slate-400 hover:text-slate-600 font-semibold link">
                          Change Type
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Full Name</label>
                          <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="John Doe"
                            required
                            className="h-11 border-slate-200 focus:ring-2 focus:ring-indigo-500/20 rounded-lg"
                          />
                        </div>
                        {roleSelection === 'vendor' && (
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Business Name</label>
                              <Input
                                value={businessName}
                                onChange={(e) => setBusinessName(e.target.value)}
                                placeholder="Acme Inc"
                                required
                                className="h-11 border-slate-200 focus:ring-2 focus:ring-indigo-500/20 rounded-lg"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Type</label>
                              <Input
                                value={businessType}
                                onChange={(e) => setBusinessType(e.target.value)}
                                placeholder="e.g. Milk, Rice, Water"
                                required
                                className="h-11 border-slate-200 focus:ring-2 focus:ring-indigo-500/20 rounded-lg"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Email Address</label>
                          <Input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            placeholder="name@company.com"
                            required
                            className="h-11 border-slate-200 focus:ring-2 focus:ring-indigo-500/20 rounded-lg"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">WhatsApp Number</label>
                          <Input
                            value={signupPhone}
                            onChange={(e) => setSignupPhone(e.target.value)}
                            type="tel"
                            placeholder="9876543210"
                            required
                            className="h-11 border-slate-200 focus:ring-2 focus:ring-indigo-500/20 rounded-lg"
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Password</label>
                        <Input
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          type="password"
                          placeholder="••••••••"
                          required
                          className="h-11 border-slate-200 focus:ring-2 focus:ring-indigo-500/20 rounded-lg"
                        />
                      </div>
                      <div onClick={() => setIsRobotVerified(!isRobotVerified)} className={cn(
                        "flex items-center gap-3 cursor-pointer p-3 mt-2 rounded-lg border transition-all duration-200 select-none",
                        isRobotVerified ? "border-indigo-200 bg-indigo-50/50" : "border-slate-200 bg-slate-50 hover:bg-slate-100"
                      )}>
                        <div className={cn("w-5 h-5 rounded flex items-center justify-center transition-colors", isRobotVerified ? 'bg-indigo-600' : 'border border-slate-300 bg-white')}>
                          {isRobotVerified && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                        </div>
                        <span className="text-[13px] font-medium text-slate-700">I am human</span>
                      </div>
                      <Button type="submit" disabled={isLoading} className="w-full mt-6 h-12 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-xl transition-all">
                        {isLoading ? 'Creating account...' : 'Create account'}
                      </Button>
                    </form>
                  )
                ) : (
                  <form onSubmit={handleLogin} className="space-y-5">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-900">Email Address</label>
                      <Input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        placeholder="name@company.com"
                        required
                        className="h-12 border-slate-200 focus:ring-2 focus:ring-indigo-500/20 rounded-xl"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-medium text-slate-900">Password</label>
                      </div>
                      <Input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        placeholder="••••••••"
                        required
                        className="h-12 border-slate-200 focus:ring-2 focus:ring-indigo-500/20 rounded-xl"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-12 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-bold rounded-xl transition-all shadow-lg active:scale-[0.98]"
                    >
                      {isLoading ? 'Signing in...' : 'Sign in'}
                    </button>
                  </form>
                )}
              </div>
            )}

            <div className="mt-8 flex items-center justify-center gap-4">
              <div className="h-px bg-slate-200 flex-1"></div>
              <span className="text-xs uppercase font-semibold text-slate-400 tracking-wider">Or continue with</span>
              <div className="h-px bg-slate-200 flex-1"></div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => handleSocialLogin('google')}
                disabled={isLoading}
                className="w-full h-11 rounded-xl bg-white border border-slate-200 flex items-center justify-center gap-2.5 hover:bg-slate-50 hover:border-slate-300 transition-all text-sm font-semibold text-slate-700 shadow-sm"
              >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-4 h-4" alt="Google" />
                Google
              </button>
            </div>

            <div className="mt-10 pt-6 border-t border-slate-100 flex justify-center">
              <p className="text-[13px] text-slate-500">
                {isSignup ? 'Already have an account? ' : "Don't have an account? "}
                <button
                  onClick={() => setIsSignup(!isSignup)}
                  className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline transition-all"
                >
                  {isSignup ? 'Sign in' : 'Sign up for free'}
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Right Marketing Section */}
        <div className="hidden lg:flex flex-1 bg-slate-900 relative p-12 flex-col justify-between overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}></div>
          <div className="relative z-10">
            <div className="bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 px-3 py-1 text-xs font-semibold tracking-wider uppercase rounded-full inline-block backdrop-blur-md mb-6">
              New Features Available
            </div>
            <h2 className="text-3xl font-bold text-white mb-4 leading-tight">
              Manage subscriptions like a pro.
            </h2>
            <p className="text-indigo-100/70 text-base max-w-sm leading-relaxed">
              Subtrack unifies your billing, payments, and analytics directly into one beautiful dashboard tailored for modern businesses.
            </p>
          </div>
          <div className="relative z-10 bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl max-w-md shadow-2xl">
            <div className="flex gap-1 mb-4">
              {[1, 2, 3, 4, 5].map(i => (
                <svg key={i} className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
              ))}
            </div>
            <p className="text-white font-medium leading-relaxed mb-6">
              "We migrated to Subtrack last month and our vendor tracking has never been easier."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-500/20 border border-indigo-400/50 flex items-center justify-center text-indigo-100 font-bold">
                SA
              </div>
              <div>
                <p className="text-white text-sm font-semibold">Sarah Adams</p>
                <p className="text-indigo-200/60 text-xs">Operations at Fresh Dairy</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VendorAuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 rounded-full border-2 border-slate-300 border-t-indigo-600 animate-spin"></div>
      </div>
    }>
      <VendorAuthContent />
    </Suspense>
  );
}