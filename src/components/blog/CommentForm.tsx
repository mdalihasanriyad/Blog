'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { commentSchema } from '@/lib/validations/post';
import { submitComment } from '@/actions/engagement.actions';
import type { z } from 'zod';

type FormValues = z.infer<typeof commentSchema>;

export default function CommentForm({ postId }: { postId: string }) {
  const { data: session } = useSession();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(commentSchema),
    defaultValues: { postId },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const result = await submitComment(values);
      if (result?.success) {
        toast.success('Thanks! Your comment is awaiting moderation.');
        reset({ postId, content: '' });
      } else {
        toast.error(result?.error ?? 'Something went wrong. Please try again.');
      }
    } catch (err) {
      console.error('Comment submit error:', err);
      toast.error('Something went wrong. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-3">
      <input type="hidden" {...register('postId')} value={postId} />

      {!session?.user && (
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="guestName" className="sr-only">Name</label>
            <input
              id="guestName"
              placeholder="Your name"
              {...register('guestName')}
              className="w-full rounded-md border border-ink-200 bg-paper px-3 py-2 text-sm dark:border-ink-600 dark:bg-ink-800"
            />
          </div>
          <div>
            <label htmlFor="guestEmail" className="sr-only">Email</label>
            <input
              id="guestEmail"
              type="email"
              placeholder="Your email (not published)"
              {...register('guestEmail')}
              className="w-full rounded-md border border-ink-200 bg-paper px-3 py-2 text-sm dark:border-ink-600 dark:bg-ink-800"
            />
          </div>
        </div>
      )}

      <div>
        <label htmlFor="content" className="sr-only">Comment</label>
        <textarea
          id="content"
          rows={4}
          placeholder="Share your thoughts…"
          {...register('content')}
          className="w-full rounded-md border border-ink-200 bg-paper px-3 py-2 text-sm dark:border-ink-600 dark:bg-ink-800"
        />
        {errors.content && (
          <p role="alert" className="mt-1 font-mono text-xs text-brick">
            {errors.content.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-md bg-ink-800 px-4 py-2 text-sm font-medium text-paper transition-colors
          hover:bg-ink-700 disabled:opacity-60 dark:bg-amber dark:text-ink-900"
      >
        {isSubmitting ? 'Posting…' : 'Post comment'}
      </button>
    </form>
  );
}
