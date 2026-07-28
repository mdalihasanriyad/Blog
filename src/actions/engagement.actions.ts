'use server';

import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { nanoid } from 'nanoid';
import { connectDB } from '@/lib/db';
import Comment from '@/models/Comment';
import Subscriber from '@/models/Subscriber';
import Contact from '@/models/Contact';
import { auth } from '@/lib/auth';
import { commentSchema, contactSchema, newsletterSchema } from '@/lib/validations/post';
import { rateLimit } from '@/lib/rate-limit';
import { sendWelcomeEmail } from '@/lib/email';

type ActionResult<T = undefined> =
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };

async function getClientIp(): Promise<string> {
  try {
    const h = await headers();
    return h.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  } catch {
    return 'unknown';
  }
}

export async function submitComment(
  input: unknown,
): Promise<ActionResult<{ pending: boolean }>> {
  try {
    const ip = await getClientIp();
    const { success: allowed } = await rateLimit(`comment:${ip}`);
    if (!allowed) {
      return {
        success: false,
        error: 'Too many comments — please slow down and try again shortly.',
      };
    }

    const parsed = commentSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: 'Validation failed',
        fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
      };
    }

    await connectDB();
    const session = await auth();

    await Comment.create({
      post: parsed.data.postId,
      author: session?.user?.id ?? null,
      guestName: session?.user ? undefined : parsed.data.guestName,
      guestEmail: session?.user ? undefined : parsed.data.guestEmail,
      content: parsed.data.content,
      parent: parsed.data.parent ?? null,
      status: 'pending', // all comments are moderated before showing publicly
    });

    revalidatePath('/admin/comments');
    return { success: true, data: { pending: true } };
  } catch (err) {
    console.error('submitComment error:', err);
    return { success: false, error: 'Something went wrong while posting your comment' };
  }
}

export async function subscribeNewsletter(input: unknown): Promise<ActionResult> {
  try {
    const ip = await getClientIp();
    const { success: allowed } = await rateLimit(`newsletter:${ip}`);
    if (!allowed) {
      return { success: false, error: 'Too many attempts — please try again in a minute.' };
    }

    const parsed = newsletterSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: 'Please enter a valid email address',
        fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
      };
    }

    await connectDB();
    const existing = await Subscriber.findOne({ email: parsed.data.email });
    if (existing) {
      if (existing.status === 'unsubscribed') {
        existing.status = 'pending';
        existing.confirmToken = nanoid(32);
        await existing.save();
      } else {
        return { success: true, data: undefined }; // already subscribed — no need to error
      }
    } else {
      await Subscriber.create({
        email: parsed.data.email,
        confirmToken: nanoid(32),
      });
    }

    try {
      await sendWelcomeEmail(parsed.data.email);
    } catch (emailErr) {
      // Don't fail the whole subscription just because the welcome email failed to send
      console.error('sendWelcomeEmail error:', emailErr);
    }

    revalidatePath('/admin/subscribers');
    return { success: true, data: undefined };
  } catch (err) {
    console.error('subscribeNewsletter error:', err);
    return { success: false, error: 'Something went wrong. Please try again.' };
  }
}

export async function submitContactForm(input: unknown): Promise<ActionResult> {
  try {
    const ip = await getClientIp();
    const { success: allowed } = await rateLimit(`contact:${ip}`);
    if (!allowed) {
      return { success: false, error: 'Too many messages — please try again in a minute.' };
    }

    const parsed = contactSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: 'Validation failed',
        fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
      };
    }

    await connectDB();
    await Contact.create(parsed.data);
    revalidatePath('/admin/contacts');
    return { success: true, data: undefined };
  } catch (err) {
    console.error('submitContactForm error:', err);
    return { success: false, error: 'Something went wrong. Please try again.' };
  }
}
