import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Article from '@/models/Article';

export async function GET(req: Request) {
  await connectToDatabase();
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  try {
    const query = category ? { category } : {};
    const articles = await Article.find(query).sort({ date: -1 });
    return NextResponse.json(articles);
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
} 