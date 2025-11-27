// Component to display the curated list of free historical news sources
import React from 'react';
import { getHistoricalSources, HistoricalSource } from '@/lib/historicalSources';

export default function HistoricalSources() {
    const sources: HistoricalSource[] = getHistoricalSources();

    return (
        <section className="p-6 bg-slate-950/30 rounded-2xl border border-slate-800/50">
            <h2 className="text-2xl font-bold text-slate-100 mb-4">Free Historical News Sources</h2>
            <ul className="space-y-4">
                {sources.map((src, idx) => (
                    <li key={idx} className="border-b border-slate-800 pb-2 last:border-0 last:pb-0">
                        <a
                            href={src.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-lg font-medium text-blue-400 hover:underline"
                        >
                            {src.title}
                        </a>
                        <p className="text-sm text-slate-400 mt-1">{src.description}</p>
                    </li>
                ))}
            </ul>
        </section>
    );
}
