import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import InfinitePostList from '@/components/blog/InfinitePostList';
import { getPublishedPosts } from '@/services/post.service';
import { getCategoryBySlug } from '@/services/category.service';

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return {};
  return {
    title: category.metaTitle || category.name,
    description: category.metaDescription || category.description || `Articles in ${category.name}`,
    alternates: { canonical: `/category/${slug}` },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const { posts } = await getPublishedPosts(1, 9, slug);

  return (
    <div className="container-editorial py-12">
      <header className="mb-10">
        <p className="press-stamp mb-3 w-fit text-amber-dark dark:text-amber-light">Category</p>
        <h1 className="font-display text-display-md font-semibold text-ink-800 dark:text-paper">
          {category.name}
        </h1>
        {category.description && (
          <p className="mt-2 max-w-2xl font-body text-slate dark:text-ink-200">{category.description}</p>
        )}
      </header>

      {posts.length > 0 ? (
        <InfinitePostList initialPosts={posts} category={slug} />
      ) : (
        <p className="font-body text-slate dark:text-ink-200">No articles here yet — check back soon.</p>
      )}
    </div>
  );
}
