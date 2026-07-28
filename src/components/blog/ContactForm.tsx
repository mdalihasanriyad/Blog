'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { contactSchema } from '@/lib/validations/post';
import { submitContactForm } from '@/actions/engagement.actions';
import type { z } from 'zod';

type FormValues = z.infer<typeof contactSchema>;

export default function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(contactSchema) });

  const onSubmit = async (values: FormValues) => {
    try {
      const result = await submitContactForm(values);
      if (result?.success) {
        toast.success("Message sent — we'll get back to you soon.");
        reset();
      } else {
        toast.error(result?.error ?? 'Something went wrong. Please try again.');
      }
    } catch (err) {
      console.error('Contact form submit error:', err);
      toast.error('Something went wrong. Please try again.');
    }
  };

  const fieldClass =
    'w-full rounded-md border border-ink-200 bg-paper px-3 py-2 font-body text-sm text-ink-800 focus:border-amber dark:border-ink-600 dark:bg-ink-800 dark:text-paper';

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
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
      </div>
      <div>
        <label htmlFor="subject" className="mb-1 block font-body text-sm font-medium text-ink-700 dark:text-ink-100">Subject</label>
        <input id="subject" {...register('subject')} className={fieldClass} />
        {errors.subject && <p className="mt-1 font-mono text-xs text-brick">{errors.subject.message}</p>}
      </div>
      <div>
        <label htmlFor="message" className="mb-1 block font-body text-sm font-medium text-ink-700 dark:text-ink-100">Message</label>
        <textarea id="message" rows={5} {...register('message')} className={fieldClass} />
        {errors.message && <p className="mt-1 font-mono text-xs text-brick">{errors.message.message}</p>}
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-md bg-ink-800 px-5 py-2.5 font-body text-sm font-medium text-paper
          transition-colors hover:bg-ink-700 disabled:opacity-60 dark:bg-amber dark:text-ink-900"
      >
        {isSubmitting ? 'Sending…' : 'Send message'}
      </button>
    </form>
  );
}
