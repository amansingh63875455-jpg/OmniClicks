'use client';

import React, { useState } from 'react';
import { NewsItem } from '@/lib/rss';
import Column from './Column';
import { Newspaper, History, Code, Briefcase } from 'lucide-react';

interface DashboardTabsProps {
    news: NewsItem[];
    history: NewsItem[];
    hackathons: NewsItem[];
    jobs: NewsItem[];
}

type Tab = 'news' | 'history' | 'hackathons' | 'jobs';

export default function TabsContainer({ news, history, hackathons, jobs }: DashboardTabsProps) {
    const [activeTab, setActiveTab] = useState<Tab>('news');

    // Filter out future-dated news items
    const now = new Date();
    const filteredNews = news.filter(item => {
        const date = new Date(item.pubDate);
        return date <= now;
    });

    // Exclude "on this day" entries from market history
    const filteredHistory = history.filter(item => item.category !== 'history');

    // Limit counts as per requirements
    const displayedNews = filteredNews.slice(0, 10);
    const displayedHistory = filteredHistory.slice(0, 10);
    const displayedHackathons = hackathons.slice(0, 5);
    const displayedJobs = jobs.slice(0, 5);

    const tabs = [
        { id: 'news', label: 'Latest News', icon: Newspaper },
        { id: 'history', label: 'Market History', icon: History },
        { id: 'hackathons', label: 'Hackathons', icon: Code },
        { id: 'jobs', label: 'Career', icon: Briefcase },
    ] as const;

    return (
        <div className="flex flex-col h-full">
            {/* Tab Navigation */}
            <div className="flex space-x-2 mb-6 overflow-x-auto pb-2 scrollbar-hide shrink-0">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                flex items-center px-4 py-3 rounded-xl font-medium transition-all duration-200 whitespace-nowrap
                ${isActive
                                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-lg shadow-blue-500/10'
                                    : 'bg-slate-900/50 text-slate-400 border border-slate-800 hover:bg-slate-800 hover:text-slate-200'}
              `}
                        >
                            <Icon className={`w-4 h-4 mr-2 ${isActive ? 'text-blue-400' : 'text-slate-500'}`} />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Content Area */}
            <div className="flex-1 min-h-0">
                <div className={activeTab === 'news' ? 'block h-full' : 'hidden'}>
                    <Column title="Latest News" items={displayedNews} icon={<Newspaper className="w-6 h-6" />} />
                </div>
                <div className={activeTab === 'history' ? 'block h-full' : 'hidden'}>
                    <Column title="Market History" items={displayedHistory} icon={<History className="w-6 h-6" />} />
                </div>
                <div className={activeTab === 'hackathons' ? 'block h-full' : 'hidden'}>
                    <Column title="Hackathons" items={displayedHackathons} icon={<Code className="w-6 h-6" />} />
                </div>
                <div className={activeTab === 'jobs' ? 'block h-full' : 'hidden'}>
                    <Column title="Career" items={displayedJobs} icon={<Briefcase className="w-6 h-6" />} />
                </div>
            </div>
        </div>
    );
}
