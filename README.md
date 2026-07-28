# Blog CMS — SEO-First, AdSense-Ready Publishing Platform

A production-oriented blog CMS built with Next.js 15 (App Router), TypeScript, MongoDB/Mongoose,
Auth.js, and Tailwind CSS. Designed for organic search growth and AdSense revenue: fast Core Web
Vitals, full structured data, and an editorial UI that doesn't look like a template.

## Status: Phase 1 of 5 (Foundation)

This repo contains a **working, running foundation** — not a finished product. See "Roadmap"
below for what's built vs. what's next. Everything included here is real, wired-up code: it
connects to MongoDB, authenticates users, uploads images to Cloudinary, sends email via Resend,
and renders SEO-correct pages. Nothing is a mock or a stub unless explicitly marked TODO.

## What's included

**Public site**
- Homepage (hero, featured posts, latest posts, trending sidebar)
- Blog index with infinite scroll (TanStack Query + IntersectionObserver)
- Single post page: Markdown/MDX rendering, syntax highlighting, table of contents,
  reading-progress ribbon, related posts, comments, social share, in-article ads
- Category & tag archive pages, full-text search
- About, Contact, Privacy, Terms, custom 404
- Newsletter signup (Resend), contact form, comment submission — all rate-limited

**Admin panel** (`/admin`, role-protected)
- Dashboard with view/post/comment/subscriber stats and top-posts leaderboard
- Post CRUD with SEO fields (meta title/description, canonical URL, OG image, FAQ schema,
  noindex), Cloudinary image upload, draft/scheduled/published/archived states, featured toggle
- Category & tag management
- Comment moderation queue (approve/spam/trash)
- Media library
- Subscriber list, contact message inbox
- User management with role changes (admin-only)
- Site settings: branding, SEO/analytics IDs, AdSense slots, social links

**SEO infrastructure**
- Dynamic `sitemap.xml`, `robots.txt`, `rss.xml`
- Per-post `generateMetadata` with canonical URLs, OG/Twitter cards
- JSON-LD: Organization (site-wide), Article, BreadcrumbList, FAQPage
- ISR via `unstable_cache` + tag-based revalidation from server actions

**Auth & security**
- Auth.js v5, credentials + Google OAuth, JWT sessions with roles
  (admin/editor/author/reader)
- `middleware.ts` protects `/admin/*`, with an extra admin-only tier for `/admin/users` and
  `/admin/settings`
- Zod validation on every server action and route handler
- Optional Upstash rate limiting (degrades gracefully to "always allow" if unset, so the app
  still runs without it)
- Security headers in `next.config.mjs` (HSTS, X-Frame-Options, etc.)

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in real values — see below
npm run seed                 # creates an admin user + sample content
npm run dev
```

Then log in at `/login` with the credentials the seed script prints (default
`admin@example.com` / `ChangeMe123!` — **change this immediately** if you don't set
`SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` env vars before seeding).

### Required environment variables

At minimum, to run locally you need:
- `MONGODB_URI` — a MongoDB Atlas connection string (free tier is fine to start)
- `AUTH_SECRET` — generate with `openssl rand -base64 32`

Everything else in `.env.example` (Cloudinary, Resend, GA4/GTM/Clarity, AdSense, Upstash) is
optional for local development — features that depend on them degrade gracefully (e.g. image
upload will error until Cloudinary keys are set; ads simply don't render until
`NEXT_PUBLIC_ADS_ENABLED=true` and a client ID are set).

## Architecture

```
src/
  app/            # App Router routes
    (main)/       # Public site — wrapped in Navbar/Footer layout
    (auth)/       # Login/register — no chrome
    admin/        # Role-protected admin panel
    api/          # Route handlers (auth, posts pagination, upload, revalidate)
    sitemap.ts, robots.ts, layout.tsx, not-found.tsx
    rss.xml/route.ts
  components/
    blog/         # Public-facing feature components
    admin/         # Admin panel components
    layout/       # Navbar, Footer
    ui/            # Cross-cutting primitives (ThemeToggle, AdSlot, CookieConsent)
    providers/    # Theme, Session, TanStack Query providers
  models/         # Mongoose schemas (User, Post, Category, Tag, Comment, Media,
                   Subscriber, Contact, Settings)
  services/       # Data-access layer — cached reads used by Server Components
  actions/        # Server Actions — all writes go through here (post/comment/
                   category/user/settings CRUD), each with auth + Zod validation
  lib/            # db connection, auth config, email, rate-limit, json-ld, utils
scripts/seed.ts   # Bootstraps an admin user + sample content
```

**Why this split:** `services/` is read-only and cache-friendly (safe to call from Server
Components at request time); `actions/` is where all mutations and authorization checks live.
Route handlers under `app/api/` exist only where a Server Action doesn't fit (pagination fetch
from a client component, file upload, webhooks, NextAuth).

## Design system

A deliberate editorial identity rather than generic AI-blog defaults: deep indigo-ink
(`#1B2333`) and warm paper (`#FAF8F3`) with a muted amber accent, Fraunces for display
headlines paired with Inter body text and JetBrains Mono for metadata/labels. The signature
interactive element is the reading-progress ribbon (`ReadingRibbon.tsx`) that fills as you
scroll an article, plus "press-stamp" category badges. All tokens live in `tailwind.config.ts`.

## Deploying to Vercel

1. Push this repo to GitHub.
2. Import into Vercel, set all env vars from `.env.example` in the Vercel dashboard.
3. Point `MONGODB_URI` at your production Atlas cluster (whitelist Vercel's IPs or use
   0.0.0.0/0 with a strong password, per Atlas network access settings).
4. Set `NEXT_PUBLIC_SITE_URL` to your production domain before the first deploy — it's baked
   into `metadataBase`, sitemap, and RSS feed.
5. Run `npm run seed` once locally against the production `MONGODB_URI` (or connect a one-off
   script) to create your first admin account.

## Roadmap — what's not built yet

This is Phase 1 of a 5-phase build. Not yet included:
- Scheduled-publish cron (a Vercel Cron hitting a status-flip job — the `scheduledAt` field
  and admin UI exist, but nothing currently flips `scheduled` → `published` automatically)
- Bookmarks/reading-history UI (the data model and `toggleBookmark` action exist; no
  `/account` pages yet)
- Backup/restore tooling in the admin panel
- Email templates via React Email components (currently raw HTML strings in `lib/email.ts`)
- Automated tests
- A full Lighthouse/Core Web Vitals tuning pass once real content and images are in place —
  the architecture (ISR, `next/image`, font `display: swap`, code splitting via route groups)
  is built for it, but only real deployment data will show where to tune further

Say the word and I'll keep building any of these next.
# Blog
