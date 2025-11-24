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

// Static history database (Month-Day) - Comprehensive fintech history
const HISTORY_DB: Record<string, { title: string; year: string; description: string }[]> = {
    '01-03': [
        { title: 'Bitcoin Genesis Block Mined', year: '2009', description: 'Satoshi Nakamoto mined the first Bitcoin block, embedding the message "The Times 03/Jan/2009 Chancellor on brink of second bailout for banks"' },
        { title: 'Apple Computer Incorporated', year: '1977', description: 'Apple Computer Company was officially incorporated, marking the beginning of personal computing revolution' }
    ],
    '09-15': [
        { title: 'Lehman Brothers Files for Bankruptcy', year: '2008', description: 'The collapse of Lehman Brothers triggered the global financial crisis, leading to major regulatory reforms' },
        { title: 'First ATM Installed in US', year: '1969', description: 'Chemical Bank installed the first ATM in the United States in Rockville Centre, New York' }
    ],
    '10-31': [
        { title: 'Bitcoin Whitepaper Published', year: '2008', description: 'Satoshi Nakamoto published the Bitcoin whitepaper titled "Bitcoin: A Peer-to-Peer Electronic Cash System"' },
        { title: 'New York Stock Exchange Crash', year: '1929', description: 'Black Tuesday marked the most devastating stock market crash in US history' }
    ],
    '11-24': [
        { title: 'PayPal Goes Public', year: '2002', description: 'PayPal Holdings Inc. completed its IPO on NASDAQ, revolutionizing online payments' },
        { title: 'First Bitcoin ATM Installed', year: '2013', description: 'The world\'s first Bitcoin ATM was installed in Vancouver, Canada' },
        { title: 'Stripe Founded', year: '2010', description: 'Patrick and John Collison founded Stripe to simplify online payment processing' },
        { title: 'Square Inc. Founded', year: '2009', description: 'Jack Dorsey and Jim McKelvey founded Square to enable mobile payments' },
        { title: 'Venmo Launched', year: '2009', description: 'Venmo was launched as a peer-to-peer payment app, later acquired by PayPal' },
        { title: 'Robinhood Founded', year: '2013', description: 'Robinhood Markets was founded to democratize finance for all' },
        { title: 'Coinbase Founded', year: '2012', description: 'Brian Armstrong and Fred Ehrsam founded Coinbase, the largest US cryptocurrency exchange' },
        { title: 'Revolut Launched', year: '2015', description: 'Revolut was launched in the UK as a digital banking alternative' },
        { title: 'Wise (TransferWise) Founded', year: '2011', description: 'Wise was founded to provide transparent international money transfers' },
        { title: 'Plaid Founded', year: '2013', description: 'Plaid was founded to connect fintech applications to users\' bank accounts' }
    ],
    '12-12': [
        { title: 'Apple IPO', year: '1980', description: 'Apple Computer went public at $22 per share, creating instant millionaires among employees' },
        { title: 'First Credit Card Introduced', year: '1950', description: 'Diners Club introduced the first modern credit card' }
    ]
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
            contentSnippet: (item.contentSnippet || item.content || '').slice(0, 800) + '...',
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
    return results.flat().sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()).slice(0, 10);
}

export async function getHackathons(): Promise<NewsItem[]> {
    const promises = FEEDS.hackathon.map(f => fetchFeed(f.url, f.source, 'hackathon'));
    const results = await Promise.all(promises);
    return results.flat().sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()).slice(0, 5);
}

export async function getJobs(): Promise<NewsItem[]> {
    const promises = FEEDS.job.map(f => fetchFeed(f.url, f.source, 'job'));
    const results = await Promise.all(promises);
    return results.flat().sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()).slice(0, 5);
}

export async function getHistory(): Promise<NewsItem[]> {
    const today = new Date();
    const key = `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const events = HISTORY_DB[key] || [
        { title: 'PayPal Goes Public', year: '2002', description: 'PayPal Holdings Inc. completed its IPO on NASDAQ, revolutionizing online payments' },
        { title: 'First Bitcoin ATM Installed', year: '2013', description: 'The world\'s first Bitcoin ATM was installed in Vancouver, Canada' },
        { title: 'Stripe Founded', year: '2010', description: 'Patrick and John Collison founded Stripe to simplify online payment processing' },
        { title: 'Square Inc. Founded', year: '2009', description: 'Jack Dorsey and Jim McKelvey founded Square to enable mobile payments' },
        { title: 'Venmo Launched', year: '2009', description: 'Venmo was launched as a peer-to-peer payment app, later acquired by PayPal' },
        { title: 'Robinhood Founded', year: '2013', description: 'Robinhood Markets was founded to democratize finance for all' },
        { title: 'Coinbase Founded', year: '2012', description: 'Brian Armstrong and Fred Ehrsam founded Coinbase, the largest US cryptocurrency exchange' },
        { title: 'Revolut Launched', year: '2015', description: 'Revolut was launched in the UK as a digital banking alternative' },
        { title: 'Wise (TransferWise) Founded', year: '2011', description: 'Wise was founded to provide transparent international money transfers' },
        { title: 'Plaid Founded', year: '2013', description: 'Plaid was founded to connect fintech applications to users\' bank accounts' }
    ];

    return events.map(e => ({
        title: e.title,
        link: 'https://en.wikipedia.org/wiki/History_of_finance',
        pubDate: new Date().toISOString(),
        contentSnippet: e.description || (e.year ? `Happened in ${e.year}` : 'Historical Event'),
        source: 'FinHistory',
        category: 'history' as const
    }) as NewsItem).slice(0, 10);
}
