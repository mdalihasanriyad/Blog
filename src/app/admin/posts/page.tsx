import Link from 'next/link';
import { Plus, Pencil, Eye } from 'lucide-react';
import { connectDB } from '@/lib/db';
import Post from '@/models/Post';
import '@/models/Category';
import DeletePostButton from '@/components/admin/DeletePostButton';
import { cn, formatDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

const STATUS_STYLES: Record<string, string> = {
  published: 'bg-sage/15 text-sage-dark',
  draft: 'bg-ink-100 text-ink-500 dark:bg-ink-700 dark:text-ink-300',
  scheduled: 'bg-amber/15 text-amber-dark',
  archived: 'bg-brick/10 text-brick',
};

export default async function AdminPostsPage() {
  await connectDB();
  const posts = await Post.find()
    .sort({ createdAt: -1 })
    .populate('category', 'name')
    .select('title slug status views category publishedAt createdAt')
    .lean();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-ink-800 dark:text-paper">Posts</h1>
        <Link
          href="/admin/posts/new"
          className="flex items-center gap-2 rounded-md bg-ink-800 px-4 py-2 font-body text-sm font-medium
            text-paper hover:bg-ink-700 dark:bg-amber dark:text-ink-900"
        >
          <Plus size={16} /> New post
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg border border-ink-100 dark:border-ink-700">
        <table className="w-full text-left">
          <thead className="bg-paper-dim dark:bg-ink-800">
            <tr className="font-mono text-xs uppercase tracking-widest text-ink-400">
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Views</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100 bg-paper dark:divide-ink-700 dark:bg-ink-900">
            {posts.map((post: any) => (
              <tr key={post._id.toString()}>
                <td className="max-w-xs truncate px-4 py-3 font-body text-sm text-ink-800 dark:text-paper">
                  {post.title}
                </td>
                <td className="px-4 py-3 font-body text-sm text-slate dark:text-ink-200">
                  {post.category?.name ?? '—'}
                </td>
                <td className="px-4 py-3">
                  <span className={cn('rounded-full px-2.5 py-1 font-mono text-[11px] uppercase', STATUS_STYLES[post.status])}>
                    {post.status}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono text-sm text-ink-500">{post.views}</td>
                <td className="px-4 py-3 font-mono text-xs text-ink-400">
                  {formatDate(post.publishedAt ?? post.createdAt)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-3">
                    {post.status === 'published' && (
                      <Link href={`/blog/${post.slug}`} target="_blank" aria-label="View" className="text-ink-400 hover:text-amber-dark">
                        <Eye size={16} />
                      </Link>
                    )}
                    <Link href={`/admin/posts/${post._id}/edit`} aria-label="Edit" className="text-ink-400 hover:text-amber-dark">
                      <Pencil size={16} />
                    </Link>
                    <DeletePostButton id={post._id.toString()} title={post.title} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {posts.length === 0 && (
          <p className="p-8 text-center font-body text-sm text-slate">No posts yet — create your first one.</p>
        )}
      </div>
    </div>
  );
}
