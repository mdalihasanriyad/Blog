'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { connectDB } from '@/lib/db';
import Post from '@/models/Post';
import { auth } from '@/lib/auth';
import { postSchema, type PostFormValues } from '@/lib/validations/post';
import readingTime from 'reading-time';

type ActionResult<T = undefined> =
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };

const STAFF_ROLES = ['admin', 'editor', 'author'];

async function requireStaff() {
  const session = await auth();
  if (!session?.user || !STAFF_ROLES.includes(session.user.role)) {
    throw new Error('UNAUTHORIZED');
  }
  return session.user;
}

export async function createPost(input: PostFormValues): Promise<ActionResult<{ id: string }>> {
  try {
    const user = await requireStaff();
    const parsed = postSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: 'Validation failed',
        fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
      };
    }

    await connectDB();

    const existing = await Post.findOne({ slug: parsed.data.slug });
    if (existing) {
      return {
        success: false,
        error: 'A post with this slug already exists',
        fieldErrors: { slug: ['This slug is already taken'] },
      };
    }

    const stats = readingTime(parsed.data.content);
    const isPublishingNow = parsed.data.status === 'published';

    const post = await Post.create({
      ...parsed.data,
      author: user.id,
      readingTimeMinutes: Math.max(1, Math.ceil(stats.minutes)),
      publishedAt: isPublishingNow ? new Date() : null,
      scheduledAt: parsed.data.scheduledAt ? new Date(parsed.data.scheduledAt) : null,
    });

    revalidatePath('/admin/posts');
    revalidatePath('/blog');
    revalidateTag('posts');

    return { success: true, data: { id: post._id.toString() } };
  } catch (err) {
    if (err instanceof Error && err.message === 'UNAUTHORIZED') {
      return { success: false, error: 'You do not have permission to create posts' };
    }
    console.error('createPost error:', err);
    return { success: false, error: 'Something went wrong while creating the post' };
  }
}

export async function updatePost(
  id: string,
  input: PostFormValues,
): Promise<ActionResult<{ id: string }>> {
  try {
    await requireStaff();
    const parsed = postSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: 'Validation failed',
        fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
      };
    }

    await connectDB();

    const duplicate = await Post.findOne({ slug: parsed.data.slug, _id: { $ne: id } });
    if (duplicate) {
      return {
        success: false,
        error: 'A post with this slug already exists',
        fieldErrors: { slug: ['This slug is already taken'] },
      };
    }

    const existingPost = await Post.findById(id);
    if (!existingPost) {
      return { success: false, error: 'Post not found' };
    }

    const stats = readingTime(parsed.data.content);
    const isNewlyPublished = parsed.data.status === 'published' && !existingPost.publishedAt;

    existingPost.set({
      ...parsed.data,
      readingTimeMinutes: Math.max(1, Math.ceil(stats.minutes)),
      publishedAt: isNewlyPublished ? new Date() : existingPost.publishedAt,
      scheduledAt: parsed.data.scheduledAt ? new Date(parsed.data.scheduledAt) : null,
    });
    await existingPost.save();

    revalidatePath('/admin/posts');
    revalidatePath(`/blog/${parsed.data.slug}`);
    revalidatePath('/blog');
    revalidateTag('posts');

    return { success: true, data: { id: existingPost._id.toString() } };
  } catch (err) {
    if (err instanceof Error && err.message === 'UNAUTHORIZED') {
      return { success: false, error: 'You do not have permission to edit posts' };
    }
    console.error('updatePost error:', err);
    return { success: false, error: 'Something went wrong while updating the post' };
  }
}

export async function deletePost(id: string): Promise<ActionResult> {
  try {
    await requireStaff();
    await connectDB();
    await Post.findByIdAndDelete(id);

    revalidatePath('/admin/posts');
    revalidatePath('/blog');
    revalidateTag('posts');

    return { success: true, data: undefined };
  } catch (err) {
    if (err instanceof Error && err.message === 'UNAUTHORIZED') {
      return { success: false, error: 'You do not have permission to delete posts' };
    }
    console.error('deletePost error:', err);
    return { success: false, error: 'Something went wrong while deleting the post' };
  }
}

/** Fire-and-forget view counter, called from the post page on mount. */
export async function incrementPostViews(id: string): Promise<void> {
  try {
    await connectDB();
    await Post.findByIdAndUpdate(id, { $inc: { views: 1, viewsLast7Days: 1 } });
  } catch (err) {
    console.error('incrementPostViews error:', err);
  }
}

export async function toggleBookmark(postId: string): Promise<ActionResult<{ bookmarked: boolean }>> {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: 'Please log in to bookmark posts' };
    }

    await connectDB();
    const { default: User } = await import('@/models/User');
    const user = await User.findById(session.user.id);
    if (!user) return { success: false, error: 'User not found' };

    const idx = user.bookmarks.findIndex((b) => b.toString() === postId);
    let bookmarked: boolean;
    if (idx >= 0) {
      user.bookmarks.splice(idx, 1);
      bookmarked = false;
    } else {
      user.bookmarks.push(postId as unknown as never);
      bookmarked = true;
    }
    await user.save();

    revalidatePath('/account/bookmarks');
    return { success: true, data: { bookmarked } };
  } catch (err) {
    console.error('toggleBookmark error:', err);
    return { success: false, error: 'Something went wrong' };
  }
}
