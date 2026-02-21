'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, Bell, User, LogOut, Settings, Moon, Sun, RefreshCw } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { Button } from '@/components/ui/Button';

export const Header: React.FC = () => {
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuthStore();
  const { toggleSidebar, sidebarOpen, theme, toggleTheme } = useUIStore();
  const [mounted, setMounted] = useState(false);
  const isDark = mounted && theme === 'dark';

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleReload = () => {
    window.location.reload();
  };

  // Wait for mount to check authentication to prevent hydration mismatch
  // Always start with false to ensure server and client match
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    if (mounted) {
      setAuthenticated(isAuthenticated());
    }
  }, [mounted]);

  // Show unauthenticated header (same on server and client initially)
  if (!authenticated) {
    return (
      <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="text-2xl font-bold text-primary-600 dark:text-primary-400">
            Video Editor
          </Link>
          <div className="flex items-center gap-2">
            {mounted && (
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                className="hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {isDark ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
            )}
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>
    );
  }

  // Show authenticated header
  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <Link href="/dashboard" className="text-2xl font-bold text-primary-600 dark:text-primary-400">
            Video Editor
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReload}
            title="Reload page"
            className="hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <RefreshCw className="h-5 w-5" />
          </Button>
          {mounted && (
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              className="hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {isDark ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          )}
          <Button 
            variant="ghost" 
            size="sm"
            title="Notifications"
            className="hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Bell className="h-5 w-5" />
          </Button>
          <div className="relative group">
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <User className="h-5 w-5" />
              <span className="hidden md:inline">{user?.name || user?.email}</span>
            </Button>
            <div className="absolute right-0 mt-2 w-48 rounded-md border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
              <div className="p-2">
                <Link
                  href="/profile"
                  className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
                >
                  <User className="h-4 w-4" />
                  Profile
                </Link>
                <Link
                  href="/settings"
                  className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-red-600 dark:text-red-400"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

