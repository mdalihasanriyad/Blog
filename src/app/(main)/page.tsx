import Link from 'next/link';
import type { Metadata } from 'next';
import PostCard from '@/components/blog/PostCard';
import AdSlot from '@/components/ui/AdSlot';
import { getFeaturedPosts, getPublishedPosts, getTrendingPosts } from '@/services/post.service';
import { formatCompactNumber } from '@/lib/utils';

export const revalidate = 300;

export const metadata: Metadata = {
  description:
    'In-depth, well-researched articles on technology, business, and culture — written for readers who want substance over noise.',
};

export default async function HomePage() {
  const [featured, { posts: latest }, trending] = await Promise.all([
    getFeaturedPosts(4),
    getPublishedPosts(1, 9),
    getTrendingPosts(5),
  ]);

  const [hero, ...restFeatured] = featured;

  return (
    <>
      <section className="container-editorial pt-10 sm:pt-16">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-amber-dark dark:text-amber-light">
          Issue №{new Date().getFullYear()}
        </p>
        <h1 className="mt-3 max-w-3xl font-display text-display-md font-semibold leading-[1.05] text-ink-800 sm:text-display-lg md:text-display-xl dark:text-paper">
          Ideas worth your time.
        </h1>
        <p className="mt-4 max-w-xl font-body text-base text-slate dark:text-ink-200">
          Original reporting and long-form analysis on the technology and business decisions
          shaping how we work.
        </p>
      </section>

      {hero && (
        <section className="container-editorial mt-10 grid gap-8 border-b border-ink-100 pb-12 dark:border-ink-700 lg:grid-cols-[1.4fr_1fr]">
          <div className="animate-fade-up">
            <PostCard post={hero} priority />
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-1">
            {restFeatured.slice(0, 3).map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        </section>
      )}

      <AdSlot position="header" slotId={process.env.NEXT_PUBLIC_ADSENSE_HEADER_SLOT} className="container-editorial my-8" />

      <section className="container-editorial grid gap-12 py-12 lg:grid-cols-[1fr_320px]">
        <div>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-display text-2xl font-semibold text-ink-800 dark:text-paper">
              Latest articles
            </h2>
            <Link href="/blog" className="link-underline font-body text-sm font-medium text-amber-dark dark:text-amber-light">
              View all
            </Link>
          </div>
          <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2">
            {latest.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        </div>

        <aside className="space-y-8">
          <div>
            <h2 className="mb-4 font-display text-lg font-semibold text-ink-800 dark:text-paper">
              Trending now
            </h2>
            <ol className="space-y-4">
              {trending.map((post, i) => (
                <li key={post._id} className="flex gap-3">
                  <span className="font-display text-2xl font-semibold text-ink-200 dark:text-ink-600">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="link-underline font-body text-sm font-medium leading-snug text-ink-800 dark:text-paper"
                    >
                      {post.title}
                    </Link>
                    <p className="mt-1 font-mono text-xs text-ink-300 dark:text-ink-400">
                      {formatCompactNumber(post.views)} views
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <AdSlot position="sidebar" slotId={process.env.NEXT_PUBLIC_ADSENSE_SIDEBAR_SLOT} />
        </aside>
      </section>
    </>
  );
}
