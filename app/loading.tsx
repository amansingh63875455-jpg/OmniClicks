import React from 'react';

export default function Loading() {
    return (
        <main className="h-screen bg-slate-950 text-slate-200 font-sans flex flex-col overflow-hidden">
            <div className="flex-1 flex flex-col max-w-[1920px] mx-auto w-full p-4 md:p-6 min-h-0">
                <header className="mb-6 flex items-center justify-between shrink-0">
                    <div>
                        <div className="h-10 w-64 bg-slate-900 rounded-lg animate-pulse mb-2"></div>
                        <div className="h-4 w-48 bg-slate-900/50 rounded animate-pulse"></div>
                    </div>
                    <div className="hidden md:block">
                        <div className="h-8 w-40 bg-slate-900 rounded-full animate-pulse"></div>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 flex-1 min-h-0">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="flex flex-col h-full bg-slate-950/30 rounded-2xl p-4 border border-slate-800/50">
                            <div className="flex items-center mb-6 pb-4 border-b border-slate-800">
                                <div className="w-6 h-6 bg-slate-900 rounded mr-3 animate-pulse"></div>
                                <div className="h-6 w-32 bg-slate-900 rounded animate-pulse"></div>
                            </div>
                            <div className="space-y-4">
                                {[...Array(5)].map((_, j) => (
                                    <div key={j} className="h-32 bg-slate-900/30 rounded-xl animate-pulse border border-slate-800/30"></div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
