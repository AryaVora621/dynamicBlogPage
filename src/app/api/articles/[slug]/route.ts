import { NextRequest, NextResponse } from "next/server";
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  const { slug } = params;
  try {
    const article = await prisma.article.findUnique({ where: { slug } });
    if (!article) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(article);
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { slug: string } }) {
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
  const { slug } = params;
  try {
    const data = await req.json();
    if (!data.title || !data.slug || !data.content || !data.category || !data.date) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }
    // Check for duplicate slug if changing slug
    if (data.slug !== slug) {
      const existing = await prisma.article.findUnique({ where: { slug: data.slug } });
      if (existing) {
        return NextResponse.json({ error: 'Slug already exists' }, { status: 409 });
      }
    }
    const updated = await prisma.article.update({
      where: { slug },
      data: {
        title: data.title,
        slug: data.slug,
        content: data.content,
        category: data.category,
        date: new Date(data.date),
        image_url: data.image_url || null,
      },
    });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { slug: string } }) {
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
  const { slug } = params;
  try {
    await prisma.article.delete({ where: { slug } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
} 