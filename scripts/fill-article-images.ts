#!/usr/bin/env node
import 'dotenv/config';
/**
 * fill-article-images.ts
 *
 * Usage:
 *   npx ts-node scripts/fill-article-images.ts prisma   # Update images in Postgres via Prisma
 *   npx ts-node scripts/fill-article-images.ts mock     # Update images in src/data/articles.ts
 *
 * Requires:
 *   - PEXELS_API_KEY in environment
 *   - DATABASE_URL in environment (for prisma mode)
 *   - Node 18+ for built-in fetch, or install node-fetch for older versions
 */

import fs from 'fs';
import path from 'path';

// Use built-in fetch if available (Node 18+), otherwise require('node-fetch')
let fetchFn: typeof fetch;
try {
  fetchFn = fetch;
} catch {
  // @ts-ignore
  fetchFn = require('node-fetch');
}

const PEXELS_API_KEY = process.env.PEXELS_API_KEY;
if (!PEXELS_API_KEY) {
  console.error('PEXELS_API_KEY is not set in environment.');
  process.exit(1);
}

const getImageUrl = async (query: string): Promise<string> => {
  try {
    const res = await fetchFn(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=5`, {
      headers: { Authorization: PEXELS_API_KEY }
    });
    const data = await res.json();
    const validPhoto = (data.photos || []).find((photo: any) => photo?.src?.large);
    return validPhoto?.src?.large || '/placeholder-1.jpg';
  } catch (err) {
    console.error(`Error fetching image for "${query}":`, err);
    return '/placeholder-1.jpg';
  }
};

const mode = process.argv[2];

if (mode === 'prisma') {
  // --- PRISMA MODE ---
  (async () => {
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    const articles = await prisma.article.findMany();
    for (const article of articles) {
      const imageUrl = await getImageUrl(article.title);
      await prisma.article.update({
        where: { id: article.id },
        data: { image_url: imageUrl },
      });
      console.log(`Updated article [${article.title}] with image: ${imageUrl}`);
    }
    await prisma.$disconnect();
    console.log('All articles updated in Postgres!');
  })();
} else if (mode === 'mock') {
  // --- MOCK DATA MODE ---
  (async () => {
    const articlesPath = path.join(__dirname, '../src/data/articles.ts');
    let fileContent = fs.readFileSync(articlesPath, 'utf-8');
    // Find the articles array (without dotAll flag for compatibility)
    const articlesMatch = fileContent.match(/const articles: Article\[\] = (\[[\s\S]*?\]);/);
    if (!articlesMatch) {
      console.error('Could not find articles array in articles.ts');
      process.exit(1);
    }
    let articles: any[] = [];
    try {
      // eslint-disable-next-line no-eval
      articles = eval(articlesMatch[1]);
    } catch (err) {
      console.error('Failed to parse articles array:', err);
      process.exit(1);
    }
    for (let i = 0; i < articles.length; i++) {
      const imageUrl = await getImageUrl(articles[i].title);
      articles[i].image_url = imageUrl;
      console.log(`Updated article [${articles[i].title}] with image: ${imageUrl}`);
    }
    // Replace the articles array in the file
    const newArticlesString = JSON.stringify(articles, null, 2).replace(/"([^\"]+)":/g, '$1:');
    fileContent = fileContent.replace(/const articles: Article\[\] = (\[[\s\S]*?\]);/, `const articles: Article[] = ${newArticlesString};`);
    fs.writeFileSync(articlesPath, fileContent, 'utf-8');
    console.log('All articles updated in mock data!');
  })();
} else {
  console.error('Usage: npx ts-node scripts/fill-article-images.ts [prisma|mock]');
  process.exit(1);
} 