'use client';

import React, { useState } from 'react';
import { NewsItem } from '@/lib/rss';
import { ExternalLink, Calendar, Share2, Check } from 'lucide-react';
import { format } from 'date-fns';

interface NewsCardProps {
    item: NewsItem;
    isActive: boolean;
}

export default function NewsCard({ item, isActive }: NewsCardProps) {
    // Safe date formatting
    let dateStr = '';
    try {
        dateStr = format(new Date(item.pubDate), 'MMM d, yyyy • h:mm a');
    } catch (e) {
        dateStr = item.pubDate;
    }

    // Determine category color
    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'news': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            case 'history': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
            case 'hackathon': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
            case 'research': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'job': return 'bg-pink-500/10 text-pink-400 border-pink-500/20';
            case 'terminology': return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
            default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
        }
    };

    const [hasCopied, setHasCopied] = useState(false);

    const handleShare = async () => {
        const shareData = {
            title: item.title,
            text: item.contentSnippet,
            url: item.link
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(item.link);
                setHasCopied(true);
                setTimeout(() => setHasCopied(false), 2000);
            }
        } catch (err) {
            console.error('Error sharing:', err);
        }
    };

    return (
        <div className="h-full w-full flex items-center justify-center p-4 md:p-8 snap-start shrink-0 relative overflow-hidden">
            {/* Background with subtle gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 z-0" />

            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <div className={`relative z-10 w-full max-w-3xl flex flex-col gap-6 transition-all duration-700 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-50 translate-y-8'}`}>

                {/* Header: Source & Date */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(item.category)}`}>
                            {item.category.toUpperCase()}
                        </span>
                        <span className="text-slate-400 text-sm font-medium">{item.source}</span>
                    </div>
                    <div className="flex items-center text-slate-500 text-xs">
                        <Calendar className="w-3 h-3 mr-1.5" />
                        {dateStr}
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-slate-100 leading-tight tracking-tight">
                    {item.title}
                </h1>

                {/* Content / Summary */}
                <div className="prose prose-invert prose-lg max-w-none">
                    <p className="text-slate-300 leading-relaxed text-lg md:text-xl font-light">
                        {item.contentSnippet}
                    </p>
                </div>

                {/* Footer: Actions */}
                <div className="pt-6 flex items-center justify-between border-t border-slate-800/50 mt-4">
                    <button
                        onClick={handleShare}
                        className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors relative group"
                        title="Share"
                    >
                        {hasCopied ? <Check className="w-5 h-5 text-green-500" /> : <Share2 className="w-5 h-5" />}
                        {hasCopied && (
                            <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-800 text-white text-xs rounded shadow-lg whitespace-nowrap">
                                Copied!
                            </span>
                        )}
                    </button>
                    <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-900 hover:bg-white font-semibold rounded-xl transition-all shadow-lg shadow-white/5 hover:shadow-white/10 transform hover:-translate-y-0.5"
                    >
                        {item.category === 'research' ? 'Read Paper' :
                            item.category === 'hackathon' ? 'Apply Now' :
                                item.category === 'job' ? 'View Job' :
                                    item.category === 'terminology' ? 'Learn More' : 'Read Full Story'}
                        <ExternalLink className="w-4 h-4" />
                    </a>
                </div>
            </div>
        </div>
    );
}
