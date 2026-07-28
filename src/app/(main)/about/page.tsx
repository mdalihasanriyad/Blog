import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description: 'What we write about, and who writes it.',
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return (
    <div className="container-editorial max-w-2xl py-16">
      <h1 className="font-display text-display-md font-semibold text-ink-800 dark:text-paper">About</h1>
      <div className="prose prose-lg mt-6 dark:prose-invert">
        <p>
          We publish in-depth, well-researched articles on technology, business, and culture —
          written for readers who want substance over noise. Every piece is written or reviewed
          by an editor with direct experience in the subject, sourced transparently, and updated
          when the facts change.
        </p>
        <p>
          Have a story tip, correction, or partnership idea? <a href="/contact">Get in touch</a>.
        </p>
      </div>
    </div>
  );
}
