import React from 'react';
import { Github, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="w-full border-t border-slate-800 bg-slate-950/50 backdrop-blur-sm mt-auto">
            <div className="max-w-[1920px] mx-auto px-4 md:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-sm text-slate-500">
                    © {new Date().getFullYear()} OmniClicks. All rights reserved.
                </div>

                <div className="flex items-center gap-6">
                    <a href="#" className="text-slate-500 hover:text-blue-400 transition-colors">
                        <Github className="w-5 h-5" />
                    </a>
                    <a href="#" className="text-slate-500 hover:text-blue-400 transition-colors">
                        <Twitter className="w-5 h-5" />
                    </a>
                    <a href="#" className="text-slate-500 hover:text-blue-400 transition-colors">
                        <Linkedin className="w-5 h-5" />
                    </a>
                </div>

                <div className="text-xs text-slate-600 font-mono flex items-center gap-2">
                    <span>Powered by Next.js & Vercel</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                </div>
            </div>
        </footer>
    );
}
