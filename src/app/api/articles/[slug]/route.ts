import { NextRequest, NextResponse } from "next/server";
import articles from '@/data/articles';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const article = articles.find((a: any) => a.slug === slug);
    if (!article) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(article);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
} 