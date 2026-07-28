'use client';

import { useEffect, useState } from 'react';
import { cn, toSlug } from '@/lib/utils';

interface Heading {
  id: string;
  text: string;
  level: number;
}

/** Extracts H2/H3 headings from raw markdown source for the sidebar TOC. */
function extractHeadings(markdown: string): Heading[] {
  const lines = markdown.split('\n');
  const headings: Heading[] = [];
  for (const line of lines) {
    const match = line.match(/^(#{2,3})\s+(.*)/);
    if (match) {
      const level = match[1].length;
      const text = match[2].trim();
      headings.push({ id: toSlug(text), text, level });
    }
  }
  return headings;
}

export default function TableOfContents({ content }: { content: string }) {
  const [headings] = useState(() => extractHeadings(content));
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    if (!headings.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: '-100px 0px -70% 0px' },
    );
    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 2) return null;

  return (
    <nav aria-label="Table of contents" className="sticky top-24">
      <p className="mb-3 font-mono text-xs uppercase tracking-widest text-ink-400 dark:text-ink-400">
        On this page
      </p>
      <ul className="space-y-2 border-l border-ink-100 dark:border-ink-700">
        {headings.map((h) => (
          <li key={h.id} style={{ paddingLeft: h.level === 3 ? '1.5rem' : '1rem' }}>
            <a
              href={`#${h.id}`}
              className={cn(
                '-ml-px block border-l-2 py-0.5 font-body text-sm transition-colors',
                activeId === h.id
                  ? 'border-amber font-medium text-ink-800 dark:text-paper'
                  : 'border-transparent text-slate hover:text-ink-700 dark:text-ink-300 dark:hover:text-paper',
              )}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
