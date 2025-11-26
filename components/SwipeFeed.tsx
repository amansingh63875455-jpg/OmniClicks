'use client';

import React, { useRef, useEffect, useState } from 'react';
import { NewsItem } from '@/lib/rss';
import NewsCard from './NewsCard';
import { ChevronDown } from 'lucide-react';

interface SwipeFeedProps {
    initialNews: NewsItem[];
}

export default function SwipeFeed({ initialNews }: SwipeFeedProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    // Handle scroll snap detection
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleScroll = () => {
            const index = Math.round(container.scrollTop / container.clientHeight);
            if (index !== activeIndex) {
                setActiveIndex(index);
            }
        };

        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, [activeIndex]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!containerRef.current) return;

            const height = containerRef.current.clientHeight;

            if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === ' ') {
                e.preventDefault();
                containerRef.current.scrollTo({
                    top: (activeIndex + 1) * height,
                    behavior: 'smooth'
                });
            } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                e.preventDefault();
                containerRef.current.scrollTo({
                    top: (activeIndex - 1) * height,
                    behavior: 'smooth'
                });
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [activeIndex]);

    return (
        <div className="relative h-screen w-full bg-slate-950 overflow-hidden">
            {/* Feed Container */}
            <div
                ref={containerRef}
                className="h-full w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth no-scrollbar"
                style={{ scrollSnapType: 'y mandatory' }}
            >
                {initialNews.map((item, index) => (
                    <NewsCard
                        key={`${item.source}-${index}`}
                        item={item}
                        isActive={index === activeIndex}
                    />
                ))}

                {/* End of feed message */}
                <div className="h-full w-full flex items-center justify-center snap-start bg-slate-950 text-slate-500">
                    <div className="text-center">
                        <p className="text-xl font-medium mb-2">You're all caught up!</p>
                        <p className="text-sm">Check back later for more updates.</p>
                    </div>
                </div>
            </div>

            {/* Floating Navigation Hint (only on first item) */}
            {activeIndex === 0 && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-slate-500 pointer-events-none z-50">
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-xs uppercase tracking-widest opacity-70">Swipe Up</span>
                        <ChevronDown className="w-6 h-6" />
                    </div>
                </div>
            )}
        </div>
    );
}
