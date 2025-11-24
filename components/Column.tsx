import React from 'react';
import { NewsItem } from '@/lib/rss';
import NewsCard from './NewsCard';

interface ColumnProps {
    title: string;
    items: NewsItem[];
    icon?: React.ReactNode;
}

export default function Column({ title, items, icon }: ColumnProps) {
    return (
        <div className="flex flex-col h-full bg-slate-950/30 rounded-2xl p-4 border border-slate-800/50">
            <div className="flex items-center mb-6 pb-4 border-b border-slate-800">
                {icon && <div className="mr-3 text-blue-400">{icon}</div>}
                <h2 className="text-xl font-bold text-slate-100">{title}</h2>
                <span className="ml-auto text-xs font-mono text-slate-500 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                    {items.length}
                </span>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-4 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent custom-scrollbar">
                {items.map((item, i) => (
                    <NewsCard key={i} item={item} />
                ))}
                {items.length === 0 && (
                    <div className="text-center py-10 text-slate-600 italic">
                        No items found
                    </div>
                )}
            </div>
        </div>
    );
}
