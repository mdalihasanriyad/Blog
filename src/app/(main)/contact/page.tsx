import type { Metadata } from 'next';
import ContactForm from '@/components/blog/ContactForm';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with our editorial team.',
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  return (
    <div className="container-editorial max-w-xl py-16">
      <h1 className="font-display text-display-md font-semibold text-ink-800 dark:text-paper">Contact</h1>
      <p className="mt-3 font-body text-slate dark:text-ink-200">
        Story tips, corrections, and partnership inquiries welcome.
      </p>
      <div className="mt-8">
        <ContactForm />
      </div>
    </div>
  );
}
