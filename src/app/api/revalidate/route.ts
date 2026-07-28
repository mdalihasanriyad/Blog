import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret');
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
  }

  const { path, tag } = await req.json().catch(() => ({ path: null, tag: null }));

  if (path) revalidatePath(path);
  if (tag) revalidateTag(tag);

  return NextResponse.json({ revalidated: true, now: Date.now() });
}
