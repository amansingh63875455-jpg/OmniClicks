import Parser from 'rss-parser';

export interface NewsItem {
    title: string;
    link: string;
    pubDate: string;
    contentSnippet: string;
    source: string;
    category: 'news' | 'history' | 'hackathon' | 'job';
}

const parser = new Parser({
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
});

const FEEDS = {
    news: [
        { url: 'https://techcrunch.com/category/fintech/feed/', source: 'TechCrunch' },
        { url: 'https://www.coindesk.com/arc/outboundfeeds/rss/', source: 'CoinDesk' },
        { url: 'https://www.finextra.com/rss/headlines.aspx', source: 'Finextra' },
        { url: 'https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=10000664', source: 'CNBC Finance' },
        { url: 'https://www.investing.com/rss/news_25.rss', source: 'Investing.com' }
    ],
    hackathon: [
        { url: 'https://dev.to/feed/tag/hackathon', source: 'Dev.to' },
        { url: 'https://medium.com/feed/tag/hackathon', source: 'Medium' }
    ],
    job: [
        { url: 'https://weworkremotely.com/categories/remote-management-and-finance-jobs.rss', source: 'WeWorkRemotely' },
        { url: 'https://remoteok.com/rss?tags=finance', source: 'RemoteOK' }
    ]
};

// Static history database (Month-Day)
const HISTORY_DB: Record<string, { title: string; year: string }[]> = {
    '01-03': [{ title: 'Bitcoin Genesis Block Mined', year: '2009' }],
    '09-15': [{ title: 'Lehman Brothers Files for Bankruptcy', year: '2008' }],
    '10-31': [{ title: 'Bitcoin Whitepaper Published', year: '2008' }],
    '12-12': [{ title: 'Apple IPO', year: '1980' }],
};

async function fetchFeed(url: string, source: string, category: NewsItem['category']): Promise<NewsItem[]> {
    console.log(`Fetching ${source} from ${url}...`);
    try {
        // Add timeout to parser
        const res = await Promise.race([
            parser.parseURL(url),
            new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))
        ]);

        console.log(`Successfully fetched ${source}: ${res.items.length} items`);
        return res.items.map(item => ({
            title: item.title || 'No Title',
            link: item.link || '#',
            pubDate: item.pubDate || new Date().toISOString(),
            contentSnippet: (item.contentSnippet || item.content || '').slice(0, 200) + '...',
            source: source,
            category: category
        }));
    } catch (e) {
        console.error(`Error fetching ${source} (${url}):`, e);
        return [];
    }
}

export async function getNews(): Promise<NewsItem[]> {
    const promises = FEEDS.news.map(f => fetchFeed(f.url, f.source, 'news'));
    const results = await Promise.all(promises);
    return results.flat().sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()).slice(0, 20);
}

export async function getHackathons(): Promise<NewsItem[]> {
    const promises = FEEDS.hackathon.map(f => fetchFeed(f.url, f.source, 'hackathon'));
    const results = await Promise.all(promises);
    return results.flat().sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()).slice(0, 10);
}

export async function getJobs(): Promise<NewsItem[]> {
    const promises = FEEDS.job.map(f => fetchFeed(f.url, f.source, 'job'));
    const results = await Promise.all(promises);
    return results.flat().sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()).slice(0, 10);
}

export async function getHistory(): Promise<NewsItem[]> {
    const today = new Date();
    const key = `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const events = HISTORY_DB[key] || [
        { title: 'No major fintech event recorded for today.', year: '' },
        { title: 'New York Stock Exchange Founded', year: '1792 (May 17)' } // Fallback trivia
    ];

    return events.map(e => ({
        title: e.title,
        link: 'https://en.wikipedia.org/wiki/History_of_finance',
        pubDate: new Date().toISOString(),
        contentSnippet: e.year ? `Happened in ${e.year}` : 'Historical Event',
        source: 'FinHistory',
        category: 'history'
    }));
}
