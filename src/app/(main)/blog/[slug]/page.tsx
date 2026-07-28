import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import MarkdownRenderer from '@/components/blog/MarkdownRenderer';
import TableOfContents from '@/components/blog/TableOfContents';
import SocialShare from '@/components/blog/SocialShare';
import ReadingRibbon from '@/components/blog/ReadingRibbon';
import ViewTracker from '@/components/blog/ViewTracker';
import CommentSection from '@/components/blog/CommentSection';
import PostCard from '@/components/blog/PostCard';
import AdSlot from '@/components/ui/AdSlot';
import { getAllPostSlugs, getPostBySlug, getRelatedPosts } from '@/services/post.service';
import { articleJsonLd, breadcrumbJsonLd, faqJsonLd } from '@/lib/json-ld';
import { formatDate } from '@/lib/utils';

export const revalidate = 300;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  const title = post.metaTitle || post.title;
  const description = post.metaDescription || post.excerpt;
  const url = post.canonicalUrl || `${SITE_URL}/blog/${post.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: post.noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      type: 'article',
      title,
      description,
      url,
      images: post.ogImage || post.coverImage ? [post.ogImage || post.coverImage] : undefined,
      publishedTime: post.publishedAt?.toISOString(),
      modifiedTime: post.updatedAt?.toISOString(),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: post.ogImage || post.coverImage ? [post.ogImage || post.coverImage] : undefined,
    },
    keywords: post.keywords,
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post || post.status === 'draft') notFound();

  const category = post.category as any;
  const author = post.author as any;
  const tags = post.tags as any[];
  const related = await getRelatedPosts(post._id.toString(), category._id.toString());

  const url = `${SITE_URL}/blog/${post.slug}`;

  const jsonLd = [
    articleJsonLd({
      title: post.title,
      description: post.metaDescription || post.excerpt,
      slug: post.slug,
      coverImage: post.coverImage,
      authorName: author?.name ?? 'Editorial Team',
      publishedAt: post.publishedAt?.toISOString() ?? post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
      categoryName: category?.name ?? '',
    }),
    breadcrumbJsonLd([
      { name: 'Home', url: SITE_URL },
      { name: category?.name ?? 'Blog', url: `${SITE_URL}/category/${category?.slug}` },
      { name: post.title, url },
    ]),
    faqJsonLd(post.faq ?? []),
  ].filter(Boolean);

  return (
    <>
      <ReadingRibbon />
      <ViewTracker postId={post._id.toString()} />
      {jsonLd.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <article className="container-editorial py-10">
        <nav aria-label="Breadcrumb" className="mb-4 font-mono text-xs text-ink-300 dark:text-ink-500">
          <Link href="/" className="hover:text-amber-dark">Home</Link>
          <span className="mx-2">/</span>
          <Link href={`/category/${category?.slug}`} className="hover:text-amber-dark">
            {category?.name}
          </Link>
        </nav>

        <header className="mx-auto max-w-3xl">
          <Link href={`/category/${category?.slug}`} className="press-stamp mb-4 w-fit text-amber-dark dark:text-amber-light">
            {category?.name}
          </Link>
          <h1 className="font-display text-display-md font-semibold leading-[1.1] text-ink-800 sm:text-display-lg dark:text-paper">
            {post.title}
          </h1>
          <p className="mt-4 font-body text-lg text-slate dark:text-ink-200">{post.excerpt}</p>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-y border-ink-100 py-4 dark:border-ink-700">
            <div className="flex items-center gap-3">
              {author?.image && (
                <Image src={author.image} alt={author.name} width={40} height={40} className="rounded-full" />
              )}
              <div>
                <p className="font-body text-sm font-semibold text-ink-800 dark:text-paper">
                  {author?.name ?? 'Editorial Team'}
                </p>
                <p className="font-mono text-xs text-ink-300 dark:text-ink-500">
                  {formatDate(post.publishedAt ?? post.createdAt)} · {post.readingTimeMinutes} min read
                </p>
              </div>
            </div>
            <SocialShare url={url} title={post.title} />
          </div>
        </header>

        {post.coverImage && (
          <div className="relative mx-auto mt-8 aspect-[16/9] max-w-4xl overflow-hidden rounded-xl">
            <Image
              src={post.coverImage}
              alt={post.coverImageAlt || post.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 900px"
              className="object-cover"
            />
          </div>
        )}

        <div className="mx-auto mt-10 grid max-w-6xl gap-10 lg:grid-cols-[1fr_220px]">
          <div className="mx-auto w-full max-w-3xl">
            <MarkdownRenderer content={post.content} />

            <AdSlot position="in-article" slotId={process.env.NEXT_PUBLIC_ADSENSE_INARTICLE_SLOT} className="my-10" />

            {tags?.length > 0 && (
              <div className="mt-10 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Link
                    key={tag.slug}
                    href={`/tag/${tag.slug}`}
                    className="rounded-full border border-ink-100 px-3 py-1 font-mono text-xs text-slate
                      hover:border-amber hover:text-amber-dark dark:border-ink-700 dark:text-ink-200"
                  >
                    #{tag.name}
                  </Link>
                ))}
              </div>
            )}

            <CommentSection postId={post._id.toString()} />
          </div>

          <aside className="hidden lg:block">
            <TableOfContents content={post.content} />
          </aside>
        </div>

        {related.length > 0 && (
          <section className="mx-auto mt-16 max-w-6xl border-t border-ink-100 pt-10 dark:border-ink-700">
            <h2 className="mb-6 font-display text-2xl font-semibold text-ink-800 dark:text-paper">
              Related reading
            </h2>
            <div className="grid gap-8 sm:grid-cols-3">
              {related.map((p) => (
                <PostCard key={p._id} post={p} />
              ))}
            </div>
          </section>
        )}
      </article>
    </>
  );
}
