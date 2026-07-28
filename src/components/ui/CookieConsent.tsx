'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'cookie-consent';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : 'accepted';
    if (!consent) setVisible(true);
  }, []);

  const respond = (value: 'accepted' | 'rejected') => {
    localStorage.setItem(STORAGE_KEY, value);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-ink-100 bg-paper/95 p-4 backdrop-blur
        dark:border-ink-700 dark:bg-ink-900/95"
    >
      <div className="container-editorial flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
        <p className="font-body text-sm text-ink-700 dark:text-ink-100">
          We use cookies to understand traffic and serve relevant ads. See our{' '}
          <a href="/privacy" className="link-underline font-medium">
            Privacy Policy
          </a>
          .
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            onClick={() => respond('rejected')}
            className="rounded-md border border-ink-200 px-3 py-1.5 font-body text-sm text-ink-700
              dark:border-ink-600 dark:text-ink-100"
          >
            Decline
          </button>
          <button
            onClick={() => respond('accepted')}
            className="rounded-md bg-ink-800 px-3 py-1.5 font-body text-sm font-medium text-paper
              dark:bg-amber dark:text-ink-900"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
