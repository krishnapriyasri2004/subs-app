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
    const accentColor = 'text-blue-500';

    return (
        <div className={cn("flex items-center gap-3 group relative", className)}>
            <div className="relative">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-blue-500/30 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute -inset-1 bg-blue-500/20 blur-md rounded-lg" />

                <div
                    className="relative flex items-center justify-center bg-blue-600 rounded-lg shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                    style={{ width: size, height: size }}
                >
                    <span className="text-white font-black leading-none" style={{ fontSize: size * 0.6 }}>
                        S
                    </span>
                </div>
            </div>
            {showText && (
                <span
                    className={cn("font-bold tracking-tight", textColor)}
                    style={{ fontSize: size * 0.75 }}
                >
                    Subtrack<span className={accentColor}>.</span>
                </span>
            )}
        </div>
    );
}