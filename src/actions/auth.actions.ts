'use server';

import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { registerSchema } from '@/lib/validations/auth';

type ActionResult<T = undefined> =
  | { success: true; data: T }
  | { success: false; error: string };

export async function registerUser(input: unknown): Promise<ActionResult> {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Validation failed' };
  }

  try {
    await connectDB();
    const existing = await User.findOne({ email: parsed.data.email });
    if (existing) {
      return { success: false, error: 'An account with this email already exists' };
    }

    const hashedPassword = await bcrypt.hash(parsed.data.password, 12);
    await User.create({
      name: parsed.data.name,
      email: parsed.data.email,
      password: hashedPassword,
      role: 'reader',
    });

    return { success: true, data: undefined };
  } catch (err) {
    console.error('registerUser error:', err);
    return { success: false, error: 'Something went wrong. Please try again.' };
  }
}
