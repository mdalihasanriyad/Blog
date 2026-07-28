'use server';

import { revalidatePath } from 'next/cache';
import { connectDB } from '@/lib/db';
import Comment, { type CommentStatus } from '@/models/Comment';
import Contact from '@/models/Contact';
import Settings from '@/models/Settings';
import { auth } from '@/lib/auth';
import { sendContactReply } from '@/lib/email';

type ActionResult<T = undefined> =
  | { success: true; data: T }
  | { success: false; error: string };

async function requireStaff() {
  const session = await auth();
  if (!session?.user || !['admin', 'editor'].includes(session.user.role)) {
    throw new Error('UNAUTHORIZED');
  }
}

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'admin') {
    throw new Error('UNAUTHORIZED');
  }
}

export async function moderateComment(id: string, status: CommentStatus): Promise<ActionResult> {
  try {
    await requireStaff();
    await connectDB();
    await Comment.findByIdAndUpdate(id, { status });
    revalidatePath('/admin/comments');
    return { success: true, data: undefined };
  } catch (err) {
    console.error('moderateComment error:', err);
    return { success: false, error: 'Something went wrong' };
  }
}

export async function updateContactStatus(
  id: string,
  status: 'new' | 'read' | 'replied' | 'archived',
): Promise<ActionResult> {
  try {
    await requireStaff();
    await connectDB();
    await Contact.findByIdAndUpdate(id, { status });
    revalidatePath('/admin/contacts');
    return { success: true, data: undefined };
  } catch (err) {
    console.error('updateContactStatus error:', err);
    return { success: false, error: 'Something went wrong' };
  }
}

export async function updateSiteSettings(input: Record<string, unknown>): Promise<ActionResult> {
  try {
    await requireAdmin();
    await connectDB();
    await Settings.findOneAndUpdate({}, input, { upsert: true, new: true });
    revalidatePath('/admin/settings');
    return { success: true, data: undefined };
  } catch (err) {
    console.error('updateSiteSettings error:', err);
    return { success: false, error: 'Something went wrong' };
  }
}

export async function replyToContact(id: string, replyMessage: string): Promise<ActionResult> {
  try {
    await requireStaff();

    if (!replyMessage || replyMessage.trim().length < 2) {
      return { success: false, error: 'Reply message is too short' };
    }

    await connectDB();
    const contact = await Contact.findById(id);
    if (!contact) {
      return { success: false, error: 'Message not found' };
    }

    await sendContactReply({
      to: contact.email,
      recipientName: contact.name,
      originalSubject: contact.subject,
      replyMessage: replyMessage.trim(),
    });

    contact.status = 'replied';
    contact.replyMessage = replyMessage.trim();
    contact.repliedAt = new Date();
    await contact.save();

    revalidatePath('/admin/contacts');
    return { success: true, data: undefined };
  } catch (err) {
    console.error('replyToContact error:', err);
    const message =
      err instanceof Error && err.message.includes('not configured')
        ? err.message
        : 'Failed to send reply. Please try again.';
    return { success: false, error: message };
  }
}
