'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Send } from 'lucide-react';
import { replyToContact } from '@/actions/moderation.actions';

export default function ContactReplyForm({ id }: { id: string }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const onSend = () => {
    if (message.trim().length < 2) {
      toast.error('Write a reply message first');
      return;
    }
    startTransition(async () => {
      const result = await replyToContact(id, message);
      if (result.success) {
        toast.success('Reply sent');
        setMessage('');
        setOpen(false);
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-3 font-mono text-xs uppercase tracking-widest text-amber-dark hover:underline dark:text-amber-light"
      >
        Reply
      </button>
    );
  }

  return (
    <div className="mt-3 space-y-2">
      <textarea
        rows={3}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Write your reply — this will be emailed to the sender…"
        className="w-full rounded-md border border-ink-200 bg-paper px-3 py-2 font-body text-sm
          text-ink-800 focus:border-amber dark:border-ink-600 dark:bg-ink-800 dark:text-paper"
      />
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onSend}
          disabled={isPending}
          className="flex items-center gap-1.5 rounded-md bg-ink-800 px-3 py-1.5 font-body text-xs
            font-medium text-paper hover:bg-ink-700 disabled:opacity-60 dark:bg-amber dark:text-ink-900"
        >
          <Send size={12} /> {isPending ? 'Sending…' : 'Send reply'}
        </button>
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            setMessage('');
          }}
          disabled={isPending}
          className="rounded-md border border-ink-200 px-3 py-1.5 font-body text-xs text-ink-600
            dark:border-ink-600 dark:text-ink-200"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
