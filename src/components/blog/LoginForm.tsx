'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { loginSchema, type LoginFormValues } from '@/lib/validations/auth';

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values: LoginFormValues) => {
    const result = await signIn('credentials', {
      ...values,
      redirect: false,
    });

    if (result?.error) {
      toast.error('Invalid email or password');
      return;
    }

    toast.success('Welcome back!');
    router.push(searchParams.get('callbackUrl') || '/admin');
    router.refresh();
  };

  const fieldClass =
    'w-full rounded-md border border-ink-200 bg-paper px-3 py-2.5 font-body text-sm text-ink-800 focus:border-amber dark:border-ink-600 dark:bg-ink-800 dark:text-paper';

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <div>
        <label htmlFor="email" className="mb-1 block font-body text-sm font-medium text-ink-700 dark:text-ink-100">
          Email
        </label>
        <input id="email" type="email" autoComplete="email" {...register('email')} className={fieldClass} />
        {errors.email && <p className="mt-1 font-mono text-xs text-brick">{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="password" className="mb-1 block font-body text-sm font-medium text-ink-700 dark:text-ink-100">
          Password
        </label>
        <input
          id="password"
          type={showPassword ? 'text' : 'password'}
          autoComplete="current-password"
          {...register('password')}
          className={fieldClass}
        />
        {errors.password && <p className="mt-1 font-mono text-xs text-brick">{errors.password.message}</p>}
        <button
          type="button"
          onClick={() => setShowPassword((v) => !v)}
          className="mt-1 font-mono text-xs text-ink-400 hover:text-amber-dark"
        >
          {showPassword ? 'Hide password' : 'Show password'}
        </button>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-md bg-ink-800 py-2.5 font-body text-sm font-medium text-paper
          transition-colors hover:bg-ink-700 disabled:opacity-60 dark:bg-amber dark:text-ink-900"
      >
        {isSubmitting ? 'Logging in…' : 'Log in'}
      </button>
    </form>
  );
}
