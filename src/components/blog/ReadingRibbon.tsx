'use client';

import { useEffect, useRef } from 'react';

/**
 * Renders a thin amber ribbon fixed to the top of the viewport that fills
 * left-to-right as the reader progresses through the article body. This is
 * the page's signature motion element — deliberately restrained elsewhere.
 */
export default function ReadingRibbon({ targetId = 'article-body' }: { targetId?: string }) {
  const ribbonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = document.getElementById(targetId);
    if (!target) return;

    let ticking = false;

    const update = () => {
      const rect = target.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const scrolled = Math.min(Math.max(-rect.top, 0), Math.max(total, 1));
      const progress = total > 0 ? scrolled / total : 0;
      ribbonRef.current?.style.setProperty('--reading-progress', String(progress));
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [targetId]);

  return <div ref={ribbonRef} className="reading-ribbon" aria-hidden="true" />;
}
