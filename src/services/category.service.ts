import 'server-only';
import { unstable_cache } from 'next/cache';
import { connectDB } from '@/lib/db';
import Category from '@/models/Category';

export const getAllCategories = unstable_cache(
  async () => {
    await connectDB();
    const categories = await Category.find().sort({ name: 1 }).lean();
    return categories.map((c) => ({
      _id: c._id.toString(),
      name: c.name,
      slug: c.slug,
      description: c.description,
      parent: c.parent?.toString() ?? null,
    }));
  },
  ['categories'],
  { revalidate: 3600, tags: ['categories'] },
);

export async function getCategoryBySlug(slug: string) {
  await connectDB();
  return Category.findOne({ slug }).lean();
}
