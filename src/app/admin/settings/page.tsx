import { connectDB } from '@/lib/db';
import Settings from '@/models/Settings';
import SettingsForm from '@/components/admin/SettingsForm';

export const dynamic = 'force-dynamic';
export const metadata = { robots: { index: false, follow: false } };

export default async function AdminSettingsPage() {
  await connectDB();

  let settings = await Settings.findOne().lean();

  if (!settings) { 
    await Settings.create({});
    settings = await Settings.findOne().lean();
  }

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-semibold text-ink-800 dark:text-paper">
        Site Settings
      </h1>
      <SettingsForm initial={JSON.parse(JSON.stringify(settings))} />
    </div>
  );
}