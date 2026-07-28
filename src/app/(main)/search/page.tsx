import type { Metadata } from 'next';
import PostCard from '@/components/blog/PostCard';
import SearchBox from '@/components/blog/SearchBox';
import { searchPosts } from '@/services/post.service';

export const metadata: Metadata = {
  title: 'Search',
  robots: { index: false, follow: true },
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = '' } = await searchParams;
  const results = q ? await searchPosts(q) : [];

  return (
    <div className="container-editorial py-12">
      <h1 className="font-display text-display-md font-semibold text-ink-800 dark:text-paper">
        Search
      </h1>
      <div className="mt-6 max-w-xl">
        <SearchBox initialQuery={q} />
      </div>

      {q && (
        <p className="mt-6 font-mono text-xs uppercase tracking-widest text-ink-300 dark:text-ink-500">
          {results.length} result{results.length === 1 ? '' : 's'} for "{q}"
        </p>
      )}

      <div className="mt-8 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
}
