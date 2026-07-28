'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { createTag } from '@/actions/taxonomy.actions';

export default function TagForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const result = await createTag(name);
    setIsSubmitting(false);
    if (result.success) {
      toast.success('Tag added');
      setName('');
      router.refresh();
    } else {
      toast.error(result.error);
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex gap-3">
      <input
        placeholder="New tag name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full max-w-xs rounded-md border border-ink-200 bg-paper px-3 py-2 font-body text-sm
          dark:border-ink-600 dark:bg-ink-800 dark:text-paper"
        required
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-md bg-ink-800 px-4 py-2 font-body text-sm font-medium text-paper
          hover:bg-ink-700 disabled:opacity-60 dark:bg-amber dark:text-ink-900"
      >
        {isSubmitting ? 'Adding…' : 'Add tag'}
      </button>
    </form>
  );
}
