import { NextRequest, NextResponse } from 'next/server';
import { getPublishedPosts } from '@/services/post.service';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get('page') ?? '1');
  const category = searchParams.get('category') ?? undefined;
  const tag = searchParams.get('tag') ?? undefined;

  if (Number.isNaN(page) || page < 1) {
    return NextResponse.json({ error: 'Invalid page parameter' }, { status: 400 });
  }

  try {
    const result = await getPublishedPosts(page, 9, category, tag);
    return NextResponse.json(result, {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
    });
  } catch (err) {
    console.error('GET /api/posts error:', err);
    return NextResponse.json({ error: 'Failed to load posts' }, { status: 500 });
  }
}
