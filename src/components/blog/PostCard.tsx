import Link from 'next/link';
import Image from 'next/image';
import { formatDate } from '@/lib/utils';

export interface PostCardData {
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  coverImageAlt: string;
  category: { name: string; slug: string };
  publishedAt: string | Date;
  readingTimeMinutes: number;
}

export default function PostCard({
  post,
  priority = false,
}: {
  post: PostCardData;
  priority?: boolean;
}) {
  return (
    <article className="group flex flex-col">
      <Link
        href={`/blog/${post.slug}`}
        className="relative mb-4 block aspect-[16/10] overflow-hidden rounded-lg bg-ink-100 dark:bg-ink-800"
      >
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.coverImageAlt || post.title}
            fill
            priority={priority}
            loading={priority ? 'eager' : 'lazy'}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : null}
      </Link>

      <Link
        href={`/category/${post.category.slug}`}
        className="press-stamp mb-2 w-fit text-amber-dark dark:text-amber-light"
      >
        {post.category.name}
      </Link>

      <h3 className="font-display text-xl font-semibold leading-snug text-ink-800 dark:text-paper">
        <Link href={`/blog/${post.slug}`} className="link-underline">
          {post.title}
        </Link>
      </h3>

      <p className="mt-2 line-clamp-2 font-body text-sm text-slate dark:text-ink-200">
        {post.excerpt}
      </p>

      <div className="mt-3 flex items-center gap-3 font-mono text-xs text-ink-300 dark:text-ink-400">
        <time dateTime={new Date(post.publishedAt).toISOString()}>
          {formatDate(post.publishedAt)}
        </time>
        <span aria-hidden>·</span>
        <span>{post.readingTimeMinutes} min read</span>
      </div>
    </article>
  );
}
