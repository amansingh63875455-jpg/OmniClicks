import React from 'react';
import { NewsItem } from '@/lib/rss';
import { ExternalLink, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { truncate } from '@/utils/truncate';

export default function NewsCard({ item }: { item: NewsItem }) {
    // Safe date formatting
    let dateStr = '';
    try {
        dateStr = format(new Date(item.pubDate), 'MMM d, yyyy');
    } catch (e) {
        dateStr = item.pubDate;
    }

    return (
        <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block group relative overflow-hidden rounded-xl bg-slate-900/50 border border-slate-800 p-5 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-3">
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        {item.source}
                    </span>
                    <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors" />
                </div>

                <h3 className="text-lg font-semibold text-slate-100 mb-3 group-hover:text-blue-200 transition-colors">
                    {item.title}
                </h3>

                <p className="text-sm text-slate-400 mb-4 leading-relaxed whitespace-pre-wrap">
                    {truncate(item.contentSnippet.replace(/<[^>]*>/gm, ''), 2000)}
                </p>

                <div className="flex items-center text-xs text-slate-500">
                    <Calendar className="w-3 h-3 mr-1" />
                    {item.category === 'history' ? 'On this day' : dateStr}
                </div>
            </div>
        </a>
    );
}
