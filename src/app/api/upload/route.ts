import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { auth } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import Media from '@/models/Media';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const STAFF_ROLES = ['admin', 'editor', 'author'];

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user || !STAFF_ROLES.includes(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const alt = (formData.get('alt') as string) ?? '';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image uploads are supported' }, { status: 400 });
    }

    const MAX_BYTES = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: 'File exceeds 10MB limit' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;

    const result = await cloudinary.uploader.upload(base64, {
      folder: 'blog-cms',
      resource_type: 'image',
    });

    await connectDB();
    const media = await Media.create({
      url: result.secure_url,
      publicId: result.public_id,
      alt,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
      uploadedBy: session.user.id,
    });

    return NextResponse.json({
      id: media._id.toString(),
      url: media.url,
      width: media.width,
      height: media.height,
    });
  } catch (err) {
    console.error('POST /api/upload error:', err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
