import { connectDB } from '@/lib/db';
import Comment from '@/models/Comment';
import CommentForm from '@/components/blog/CommentForm';
import { formatDate } from '@/lib/utils';

export default async function CommentSection({ postId }: { postId: string }) {
  await connectDB();
  const comments = await Comment.find({ post: postId, status: 'approved', parent: null })
    .sort({ createdAt: -1 })
    .populate('author', 'name image')
    .lean();

  return (
    <section aria-labelledby="comments-heading" className="mt-16 border-t border-ink-100 pt-10 dark:border-ink-700">
      <h2 id="comments-heading" className="mb-6 font-display text-2xl font-semibold text-ink-800 dark:text-paper">
        Discussion ({comments.length})
      </h2>

      <CommentForm postId={postId} />

      <ul className="mt-10 space-y-6">
        {comments.map((c: any) => (
          <li key={c._id.toString()} className="border-b border-ink-100 pb-6 dark:border-ink-700">
            <div className="flex items-center gap-2">
              <span className="font-body text-sm font-semibold text-ink-800 dark:text-paper">
                {c.author?.name ?? c.guestName ?? 'Anonymous'}
              </span>
              <span className="font-mono text-xs text-ink-300 dark:text-ink-500">
                {formatDate(c.createdAt)}
              </span>
            </div>
            <p className="mt-2 font-body text-sm text-slate dark:text-ink-200">{c.content}</p>
          </li>
        ))}
        {comments.length === 0 && (
          <p className="font-body text-sm text-ink-300 dark:text-ink-500">
            Be the first to share your thoughts.
          </p>
        )}
      </ul>
    </section>
  );
}
