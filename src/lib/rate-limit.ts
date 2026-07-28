import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

/**
 * Rate limiting is optional in local/dev: if Upstash env vars are not set,
 * `limit()` always allows the request rather than throwing, so the app
 * still runs with placeholder env vars.
 */
const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

const limiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, '60 s'),
      analytics: true,
      prefix: 'blog-cms',
    })
  : null;

export async function rateLimit(identifier: string) {
  if (!limiter) {
    return { success: true, limit: 0, remaining: 0, reset: 0 };
  }
  return limiter.limit(identifier);
}
