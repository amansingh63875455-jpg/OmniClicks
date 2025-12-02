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

    // Determine category color (light mode)
    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'news': return 'bg-blue-100 text-blue-700 border-blue-300';
            case 'history': return 'bg-amber-100 text-amber-700 border-amber-300';
            case 'hackathon': return 'bg-purple-100 text-purple-700 border-purple-300';
            case 'research': return 'bg-emerald-100 text-emerald-700 border-emerald-300';
            case 'job': return 'bg-pink-100 text-pink-700 border-pink-300';
            case 'terminology': return 'bg-cyan-100 text-cyan-700 border-cyan-300';
            default: return 'bg-slate-100 text-slate-700 border-slate-300';
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
        <article className="h-full w-full flex items-center justify-center p-4 md:p-8 snap-start shrink-0 relative overflow-hidden">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "NewsArticle",
                        "headline": item.title,
                        "datePublished": item.pubDate,
                        "author": [{ "@type": "Organization", "name": item.source }],
                        "description": item.contentSnippet
                    })
                }}
            />
            <div className={`relative z-10 w-full max-w-3xl flex flex-col gap-6 transition-all duration-700 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-50 translate-y-8'}`}>

                {/* Header: Source & Date */}
                <header className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(item.category)}`}>
                            {item.category.toUpperCase()}
                        </span>
                        <span className="text-slate-700 text-sm font-medium">{item.source}</span>
                    </div>
                    <div className="flex items-center text-slate-600 text-xs">
                        <Calendar className="w-3 h-3 mr-1.5" />
                        <time dateTime={item.pubDate}>{dateStr}</time>
                    </div>
                </header>

                {/* Title */}
                <h1 className="text-2xl md:text-4xl lg:text-5xl font-serif font-bold text-slate-900 leading-tight tracking-tight">
                    {item.title}
                </h1>

                {/* Content / Summary */}
                <div className="prose prose-slate prose-lg max-w-none">
                    <p className="text-slate-700 leading-relaxed text-lg md:text-xl font-light">
                        {item.contentSnippet}
                    </p>
                </div>

                {/* Footer: Actions */}
                <footer className="pt-6 flex items-center justify-between border-t border-slate-300 mt-4">
                    <button
                        onClick={handleShare}
                        className="p-2 rounded-full hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors relative group"
                        title="Share"
                    >
                        {hasCopied ? <Check className="w-5 h-5 text-green-600" /> : <Share2 className="w-5 h-5" />}
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
                        className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white hover:bg-slate-800 font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        {item.category === 'research' ? 'Read Paper' :
                            item.category === 'hackathon' ? 'Apply Now' :
                                item.category === 'job' ? 'View Job' :
                                    item.category === 'terminology' ? 'Learn More' : 'Read Full Story'}
                        <ExternalLink className="w-4 h-4" />
                    </a>
                </footer>
            </div>
        </article>
    );
}
