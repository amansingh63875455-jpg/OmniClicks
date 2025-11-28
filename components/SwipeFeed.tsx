'use client';

import React, { useRef, useEffect, useState } from 'react';
import { NewsItem } from '@/lib/rss';
import NewsCard from './NewsCard';
import Logo from './Logo';
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
                containerRef.current.scrollBy({ top: height, behavior: 'smooth' });
            } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                e.preventDefault();
                containerRef.current.scrollBy({ top: -height, behavior: 'smooth' });
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div className="relative h-screen w-screen overflow-hidden">
            {/* Paper texture background */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: 'url(/paper-texture.png)' }}
            />

            {/* Logo overlay - fixed at top */}
            <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-slate-300">
                <Logo />
            </div>

            {/* Feed Container */}
            <div
                ref={containerRef}
                className="h-full w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth no-scrollbar pt-32"
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
                <div className="h-full w-full flex items-center justify-center snap-start p-4">
                    <div className="w-full max-w-2xl h-full overflow-y-auto py-10 no-scrollbar flex flex-col items-center justify-center">
                        <div className="text-center mt-8 mb-20 text-slate-700">
                            <p className="text-xl font-medium mb-2">You're all caught up!</p>
                            <p className="text-sm">Check back later for more updates.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Navigation Hint (only on first item) */}
            {activeIndex === 0 && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-slate-700 pointer-events-none z-50">
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-xs uppercase tracking-widest opacity-70">Swipe Up</span>
                        <ChevronDown className="w-6 h-6" />
                    </div>
                </div>
            )}
        </div>
    );
}
