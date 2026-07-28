'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { updateContactStatus } from '@/actions/moderation.actions';

export default function ContactStatusSelect({ id, status }: { id: string; status: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const onChange = (value: string) => {
    startTransition(async () => {
      const result = await updateContactStatus(id, value as any);
      if (result.success) {
        toast.success('Status updated');
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <select
      value={status}
      disabled={isPending}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-md border border-ink-200 bg-paper px-2 py-1 font-mono text-xs
        dark:border-ink-600 dark:bg-ink-800 dark:text-paper"
    >
      <option value="new">New</option>
      <option value="read">Read</option>
      <option value="replied">Replied</option>
      <option value="archived">Archived</option>
    </select>
  );
}
