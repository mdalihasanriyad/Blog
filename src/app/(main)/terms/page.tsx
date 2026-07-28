import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  alternates: { canonical: '/terms' },
};

export default function TermsPage() {
  return (
    <div className="container-editorial max-w-2xl py-16">
      <h1 className="font-display text-display-md font-semibold text-ink-800 dark:text-paper">
        Terms of Service
      </h1>
      <div className="prose prose-lg mt-6 dark:prose-invert">
        <p>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        <h2>Use of content</h2>
        <p>
          All articles, images, and other content on this site are owned by us or our licensors
          and may not be reproduced without permission, except for brief quotations with proper
          attribution and a link back to the original article.
        </p>
        <h2>Comments</h2>
        <p>
          By posting a comment you grant us a non-exclusive license to display it on this site.
          We reserve the right to remove comments that are abusive, spam, or otherwise violate
          our community guidelines.
        </p>
        <h2>Disclaimer</h2>
        <p>
          Content is provided for informational purposes only and does not constitute
          professional advice. We make reasonable efforts to keep information accurate and
          up to date but make no guarantees of completeness.
        </p>
      </div>
    </div>
  );
}
