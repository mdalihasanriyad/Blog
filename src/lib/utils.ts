import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import slugify from 'slugify';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toSlug(text: string): string {
  return slugify(text, { lower: true, strict: true, trim: true });
}

export function formatDate(date: Date | string, opts?: Intl.DateTimeFormatOptions): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...opts,
  });
}

export function truncate(text: string, length = 160): string {
  if (text.length <= length) return text;
  return text.slice(0, length).trimEnd() + '…';
}

/** Formats a large number the way editorial sites show view counts (1.2K, 3.4M). */
export function formatCompactNumber(n: number): string {
  return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(
    n,
  );
}
