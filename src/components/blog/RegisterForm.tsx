'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { registerSchema, type RegisterFormValues } from '@/lib/validations/auth';
import { registerUser } from '@/actions/auth.actions';

export default function RegisterForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (values: RegisterFormValues) => {
    const result = await registerUser(values);
    if (!result.success) {
      toast.error(result.error);
      return;
    }

    await signIn('credentials', { email: values.email, password: values.password, redirect: false });
    toast.success('Account created!');
    router.push('/');
    router.refresh();
  };

  const fieldClass =
    'w-full rounded-md border border-ink-200 bg-paper px-3 py-2.5 font-body text-sm text-ink-800 focus:border-amber dark:border-ink-600 dark:bg-ink-800 dark:text-paper';

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <div>
        <label htmlFor="name" className="mb-1 block font-body text-sm font-medium text-ink-700 dark:text-ink-100">Name</label>
        <input id="name" {...register('name')} className={fieldClass} />
        {errors.name && <p className="mt-1 font-mono text-xs text-brick">{errors.name.message}</p>}
      </div>
      <div>
        <label htmlFor="email" className="mb-1 block font-body text-sm font-medium text-ink-700 dark:text-ink-100">Email</label>
        <input id="email" type="email" {...register('email')} className={fieldClass} />
        {errors.email && <p className="mt-1 font-mono text-xs text-brick">{errors.email.message}</p>}
      </div>
      <div>
        <label htmlFor="password" className="mb-1 block font-body text-sm font-medium text-ink-700 dark:text-ink-100">Password</label>
        <input id="password" type="password" {...register('password')} className={fieldClass} />
        {errors.password && <p className="mt-1 font-mono text-xs text-brick">{errors.password.message}</p>}
      </div>
      <div>
        <label htmlFor="confirmPassword" className="mb-1 block font-body text-sm font-medium text-ink-700 dark:text-ink-100">Confirm password</label>
        <input id="confirmPassword" type="password" {...register('confirmPassword')} className={fieldClass} />
        {errors.confirmPassword && <p className="mt-1 font-mono text-xs text-brick">{errors.confirmPassword.message}</p>}
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-md bg-ink-800 py-2.5 font-body text-sm font-medium text-paper
          transition-colors hover:bg-ink-700 disabled:opacity-60 dark:bg-amber dark:text-ink-900"
      >
        {isSubmitting ? 'Creating account…' : 'Create account'}
      </button>
    </form>
  );
}
