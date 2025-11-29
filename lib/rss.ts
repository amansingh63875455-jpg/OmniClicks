import Parser from 'rss-parser';
import { generateSummary } from './ai-summarizer';
import { TERMINOLOGY_DB } from './terminology';

export interface NewsItem {
    title: string;
    link: string;
    pubDate: string;
    contentSnippet: string;
    source: string;
    category: 'news' | 'history' | 'hackathon' | 'job' | 'research' | 'terminology';
    topic?: 'fintech' | 'finance' | 'tech';
    region?: 'india' | 'global';
}

const parser = new Parser({
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    },
});

interface FeedConfig {
    url: string;
    source: string;
    topic: 'fintech' | 'finance' | 'tech';
    region: 'india' | 'global';
}

const FEEDS: { news: FeedConfig[]; hackathon: { url: string; source: string }[]; job: { url: string; source: string }[]; research: { url: string; source: string }[] } = {
    news: [
        // --- FINTECH (GLOBAL) ---
        { url: 'https://techcrunch.com/category/fintech/feed/', source: 'TechCrunch Fintech', topic: 'fintech', region: 'global' },
        { url: 'https://www.finextra.com/rss/headlines.aspx', source: 'Finextra', topic: 'fintech', region: 'global' },
        { url: 'https://www.forbes.com/fintech/feed/', source: 'Forbes Fintech', topic: 'fintech', region: 'global' },
        { url: 'https://www.pymnts.com/feed/', source: 'PYMNTS', topic: 'fintech', region: 'global' },
        { url: 'https://thefinancialbrand.com/feed/', source: 'The Financial Brand', topic: 'fintech', region: 'global' },
        { url: 'https://news.crunchbase.com/sections/fintech-commerce/feed/', source: 'Crunchbase Fintech', topic: 'fintech', region: 'global' },

        // --- FINTECH (INDIA) ---
        { url: 'https://inc42.com/category/fintech/feed/', source: 'Inc42 Fintech', topic: 'fintech', region: 'india' },
        { url: 'https://entrackr.com/feed/', source: 'Entrackr', topic: 'fintech', region: 'india' },
        { url: 'https://yourstory.com/feed', source: 'YourStory Fintech', topic: 'fintech', region: 'india' },
        { url: 'https://www.livemint.com/rss/industry/banking', source: 'LiveMint Banking', topic: 'fintech', region: 'india' },

        // --- FINANCE (GLOBAL) ---
        { url: 'https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=10000664', source: 'CNBC Finance', topic: 'finance', region: 'global' },
        { url: 'https://www.investing.com/rss/news_25.rss', source: 'Investing.com', topic: 'finance', region: 'global' },
        { url: 'https://www.reuters.com/finance/rss', source: 'Reuters Finance', topic: 'finance', region: 'global' },
        { url: 'https://www.marketwatch.com/rss/', source: 'MarketWatch', topic: 'finance', region: 'global' },
        { url: 'https://finance.yahoo.com/rss/', source: 'Yahoo Finance', topic: 'finance', region: 'global' },
        { url: 'https://seekingalpha.com/feed.xml', source: 'Seeking Alpha', topic: 'finance', region: 'global' },
        { url: 'https://www.fool.com/rss/index.aspx', source: 'Motley Fool', topic: 'finance', region: 'global' },
        { url: 'https://www.ft.com/?format=rss', source: 'Financial Times', topic: 'finance', region: 'global' },

        // --- FINANCE (INDIA) ---
        { url: 'https://www.moneycontrol.com/rss/MCtopnews.xml', source: 'MoneyControl', topic: 'finance', region: 'india' },
        { url: 'https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms', source: 'Economic Times Markets', topic: 'finance', region: 'india' },
        { url: 'https://www.livemint.com/rss/money', source: 'LiveMint Money', topic: 'finance', region: 'india' },
        { url: 'https://www.business-standard.com/rss/finance-103.rss', source: 'Business Standard', topic: 'finance', region: 'india' },

        // --- TECHNOLOGY (GLOBAL) ---
        { url: 'https://gizmodo.com/rss', source: 'Gizmodo', topic: 'tech', region: 'global' },
        { url: 'https://www.zdnet.com/news/rss.xml', source: 'ZDNet', topic: 'tech', region: 'global' },
        { url: 'https://www.cnet.com/rss/news/', source: 'CNET', topic: 'tech', region: 'global' },
        { url: 'https://techcrunch.com/feed/', source: 'TechCrunch', topic: 'tech', region: 'global' },
        { url: 'https://arstechnica.com/feed/', source: 'Ars Technica', topic: 'tech', region: 'global' },
        { url: 'https://www.engadget.com/rss.xml', source: 'Engadget', topic: 'tech', region: 'global' },
        { url: 'https://mashable.com/feed', source: 'Mashable', topic: 'tech', region: 'global' },
        { url: 'https://venturebeat.com/feed/', source: 'VentureBeat', topic: 'tech', region: 'global' },
        { url: 'https://readwrite.com/feed/', source: 'ReadWrite', topic: 'tech', region: 'global' },

        // --- TECHNOLOGY (INDIA) ---
        { url: 'https://gadgets360.com/rss/news', source: 'Gadgets360', topic: 'tech', region: 'india' },
        { url: 'https://indianexpress.com/section/technology/feed/', source: 'Indian Express Tech', topic: 'tech', region: 'india' },
        { url: 'https://inc42.com/category/buzz/feed/', source: 'Inc42 Tech', topic: 'tech', region: 'india' },
        { url: 'https://www.livemint.com/rss/technology', source: 'LiveMint Tech', topic: 'tech', region: 'india' },

        // Crypto (Categorized as Fintech/Finance Hybrid, putting in Fintech for now)
        { url: 'https://www.coindesk.com/arc/outboundfeeds/rss/', source: 'CoinDesk', topic: 'fintech', region: 'global' },
        { url: 'https://cointelegraph.com/rss', source: 'CoinTelegraph', topic: 'fintech', region: 'global' },
    ],
    hackathon: [
        { url: 'https://dev.to/feed/tag/hackathon', source: 'Dev.to' },
        { url: 'https://medium.com/feed/tag/hackathon', source: 'Medium' },
    ],
    job: [
        { url: 'https://weworkremotely.com/categories/remote-management-and-finance-jobs.rss', source: 'WeWorkRemotely' },
        { url: 'https://remoteok.com/rss?tags=finance', source: 'RemoteOK' },
    ],
    research: [
        { url: 'https://export.arxiv.org/rss/cs.AI', source: 'ArXiv AI' },
        { url: 'https://export.arxiv.org/rss/cs.CY', source: 'ArXiv Computers & Society' },
        { url: 'https://export.arxiv.org/rss/q-fin.GN', source: 'ArXiv General Finance' },
        { url: 'https://openai.com/blog/rss.xml', source: 'OpenAI Research' },
        { url: 'https://research.google/blog/rss', source: 'Google Research' },
        { url: 'https://www.mit.edu/feed', source: 'MIT News' },
    ]
};

// Static history database (Month-Day) – advanced fintech milestones
const HISTORY_DB: Record<string, { title: string; year: string; description: string; link: string; source: string }[]> = {
    '05-03': [
        { title: 'SWIFT Founded', year: '1973', description: 'The Society for Worldwide Interbank Financial Telecommunication (SWIFT) was founded in Brussels, establishing the standard for global interbank messaging and cross-border payments.', link: 'https://www.swift.com/about-us/history', source: 'SWIFT' },
    ],
    '05-01': [
        { title: 'Black-Scholes Model Published', year: '1973', description: 'Fischer Black and Myron Scholes published "The Pricing of Options and Corporate Liabilities", revolutionizing quantitative finance and derivatives trading.', link: 'https://www.jstor.org/stable/1831029', source: 'JSTOR' },
    ],
    '01-22': [
        { title: 'First ETF (SPY) Launched', year: '1993', description: 'State Street Global Advisors launched the SPDR S&P 500 ETF (SPY), the first exchange-traded fund in the US, transforming passive investing forever.', link: 'https://www.ssga.com/us/en/intermediary/etfs/funds/spdr-sp-500-etf-trust-spy', source: 'State Street' },
    ],
    '07-15': [
        { title: 'Basel I Accord', year: '1988', description: 'The Basel Committee on Banking Supervision published the Basel I accord, introducing the first international capital measurement system and minimum capital standards for banks.', link: 'https://www.bis.org/publ/bcbs04a.htm', source: 'BIS' },
    ],
    '12-08': [
        { title: 'SEC Regulation ATS', year: '1998', description: 'The SEC adopted Regulation ATS, establishing a regulatory framework for Alternative Trading Systems and paving the way for electronic communication networks (ECNs) and high-frequency trading.', link: 'https://www.sec.gov/rules/final/34-40760.txt', source: 'SEC' },
    ],
    '12-20': [
        { title: 'Payment & Settlement Systems Act', year: '2007', description: 'The Payment and Settlement Systems Act received the assent of the President of India, designating the RBI as the authority for regulation and supervision of payment systems in India.', link: 'https://m.rbi.org.in/Scripts/FAQView.aspx?Id=73', source: 'RBI' },
    ],
    '11-22': [
        { title: 'IMPS Launched', year: '2010', description: 'NPCI launched the Immediate Payment Service (IMPS), offering an instant, 24x7, interbank electronic fund transfer service through mobile phones.', link: 'https://www.npci.org.in/what-we-do/imps/product-overview', source: 'NPCI' },
    ],
    '12-01': [
        { title: 'NPCI Incorporated', year: '2008', description: 'The National Payments Corporation of India (NPCI) was incorporated as a specialized division of the RBI to operate retail payments and settlement systems.', link: 'https://www.npci.org.in/who-we-are/about-us', source: 'NPCI' },
    ],
    '01-28': [
        { title: 'UIDAI Established (Aadhaar)', year: '2009', description: 'The Unique Identification Authority of India (UIDAI) was established, laying the foundation for Aadhaar, the world\'s largest biometric ID system and a key pillar of India\'s fintech stack.', link: 'https://uidai.gov.in/en/about-uidai/unique-identification-authority-of-india/history.html', source: 'UIDAI' },
    ],
    '03-26': [
        { title: 'RuPay Card Launched', year: '2012', description: 'NPCI launched RuPay, India\'s own domestic card network, to reduce dependency on international card schemes like Visa and Mastercard.', link: 'https://www.npci.org.in/what-we-do/rupay/product-overview', source: 'NPCI' },
    ],
    '10-31': [
        { title: 'Bitcoin Whitepaper', year: '2008', description: 'Satoshi Nakamoto published "Bitcoin: A Peer-to-Peer Electronic Cash System", introducing the concept of a decentralized ledger and solving the double-spending problem.', link: 'https://bitcoin.org/bitcoin.pdf', source: 'Bitcoin.org' },
    ],
    '09-15': [
        { title: 'Lehman Brothers Collapse', year: '2008', description: 'Lehman Brothers filed for Chapter 11 bankruptcy protection, marking the largest bankruptcy filing in U.S. history and intensifying the global financial crisis.', link: 'https://www.federalreservehistory.org/essays/lehman-brothers-bankruptcy', source: 'Fed History' },
    ],
};



/**
 * Fetch a feed and normalize each item.
 */
async function fetchFeed(url: string, source: string, category: NewsItem['category'], topic?: NewsItem['topic'], region?: NewsItem['region']): Promise<NewsItem[]> {
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

            // Limit to 50 words for initial snippet
            const words = cleanContent.split(/\s+/);
            const limitedWords = words.slice(0, 50);
            const snippet = limitedWords.join(' ') + (words.length > 50 ? '...' : '');

            let pubDate = item.pubDate ? new Date(item.pubDate) : new Date();
            if (pubDate.getTime() > Date.now()) pubDate = new Date();

            return {
                title: item.title || 'No Title',
                link: item.link || '#',
                pubDate: pubDate.toISOString(),
                contentSnippet: snippet || 'No description available.',
                source,
                category,
                topic,
                region
            } as NewsItem;
        });
    } catch (e) {
        console.error(`Error fetching ${source} (${url}):`, e);
        return [];
    }
}

/**
 * Get unified news feed for Inshorts-style display.
 * Prioritizes balanced content between Fintech, Finance, and Tech, with Regional balance.
 */
export async function getUnifiedNews(): Promise<NewsItem[]> {
    // 1. Fetch all feeds in parallel
    const newsPromises = FEEDS.news.map(f => fetchFeed(f.url, f.source, 'news', f.topic, f.region));
    const hackathonPromises = FEEDS.hackathon.map(f => fetchFeed(f.url, f.source, 'hackathon'));
    const researchPromises = FEEDS.research.map(f => fetchFeed(f.url, f.source, 'research'));

    const [newsResults, hackathonResults, researchResults] = await Promise.all([
        Promise.all(newsPromises),
        Promise.all(hackathonPromises),
        Promise.all(researchPromises)
    ]);

    // 2. Get historical events
    const allHistoryEvents: NewsItem[] = [];
    Object.entries(HISTORY_DB).forEach(([dateKey, events]) => {
        events.forEach(e => {
            const [month, day] = dateKey.split('-');
            const dateObj = new Date(parseInt(e.year), parseInt(month) - 1, parseInt(day));

            allHistoryEvents.push({
                title: e.title,
                link: e.link,
                pubDate: dateObj.toISOString(),
                contentSnippet: e.description,
                source: `History (${e.year})`,
                category: 'history'
            });
        });
    });

    // 3. Flatten and categorize news by Topic and Region
    const allNews = newsResults.flat();

    const fintechGlobal = allNews.filter(n => n.topic === 'fintech' && n.region === 'global');
    const fintechIndia = allNews.filter(n => n.topic === 'fintech' && n.region === 'india');

    const financeGlobal = allNews.filter(n => n.topic === 'finance' && n.region === 'global');
    const financeIndia = allNews.filter(n => n.topic === 'finance' && n.region === 'india');

    const techGlobal = allNews.filter(n => n.topic === 'tech' && n.region === 'global');
    const techIndia = allNews.filter(n => n.topic === 'tech' && n.region === 'india');

    // 4. Select balanced mix
    // Target: 5 items per topic.
    // Strategy: 2 India + 3 Global (or vice versa, randomized for variety)

    const getBalancedSlice = (indiaItems: NewsItem[], globalItems: NewsItem[], total: number) => {
        const indiaCount = 2; // Guarantee at least 2 Indian items if available
        const globalCount = total - indiaCount;

        const selectedIndia = indiaItems.sort(() => 0.5 - Math.random()).slice(0, indiaCount);
        // If we didn't get enough Indian items, fill with Global
        const remainingNeeded = total - selectedIndia.length;
        const selectedGlobal = globalItems.sort(() => 0.5 - Math.random()).slice(0, remainingNeeded);

        return [...selectedIndia, ...selectedGlobal];
    };

    const selectedFintech = getBalancedSlice(fintechIndia, fintechGlobal, 5);
    const selectedFinance = getBalancedSlice(financeIndia, financeGlobal, 5);
    const selectedTech = getBalancedSlice(techIndia, techGlobal, 5);

    // 5. Categorize history
    const indianHistoryKeywords = ['India', 'Paytm', 'PhonePe', 'UPI', 'RBI', 'Rupee', 'NPCI', 'IMPS', 'Aadhaar', 'RuPay', 'UIDAI'];
    const indianHistory = allHistoryEvents.filter(h => indianHistoryKeywords.some(k => h.title.includes(k) || h.contentSnippet.includes(k)));
    const globalHistory = allHistoryEvents.filter(h => !indianHistoryKeywords.some(k => h.title.includes(k) || h.contentSnippet.includes(k)));

    const selectedGlobalHistory = globalHistory.sort(() => 0.5 - Math.random()).slice(0, 4);
    const selectedIndianHistory = indianHistory.sort(() => 0.5 - Math.random()).slice(0, 4);

    const researchPapers = researchResults.flat().sort(() => 0.5 - Math.random()).slice(0, 2);

    // 6. Get Terminology items
    const terminologyItems: NewsItem[] = TERMINOLOGY_DB.map(t => ({
        title: `${t.term} (${t.category})`,
        link: t.link || '#',
        pubDate: new Date().toISOString(),
        contentSnippet: t.definition,
        source: t.source || 'FinTech Terminology',
        category: 'terminology' as const
    })).sort(() => 0.5 - Math.random()).slice(0, 5);

    // 7. Combine all items
    let allItems: NewsItem[] = [
        ...selectedFintech,
        ...selectedFinance,
        ...selectedTech,
        ...selectedGlobalHistory,
        ...selectedIndianHistory,
        ...researchPapers,
        ...terminologyItems
    ];

    // 8. Shuffle everything
    for (let i = allItems.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allItems[i], allItems[j]] = [allItems[j], allItems[i]];
    }

    // 9. Generate AI Summaries for the top 3 items
    for (let i = 0; i < 3; i++) {
        if (allItems[i] && allItems[i].category !== 'history') {
            try {
                const summary = await generateSummary(allItems[i].link, allItems[i].title, allItems[i].contentSnippet);
                allItems[i].contentSnippet = summary;
            } catch (e) {
                console.log('Failed to generate summary for item ' + i);
            }
        }
    }

    return allItems;
}

export async function getNews() { return []; } // Deprecated
export async function getHackathons() { return []; } // Deprecated
export async function getJobs() { return []; } // Deprecated
export async function getHistory() { return []; } // Deprecated
