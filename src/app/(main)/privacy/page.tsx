import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  alternates: { canonical: '/privacy' },
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <div className="container-editorial max-w-2xl py-16">
      <h1 className="font-display text-display-md font-semibold text-ink-800 dark:text-paper">
        Privacy Policy
      </h1>
      <div className="prose prose-lg mt-6 dark:prose-invert">
        <p>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        <h2>Information we collect</h2>
        <p>
          We collect information you provide directly (such as your email when subscribing to
          our newsletter or submitting a comment) and information collected automatically
          through cookies and analytics tools, including Google Analytics and Microsoft Clarity.
        </p>
        <h2>Advertising</h2>
        <p>
          This site uses Google AdSense to display ads. Google and its partners may use cookies
          to serve ads based on your prior visits to this or other websites. You can opt out of
          personalized advertising by visiting Google's Ads Settings.
        </p>
        <h2>Cookies</h2>
        <p>
          We use cookies for essential site functionality, analytics, and advertising. You can
          control cookie preferences through the banner shown on your first visit or your browser
          settings.
        </p>
        <h2>Your rights</h2>
        <p>
          You may request access to, correction of, or deletion of your personal data at any
          time by contacting us through our contact page.
        </p>
      </div>
    </div>
  );
}
