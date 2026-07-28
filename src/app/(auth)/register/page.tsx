import type { Metadata } from 'next';
import RegisterForm from '@/components/blog/RegisterForm';

export const metadata: Metadata = {
  title: 'Create an account',
  robots: { index: false, follow: false },
};

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4 dark:bg-ink-900">
      <div className="w-full max-w-sm">
        <h1 className="mb-1 text-center font-display text-2xl font-semibold text-ink-800 dark:text-paper">
          Create an account
        </h1>
        <p className="mb-8 text-center font-body text-sm text-slate dark:text-ink-200">
          Bookmark articles and join the discussion.
        </p>
        <RegisterForm />
      </div>
    </div>
  );
}
