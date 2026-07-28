'use client';

import { useEffect, useRef } from 'react';
import { incrementPostViews } from '@/actions/post.actions';

export default function ViewTracker({ postId }: { postId: string }) {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    incrementPostViews(postId);
  }, [postId]);

  return null;
}
