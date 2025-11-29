const Parser = require('rss-parser');

const parser = new Parser({
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    },
});

const techFeeds = [
    { url: 'https://www.theverge.com/rss/index.xml', source: 'The Verge' },
    { url: 'https://www.wired.com/feed/rss', source: 'Wired' },
    { url: 'https://techcrunch.com/feed/', source: 'TechCrunch' },
    { url: 'https://arstechnica.com/feed/', source: 'Ars Technica' },
    { url: 'https://www.engadget.com/rss.xml', source: 'Engadget' },
    { url: 'https://mashable.com/feed', source: 'Mashable' },
    { url: 'https://venturebeat.com/feed/', source: 'VentureBeat' },
    { url: 'https://readwrite.com/feed/', source: 'ReadWrite' },
];

async function testFeeds() {
    console.log('Testing Tech Feeds...');
    for (const feed of techFeeds) {
        try {
            console.log(`Fetching ${feed.source} (${feed.url})...`);
            const res = await parser.parseURL(feed.url);
            console.log(`✅ Success: ${feed.source} - ${res.items.length} items`);
        } catch (e) {
            console.error(`❌ Failed: ${feed.source} - ${e.message}`);
        }
    }
}

testFeeds();
