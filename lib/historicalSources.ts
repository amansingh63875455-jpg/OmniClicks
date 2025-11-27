// Top 10 Free Historical News Sources
// This module provides a curated list of free resources for historical news.
// It can be imported wherever historical data is needed.

export interface HistoricalSource {
    title: string;
    url: string;
    description: string;
}

export const HISTORICAL_SOURCES: HistoricalSource[] = [
    {
        title: "Wikipedia – On This Day",
        url: "https://en.wikipedia.org/wiki/Wikipedia:On_this_day",
        description: "Daily list of historical events with permanent Wikipedia links."
    },
    {
        title: "Internet Archive – Wayback Machine",
        url: "https://archive.org/web/",
        description: "Archive of billions of web pages, useful for retrieving old news pages."
    },
    {
        title: "Library of Congress – Chronicling America",
        url: "https://chroniclingamerica.loc.gov/",
        description: "Digitized historic U.S. newspapers (1800‑1963) with free full‑text search."
    },
    {
        title: "BBC History",
        url: "https://www.bbc.com/history",
        description: "Curated articles on major historical events and timelines."
    },
    {
        title: "History.com",
        url: "https://www.history.com/this-day-in-history",
        description: "Daily 'This Day in History' articles with reliable sources."
    },
    {
        title: "The New York Times Archive",
        url: "https://www.nytimes.com/search",
        description: "Free search of NYT articles older than 1 year (limited preview)."
    },
    {
        title: "Google News Archive",
        url: "https://news.google.com/publications?hl=en-US&gl=US&ceid=US:en",
        description: "Search historic newspaper archives via Google News."
    },
    {
        title: "Project Gutenberg – Historical Newspapers",
        url: "https://www.gutenberg.org/",
        description: "Free e‑books and some historic newspaper collections."
    },
    {
        title: "OpenNews – Open Access News",
        url: "https://opennews.org/",
        description: "Open‑access news articles and archives for research."
    },
    {
        title: "Europress – European Historical Press",
        url: "https://www.europress.org/",
        description: "Free European newspaper archives and historical press releases."
    }
];

/**
 * Returns the list of free historical news sources.
 */
export function getHistoricalSources(): HistoricalSource[] {
    return HISTORICAL_SOURCES;
}
