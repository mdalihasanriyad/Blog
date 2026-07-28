import NextAuth, { type DefaultSession } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/db';
import User, { type UserRole } from '@/models/User';
import { loginSchema } from '@/lib/validations/auth';
import { authConfig } from '@/lib/auth.config';

// declare module 'next-auth' {
//   interface Session {
//     user: {
//       id: string;
//       role: UserRole;
//     } & DefaultSession['user'];
//   }
//   interface User {
//     role?: UserRole;
//   }
// }

// declare module 'next-auth/jwt' {
//   interface JWT {
//     id: string;
//     role: UserRole;
//   }
// }

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        await connectDB();
        const user = await User.findOne({ email: parsed.data.email }).select('+password');
        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(parsed.data.password, user.password);
        if (!isValid) return null;

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],
});
