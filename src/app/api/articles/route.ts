import { NextResponse } from 'next/server';
import articles from '@/data/articles';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  try {
    const filtered = category ? articles.filter((a: any) => a.category === category) : articles;
    return NextResponse.json(filtered);
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
} 