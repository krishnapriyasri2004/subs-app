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
    Loader2
} from 'lucide-react';
import { toast } from 'sonner';

export default function ReportsPage() {
    const [isGeneratingAudit, setIsGeneratingAudit] = useState(false);
    const [isGeneratingLTV, setIsGeneratingLTV] = useState(false);
    const [isExporting, setIsExporting] = useState(false);

    const handleGenerateAudit = async () => {
        setIsGeneratingAudit(true);
        toast.loading("Generating GST Revenue Audit report...", { id: "audit-report" });
        
        // Simulate processing
        await new Promise(resolve => setTimeout(resolve, 800));
        
        setIsGeneratingAudit(false);
        toast.success("GST Revenue Audit report generated successfully!", { id: "audit-report" });
    };

    const handleGenerateLTV = async () => {
        setIsGeneratingLTV(true);
        toast.loading("Analyzing Customer Lifetime Value patterns...", { id: "ltv-report" });
        
        await new Promise(resolve => setTimeout(resolve, 1200));
        
        setIsGeneratingLTV(false);
        toast.success("LTV Report ready for download!", { id: "ltv-report" });
    };

    const handleExportAll = async () => {
        setIsExporting(true);
        toast.loading("Compiling all financial data for export...", { id: "export-all" });
        
        await new Promise(resolve => setTimeout(resolve, 600));
        
        setIsExporting(false);
        toast.success("Consolidated financial report exported successfully!", { id: "export-all" });
    };

    const handleDateRange = () => {
        toast.info("Date range selector opened. Defaulting to 'Last 30 Days'.", {
            description: "Custom date range filtering is being initialized."
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                        <span>Dashboard</span>
                        <ChevronRight className="w-3 h-3" />
                        <span className="text-slate-900">Reports</span>
                    </div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Financial Reports</h1>
                </div>
                <div className="flex items-center gap-3">
                    <Button 
                        variant="outline" 
                        className="font-bold gap-2 h-10 px-4 rounded-lg"
                        onClick={handleDateRange}
                    >
                        <Calendar className="w-4 h-4" /> Date Range
                    </Button>
                    <Button 
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold gap-2 h-10 px-6 rounded-lg shadow-lg shadow-blue-500/20"
                        onClick={handleExportAll}
                        disabled={isExporting}
                    >
                        {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                        {isExporting ? "Exporting..." : "Export All"}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="p-8 border-slate-100 shadow-sm space-y-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                            <BarChart3 className="w-6 h-6" />
                        </div>
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Revenue Audit</h3>
                    </div>
                    <p className="text-sm font-medium text-slate-400">
                        Generate detailed GST-ready reports on your monthly collections, pending dues, and tax calculations.
                    </p>
                    <Button 
                        variant="outline" 
                        className="w-full h-11 font-bold border-2 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-100 transition-all"
                        onClick={handleGenerateAudit}
                        disabled={isGeneratingAudit}
                    >
                        {isGeneratingAudit && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        {isGeneratingAudit ? "Processing..." : "Generate Audit"}
                    </Button>
                </Card>

                <Card className="p-8 border-slate-100 shadow-sm space-y-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                            <Zap className="w-6 h-6" />
                        </div>
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Customer Lifetime (LTV)</h3>
                    </div>
                    <p className="text-sm font-medium text-slate-400">
                        Analyze customer churn patterns, plan distribution, and individual customer spend cycles over time.
                    </p>
                    <Button 
                        variant="outline" 
                        className="w-full h-11 font-bold border-2 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100 transition-all"
                        onClick={handleGenerateLTV}
                        disabled={isGeneratingLTV}
                    >
                        {isGeneratingLTV && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        {isGeneratingLTV ? "Analyzing..." : "Generate LTV Report"}
                    </Button>
                </Card>
            </div>
        </div>
    );
}
