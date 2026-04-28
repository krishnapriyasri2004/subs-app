'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    ChevronRight,
    BarChart3,
    Download,
    Calendar,
    Zap,
    FileSpreadsheet,
    FileText,
    TrendingUp,
    ShieldCheck
} from 'lucide-react';
import { toast } from 'sonner';

export default function ReportsPage() {
    const [generating, setGenerating] = useState<string | null>(null);

    const handleGenerate = (type: string) => {
        setGenerating(type);
        toast.loading(`Analyzing data for ${type}...`, { id: 'report' });
        
        setTimeout(() => {
            setGenerating(null);
            toast.success(`${type} generated successfully!`, {
                id: 'report',
                description: 'The report has been sent to your registered email and is available in downloads.'
            });
        }, 2000);
    };

    return (
        <div className="space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                        <span>Dashboard</span>
                        <ChevronRight className="w-3 h-3" />
                        <span className="text-slate-900">Reports</span>
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight italic">Analytics & Financials</h1>
                </div>
                <div className="flex items-center gap-3">
                    <Button 
                        variant="ghost" 
                        className="font-black text-xs uppercase tracking-widest text-slate-500 hover:bg-slate-50 h-10 px-4 rounded-xl border border-slate-100"
                        onClick={() => toast.info('Custom date range selector will be available in the next update.')}
                    >
                        <Calendar className="w-4 h-4 mr-2" /> Apr 2024 - May 2024
                    </Button>
                    <Button 
                        className="bg-slate-900 hover:bg-black text-white font-black gap-2 h-10 px-6 rounded-xl shadow-xl active:scale-95 transition-all text-xs uppercase tracking-widest"
                        onClick={() => handleGenerate('Full Workspace Export')}
                    >
                        <Download className="w-4 h-4" /> Export All
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between group hover:border-blue-200 transition-all">
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Collections</p>
                        <p className="text-2xl font-black text-slate-900 tracking-tighter">₹8,45,200</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <TrendingUp className="w-5 h-5" />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between group hover:border-emerald-200 transition-all">
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Avg. Retention</p>
                        <p className="text-2xl font-black text-slate-900 tracking-tighter">94.2%</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <ShieldCheck className="w-5 h-5" />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between group hover:border-amber-200 transition-all">
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tax Liability</p>
                        <p className="text-2xl font-black text-slate-900 tracking-tighter">₹42,100</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <FileText className="w-5 h-5" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="p-8 border-slate-100 shadow-xl shadow-slate-200/40 rounded-3xl space-y-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 rotate-12 scale-150 group-hover:rotate-0 transition-all duration-700">
                        <BarChart3 className="w-24 h-24" />
                    </div>
                    
                    <div className="flex items-center gap-3 relative z-10">
                        <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600 shadow-sm shadow-emerald-200">
                            <FileSpreadsheet className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-base font-black text-slate-900 tracking-tight uppercase tracking-widest">Revenue Audit (GST)</h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Compliance Ready</p>
                        </div>
                    </div>
                    
                    <p className="text-sm font-medium text-slate-500 leading-relaxed relative z-10">
                        Generate comprehensive financial summaries including tax calculations, discounts applied, and net collections. Perfect for filing your GST returns.
                    </p>

                    <div className="pt-4 relative z-10">
                        <Button 
                            disabled={generating === 'GST Report'}
                            onClick={() => handleGenerate('GST Report')}
                            variant="outline" 
                            className="w-full h-14 font-black border-2 border-slate-100 rounded-2xl hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all text-base shadow-sm"
                        >
                            {generating === 'GST Report' ? 'Calculating...' : 'Generate & Download Audit'}
                        </Button>
                    </div>
                </Card>

                <Card className="p-8 border-slate-100 shadow-xl shadow-slate-200/40 rounded-3xl space-y-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 rotate-12 scale-150 group-hover:rotate-0 transition-all duration-700">
                        <Zap className="w-24 h-24 text-blue-500" />
                    </div>

                    <div className="flex items-center gap-3 relative z-10">
                        <div className="p-3 rounded-2xl bg-blue-50 text-blue-600 shadow-sm shadow-blue-200">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-base font-black text-slate-900 tracking-tight uppercase tracking-widest">Growth Analytics (LTV)</h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Customer Intelligence</p>
                        </div>
                    </div>
                    
                    <p className="text-sm font-medium text-slate-500 leading-relaxed relative z-10">
                        Deep-dive into customer behavior, retention cohorts, and lifetime value across segments. Identify your most profitable product categories instantly.
                    </p>

                    <div className="pt-4 relative z-10">
                        <Button 
                            disabled={generating === 'LTV Report'}
                            onClick={() => handleGenerate('LTV Report')}
                            variant="outline" 
                            className="w-full h-14 font-black border-2 border-slate-100 rounded-2xl hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all text-base shadow-sm"
                        >
                            {generating === 'LTV Report' ? 'Segmenting...' : 'Build LTV Visualization'}
                        </Button>
                    </div>
                </Card>
            </div>

            {/* Recent Downloads Section */}
            <div className="pt-10">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 ml-1">Recent Generations</h3>
                <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50">
                            <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                                <th className="px-8 py-4">Report Name</th>
                                <th className="px-8 py-4">Period</th>
                                <th className="px-8 py-4">Status</th>
                                <th className="px-8 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {[
                                { name: 'April Monthly Audit', period: 'Apr 2024', status: 'Available' },
                                { name: 'Q1 Customer Cohorts', period: 'Jan - Mar 2024', status: 'Available' }
                            ].map((report, i) => (
                                <tr key={i} className="hover:bg-slate-50/30 transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                                <FileText className="w-4 h-4" />
                                            </div>
                                            <span className="text-sm font-bold text-slate-900">{report.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className="text-xs font-black text-slate-400 uppercase">{report.period}</span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                                            {report.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600">
                                            <Download className="w-4 h-4" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
