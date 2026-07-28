'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { newsletterSchema } from '@/lib/validations/post';
import { subscribeNewsletter } from '@/actions/engagement.actions';
import type { z } from 'zod';

type FormValues = z.infer<typeof newsletterSchema>;

export default function NewsletterForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(newsletterSchema) });

  const onSubmit = async (values: FormValues) => {
    try {
      const result = await subscribeNewsletter(values);
      if (result?.success) {
        toast.success("You're subscribed. Check your inbox for a welcome note.");
        reset();
      } else {
        toast.error(result?.error ?? 'Something went wrong. Please try again.');
      }
    } catch (err) {
      console.error('Newsletter subscribe error:', err);
      toast.error('Something went wrong. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-2">
      <div className="flex gap-2">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          {...register('email')}
          className="w-full rounded-md border border-ink-200 bg-paper px-3 py-2 font-body text-sm
            text-ink-800 placeholder:text-ink-300 focus:border-amber
            dark:border-ink-600 dark:bg-ink-800 dark:text-paper"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="shrink-0 rounded-md bg-ink-800 px-4 py-2 font-body text-sm font-medium text-paper
            transition-colors hover:bg-ink-700 disabled:opacity-60
            dark:bg-amber dark:text-ink-900 dark:hover:bg-amber-light"
        >
          {isSubmitting ? 'Sending…' : 'Subscribe'}
        </button>
      </div>
      {errors.email && (
        <p role="alert" className="font-mono text-xs text-brick">
          {errors.email.message}
        </p>
      )}
    </form>
  );
}
