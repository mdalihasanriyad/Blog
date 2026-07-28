import { connectDB } from '@/lib/db';
import Contact from '@/models/Contact';
import ContactStatusSelect from '@/components/admin/ContactStatusSelect';
import ContactReplyForm from '@/components/admin/ContactReplyForm';
import { formatDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';
export const metadata = { robots: { index: false, follow: false } };

export default async function AdminContactsPage() {
  await connectDB();
  const contacts = await Contact.find().sort({ createdAt: -1 }).lean();

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-semibold text-ink-800 dark:text-paper">Messages</h1>

      <div className="space-y-3">
        {contacts.map((c) => (
          <div key={c._id.toString()} className="rounded-lg border border-ink-100 p-4 dark:border-ink-700">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="font-body text-sm font-semibold text-ink-800 dark:text-paper">{c.name}</span>
                <span className="ml-2 font-mono text-xs text-ink-400">{c.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-ink-300">{formatDate(c.createdAt)}</span>
                <ContactStatusSelect id={c._id.toString()} status={c.status} />
              </div>
            </div>
            <p className="font-body text-sm font-medium text-ink-700 dark:text-ink-100">{c.subject}</p>
            <p className="mt-1 font-body text-sm text-slate dark:text-ink-200">{c.message}</p>

            {c.replyMessage ? (
              <div className="mt-3 rounded-md bg-sage/10 p-3">
                <p className="font-mono text-[10px] uppercase tracking-widest text-sage-dark">
                  Your reply {c.repliedAt ? `· ${formatDate(c.repliedAt)}` : ''}
                </p>
                <p className="mt-1 font-body text-sm text-ink-700 dark:text-ink-100">{c.replyMessage}</p>
              </div>
            ) : (
              <ContactReplyForm id={c._id.toString()} />
            )}
          </div>
        ))}
        {contacts.length === 0 && (
          <p className="font-body text-sm text-slate">No messages yet.</p>
        )}
      </div>
    </div>
  );
}
