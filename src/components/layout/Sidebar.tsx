'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Video,
  Settings,
  Key,
  User,
  Users,
  BarChart3,
  Film,
  X,
  Shield,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { cn } from '@/utils/helpers';
import { Button } from '@/components/ui/Button';

const dashboardLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/videos', label: 'Videos', icon: Video },
  { href: '/api-keys', label: 'API Keys', icon: Key },
  { href: '/profile', label: 'Profile', icon: User },
  { href: '/settings', label: 'Settings', icon: Settings },
];

const adminLinks = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  {
    label: 'Management',
    items: [
      { href: '/admin/users', label: 'User Management', icon: Users },
      { href: '/admin/filler-videos', label: 'Filler Videos', icon: Film },
      { href: '/admin/stats', label: 'Statistics', icon: BarChart3 },
    ]
  },
  {
    label: 'My Features',
    items: [
      { href: '/videos', label: 'My Videos', icon: Video },
      { href: '/api-keys', label: 'My API Keys', icon: Key },
    ]
  },
  { href: '/profile', label: 'Profile', icon: User },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const { sidebarOpen, setSidebarOpen } = useUIStore();
  const isAdmin = (user as any)?.is_admin === true || pathname?.startsWith('/admin');

  const links = isAdmin ? adminLinks : dashboardLinks;

  return (
    <>
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 transition-transform lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-full flex-col p-4">
          <div className="mb-4 flex items-center justify-between lg:hidden">
            <h2 className="text-lg font-semibold">Menu</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <nav className="flex-1 space-y-1">
            {links.map((link: any) => {
              // Handle grouped items (sections)
              if (link.items) {
                return (
                  <div key={link.label} className="pt-4">
                    <p className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {link.label}
                    </p>
                    <div className="space-y-1">
                      {link.items.map((item: any) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                              isActive
                                ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/50 dark:text-primary-400'
                                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                            )}
                            onClick={() => setSidebarOpen(false)}
                          >
                            <Icon className="h-5 w-5" />
                            {item.label}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              }

              // Handle regular links
              const Icon = link.icon;
              const isActive = pathname === link.href || pathname?.startsWith(link.href + '/');
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/50 dark:text-primary-400'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="h-5 w-5" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
};

