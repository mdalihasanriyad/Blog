import { connectDB } from '@/lib/db';
import Subscriber from '@/models/Subscriber';
import { formatDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';
export const metadata = { robots: { index: false, follow: false } };

export default async function AdminSubscribersPage() {
  await connectDB();
  const subscribers = await Subscriber.find().sort({ subscribedAt: -1 }).lean();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-ink-800 dark:text-paper">Subscribers</h1>
        <span className="font-mono text-sm text-ink-400">{subscribers.length} total</span>
      </div>

      <div className="overflow-hidden rounded-lg border border-ink-100 dark:border-ink-700">
        <table className="w-full text-left">
          <thead className="bg-paper-dim dark:bg-ink-800">
            <tr className="font-mono text-xs uppercase tracking-widest text-ink-400">
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Subscribed</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100 bg-paper dark:divide-ink-700 dark:bg-ink-900">
            {subscribers.map((s) => (
              <tr key={s._id.toString()}>
                <td className="px-4 py-3 font-body text-sm text-ink-800 dark:text-paper">{s.email}</td>
                <td className="px-4 py-3 font-mono text-xs uppercase text-ink-400">{s.status}</td>
                <td className="px-4 py-3 font-mono text-xs text-ink-400">{formatDate(s.subscribedAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {subscribers.length === 0 && (
          <p className="p-6 text-center font-body text-sm text-slate">No subscribers yet.</p>
        )}
      </div>
    </div>
  );
}
