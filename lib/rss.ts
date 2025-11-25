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
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    },
});

const FEEDS = {
    news: [
        { url: 'https://techcrunch.com/category/fintech/feed/', source: 'TechCrunch' },
        { url: 'https://www.coindesk.com/arc/outboundfeeds/rss/', source: 'CoinDesk' },
        { url: 'https://www.finextra.com/rss/headlines.aspx', source: 'Finextra' },
        { url: 'https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=10000664', source: 'CNBC Finance' },
        { url: 'https://www.investing.com/rss/news_25.rss', source: 'Investing.com' },
    ],
    hackathon: [
        { url: 'https://dev.to/feed/tag/hackathon', source: 'Dev.to' },
        { url: 'https://medium.com/feed/tag/hackathon', source: 'Medium' },
    ],
    job: [
        { url: 'https://weworkremotely.com/categories/remote-management-and-finance-jobs.rss', source: 'WeWorkRemotely' },
        { url: 'https://remoteok.com/rss?tags=finance', source: 'RemoteOK' },
    ],
};

// Static history database (Month-Day) – comprehensive fintech milestones
const HISTORY_DB: Record<string, { title: string; year: string; description: string }[]> = {
    '01-03': [
        { title: 'Bitcoin Genesis Block Mined', year: '2009', description: 'Satoshi Nakamoto mined the first Bitcoin block, embedding the message "The Times 03/Jan/2009 Chancellor on brink of second bailout for banks"' },
        { title: 'Apple Computer Incorporated', year: '1977', description: 'Apple Computer Company was officially incorporated, marking the beginning of personal computing revolution' },
    ],
    '09-15': [
        { title: 'Lehman Brothers Files for Bankruptcy', year: '2008', description: 'The collapse of Lehman Brothers triggered the global financial crisis, leading to major regulatory reforms' },
        { title: 'First ATM Installed in US', year: '1969', description: 'Chemical Bank installed the first ATM in the United States in Rockville Centre, New York' },
    ],
    '10-31': [
        { title: 'Bitcoin Whitepaper Published', year: '2008', description: 'Satoshi Nakamoto published the Bitcoin whitepaper titled "Bitcoin: A Peer-to-Peer Electronic Cash System"' },
        { title: 'New York Stock Exchange Crash', year: '1929', description: 'Black Tuesday marked the most devastating stock market crash in US history' },
    ],
    '11-24': [
        { title: 'PayPal Goes Public', year: '2002', description: 'PayPal Holdings Inc. completed its IPO on NASDAQ, revolutionizing online payments. The company transformed how people send and receive money online, making digital payments accessible to millions worldwide.' },
        { title: 'First Bitcoin ATM Installed', year: '2013', description: "The world's first Bitcoin ATM was installed in Vancouver, Canada, marking a significant milestone in cryptocurrency adoption. This machine allowed users to exchange cash for Bitcoin instantly, bridging the gap between traditional and digital currency." },
        { title: 'Stripe Founded', year: '2010', description: 'Patrick and John Collison founded Stripe to simplify online payment processing for businesses of all sizes. The platform revolutionized e‑commerce by making it easy for developers to integrate payment systems into their websites and applications.' },
        { title: 'Square Inc. Founded', year: '2009', description: "Jack Dorsey and Jim McKelvey founded Square to enable mobile payments for small businesses. The company's card reader transformed smartphones into payment terminals, democratizing access to credit‑card processing." },
        { title: 'Venmo Launched', year: '2009', description: 'Venmo was launched as a peer‑to‑peer payment app that made splitting bills and sending money to friends as easy as sending a text message. Later acquired by PayPal, it became one of the most popular payment apps among millennials.' },
        { title: 'Robinhood Founded', year: '2013', description: 'Robinhood Markets was founded to democratize finance for all by offering commission‑free stock trading. The platform disrupted the brokerage industry and made investing accessible to a new generation of retail investors.' },
        { title: 'Coinbase Founded', year: '2012', description: 'Brian Armstrong and Fred Ehrsam founded Coinbase, which became the largest cryptocurrency exchange in the United States. The platform made buying, selling, and storing cryptocurrencies simple and secure for mainstream users.' },
        { title: 'Revolut Launched', year: '2015', description: 'Revolut was launched in the UK as a digital banking alternative offering multi‑currency accounts, cryptocurrency trading, and budgeting tools. The fintech unicorn expanded rapidly across Europe and beyond.' },
        { title: 'Wise (TransferWise) Founded', year: '2011', description: 'Wise was founded to provide transparent international money transfers at the real exchange rate. The company disrupted traditional banks by offering significantly lower fees for cross‑border payments.' },
        { title: 'Plaid Founded', year: '2013', description: "Plaid was founded to connect fintech applications to users' bank accounts securely. The company's API infrastructure powers thousands of financial apps, enabling seamless data sharing between banks and third‑party services." },
    ],
    '12-12': [
        { title: 'Apple IPO', year: '1980', description: 'Apple Computer went public at $22 per share, creating instant millionaires among employees and early investors. The IPO was one of the most successful in history at the time.' },
        { title: 'First Credit Card Introduced', year: '1950', description: 'Diners Club introduced the first modern credit card, revolutionizing how people pay for goods and services' },
    ],
};

/**
 * Fetch a feed and normalize each item.
 * - Pull the richest content field available.
 * - Strip HTML entities.
 * - Limit to 2000 characters for a detailed snippet.
 * - Ensure pubDate is not in the future; fallback to now.
 */
async function fetchFeed(url: string, source: string, category: NewsItem['category']): Promise<NewsItem[]> {
    console.log(`Fetching ${source} from ${url}...`);
    try {
        const res = await Promise.race([
            parser.parseURL(url),
            new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000)),
        ]);
        console.log(`Successfully fetched ${source}: ${res.items.length} items`);
        return res.items.map(item => {
            let fullContent = '';
            if (item['content:encoded']) fullContent = item['content:encoded'];
            else if (item.content) fullContent = item.content;
            else if (item.contentSnippet) fullContent = item.contentSnippet;
            else if (item.description) fullContent = item.description;

            const cleanContent = fullContent
                .replace(/<[^>]*>/g, '')
                .replace(/&nbsp;/g, ' ')
                .replace(/&amp;/g, '&')
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>')
                .replace(/\s+/g, ' ')
                .trim();

            const snippet = cleanContent.slice(0, 2000) + (cleanContent.length > 2000 ? '...' : '');

            let pubDate = item.pubDate ? new Date(item.pubDate) : new Date();
            if (pubDate.getTime() > Date.now()) pubDate = new Date();

            return {
                title: item.title || 'No Title',
                link: item.link || '#',
                pubDate: pubDate.toISOString(),
                contentSnippet: snippet || 'No description available.',
                source,
                category,
            } as NewsItem;
        });
    } catch (e) {
        console.error(`Error fetching ${source} (${url}):`, e);
        return [];
    }
}

/**
 * Get the latest news, enriched with today's historical events (moved to news).
 */
export async function getNews(): Promise<NewsItem[]> {
    const promises = FEEDS.news.map(f => fetchFeed(f.url, f.source, 'news'));
    const results = await Promise.all(promises);

    // Add today's historical events as news items (if any)
    const today = new Date();
    const key = `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const todayEvents = HISTORY_DB[key] || [];
    const historyAsNews: NewsItem[] = todayEvents.map(e => ({
        title: e.title,
        link: 'https://en.wikipedia.org/wiki/History_of_finance',
        pubDate: new Date().toISOString(),
        contentSnippet: e.description.slice(0, 2000) + (e.description.length > 2000 ? '...' : ''),
        source: 'FinHistory',
        category: 'news',
    }));

    return [...results.flat(), ...historyAsNews]
        .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
        .slice(0, 10);
}

export async function getHackathons(): Promise<NewsItem[]> {
    const promises = FEEDS.hackathon.map(f => fetchFeed(f.url, f.source, 'hackathon'));
    const results = await Promise.all(promises);
    return results
        .flat()
        .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
        .slice(0, 5);
}

export async function getJobs(): Promise<NewsItem[]> {
    const promises = FEEDS.job.map(f => fetchFeed(f.url, f.source, 'job'));
    const results = await Promise.all(promises);
    return results
        .flat()
        .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
        .slice(0, 5);
}

/**
 * Get historical events, excluding today's date (since they are shown in news).
 */
export async function getHistory(): Promise<NewsItem[]> {
    const today = new Date();
    const key = `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    // Skip today's events
    const events = HISTORY_DB[key] ? [] : HISTORY_DB[key] || [];
    return events
        .map(e => ({
            title: e.title,
            link: 'https://en.wikipedia.org/wiki/History_of_finance',
            pubDate: new Date().toISOString(),
            contentSnippet: e.description.slice(0, 2000) + (e.description.length > 2000 ? '...' : ''),
            source: 'FinHistory',
            category: 'history' as const,
        }) as NewsItem)
        .slice(0, 10);
}
