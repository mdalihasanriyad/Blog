import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { Toaster } from 'sonner';
import { fraunces, inter, jetbrainsMono } from '@/lib/fonts';
import ThemeProvider from '@/components/providers/ThemeProvider';
import QueryProvider from '@/components/providers/QueryProvider';
import SessionProvider from '@/components/providers/SessionProvider';
import CookieConsent from '@/components/ui/CookieConsent';
import './globals.css';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? 'The Ledger';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Ideas worth your time`,
    template: `%s — ${SITE_NAME}`,
  },
  description:
    'In-depth, well-researched articles on technology, business, and culture — written for readers who want substance over noise.',
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    url: SITE_URL,
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    other: { 'msvalidate.01': process.env.BING_SITE_VERIFICATION ?? '' },
  },
  alternates: {
    canonical: SITE_URL,
    types: { 'application/rss+xml': `${SITE_URL}/rss.xml` },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FAF8F3' },
    { media: '(prefers-color-scheme: dark)', color: '#1B2333' },
  ],
  width: 'device-width',
  initialScale: 1,
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/images/logo.png`,
  sameAs: [],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID;
  const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const adsEnabled = process.env.NEXT_PUBLIC_ADS_ENABLED === 'true';

  return (
    <html lang="en" suppressHydrationWarning className={`${fraunces.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        {adsEnabled && adsenseClientId && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body className="font-body">
        {gtmId && (
          <Script id="gtm" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`}
          </Script>
        )}
        {gaId && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
            <Script id="ga4" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', '${gaId}');`}
            </Script>
          </>
        )}
        {clarityId && (
          <Script id="clarity" strategy="afterInteractive">
            {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, "clarity", "script", "${clarityId}");`}
          </Script>
        )}

        <ThemeProvider>
          <SessionProvider>
            <QueryProvider>
              {children}
              <CookieConsent />
              <Toaster position="top-center" richColors />
            </QueryProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
