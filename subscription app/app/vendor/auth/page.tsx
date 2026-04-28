'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useVendorAuth } from '@/lib/vendor-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';
import { Logo } from '@/components/ui/logo';
import Link from 'next/link';

function VendorAuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, signup, loginWithGoogle, loginWithMicrosoft } = useVendorAuth();
  const [isSignup, setIsSignup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);
  const [isRobotVerified, setIsRobotVerified] = useState(false);

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

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      await login(email, password);
      const redirectPath = email === 'super@admin.com' ? '/dashboard' : '/vendor/dashboard';
      setTimeout(() => router.push(redirectPath), 300);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isRobotVerified) {
      setError('Please verify that you are not a robot');
      return;
    }
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const name = formData.get('name') as string;
    const businessName = formData.get('businessName') as string;
    const businessType = formData.get('businessType') as 'milk' | 'rice' | 'both';

    try {
      await signup(email, password, name, businessName, businessType);
      setTimeout(() => router.push('/onboarding'), 300);
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
      setTimeout(() => router.push('/vendor/dashboard'), 300);
    } catch (err) {
      setError(`${provider === 'google' ? 'Google' : 'Microsoft'} login failed`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div suppressHydrationWarning className="min-h-screen bg-[#f4f7f9] font-sans flex items-center justify-center p-4 relative overflow-hidden">

      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#d1d5db_1px,transparent_1px)] [background-size:20px_20px]"></div>
      </div>

      <div className="max-w-[900px] w-full bg-white rounded-sm shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col md:flex-row min-h-[580px] relative z-10 overflow-hidden">

        {/* Left Control Column (Form) */}
        <div className="flex-1 p-8 md:p-12 flex flex-col justify-between border-r border-slate-50">
          <div>
            <div className="mb-8 flex items-center gap-2">
              <Logo showText={false} size={28} />
              <span className="font-bold text-xl tracking-tighter text-slate-800">SubScale</span>
            </div>

            <h1 className="text-2xl font-bold text-slate-900 mb-1">
              {isSignup ? 'Sign up' : 'Sign in'}
            </h1>
            <p className="text-slate-500 text-sm mb-8">
              to access SubScale Dashboard
            </p>

            {error && (
              <div className="mb-6 bg-red-50 border border-red-100 p-3 rounded flex gap-2 items-center animate-in-fade">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <p className="text-xs text-red-600">{error}</p>
              </div>
            )}

            {isSignup ? (
              <form onSubmit={handleSignup} className="space-y-4">
                <Input name="name" type="text" placeholder="Full Name" required className="h-11 border-slate-200 focus:border-blue-500 rounded-sm" />
                <Input name="businessName" type="text" placeholder="Business Name" required className="h-11 border-slate-200 focus:border-blue-500 rounded-sm" />
                <Input name="email" type="email" placeholder="Email Address" required className="h-11 border-slate-200 focus:border-blue-500 rounded-sm" />
                <select name="businessType" className="flex h-11 w-full rounded-sm border border-slate-200 bg-white px-3 py-2 text-sm focus:border-blue-500">
                  <option value="milk">Milk Vendor</option>
                  <option value="rice">Rice Vendor</option>
                  <option value="both">Both</option>
                </select>
                <Input name="password" type="password" placeholder="Password" required className="h-11 border-slate-200 focus:border-blue-500 rounded-sm" />

                <div onClick={() => setIsRobotVerified(!isRobotVerified)} className="flex items-center gap-2 cursor-pointer p-2 border border-slate-100 rounded-sm bg-slate-50 hover:bg-white transition-colors">
                  <div className={`w-4 h-4 border rounded-sm flex items-center justify-center ${isRobotVerified ? 'bg-blue-500 border-blue-500' : 'bg-white border-slate-300'}`}>
                    {isRobotVerified && <CheckCircle2 className="w-3 h-3 text-white" />}
                  </div>
                  <span className="text-[11px] font-medium text-slate-600 uppercase tracking-tighter">I'm not a robot</span>
                </div>

                <Button type="submit" disabled={isLoading} className="w-full h-11 bg-[#1890ff] hover:bg-[#096dd9] text-white font-bold rounded-sm shadow-md transition-all">
                  {isLoading ? 'Processing...' : 'Sign up'}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleLogin} className="space-y-4">
                <Input name="email" type="email" placeholder="Email Address" required className="h-11 border-slate-200 focus:border-blue-500 rounded-sm" />
                <Input name="password" type="password" placeholder="Password" required className="h-11 border-slate-200 focus:border-blue-500 rounded-sm" />

                <Button type="submit" disabled={isLoading} className="w-full h-11 bg-[#1890ff] hover:bg-[#096dd9] text-white font-bold rounded-sm shadow-md transition-all">
                  {isLoading ? 'Processing...' : 'Next'}
                </Button>
              </form>
            )}

            <div className="mt-8">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-4">Sign in using</p>
              <div className="space-y-3">
                <button
                  onClick={() => handleSocialLogin('google')}
                  disabled={isLoading}
                  className="w-full h-11 rounded-sm bg-white border border-slate-200 flex items-center justify-center gap-3 hover:bg-slate-50 hover:shadow-sm transition-all text-sm font-semibold text-slate-700"
                >
                  <GoogleIcon className="w-5 h-5" />
                  Continue with Google account
                </button>
                <button
                  onClick={() => handleSocialLogin('microsoft')}
                  disabled={isLoading}
                  className="w-full h-11 rounded-sm bg-white border border-slate-200 flex items-center justify-center gap-3 hover:bg-slate-50 hover:shadow-sm transition-all text-sm font-semibold text-slate-700"
                >
                  <MicrosoftIcon className="w-5 h-5" />
                  Continue with Microsoft account
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <p className="text-xs text-slate-500">
              {isSignup ? 'Already have a SubScale account? ' : "Don't have a SubScale account? "}
              <button onClick={() => setIsSignup(!isSignup)} className="text-[#1890ff] font-bold hover:underline">
                {isSignup ? 'Sign in now' : 'Sign up now'}
              </button>
            </p>
          </div>
        </div>

        {/* Right Info Column (Promo) */}
        <div className="hidden md:flex flex-1 p-12 bg-white flex-col items-center justify-center text-center">
          <div className="max-w-xs space-y-6">
            <h2 className="text-xl font-bold text-slate-900 leading-tight">
              Scale your business with SubScale
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">
              Manage memberships, automate tax compliance, and track your revenue growth in real-time. Secure, reliable, and built for modern vendors.
            </p>
            <div className="pt-4">
              <Button variant="outline" className="border-blue-200 text-[#1890ff] hover:bg-blue-50 font-bold rounded-sm px-8">
                Learn more
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 text-[10px] text-slate-400 font-medium">
        © 2026 SubScale Inc. All Rights Reserved.
      </div>
    </div>
  );
}

// Better Social Icons
const GoogleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

const MicrosoftIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 23 23" xmlns="http://www.w3.org/2000/svg">
    <path fill="#f3f3f3" d="M0 0h23v23H0z" />
    <path fill="#f35325" d="M1 1h10v10H1z" />
    <path fill="#81bc06" d="M12 1h10v10H12z" />
    <path fill="#05a6f0" d="M1 12h10v10H1z" />
    <path fill="#ffba08" d="M12 12h10v10H12z" />
  </svg>
);

export default function VendorAuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#f4f7f9]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    }>
      <VendorAuthContent />
    </Suspense>
  );
}
