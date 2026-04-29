'use client';

import React, { Component, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

export class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean, error: any }> {
    constructor(props: any) {
        super(props);
        this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(error: any) { return { hasError: true, error }; }

    componentDidCatch(error: any, errorInfo: any) {
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-slate-900 p-8 text-center font-sans">
                    <div className="max-w-xl w-full bg-white rounded-3xl p-10 shadow-2xl space-y-6 border border-red-100">
                        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto">
                            <AlertTriangle className="w-10 h-10 text-red-500" />
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">App Crash Detected</h1>
                        <p className="text-slate-500 font-medium leading-relaxed">
                            We encountered a runtime error that prevented the page from loading. This usually happens due to a data mismatch.
                        </p>
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-left overflow-auto max-h-[300px]">
                            <code className="text-xs font-mono text-red-600 block whitespace-pre-wrap">
                                {this.state.error?.toString()}
                                {"\n\nStack Trace:\n"}
                                {this.state.error?.stack}
                            </code>
                        </div>
                        <button
                            onClick={() => {
                                localStorage.clear(); // Clear potentially corrupt data
                                window.location.reload();
                            }}
                            className="w-full h-14 bg-slate-900 hover:bg-black text-white font-black rounded-2xl transition-all shadow-xl shadow-slate-200"
                        >
                            Reset Data & Reload
                        </button>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}