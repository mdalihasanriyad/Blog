import { connectDB } from '@/lib/db';
import User from '@/models/User';
import RoleSelect from '@/components/admin/RoleSelect';
import { auth } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const metadata = { robots: { index: false, follow: false } };

export default async function AdminUsersPage() {
  const session = await auth();
  await connectDB();
  const users = await User.find().sort({ createdAt: -1 }).lean();

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-semibold text-ink-800 dark:text-paper">Users</h1>

      <div className="overflow-hidden rounded-lg border border-ink-100 dark:border-ink-700">
        <table className="w-full text-left">
          <thead className="bg-paper-dim dark:bg-ink-800">
            <tr className="font-mono text-xs uppercase tracking-widest text-ink-400">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100 bg-paper dark:divide-ink-700 dark:bg-ink-900">
            {users.map((u) => (
              <tr key={u._id.toString()}>
                <td className="px-4 py-3 font-body text-sm text-ink-800 dark:text-paper">{u.name}</td>
                <td className="px-4 py-3 font-mono text-xs text-ink-400">{u.email}</td>
                <td className="px-4 py-3">
                  {session?.user.id === u._id.toString() ? (
                    <span className="font-mono text-xs text-ink-400">{u.role} (you)</span>
                  ) : (
                    <RoleSelect id={u._id.toString()} role={u.role} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
