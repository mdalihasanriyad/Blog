import 'server-only';
import { unstable_cache } from 'next/cache';
import { connectDB } from '@/lib/db';
import Post from '@/models/Post';
import '@/models/Category';
import '@/models/Tag';
import '@/models/User';

export interface PostListItem {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  coverImageAlt: string;
  category: { name: string; slug: string };
  publishedAt: string;
  readingTimeMinutes: number;
  views: number;
  isFeatured: boolean;
}

function serializePost(doc: any): PostListItem {
  return {
    _id: doc._id.toString(),
    title: doc.title,
    slug: doc.slug,
    excerpt: doc.excerpt,
    coverImage: doc.coverImage,
    coverImageAlt: doc.coverImageAlt,
    category: { name: doc.category?.name ?? '', slug: doc.category?.slug ?? '' },
    publishedAt: doc.publishedAt?.toISOString() ?? doc.createdAt.toISOString(),
    readingTimeMinutes: doc.readingTimeMinutes,
    views: doc.views,
    isFeatured: doc.isFeatured,
  };
}

/** Paginated list of published posts, newest first. Cached & tagged for ISR revalidation. */
export const getPublishedPosts = unstable_cache(
  async (page = 1, limit = 12, categorySlug?: string, tagSlug?: string) => {
    await connectDB();
    const query: Record<string, unknown> = { status: 'published', publishedAt: { $lte: new Date() } };

    if (categorySlug) {
      const Category = (await import('@/models/Category')).default;
      const category = await Category.findOne({ slug: categorySlug });
      if (category) query.category = category._id;
    }
    if (tagSlug) {
      const Tag = (await import('@/models/Tag')).default;
      const tag = await Tag.findOne({ slug: tagSlug });
      if (tag) query.tags = tag._id;
    }

    const [posts, total] = await Promise.all([
      Post.find(query)
        .sort({ publishedAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('category', 'name slug')
        .lean(),
      Post.countDocuments(query),
    ]);

    return {
      posts: posts.map(serializePost),
      total,
      hasMore: page * limit < total,
    };
  },
  ['published-posts'],
  { revalidate: 300, tags: ['posts'] },
);

export const getFeaturedPosts = unstable_cache(
  async (limit = 4) => {
    await connectDB();
    const posts = await Post.find({
      status: 'published',
      isFeatured: true,
      publishedAt: { $lte: new Date() },
    })
      .sort({ publishedAt: -1 })
      .limit(limit)
      .populate('category', 'name slug')
      .lean();
    return posts.map(serializePost);
  },
  ['featured-posts'],
  { revalidate: 300, tags: ['posts'] },
);

export const getTrendingPosts = unstable_cache(
  async (limit = 5) => {
    await connectDB();
    const posts = await Post.find({ status: 'published', publishedAt: { $lte: new Date() } })
      .sort({ viewsLast7Days: -1 })
      .limit(limit)
      .populate('category', 'name slug')
      .lean();
    return posts.map(serializePost);
  },
  ['trending-posts'],
  { revalidate: 600, tags: ['posts'] },
);

export async function getPostBySlug(slug: string) {
  await connectDB();
  const post = await Post.findOne({ slug, status: { $ne: 'archived' } })
    .populate('category', 'name slug')
    .populate('tags', 'name slug')
    .populate('author', 'name image bio')
    .lean();
  return post;
}

export async function getRelatedPosts(postId: string, categoryId: string, limit = 3) {
  await connectDB();
  const posts = await Post.find({
    _id: { $ne: postId },
    category: categoryId,
    status: 'published',
    publishedAt: { $lte: new Date() },
  })
    .sort({ publishedAt: -1 })
    .limit(limit)
    .populate('category', 'name slug')
    .lean();
  return posts.map(serializePost);
}

export async function searchPosts(query: string, limit = 20) {
  await connectDB();
  if (!query.trim()) return [];
  const posts = await Post.find(
    { $text: { $search: query }, status: 'published' },
    { score: { $meta: 'textScore' } },
  )
    .sort({ score: { $meta: 'textScore' } })
    .limit(limit)
    .populate('category', 'name slug')
    .lean();
  return posts.map(serializePost);
}

export async function getAllPostSlugs() {
  await connectDB();
  const posts = await Post.find({ status: 'published' }).select('slug updatedAt').lean();
  return posts.map((p) => ({ slug: p.slug, updatedAt: p.updatedAt }));
}
