import Image from 'next/image';
import { connectDB } from '@/lib/db';
import Media from '@/models/Media';
import MediaUploader from '@/components/admin/MediaUploader';

export const dynamic = 'force-dynamic';
export const metadata = { robots: { index: false, follow: false } };

export default async function AdminMediaPage() {
  await connectDB();
  const media = await Media.find().sort({ createdAt: -1 }).limit(60).lean();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-ink-800 dark:text-paper">Media Library</h1>
        <MediaUploader />
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {media.map((m) => (
          <div key={m._id.toString()} className="group relative aspect-square overflow-hidden rounded-lg bg-ink-100 dark:bg-ink-800">
            <Image
              src={m.url}
              alt={m.alt || 'Uploaded media'}
              fill
              sizes="200px"
              className="object-cover"
            />
          </div>
        ))}
        {media.length === 0 && (
          <p className="col-span-full font-body text-sm text-slate">No media uploaded yet.</p>
        )}
      </div>
    </div>
  );
}
