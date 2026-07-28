'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Search } from 'lucide-react';

export default function SearchBox({ initialQuery = '' }: { initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <form onSubmit={onSubmit} role="search" className="relative">
      <label htmlFor="search-input" className="sr-only">Search articles</label>
      <input
        id="search-input"
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search articles…"
        className="w-full rounded-md border border-ink-200 bg-paper px-4 py-3 pr-11 font-body text-sm
          text-ink-800 placeholder:text-ink-300 focus:border-amber
          dark:border-ink-600 dark:bg-ink-800 dark:text-paper"
      />
      <button
        type="submit"
        aria-label="Search"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-amber-dark"
      >
        <Search size={18} />
      </button>
    </form>
  );
}
