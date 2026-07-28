'use client';

import { Twitter, Linkedin, Facebook, Link2, Check } from 'lucide-react';
import { useState } from 'react';

export default function SocialShare({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const links = [
    {
      label: 'Share on X',
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    },
    {
      label: 'Share on LinkedIn',
      icon: Linkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      label: 'Share on Facebook',
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
  ];

  const copyLink = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="flex items-center gap-2">
      {links.map(({ label, icon: Icon, href }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer nofollow"
          aria-label={label}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-ink-100
            text-ink-600 transition-colors hover:border-amber hover:text-amber-dark
            dark:border-ink-700 dark:text-ink-200 dark:hover:text-amber-light"
        >
          <Icon size={15} strokeWidth={1.75} />
        </a>
      ))}
      <button
        type="button"
        onClick={copyLink}
        aria-label="Copy link"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-ink-100
          text-ink-600 transition-colors hover:border-amber hover:text-amber-dark
          dark:border-ink-700 dark:text-ink-200 dark:hover:text-amber-light"
      >
        {copied ? <Check size={15} /> : <Link2 size={15} strokeWidth={1.75} />}
      </button>
    </div>
  );
}
