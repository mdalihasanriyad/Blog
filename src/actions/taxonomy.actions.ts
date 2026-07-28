'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { connectDB } from '@/lib/db';
import Category from '@/models/Category';
import Tag from '@/models/Tag';
import { auth } from '@/lib/auth';
import { categorySchema } from '@/lib/validations/post';
import { toSlug } from '@/lib/utils';

type ActionResult<T = undefined> =
  | { success: true; data: T }
  | { success: false; error: string };

async function requireStaff() {
  const session = await auth();
  if (!session?.user || !['admin', 'editor'].includes(session.user.role)) {
    throw new Error('UNAUTHORIZED');
  }
}

export async function createCategory(input: unknown): Promise<ActionResult> {
  try {
    await requireStaff();
    const parsed = categorySchema.safeParse(input);
    if (!parsed.success) return { success: false, error: 'Validation failed' };

    await connectDB();
    const exists = await Category.findOne({ slug: parsed.data.slug });
    if (exists) return { success: false, error: 'A category with this slug already exists' };

    await Category.create(parsed.data);
    revalidatePath('/admin/categories');
    revalidateTag('categories');
    return { success: true, data: undefined };
  } catch (err) {
    console.error('createCategory error:', err);
    return { success: false, error: 'Something went wrong' };
  }
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  try {
    await requireStaff();
    await connectDB();
    await Category.findByIdAndDelete(id);
    revalidatePath('/admin/categories');
    revalidateTag('categories');
    return { success: true, data: undefined };
  } catch (err) {
    console.error('deleteCategory error:', err);
    return { success: false, error: 'Something went wrong' };
  }
}

export async function createTag(name: string): Promise<ActionResult> {
  try {
    await requireStaff();
    if (!name || name.trim().length < 2) return { success: false, error: 'Tag name too short' };

    await connectDB();
    const slug = toSlug(name);
    const exists = await Tag.findOne({ slug });
    if (exists) return { success: false, error: 'This tag already exists' };

    await Tag.create({ name: name.trim(), slug });
    revalidatePath('/admin/tags');
    return { success: true, data: undefined };
  } catch (err) {
    console.error('createTag error:', err);
    return { success: false, error: 'Something went wrong' };
  }
}

export async function deleteTag(id: string): Promise<ActionResult> {
  try {
    await requireStaff();
    await connectDB();
    await Tag.findByIdAndDelete(id);
    revalidatePath('/admin/tags');
    return { success: true, data: undefined };
  } catch (err) {
    console.error('deleteTag error:', err);
    return { success: false, error: 'Something went wrong' };
  }
}
