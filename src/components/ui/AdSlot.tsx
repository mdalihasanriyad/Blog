'use client';

import { useEffect, useRef } from 'react';

type AdSlotPosition = 'header' | 'sidebar' | 'in-article' | 'footer' | 'sticky-mobile';

interface AdSlotProps {
  slotId?: string;
  position: AdSlotPosition;
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

const POSITION_LABEL: Record<AdSlotPosition, string> = {
  header: 'Header ad',
  sidebar: 'Sidebar ad',
  'in-article': 'In-article ad',
  footer: 'Footer ad',
  'sticky-mobile': 'Sticky ad',
};

/**
 * Renders a Google AdSense unit. Controlled centrally via
 * NEXT_PUBLIC_ADS_ENABLED and the admin Ad Manager settings, so ads can be
 * switched off site-wide (e.g. during an AdSense policy review) without
 * touching every page template.
 */
export default function AdSlot({ slotId, position, className = '' }: AdSlotProps) {
  const insRef = useRef<HTMLModElement>(null);
  const adsEnabled = process.env.NEXT_PUBLIC_ADS_ENABLED === 'true';
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  useEffect(() => {
    if (!adsEnabled || !clientId || !slotId) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error('AdSense push failed:', err);
    }
  }, [adsEnabled, clientId, slotId]);

  if (!adsEnabled || !clientId || !slotId) {
    return null;
  }

  return (
    <div
      className={`ad-slot ad-slot--${position} ${className}`}
      aria-label={POSITION_LABEL[position]}
    >
      <span className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-ink-300">
        Advertisement
      </span>
      <ins
        ref={insRef}
        className="adsbygoogle block"
        style={{ display: 'block' }}
        data-ad-client={clientId}
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
