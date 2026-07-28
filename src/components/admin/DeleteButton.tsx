'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function DeleteButton({
  id,
  label,
  action,
}: {
  id: string;
  label: string;
  action: (id: string) => Promise<{ success: boolean; error?: string }>;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const onDelete = () => {
    if (!window.confirm(`Delete "${label}"?`)) return;
    startTransition(async () => {
      const result = await action(id);
      if (result.success) {
        toast.success('Deleted');
        router.refresh();
      } else {
        toast.error(result.error ?? 'Something went wrong');
      }
    });
  };

  return (
    <button
      type="button"
      onClick={onDelete}
      disabled={isPending}
      aria-label={`Delete ${label}`}
      className="text-ink-400 hover:text-brick disabled:opacity-50"
    >
      <Trash2 size={15} />
    </button>
  );
}
