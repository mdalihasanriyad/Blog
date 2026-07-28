'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Check, X, Ban } from 'lucide-react';
import { toast } from 'sonner';
import { moderateComment } from '@/actions/moderation.actions';
import type { CommentStatus } from '@/models/Comment';

export default function CommentModerationActions({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const act = (status: CommentStatus) => {
    startTransition(async () => {
      const result = await moderateComment(id, status);
      if (result.success) {
        toast.success(`Comment marked as ${status}`);
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <div className="flex items-center gap-3">
      <button disabled={isPending} onClick={() => act('approved')} aria-label="Approve" className="text-sage hover:text-sage-dark disabled:opacity-50">
        <Check size={16} />
      </button>
      <button disabled={isPending} onClick={() => act('spam')} aria-label="Mark as spam" className="text-amber-dark hover:text-amber disabled:opacity-50">
        <Ban size={16} />
      </button>
      <button disabled={isPending} onClick={() => act('trash')} aria-label="Trash" className="text-brick hover:text-brick-light disabled:opacity-50">
        <X size={16} />
      </button>
    </div>
  );
}
