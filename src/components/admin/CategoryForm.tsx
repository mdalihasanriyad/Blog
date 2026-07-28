'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { createCategory } from '@/actions/taxonomy.actions';
import { toSlug } from '@/lib/utils';

export default function CategoryForm({ parentOptions }: { parentOptions: { id: string; name: string }[] }) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [slugTouched, setSlugTouched] = useState(false);
  const [description, setDescription] = useState('');
  const [parent, setParent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const result = await createCategory({
      name,
      slug,
      description,
      parent: parent || null,
      metaTitle: '',
      metaDescription: '',
    });
    setIsSubmitting(false);

    if (result.success) {
      toast.success('Category created');
      setName('');
      setSlug('');
      setDescription('');
      router.refresh();
    } else {
      toast.error(result.error);
    }
  };

  const inputClass =
    'w-full rounded-md border border-ink-200 bg-paper px-3 py-2 font-body text-sm dark:border-ink-600 dark:bg-ink-800 dark:text-paper';

  return (
    <form onSubmit={onSubmit} className="grid gap-3 rounded-lg border border-ink-100 p-4 dark:border-ink-700 sm:grid-cols-2">
      <input
        placeholder="Name"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          if (!slugTouched) setSlug(toSlug(e.target.value));
        }}
        className={inputClass}
        required
      />
      <input
        placeholder="Slug"
        value={slug}
        onChange={(e) => {
          setSlugTouched(true);
          setSlug(e.target.value);
        }}
        className={inputClass}
        required
      />
      <input
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className={`${inputClass} sm:col-span-2`}
      />
      <select value={parent} onChange={(e) => setParent(e.target.value)} className={inputClass}>
        <option value="">No parent (top-level)</option>
        {parentOptions.map((p) => (
          <option key={p.id} value={p.id}>{p.name}</option>
        ))}
      </select>
      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-md bg-ink-800 px-4 py-2 font-body text-sm font-medium text-paper
          hover:bg-ink-700 disabled:opacity-60 dark:bg-amber dark:text-ink-900"
      >
        {isSubmitting ? 'Adding…' : 'Add category'}
      </button>
    </form>
  );
}
