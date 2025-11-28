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
}

const parser = new Parser({
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    },
});

const FEEDS = {
    news: [
        // Fintech & Finance
        { url: 'https://techcrunch.com/category/fintech/feed/', source: 'TechCrunch' },
        { url: 'https://www.finextra.com/rss/headlines.aspx', source: 'Finextra' },
        { url: 'https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=10000664', source: 'CNBC Finance' },
        { url: 'https://www.investing.com/rss/news_25.rss', source: 'Investing.com' },
        { url: 'https://www.reuters.com/finance/rss', source: 'Reuters' },
        { url: 'https://www.forbes.com/fintech/feed/', source: 'Forbes' },
        { url: 'https://www.marketwatch.com/rss/', source: 'MarketWatch' },
        { url: 'https://finance.yahoo.com/rss/', source: 'Yahoo Finance' },
        { url: 'https://seekingalpha.com/feed.xml', source: 'Seeking Alpha' },
        { url: 'https://www.fool.com/rss/index.aspx', source: 'Motley Fool' },

        // Crypto & Blockchain
        { url: 'https://www.coindesk.com/arc/outboundfeeds/rss/', source: 'CoinDesk' },
        { url: 'https://cointelegraph.com/rss', source: 'CoinTelegraph' },
        { url: 'https://www.theblockcrypto.com/rss.xml', source: 'The Block' },
        { url: 'https://decrypt.co/feed', source: 'Decrypt' },
        { url: 'https://bitcoinmagazine.com/.rss/full/', source: 'Bitcoin Magazine' },
        { url: 'https://cryptobriefing.com/feed/', source: 'Crypto Briefing' },
        { url: 'https://cryptonews.com/news/feed/', source: 'CryptoNews' },
        { url: 'https://www.coinbureau.com/feed/', source: 'Coin Bureau' },

        // Tech & Business (Fintech Focused)
        { url: 'https://venturebeat.com/category/fintech/feed/', source: 'VentureBeat Fintech' },
        { url: 'https://www.forbes.com/fintech/feed/', source: 'Forbes Fintech' },

        // Payment & Banking
        { url: 'https://www.pymnts.com/feed/', source: 'PYMNTS' },
        { url: 'https://thefinancialbrand.com/feed/', source: 'The Financial Brand' },
        { url: 'https://www.paymentsjournal.com/feed/', source: 'Payments Journal' },

        // Venture & Startups
        { url: 'https://news.crunchbase.com/sections/fintech-commerce/feed/', source: 'Crunchbase Fintech' },
        { url: 'https://www.entrepreneur.com/topic/fintech.rss', source: 'Entrepreneur Fintech' },
        { url: 'https://techcrunch.com/category/fintech/feed/', source: 'TechCrunch Fintech' },

        // Indian FinTech
        { url: 'https://inc42.com/category/fintech/feed/', source: 'Inc42 Fintech' },
        { url: 'https://entrackr.com/feed/', source: 'Entrackr' },
        { url: 'https://yourstory.com/feed', source: 'YourStory Fintech' },
        { url: 'https://www.livemint.com/rss/industry/banking', source: 'LiveMint Banking' },

        // Global Business

        // Additional Quality Sources
        { url: 'https://www.axios.com/feeds/feed.rss', source: 'Axios' },
        { url: 'https://www.benzinga.com/feed', source: 'Benzinga' },
        { url: 'https://www.investopedia.com/feedbuilder/feed/getfeed?feedName=rss_headline', source: 'Investopedia' },
        { url: 'https://www.nasdaq.com/feed/rssoutbound', source: 'Nasdaq' },
        { url: 'https://www.morningstar.com/rss/news.xml', source: 'Morningstar' },
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

// Static history database (Month-Day) – comprehensive fintech milestones
const HISTORY_DB: Record<string, { title: string; year: string; description: string; link: string; source: string }[]> = {
    '01-03': [
        { title: 'Bitcoin Genesis Block Mined', year: '2009', description: 'Satoshi Nakamoto mined the first Bitcoin block, embedding the message "The Times 03/Jan/2009 Chancellor on brink of second bailout for banks"', link: 'https://www.blockchain.com/explorer/blocks/btc/0', source: 'Blockchain.com' },
        { title: 'Apple Computer Incorporated', year: '1977', description: 'Apple Computer Company was officially incorporated, marking the beginning of personal computing revolution', link: 'https://www.loc.gov/item/today-in-history/april-01/', source: 'Library of Congress' },
    ],
    '02-14': [
        { title: 'YouTube Founded', year: '2005', description: 'YouTube was founded by three former PayPal employees, revolutionizing online video sharing and creating new opportunities for content monetization and digital advertising.', link: 'https://www.britannica.com/topic/YouTube', source: 'Britannica' },
        { title: 'Nasdaq Stock Market Founded', year: '1971', description: 'The Nasdaq Stock Market began operations as the world\'s first electronic stock market, transforming how securities are traded globally.', link: 'https://www.nasdaq.com/about/history', source: 'Nasdaq' },
    ],
    '03-10': [
        { title: 'Silicon Valley Bank Collapse', year: '2023', description: 'Silicon Valley Bank failed in the second-largest bank failure in U.S. history, triggering concerns about the stability of regional banks and the tech startup ecosystem.', link: 'https://www.fdic.gov/news/press-releases/2023/pr23019.html', source: 'FDIC' },
        { title: 'NASDAQ Composite Peaks', year: '2000', description: 'The NASDAQ Composite index reached its dot-com bubble peak of 5,048.62 before the subsequent crash that reshaped the tech industry.', link: 'https://www.investopedia.com/terms/d/dotcom-bubble.asp', source: 'Investopedia' },
    ],
    '04-04': [
        { title: 'Microsoft Founded', year: '1975', description: 'Bill Gates and Paul Allen founded Microsoft, which would become the world\'s largest software company and transform personal computing forever.', link: 'https://news.microsoft.com/announcement/microsoft-founded-april-4-1975/', source: 'Microsoft News' },
        { title: 'Netscape IPO', year: '1995', description: 'Netscape Communications went public in one of the most successful IPOs ever, marking the beginning of the dot-com boom.', link: 'https://www.history.com/this-day-in-history/netscape-ipo', source: 'History.com' },
    ],
    '05-18': [
        { title: 'Visa Inc. IPO', year: '2008', description: 'Visa Inc. completed the largest IPO in U.S. history at the time, raising $17.9 billion and transforming the global payments landscape.', link: 'https://usa.visa.com/about-visa/our-story.html', source: 'Visa' },
        { title: 'eBay Founded', year: '1995', description: 'Pierre Omidyar founded eBay (originally AuctionWeb), creating one of the first major e-commerce platforms and pioneering online marketplace business models.', link: 'https://www.ebayinc.com/company/our-history/', source: 'eBay Inc' },
    ],
    '06-29': [
        { title: 'iPhone Released', year: '2007', description: 'Apple released the first iPhone, revolutionizing mobile computing and enabling the mobile payments revolution that followed.', link: 'https://www.history.com/this-day-in-history/steve-jobs-debuts-the-iphone', source: 'History.com' },
        { title: 'Google IPO', year: '2004', description: 'Google went public with an unconventional Dutch auction IPO, raising $1.67 billion and beginning its transformation into one of the world\'s most valuable companies.', link: 'https://abc.xyz/investor/founders-letters/2004-ipo-letter/', source: 'Google Investor' },
    ],
    '07-15': [
        { title: 'Amazon Prime Day Launched', year: '2015', description: 'Amazon introduced Prime Day, creating a new global shopping event that would generate billions in revenue and transform e-commerce.', link: 'https://press.aboutamazon.com/2015/07/amazon-prime-day-records', source: 'Amazon Press' },
        { title: 'Twitter Founded', year: '2006', description: 'Jack Dorsey, Noah Glass, Biz Stone, and Evan Williams launched Twitter, creating a new platform for real-time communication and information sharing.', link: 'https://www.britannica.com/topic/Twitter', source: 'Britannica' },
    ],
    '08-09': [
        { title: 'Uber Founded', year: '2009', description: 'Travis Kalanick and Garrett Camp founded Uber, disrupting the transportation industry and pioneering the gig economy model.', link: 'https://www.uber.com/newsroom/history/', source: 'Uber Newsroom' },
        { title: 'Alibaba Founded', year: '1999', description: 'Jack Ma founded Alibaba Group in China, which would become one of the world\'s largest e-commerce and technology conglomerates.', link: 'https://www.alibabagroup.com/en/about/history', source: 'Alibaba Group' },
    ],
    '09-15': [
        { title: 'Lehman Brothers Files for Bankruptcy', year: '2008', description: 'The collapse of Lehman Brothers triggered the global financial crisis, leading to major regulatory reforms', link: 'https://www.history.com/this-day-in-history/lehman-brothers-collapses', source: 'History.com' },
        { title: 'First ATM Installed in US', year: '1969', description: 'Chemical Bank installed the first ATM in the United States in Rockville Centre, New York', link: 'https://www.smithsonianmag.com/history/atm-dead-long-live-atm-180953838/', source: 'Smithsonian Mag' },
    ],
    '10-31': [
        { title: 'Bitcoin Whitepaper Published', year: '2008', description: 'Satoshi Nakamoto published the Bitcoin whitepaper titled "Bitcoin: A Peer-to-Peer Electronic Cash System"', link: 'https://bitcoin.org/bitcoin.pdf', source: 'Bitcoin.org' },
        { title: 'New York Stock Exchange Crash', year: '1929', description: 'Black Tuesday marked the most devastating stock market crash in US history', link: 'https://www.history.com/topics/great-depression/1929-stock-market-crash', source: 'History.com' },
    ],
    '11-24': [
        { title: 'PayPal Goes Public', year: '2002', description: 'PayPal Holdings Inc. completed its IPO on NASDAQ, revolutionizing online payments. The company transformed how people send and receive money online, making digital payments accessible to millions worldwide.', link: 'https://www.cnn.com/2002/TECH/biztech/02/15/paypal.ipo/', source: 'CNN Money' },
        { title: 'First Bitcoin ATM Installed', year: '2013', description: "The world's first Bitcoin ATM was installed in Vancouver, Canada, marking a significant milestone in cryptocurrency adoption. This machine allowed users to exchange cash for Bitcoin instantly, bridging the gap between traditional and digital currency.", link: 'https://www.bbc.com/news/technology-24740275', source: 'BBC News' },
        { title: 'Stripe Founded', year: '2010', description: 'Patrick and John Collison founded Stripe to simplify online payment processing for businesses of all sizes. The platform revolutionized e‑commerce by making it easy for developers to integrate payment systems into their websites and applications.', link: 'https://www.bloomberg.com/profile/company/1273934D:US', source: 'Bloomberg' },
        { title: 'Square Inc. Founded', year: '2009', description: "Jack Dorsey and Jim McKelvey founded Square to enable mobile payments for small businesses. The company's card reader transformed smartphones into payment terminals, democratizing access to credit‑card processing.", link: 'https://www.britannica.com/topic/Square-Inc', source: 'Britannica' },
        { title: 'Venmo Launched', year: '2009', description: 'Venmo was launched as a peer‑to‑peer payment app that made splitting bills and sending money to friends as easy as sending a text message. Later acquired by PayPal, it became one of the most popular payment apps among millennials.', link: 'https://www.businessinsider.com/venmo-history-founders-2019-11', source: 'Business Insider' },
        { title: 'Robinhood Founded', year: '2013', description: 'Robinhood Markets was founded to democratize finance for all by offering commission‑free stock trading. The platform disrupted the brokerage industry and made investing accessible to a new generation of retail investors.', link: 'https://www.cnbc.com/2021/07/29/robinhood-ipo-how-the-trading-app-started-and-grew.html', source: 'CNBC' },
        { title: 'Coinbase Founded', year: '2012', description: 'Brian Armstrong and Fred Ehrsam founded Coinbase, which became the largest cryptocurrency exchange in the United States. The platform made buying, selling, and storing cryptocurrencies simple and secure for mainstream users.', link: 'https://www.nytimes.com/2021/04/14/technology/coinbase-ipo-stock-price.html', source: 'NY Times' },
        { title: 'Revolut Launched', year: '2015', description: 'Revolut was launched in the UK as a digital banking alternative offering multi‑currency accounts, cryptocurrency trading, and budgeting tools. The fintech unicorn expanded rapidly across Europe and beyond.', link: 'https://www.forbes.com/sites/davidschwartz/2021/07/15/revolut-becomes-uks-most-valuable-fintech-at-33-billion-valuation/', source: 'Forbes' },
        { title: 'Wise (TransferWise) Founded', year: '2011', description: 'Wise was founded to provide transparent international money transfers at the real exchange rate. The company disrupted traditional banks by offering significantly lower fees for cross‑border payments.', link: 'https://www.bbc.com/news/business-57766763', source: 'BBC News' },
        { title: 'Plaid Founded', year: '2013', description: "Plaid was founded to connect fintech applications to users' bank accounts securely. The company's API infrastructure powers thousands of financial apps, enabling seamless data sharing between banks and third‑party services.", link: 'https://www.forbes.com/sites/jeffkauflin/2020/01/13/visa-is-buying-fintech-startup-plaid-for-53-billion/', source: 'Forbes' },
    ],
    '11-08': [
        { title: 'Demonetization in India', year: '2016', description: 'The Government of India announced the demonetization of ₹500 and ₹1000 banknotes, triggering a massive surge in digital payments adoption across the country.', link: 'https://www.bbc.com/news/world-asia-india-37974423', source: 'BBC News' },
    ],
    '04-11': [
        { title: 'UPI Launched', year: '2016', description: 'National Payments Corporation of India (NPCI) launched the Unified Payments Interface (UPI), revolutionizing real-time digital payments in India.', link: 'https://www.npci.org.in/what-we-do/upi/product-overview', source: 'NPCI' },
    ],
    '08-01': [
        { title: 'Paytm Founded', year: '2010', description: 'Vijay Shekhar Sharma founded Paytm as a prepaid mobile recharge website, which later evolved into India\'s leading digital payments and financial services company.', link: 'https://paytm.com/about-us/', source: 'Paytm' },
    ],
    '12-01': [
        { title: 'PhonePe Founded', year: '2015', description: 'Sameer Nigam, Rahul Chari, and Burzin Engineer founded PhonePe, which became the first payment app built on UPI to cross 10 million downloads.', link: 'https://www.phonepe.com/about-us/', source: 'PhonePe' },
        { title: 'RBI Launches Digital Rupee', year: '2022', description: 'The Reserve Bank of India launched the first pilot for the Digital Rupee (e₹-R), marking a significant step towards a Central Bank Digital Currency (CBDC).', link: 'https://rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx?prid=54616', source: 'RBI' },
    ],
    '12-12': [
        { title: 'Apple IPO', year: '1980', description: 'Apple Computer went public at $22 per share, creating instant millionaires among employees and early investors. The IPO was one of the most successful in history at the time.', link: 'https://www.history.com/this-day-in-history/apple-goes-public', source: 'History.com' },
        { title: 'First Credit Card Introduced', year: '1950', description: 'Diners Club introduced the first modern credit card, revolutionizing how people pay for goods and services', link: 'https://www.britannica.com/topic/credit-card', source: 'Britannica' },
    ],
};



/**
 * Fetch a feed and normalize each item.
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
            } as NewsItem;
        });
    } catch (e) {
        console.error(`Error fetching ${source} (${url}):`, e);
        return [];
    }
}

/**
 * Get unified news feed for Inshorts-style display.
 * Prioritizes latest news and historical news with a 5:3 ratio.
 */
export async function getUnifiedNews(): Promise<NewsItem[]> {
    // 1. Fetch all feeds in parallel
    const newsPromises = FEEDS.news.map(f => fetchFeed(f.url, f.source, 'news'));
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

    // 3. Flatten and categorize news
    const allNews = newsResults.flat();
    const indianSources = ['Inc42 Fintech', 'Entrackr', 'YourStory Fintech', 'LiveMint Banking'];

    const indianNews = allNews.filter(n => indianSources.includes(n.source));
    const globalNews = allNews.filter(n => !indianSources.includes(n.source));

    // 4. Categorize history
    const indianHistoryKeywords = ['India', 'Paytm', 'PhonePe', 'UPI', 'RBI', 'Rupee'];
    const indianHistory = allHistoryEvents.filter(h => indianHistoryKeywords.some(k => h.title.includes(k) || h.contentSnippet.includes(k)));
    const globalHistory = allHistoryEvents.filter(h => !indianHistoryKeywords.some(k => h.title.includes(k) || h.contentSnippet.includes(k)));

    // 5. Build balanced feed
    // Target: 15 Global News, 15 Indian News
    // Target: 9 Global History, 9 Indian History
    const selectedGlobalNews = globalNews.sort(() => 0.5 - Math.random()).slice(0, 15);
    const selectedIndianNews = indianNews.sort(() => 0.5 - Math.random()).slice(0, 15);

    const selectedGlobalHistory = globalHistory.sort(() => 0.5 - Math.random()).slice(0, 9);
    const selectedIndianHistory = indianHistory.sort(() => 0.5 - Math.random()).slice(0, 9);

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
        ...selectedGlobalNews,
        ...selectedIndianNews,
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
