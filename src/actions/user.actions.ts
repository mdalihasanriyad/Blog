'use server';

import { revalidatePath } from 'next/cache';
import { connectDB } from '@/lib/db';
import User, { type UserRole } from '@/models/User';
import { auth } from '@/lib/auth';

type ActionResult<T = undefined> =
  | { success: true; data: T }
  | { success: false; error: string };

export async function updateUserRole(id: string, role: UserRole): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
      return { success: false, error: 'Only admins can change user roles' };
    }
    if (session.user.id === id) {
      return { success: false, error: 'You cannot change your own role' };
    }

    await connectDB();
    await User.findByIdAndUpdate(id, { role });
    revalidatePath('/admin/users');
    return { success: true, data: undefined };
  } catch (err) {
    console.error('updateUserRole error:', err);
    return { success: false, error: 'Something went wrong' };
  }
}
