import { GoogleGenerativeAI } from '@google/generative-ai';
import * as cheerio from 'cheerio';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function generateSummary(url: string, title: string, snippet: string): Promise<string> {
    try {
        // If no API key, return original snippet
        if (!process.env.GEMINI_API_KEY) {
            console.log('No Gemini API key found, using original snippet');
            return snippet;
        }

        // Fetch article content
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            signal: AbortSignal.timeout(5000) // 5 second timeout
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch article: ${response.status}`);
        }

        const html = await response.text();
        const $ = cheerio.load(html);

        // Remove script, style, and nav elements
        $('script, style, nav, header, footer, aside').remove();

        // Extract main content
        let articleText = '';
        const contentSelectors = [
            'article',
            '[role="main"]',
            '.article-content',
            '.post-content',
            '.entry-content',
            'main'
        ];

        for (const selector of contentSelectors) {
            const content = $(selector).text();
            if (content && content.length > 200) {
                articleText = content;
                break;
            }
        }

        // Fallback to body if no main content found
        if (!articleText || articleText.length < 200) {
            articleText = $('body').text();
        }

        // Clean up whitespace
        articleText = articleText.replace(/\s+/g, ' ').trim().slice(0, 3000);

        if (!articleText || articleText.length < 100) {
            console.log(`Insufficient content extracted from ${url}`);
            return snippet;
        }

        // Generate summary using Gemini
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `Summarize the following news article in exactly 200 words. Focus on the key facts, main points, and important details. Make it informative and engaging.

Title: ${title}

Article Content:
${articleText}

Summary (200 words):`;

        const result = await model.generateContent(prompt);
        const summary = result.response.text().trim();

        if (summary && summary.length > 100) {
            console.log(`✓ Generated AI summary for: ${title.slice(0, 50)}...`);
            return summary;
        }

        return snippet;

    } catch (error) {
        console.error(`Error generating summary for ${url}:`, error);
        return snippet; // Fallback to original snippet
    }
}
