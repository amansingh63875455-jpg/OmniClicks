'use client';

import React, { useState, useEffect } from 'react';
import { NewsItem } from '@/lib/rss';
import { ExternalLink, Calendar, ChevronDown } from 'lucide-react';
import { format } from 'date-fns';

interface NewsFeedProps {
    initialNews: NewsItem[];
}

export default function NewsFeed({ initialNews }: NewsFeedProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const currentItem = initialNews[currentIndex];

    const handleNext = () => {
        if (currentIndex < initialNews.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                handleNext();
            } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                handlePrevious();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentIndex]);

    // Safe date formatting
    let dateStr = '';
    try {
        dateStr = format(new Date(currentItem.pubDate), 'MMM d, yyyy • h:mm a');
    } catch (e) {
        dateStr = currentItem.pubDate;
    }

    return (
        <div className="flex flex-col h-full">
            {/* Progress indicator */}
            <div className="mb-4 flex items-center gap-2">
                <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                        style={{ width: `${((currentIndex + 1) / initialNews.length) * 100}%` }}
                    />
                </div>
                <span className="text-xs font-mono text-slate-500">
                    {currentIndex + 1} / {initialNews.length}
                </span>
            </div>

            {/* Main card */}
            <div className="flex-1 flex items-center justify-center min-h-0">
                <div className="w-full max-w-2xl mx-auto">
                    <div className="relative bg-gradient-to-br from-slate-900 to-slate-950 rounded-3xl border border-slate-800 p-8 md:p-12 shadow-2xl">
                        {/* Decorative gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-3xl" />

                        <div className="relative z-10">
                            {/* Source badge */}
                            <div className="flex items-center justify-between mb-6">
                                <span className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-sm font-semibold">
                                    {currentItem.source}
                                </span>
                                <div className="flex items-center text-xs text-slate-500">
                                    <Calendar className="w-3 h-3 mr-1" />
                                    {dateStr}
                                </div>
                            </div>

                            {/* Title */}
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-100 mb-6 leading-tight">
                                {currentItem.title}
                            </h2>

                            {/* Summary */}
                            <p className="text-base md:text-lg text-slate-300 leading-relaxed mb-8 whitespace-pre-wrap">
                                {currentItem.contentSnippet.replace(/<[^>]*>/gm, '')}
                            </p>

                            {/* Read more link */}
                            <a
                                href={currentItem.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40"
                            >
                                Read Full Article
                                <ExternalLink className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Navigation hint */}
                    {currentIndex < initialNews.length - 1 && (
                        <div className="mt-6 flex flex-col items-center">
                            <button
                                onClick={handleNext}
                                className="flex flex-col items-center gap-2 text-slate-500 hover:text-blue-400 transition-colors group"
                            >
                                <span className="text-sm font-medium">Swipe or click for next story</span>
                                <ChevronDown className="w-6 h-6 animate-bounce" />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation buttons (mobile-friendly) */}
            <div className="mt-6 flex justify-center gap-4">
                <button
                    onClick={handlePrevious}
                    disabled={currentIndex === 0}
                    className="px-6 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-800 hover:text-slate-200 transition-all"
                >
                    ← Previous
                </button>
                <button
                    onClick={handleNext}
                    disabled={currentIndex === initialNews.length - 1}
                    className="px-6 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-800 hover:text-slate-200 transition-all"
                >
                    Next →
                </button>
            </div>
        </div>
    );
}
