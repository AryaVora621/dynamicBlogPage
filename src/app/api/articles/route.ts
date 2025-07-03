import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  try {
    const where = category && category !== 'All' ? { category } : {};
    const articles = await prisma.article.findMany({
      where,
      orderBy: { date: 'desc' },
    });
    return NextResponse.json(articles);
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  // Basic Auth
  const auth = req.headers.get('authorization');
  if (!auth || !auth.startsWith('Basic ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const base64 = auth.replace('Basic ', '');
  const [username, password] = atob(base64).split(':');
  if (username !== 'MakEMindsADMIN' || password !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await req.json();
    if (!data.title || !data.slug || !data.content || !data.category || !data.date) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }
    // Check for duplicate slug
    const existing = await prisma.article.findUnique({ where: { slug: data.slug } });
    if (existing) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 409 });
    }
    const newArticle = await prisma.article.create({
      data: {
        title: data.title,
        slug: data.slug,
        content: data.content,
        category: data.category,
        date: new Date(data.date),
        image_url: data.image_url || null,
      },
    });
    return NextResponse.json(newArticle, { status: 201 });
  } catch (err) {
    console.error('POST /api/articles error:', err);
    return NextResponse.json({ error: 'Server error', details: String(err) }, { status: 500 });
  }
}

// DELETE /api/articles?slug=the-slug (admin only)
export async function DELETE(req: Request) {
  // Basic Auth
  const auth = req.headers.get('authorization');
  if (!auth || !auth.startsWith('Basic ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const base64 = auth.replace('Basic ', '');
  const [username, password] = atob(base64).split(':');
  if (username !== 'MakEMindsADMIN' || password !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug');
  if (!slug) {
    return NextResponse.json({ error: 'Missing slug' }, { status: 400 });
  }
  try {
    await prisma.article.delete({ where: { slug } });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Not found or server error' }, { status: 404 });
  }
} 