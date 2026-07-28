import type { Metadata } from 'next';
import LoginForm from '@/components/blog/LoginForm';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Log In',
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4 dark:bg-ink-900">
      <div className="w-full max-w-sm">
        <h1 className="mb-1 text-center font-display text-2xl font-semibold text-ink-800 dark:text-paper">
          Welcome back
        </h1>
        <p className="mb-8 text-center font-body text-sm text-slate dark:text-ink-200">
          Log in to manage the site.
        </p>
        <Suspense fallback={<div>Loading...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
