import type { Metadata } from 'next';
import InfinitePostList from '@/components/blog/InfinitePostList';
import { getPublishedPosts } from '@/services/post.service';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'All Articles',
  description: 'Browse every article — technology, business, and culture, newest first.',
  alternates: { canonical: '/blog' },
};

export default async function BlogIndexPage() {
  const { posts } = await getPublishedPosts(1, 9);

  return (
    <div className="container-editorial py-12">
      <header className="mb-10">
        <h1 className="font-display text-display-md font-semibold text-ink-800 dark:text-paper">
          All Articles
        </h1>
        <p className="mt-2 font-body text-slate dark:text-ink-200">
          Every story we've published, newest first.
        </p>
      </header>

      <InfinitePostList initialPosts={posts} />
    </div>
  );
}
