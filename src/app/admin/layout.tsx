import AdminSidebar from '@/components/admin/AdminSidebar';

export const metadata = { robots: { index: false, follow: false } };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex bg-paper-dim dark:bg-ink-950">
      <AdminSidebar />
      <main className="min-h-screen flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}
