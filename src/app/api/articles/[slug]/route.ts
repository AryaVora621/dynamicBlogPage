import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Article from '@/models/Article';

export async function GET(req: Request, { params }: { params: { slug: string } }) {
  await connectToDatabase();
  try {
    const article = await Article.findOne({ slug: params.slug });
    if (!article) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(article);
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
} 