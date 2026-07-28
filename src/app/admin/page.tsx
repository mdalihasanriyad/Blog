import Link from 'next/link';
import { FileText, Eye, MessageSquare, Mail, Inbox, FilePlus } from 'lucide-react';
import StatCard from '@/components/admin/StatCard';
import { getDashboardStats } from '@/services/dashboard.service';
import { formatCompactNumber } from '@/lib/utils';

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink-800 dark:text-paper">Dashboard</h1>
          <p className="mt-1 font-body text-sm text-slate dark:text-ink-200">
            {stats.publishedPosts} published · {stats.draftPosts} drafts
          </p>
        </div>
        <Link
          href="/admin/posts/new"
          className="flex items-center gap-2 rounded-md bg-ink-800 px-4 py-2 font-body text-sm font-medium
            text-paper hover:bg-ink-700 dark:bg-amber dark:text-ink-900"
        >
          <FilePlus size={16} /> New post
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total posts" value={stats.totalPosts} icon={FileText} />
        <StatCard label="Total views" value={formatCompactNumber(stats.totalViews)} icon={Eye} accent />
        <StatCard label="Pending comments" value={stats.pendingComments} icon={MessageSquare} />
        <StatCard label="Subscribers" value={stats.totalSubscribers} icon={Mail} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-ink-100 bg-paper p-5 dark:border-ink-700 dark:bg-ink-900">
          <h2 className="mb-4 font-display text-lg font-semibold text-ink-800 dark:text-paper">
            Top performing posts
          </h2>
          <ol className="space-y-3">
            {stats.topPosts.map((post, i) => (
              <li key={post.slug} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 overflow-hidden">
                  <span className="font-display text-lg font-semibold text-ink-200 dark:text-ink-600">
                    {i + 1}
                  </span>
                  <span className="truncate font-body text-sm text-ink-700 dark:text-ink-100">
                    {post.title}
                  </span>
                </div>
                <span className="shrink-0 font-mono text-xs text-ink-300 dark:text-ink-500">
                  {formatCompactNumber(post.views)} views
                </span>
              </li>
            ))}
          </ol>
        </div>

        <div className="rounded-lg border border-ink-100 bg-paper p-5 dark:border-ink-700 dark:bg-ink-900">
          <h2 className="mb-4 font-display text-lg font-semibold text-ink-800 dark:text-paper">
            Needs attention
          </h2>
          <ul className="space-y-3 font-body text-sm">
            <li className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-ink-700 dark:text-ink-100">
                <MessageSquare size={15} /> Comments awaiting moderation
              </span>
              <Link href="/admin/comments" className="link-underline font-medium text-amber-dark dark:text-amber-light">
                {stats.pendingComments}
              </Link>
            </li>
            <li className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-ink-700 dark:text-ink-100">
                <Inbox size={15} /> New contact messages
              </span>
              <Link href="/admin/contacts" className="link-underline font-medium text-amber-dark dark:text-amber-light">
                {stats.newContacts}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
