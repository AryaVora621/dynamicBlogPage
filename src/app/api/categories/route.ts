import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Category from '@/models/Category';

export async function GET() {
  await connectToDatabase();
  try {
    const categories = await Category.find({});
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
} 