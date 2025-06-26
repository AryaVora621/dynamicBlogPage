import { NextResponse, NextRequest } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Article from '@/models/Article';

export async function GET(
  req: NextRequest,
  context: { params: Record<string, string | string[]> }
) {
  await connectToDatabase();
  try {
    const slug = context.params.slug;
    const article = await Article.findOne({ slug });
    if (!article) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(article);
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
} 