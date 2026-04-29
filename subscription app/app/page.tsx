'use client';

// Force hot reload

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/logo';
import {
  ArrowRight,
  ChevronRight,
  Check,
  ChevronDown,
  Settings,
  BarChart3,
  ShieldCheck,
  FileText,
  Search,
  Bell,
  HelpCircle
} from 'lucide-react';

export default function Page() {
  const router = useRouter();

  const navLinks = [
    { name: 'Product', hasDropdown: true },
    { name: 'Solutions', hasDropdown: true },
    { name: 'Pricing', hasDropdown: false },
    { name: 'Resources', hasDropdown: true },
    { name: 'Enterprise', hasDropdown: false },
  ];

  const heroFeatures = [
    "GST Ready (CGST / SGST / IGST)",
    "Multi-tenant Architecture",
    "Usage & Tiered Billing",
    "Razorpay / Stripe Integration",
    "Enterprise-grade Security"
  ];

  const features = [
    {
      title: "Automated Recurring Billing",
      desc: "Simplify your subscription lifecycle management.",
      icon: Settings,
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    {
      title: "Revenue Recognition & MRR Tracking",
      desc: "Real-time insights into your business growth.",
      icon: BarChart3,
      color: "text-indigo-600",
      bg: "bg-indigo-50"
    },
    {
      title: "GST & Tax Compliance",
      desc: "Stay compliant with automated tax calculations.",
      icon: ShieldCheck,
      color: "text-emerald-600",
      bg: "bg-emerald-50"
    },
    {
      title: "Enterprise Reporting & Analytics",
      desc: "Deep dive into your subscription performance.",
      icon: Search,
      color: "text-cyan-600",
      bg: "bg-cyan-50"
    }
  ];

  return (
    <main className="min-h-screen bg-white font-sans text-slate-900 selection:bg-blue-100 overflow-x-hidden">

      {/* Navbar */}
      <nav className="max-w-[1240px] mx-auto px-6 h-20 flex items-center justify-between relative z-50">
        <div className="flex items-center gap-10">
          <Logo size={32} />
        </div>
        <div className="flex items-center gap-6">
          <button
            onClick={() => router.push('/vendor/auth')}
            className="text-sm font-bold text-slate-700 hover:text-[#1890ff] transition-colors"
          >
            Login
          </button>
          <button
            onClick={() => router.push('/vendor/auth?mode=signup')}
            className="px-6 py-2.5 bg-[#1890ff] hover:bg-[#096dd9] text-white rounded-sm text-sm font-bold transition-all shadow-sm"
          >
            Start Free Trial
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-16 pb-24 px-6">
        {/* Soft Background Mesh */}
        <div className="absolute top-0 right-0 w-[50%] h-[100%] z-0 pointer-events-none opacity-40">
          <div className="absolute top-0 right-[-10%] w-[100%] h-[100%] bg-gradient-to-bl from-blue-100 via-indigo-50 to-transparent blur-3xl"></div>
        </div>

        <div className="max-w-[1240px] mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
          {/* Hero Content */}
          <div className="space-y-8 max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-[1.1] text-slate-900 italic">
              Subscription Billing <br />
              Built for Scale
            </h1>
            <p className="text-lg md:text-xl text-slate-500 leading-relaxed font-medium">
              Automate recurring billing, GST compliance, revenue tracking, and payment collection — all in one secure platform.
            </p>

            <ul className="space-y-3">
              {heroFeatures.map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-700 font-semibold">
                  <div className="bg-emerald-100 p-0.5 rounded-full">
                    <Check className="w-4 h-4 text-emerald-600" />
                  </div>
                  {f}
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-4 pt-4">
              <button
                onClick={() => router.push('/vendor/auth?mode=signup')}
                className="px-8 py-3.5 bg-[#1890ff] hover:bg-[#096dd9] text-white rounded-sm font-bold transition-all shadow-sm shadow-blue-500/20 active:scale-95"
              >
                Start Free Trial
              </button>
              <button
                onClick={() => router.push('/book-demo')}
                className="px-8 py-3.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 rounded-md font-bold transition-all active:scale-95"
              >
                Book a Demo
              </button>
            </div>
          </div>

          {/* Hero Visual - Dashboard Preview */}
          <div className="relative group perspective-1000 hidden lg:block">
            <div className="bg-white rounded-lg border border-slate-200 shadow-xl overflow-hidden">
              {/* Mock Dashboard Header */}
              <div className="h-14 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between px-6">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-slate-200" />
                  <div className="w-3 h-3 rounded-full bg-slate-200" />
                  <div className="w-3 h-3 rounded-full bg-slate-200" />
                </div>
                <div className="flex items-center gap-4 text-slate-400">
                  <Search className="w-4 h-4" />
                  <Bell className="w-4 h-4" />
                  <HelpCircle className="w-4 h-4" />
                  <div className="w-6 h-6 rounded-full bg-blue-500 shadow-md" />
                </div>
              </div>

              {/* Mock Dashboard Body */}
              <div className="p-8 flex gap-8 h-[450px]">
                {/* Sidebar */}
                <div className="w-40 flex flex-col gap-4 py-2 border-r border-slate-50">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className={`h-2.5 rounded-full ${i === 1 ? 'w-24 bg-blue-500' : 'w-20 bg-slate-100'}`} />
                  ))}
                </div>

                {/* Main Content */}
                <div className="flex-1 space-y-8">
                  <div className="flex justify-between items-end">
                    <div className="space-y-2">
                      <div className="h-3 w-32 bg-slate-100 rounded-full" />
                      <div className="h-8 w-48 bg-slate-900 rounded-lg" />
                    </div>
                    <div className="h-10 w-24 bg-blue-600 rounded-md shadow-lg shadow-blue-200" />
                  </div>

                  {/* Grid Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-6 bg-slate-50 rounded-xl border border-slate-100 flex flex-col gap-2">
                      <div className="h-2 w-20 bg-slate-200 rounded-full" />
                      <div className="h-6 w-32 bg-slate-800 rounded-lg" />
                    </div>
                    <div className="p-6 bg-slate-50 rounded-xl border border-slate-100 flex flex-col gap-2">
                      <div className="h-2 w-20 bg-slate-200 rounded-full" />
                      <div className="h-6 w-32 bg-slate-800 rounded-lg" />
                    </div>
                  </div>

                  {/* Charts Bar */}
                  <div className="h-32 bg-white border border-slate-100 rounded-xl p-4 flex items-end justify-between gap-1">
                    {[40, 70, 45, 90, 65, 80, 55, 100, 75, 40, 85, 60].map((h, i) => (
                      <div key={i} className="w-full bg-gradient-to-t from-blue-50 to-blue-500 rounded-t-sm" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Card */}
            <div className="absolute -bottom-6 -left-12 bg-white rounded-lg shadow-xl p-6 border border-slate-200 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                <Check className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xl font-black text-slate-900">₹1,93,450</div>
                <div className="text-xs text-slate-400 font-bold uppercase tracking-widest">Successful Collection</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Section - REMOVED per user request */}

      {/* Features Grid */}
      <section className="py-24 bg-slate-50/50">
        <div className="max-w-[1240px] mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">
              Everything You Need to Scale Subscription Revenue
            </h2>
            <div className="h-1.5 w-24 bg-blue-500 mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f, i) => (
              <div key={i} className="bg-white p-8 rounded-lg border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
                <div className={`${f.bg} ${f.color} w-14 h-14 rounded-lg flex items-center justify-center mb-6 shadow-sm`}>
                  <f.icon className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {f.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="py-12 px-6 border-t border-slate-100">
        <div className="max-w-[1240px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <Logo size={28} />
          <div className="flex gap-8 text-sm font-semibold text-slate-500">
            <Link href="/privacy" className="hover:text-slate-900">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-slate-900">Terms of Service</Link>
            <Link href="/security" className="hover:text-slate-900">Security</Link>
          </div>
          <p className="text-sm text-slate-400 font-medium whitespace-nowrap">
            © 2026 SubScale Inc. All rights reserved.
          </p>
        </div>
      </footer>

    </main>
  );
}
