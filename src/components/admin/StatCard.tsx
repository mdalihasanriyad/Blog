import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

export default function StatCard({
  label,
  value,
  icon: Icon,
  accent = false,
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  accent?: boolean;
}) {
  return (
    <div className="rounded-lg border border-ink-100 bg-paper p-5 dark:border-ink-700 dark:bg-ink-900">
      <div className="flex items-center justify-between">
        <p className="font-mono text-xs uppercase tracking-widest text-ink-400 dark:text-ink-400">
          {label}
        </p>
        <Icon
          size={16}
          className={cn('text-ink-300 dark:text-ink-500', accent && 'text-amber-dark dark:text-amber-light')}
        />
      </div>
      <p className="mt-2 font-display text-3xl font-semibold text-ink-800 dark:text-paper">{value}</p>
    </div>
  );
}
