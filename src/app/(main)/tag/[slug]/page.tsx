import type { Metadata } from 'next';
import { connectDB } from '@/lib/db';
import Tag from '@/models/Tag';
import { notFound } from 'next/navigation';
import InfinitePostList from '@/components/blog/InfinitePostList';
import { getPublishedPosts } from '@/services/post.service';

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return { title: `#${slug}`, alternates: { canonical: `/tag/${slug}` } };
}

export default async function TagPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await connectDB();
  const tag = await Tag.findOne({ slug }).lean();
  if (!tag) notFound();

  const { posts } = await getPublishedPosts(1, 9, undefined, slug);

  return (
    <div className="container-editorial py-12">
      <header className="mb-10">
        <p className="press-stamp mb-3 w-fit text-amber-dark dark:text-amber-light">Tag</p>
        <h1 className="font-display text-display-md font-semibold text-ink-800 dark:text-paper">
          #{tag.name}
        </h1>
      </header>

      {posts.length > 0 ? (
        <InfinitePostList initialPosts={posts} tag={slug} />
      ) : (
        <p className="font-body text-slate dark:text-ink-200">No articles tagged yet.</p>
      )}
    </div>
  );
}
