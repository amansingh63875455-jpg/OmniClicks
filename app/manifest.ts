import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'OmniClicks - Daily Fintech Intelligence',
        short_name: 'OmniClicks',
        description: 'Aggregated news, history, hackathons, and jobs for finance professionals.',
        start_url: '/',
        display: 'standalone',
        background_color: '#0f172a',
        theme_color: '#3b82f6',
        icons: [
            {
                src: '/favicon.ico',
                sizes: 'any',
                type: 'image/x-icon',
            },
        ],
    };
}
