'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { deletePost } from '@/actions/post.actions';

export default function DeletePostButton({ id, title }: { id: string; title: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const onDelete = () => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    startTransition(async () => {
      const result = await deletePost(id);
      if (result.success) {
        toast.success('Post deleted');
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <button
      type="button"
      onClick={onDelete}
      disabled={isPending}
      aria-label={`Delete ${title}`}
      className="text-ink-400 hover:text-brick disabled:opacity-50"
    >
      <Trash2 size={16} />
    </button>
  );
}
