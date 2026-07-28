'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Search } from 'lucide-react';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { href: '/blog', label: 'Articles' },
  { href: '/category/technology', label: 'Technology' },
  { href: '/category/business', label: 'Business' },
  { href: '/about', label: 'About' },
];

export default function Navbar({ siteName = 'The Ledger' }: { siteName?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-ink-100 bg-paper/90 backdrop-blur
      dark:border-ink-700 dark:bg-ink-900/90">
      <div className="container-editorial flex h-16 items-center justify-between">
        <Link
          href="/"
          className="font-display text-xl font-semibold tracking-tight text-ink-800 dark:text-paper"
        >
          {siteName}
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="link-underline font-body text-sm font-medium text-ink-600 dark:text-ink-100"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/search"
            aria-label="Search articles"
            className="flex h-9 w-9 items-center justify-center rounded-full text-ink-600
              transition-colors hover:text-amber-dark dark:text-ink-100 dark:hover:text-amber-light"
          >
            <Search size={17} strokeWidth={1.75} />
          </Link>
          <ThemeToggle />
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full text-ink-600 md:hidden
              dark:text-ink-100"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-ink-100 md:hidden dark:border-ink-700"
            aria-label="Mobile"
          >
            <ul className="container-editorial flex flex-col gap-1 py-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      'block rounded-md px-2 py-2.5 font-body text-sm font-medium text-ink-700',
                      'hover:bg-ink-50 dark:text-ink-100 dark:hover:bg-ink-800',
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
