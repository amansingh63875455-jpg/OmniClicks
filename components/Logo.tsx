'use client';

import React from 'react';

export default function Logo() {
    return (
        <div className="flex flex-col items-start justify-center py-1 px-2">
            {/* Main Logo Text */}
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-slate-900 tracking-tight">
                OmniClicks
            </h1>

            {/* Subtitle with handwritten style */}
            <div className="relative mt-0.5">
                <p className="text-sm md:text-base font-['Caveat',cursive] text-blue-700 relative">
                    FinTech News
                    {/* Circle/underline effect */}
                    <svg
                        className="absolute -inset-1 w-[calc(100%+0.5rem)] h-[calc(100%+0.5rem)]"
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
