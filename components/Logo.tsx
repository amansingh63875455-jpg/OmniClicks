'use client';

import React from 'react';

export default function Logo() {
    return (
        <div className="flex flex-col items-center justify-center py-4">
            {/* Main Logo Text */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-slate-900 tracking-tight">
                OmniClicks
            </h1>

            {/* Subtitle with handwritten style */}
            <div className="relative mt-2">
                <p className="text-2xl md:text-3xl font-['Caveat',cursive] text-blue-700 relative">
                    FinTech News
                    {/* Circle/underline effect */}
                    <svg
                        className="absolute -inset-2 w-[calc(100%+1rem)] h-[calc(100%+1rem)]"
                        viewBox="0 0 200 60"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <ellipse
                            cx="100"
                            cy="30"
                            rx="95"
                            ry="25"
                            stroke="currentColor"
                            strokeWidth="2"
                            fill="none"
                            className="text-blue-700"
                        />
                    </svg>
                </p>
            </div>
        </div>
    );
}
