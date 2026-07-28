import { connectDB } from '@/lib/db';
import Comment from '@/models/Comment';
import CommentModerationActions from '@/components/admin/CommentModerationActions';
import { cn, formatDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';
export const metadata = { robots: { index: false, follow: false } };

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-amber/15 text-amber-dark',
  approved: 'bg-sage/15 text-sage-dark',
  spam: 'bg-brick/10 text-brick',
  trash: 'bg-ink-100 text-ink-400',
};

export default async function AdminCommentsPage() {
  await connectDB();
  const comments = await Comment.find({ status: { $ne: 'trash' } })
    .sort({ createdAt: -1 })
    .populate('post', 'title slug')
    .populate('author', 'name')
    .lean();

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-semibold text-ink-800 dark:text-paper">Comments</h1>

      <div className="space-y-3">
        {comments.map((c: any) => (
          <div key={c._id.toString()} className="rounded-lg border border-ink-100 p-4 dark:border-ink-700">
            <div className="mb-2 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="font-body text-sm font-semibold text-ink-800 dark:text-paper">
                  {c.author?.name ?? c.guestName ?? 'Anonymous'}
                </span>
                <span className={cn('rounded-full px-2 py-0.5 font-mono text-[10px] uppercase', STATUS_STYLES[c.status])}>
                  {c.status}
                </span>
                <span className="font-mono text-xs text-ink-300">{formatDate(c.createdAt)}</span>
              </div>
              <CommentModerationActions id={c._id.toString()} />
            </div>
            <p className="font-body text-sm text-slate dark:text-ink-200">{c.content}</p>
            <p className="mt-2 font-mono text-xs text-ink-300">on "{c.post?.title}"</p>
          </div>
        ))}
        {comments.length === 0 && (
          <p className="font-body text-sm text-slate">No comments to moderate.</p>
        )}
      </div>
    </div>
  );
}
