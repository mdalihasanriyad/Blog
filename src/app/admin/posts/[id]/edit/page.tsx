import { notFound } from 'next/navigation';
import PostForm from '@/components/admin/PostForm';
import { getAllCategories } from '@/services/category.service';
import { connectDB } from '@/lib/db';
import Post from '@/models/Post';
import Tag from '@/models/Tag';

export const metadata = { robots: { index: false, follow: false } };

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectDB();

  const [post, categories, tagDocs] = await Promise.all([
    Post.findById(id).lean(),
    getAllCategories(),
    Tag.find().sort({ name: 1 }).lean(),
  ]);

  if (!post) notFound();

  const tags = tagDocs.map((t) => ({ id: t._id.toString(), name: t.name }));

  const initialData = {
    _id: post._id.toString(),
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    coverImage: post.coverImage,
    coverImageAlt: post.coverImageAlt,
    category: post.category.toString(),
    tags: post.tags.map((t: any) => t.toString()),
    status: post.status,
    isFeatured: post.isFeatured,
    scheduledAt: post.scheduledAt ? new Date(post.scheduledAt).toISOString() : undefined,
    metaTitle: post.metaTitle,
    metaDescription: post.metaDescription,
    canonicalUrl: post.canonicalUrl,
    ogImage: post.ogImage,
    keywords: post.keywords,
    faq: post.faq ?? [],
    noIndex: post.noIndex,
  };

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-semibold text-ink-800 dark:text-paper">Edit post</h1>
      <PostForm
        categories={categories.map((c) => ({ id: c._id, name: c.name }))}
        tags={tags}
        initialData={initialData}
      />
    </div>
  );
}
