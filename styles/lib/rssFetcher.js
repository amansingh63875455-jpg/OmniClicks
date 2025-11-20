import Parser from "rss-parser";
const parser = new Parser();

// prettier-ignore
const feeds = {
  latest:      ["https://feeds.feedburner.com/techcrunch/fintech", "https://www.coindesk.com/arc/outboundfeeds/rss/category/business"],
  historical:  ["https://feeds.feedburner.com/techcrunch"],
  hackathons:  ["https://devpost.com/hackathons.atom?search=fintech"],
  jobs:        ["https://weworkremotely.com/categories/remote-finance-jobs.rss"],
};

function summarise(text) {
  if (!text) return "No summary available.";
  const t = text.replace(/<[^>]+>/g, " ").trim();
  const words = t.split(/\s+/);
  if (words.length <= 55) return t;          // ~300 chars
  return words.slice(0, 55).join(" ") + "…"; // ~250-300 chars
}

export async function fetchRSS(category) {
  const urls = feeds[category] || [];
  const items = [];
  for (const u of urls) {
    try {
      const feed = await parser.parseURL(u);
      items.push(...feed.items);
    } catch {}
  }
  return items
    .slice(0, 10)
    .map((i) => ({
      title: i.title,
      link: i.link,
      summary: summarise(i.content || i.summary || i.description),
    }));
}
