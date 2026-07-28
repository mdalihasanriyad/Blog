'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  FolderTree,
  Tags,
  MessageSquare,
  Users,
  Image as ImageIcon,
  Mail,
  Inbox,
  Settings,
  LogOut,
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/posts', label: 'Posts', icon: FileText },
  { href: '/admin/categories', label: 'Categories', icon: FolderTree },
  { href: '/admin/tags', label: 'Tags', icon: Tags },
  { href: '/admin/comments', label: 'Comments', icon: MessageSquare },
  { href: '/admin/media', label: 'Media Library', icon: ImageIcon },
  { href: '/admin/subscribers', label: 'Subscribers', icon: Mail },
  { href: '/admin/contacts', label: 'Messages', icon: Inbox },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-60 shrink-0 flex-col border-r border-ink-100 bg-paper dark:border-ink-700 dark:bg-ink-900">
      <div className="flex h-16 items-center border-b border-ink-100 px-5 dark:border-ink-700">
        <span className="font-display text-lg font-semibold text-ink-800 dark:text-paper">
          Admin
        </span>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3" aria-label="Admin">
        {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 font-body text-sm font-medium transition-colors',
                active
                  ? 'bg-ink-800 text-paper dark:bg-amber dark:text-ink-900'
                  : 'text-ink-600 hover:bg-ink-50 dark:text-ink-200 dark:hover:bg-ink-800',
              )}
            >
              <Icon size={17} strokeWidth={1.75} />
              {label}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={() => signOut({ callbackUrl: '/' })}
        className="m-3 flex items-center gap-3 rounded-md px-3 py-2 font-body text-sm font-medium
          text-brick hover:bg-brick/10"
      >
        <LogOut size={17} strokeWidth={1.75} />
        Log out
      </button>
    </aside>
  );
}
