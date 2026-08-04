'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import { useThemeStore } from '@/store/useThemeStore';
import { RoleSwitcher } from '@/components/ui/RoleSwitcher';
import { NotificationDropdown } from '@/components/ui/NotificationDropdown';
import { Sparkles, Sun, Moon, Search, Menu, X, LogIn, UserCheck, ShieldCheck, LogOut, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const Navbar: React.FC = () => {
  const { currentUser, isAuthenticated, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  const getDashboardPath = () => {
    if (!currentUser) return '/login';
    switch (currentUser.role) {
      case 'employer':
        return '/employer/dashboard';
      case 'admin':
        return '/admin/dashboard';
      default:
        return '/student/dashboard';
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Brand Logo */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary-600 via-primary-500 to-secondary-500 flex items-center justify-center text-white shadow-lg shadow-primary-500/25 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <span className="text-xl font-black bg-gradient-to-r from-primary-600 via-primary-500 to-secondary-500 bg-clip-text text-transparent tracking-tight">
                  CampusFlex
                </span>
                <span className="hidden sm:block text-[10px] uppercase font-bold tracking-widest text-slate-400 -mt-1">
                  Smart Jobs
                </span>
              </div>
            </Link>

            {/* Quick Navigation links */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
              <Link href="/jobs" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                Find Jobs
              </Link>
              {isAuthenticated && (
                <Link href={getDashboardPath()} className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  Dashboard
                </Link>
              )}
            </nav>
          </div>

          {/* Right Action Items */}
          <div className="hidden lg:flex items-center gap-4">
            <RoleSwitcher />

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>

            {/* Notifications Dropdown */}
            {isAuthenticated && <NotificationDropdown />}

            {/* Authentication Buttons / User Avatar */}
            {isAuthenticated && currentUser ? (
              <div className="flex items-center gap-3 pl-3 border-l border-slate-200 dark:border-slate-800">
                <Link href={getDashboardPath()} className="flex items-center gap-2.5 group">
                  <img
                    src={currentUser.avatar || currentUser.companyLogo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'}
                    alt={currentUser.name}
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-primary-500/20 group-hover:ring-primary-500 transition-all"
                  />
                  <div className="text-left hidden xl:block">
                    <div className="text-xs font-semibold text-slate-800 dark:text-slate-100 truncate max-w-[120px]">
                      {currentUser.name}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 capitalize font-medium">
                      {currentUser.role}
                    </div>
                  </div>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    router.push('/login');
                  }}
                  className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-primary-600 dark:hover:text-primary-400"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-primary-600 to-secondary-500 rounded-xl shadow-md hover:opacity-95 transition-opacity"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-600 dark:text-slate-300"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 pt-2 pb-6 space-y-4">
          <div className="pt-2">
            <RoleSwitcher />
          </div>
          <nav className="flex flex-col gap-3 font-medium text-slate-700 dark:text-slate-200">
            <Link
              href="/jobs"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Find Jobs
            </Link>
            {isAuthenticated && (
              <Link
                href={getDashboardPath()}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Dashboard
              </Link>
            )}
          </nav>
          {isAuthenticated ? (
            <button
              onClick={() => {
                logout();
                setMobileMenuOpen(false);
                router.push('/login');
              }}
              className="w-full py-2.5 text-center font-semibold text-rose-600 bg-rose-50 dark:bg-rose-950/40 rounded-xl"
            >
              Sign Out
            </button>
          ) : (
            <div className="flex flex-col gap-2 pt-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 text-sm font-semibold border border-slate-200 dark:border-slate-700 rounded-xl"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 text-sm font-semibold text-white bg-primary-600 rounded-xl"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
