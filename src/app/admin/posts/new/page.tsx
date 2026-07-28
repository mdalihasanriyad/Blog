import PostForm from '@/components/admin/PostForm';
import { getAllCategories } from '@/services/category.service';
import { connectDB } from '@/lib/db';
import Tag from '@/models/Tag';

export const metadata = { robots: { index: false, follow: false } };

export default async function NewPostPage() {
  await connectDB();
  const [categories, tagDocs] = await Promise.all([getAllCategories(), Tag.find().sort({ name: 1 }).lean()]);
  const tags = tagDocs.map((t) => ({ id: t._id.toString(), name: t.name }));

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-semibold text-ink-800 dark:text-paper">New post</h1>
      <PostForm categories={categories.map((c) => ({ id: c._id, name: c.name }))} tags={tags} />
    </div>
  );
}
