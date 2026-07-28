'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { updateUserRole } from '@/actions/user.actions';
import type { UserRole } from '@/models/User';

export default function RoleSelect({ id, role }: { id: string; role: UserRole }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const onChange = (value: UserRole) => {
    startTransition(async () => {
      const result = await updateUserRole(id, value);
      if (result.success) {
        toast.success('Role updated');
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <select
      value={role}
      disabled={isPending}
      onChange={(e) => onChange(e.target.value as UserRole)}
      className="rounded-md border border-ink-200 bg-paper px-2 py-1 font-mono text-xs
        dark:border-ink-600 dark:bg-ink-800 dark:text-paper"
    >
      <option value="admin">Admin</option>
      <option value="editor">Editor</option>
      <option value="author">Author</option>
      <option value="reader">Reader</option>
    </select>
  );
}
