'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
    className?: string;
    size?: number;
    variant?: 'light' | 'dark';
    showText?: boolean;
}

export function Logo({ className, size = 32, variant = 'dark', showText = true }: LogoProps) {
    const textColor = variant === 'light' ? 'text-white' : 'text-slate-900';
    const accentColor = 'text-blue-600';

    return (
        <div className={cn("flex items-center gap-2 group", className)}>
            <div
                className="flex items-center justify-center bg-blue-600 rounded-lg shadow-lg shadow-blue-200"
                style={{ width: size, height: size }}
            >
                <span className="text-white font-black leading-none" style={{ fontSize: size * 0.6 }}>
                    S
                </span>
            </div>
            {showText && (
                <span
                    className={cn("font-black tracking-tight", textColor)}
                    style={{ fontSize: size * 0.75 }}
                >
                    SubScale<span className={accentColor}>.</span>
                </span>
            )}
        </div>
    );
}
