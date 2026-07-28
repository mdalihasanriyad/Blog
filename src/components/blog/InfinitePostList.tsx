'use client';

import { useEffect, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import PostCard, { type PostCardData } from '@/components/blog/PostCard';
import PostCardSkeleton from '@/components/blog/PostCardSkeleton';

interface PostsResponse {
  posts: PostCardData[];
  total: number;
  hasMore: boolean;
}

async function fetchPosts(page: number, category?: string, tag?: string): Promise<PostsResponse> {
  const params = new URLSearchParams({ page: String(page) });
  if (category) params.set('category', category);
  if (tag) params.set('tag', tag);
  const res = await fetch(`/api/posts?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch posts');
  return res.json();
}

export default function InfinitePostList({
  initialPosts,
  category,
  tag,
}: {
  initialPosts: PostCardData[];
  category?: string;
  tag?: string;
}) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['posts', category ?? null, tag ?? null],
    queryFn: ({ pageParam }) => fetchPosts(pageParam, category, tag),
    initialPageParam: 2, // page 1 is already rendered server-side
    getNextPageParam: (lastPage, allPages) => (lastPage.hasMore ? allPages.length + 2 : undefined),
    initialData: {
      pages: [{ posts: initialPosts, total: initialPosts.length, hasMore: initialPosts.length >= 9 }],
      pageParams: [1],
    },
  });

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: '400px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const posts = data?.pages.flatMap((p) => p.posts) ?? initialPosts;

  return (
    <>
      <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
        {isFetchingNextPage &&
          Array.from({ length: 3 }).map((_, i) => <PostCardSkeleton key={`skeleton-${i}`} />)}
      </div>
      <div ref={sentinelRef} className="h-1" aria-hidden />
      {!hasNextPage && posts.length > 0 && (
        <p className="mt-10 text-center font-mono text-xs uppercase tracking-widest text-ink-300 dark:text-ink-500">
          You've reached the end
        </p>
      )}
    </>
  );
}
