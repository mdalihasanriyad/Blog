import Link from 'next/link';
import NewsletterForm from '@/components/blog/NewsletterForm';

const LEGAL_LINKS = [
  { href: '/about', label: 'About' },
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms of Service' },
];

export default function Footer({ siteName = 'The Ledger' }: { siteName?: string }) {
  return (
    <footer className="mt-24 border-t border-ink-100 bg-paper-dim dark:border-ink-700 dark:bg-ink-950">
      <div className="container-editorial grid gap-10 py-14 md:grid-cols-[1.3fr_1fr]">
        <div>
          <h2 className="font-display text-2xl font-semibold text-ink-800 dark:text-paper">
            Stay in the loop
          </h2>
          <p className="mt-2 max-w-md font-body text-sm text-slate dark:text-ink-200">
            One thoughtful email whenever we publish something worth your time. No spam, ever.
          </p>
          <div className="mt-5 max-w-sm">
            <NewsletterForm />
          </div>
        </div>

        <div className="flex flex-col gap-2 md:items-end">
          <span className="font-display text-lg font-semibold text-ink-800 dark:text-paper">
            {siteName}
          </span>
          <nav className="flex flex-wrap gap-4 md:justify-end">
            {LEGAL_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="link-underline font-body text-sm text-slate dark:text-ink-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <div className="border-t border-ink-100 py-5 dark:border-ink-700">
        <p className="container-editorial font-mono text-xs text-slate dark:text-ink-300">
          © {new Date().getFullYear()} {siteName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
