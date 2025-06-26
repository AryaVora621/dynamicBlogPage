import { NextResponse } from 'next/server';
import categories from '@/data/categories';

export async function GET() {
  try {
    return NextResponse.json(categories);
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
} 