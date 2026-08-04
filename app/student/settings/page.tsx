'use client';

import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { useThemeStore } from '@/store/useThemeStore';
import { Settings, Sun, Moon, Bell, Shield, Globe } from 'lucide-react';

export default function StudentSettingsPage() {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <div className="flex gap-8">
      <Sidebar />

      <main className="flex-1 space-y-6 min-w-0">

        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-primary-950 to-slate-900 text-white shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-primary-300 uppercase tracking-wider">
              Preferences
            </span>
            <h1 className="text-2xl sm:text-3xl font-black mt-1">
              Account & Theme Settings
            </h1>
          </div>
          <Settings className="w-8 h-8 text-primary-400" />
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-glass space-y-6">

          {/* Theme Settings */}
          <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              {theme === 'dark' ? <Moon className="w-5 h-5 text-amber-400" /> : <Sun className="w-5 h-5 text-slate-600" />}
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Appearance Theme
                </h4>
                <p className="text-xs text-slate-500">Switch between light and dark mode display</p>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
            >
              Current: {theme.toUpperCase()} MODE
            </button>
          </div>

          {/* Email Notifications */}
          <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-primary-600" />
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Job Match Notifications
                </h4>
                <p className="text-xs text-slate-500">Receive instant alerts when AI matches a job above 90%</p>
              </div>
            </div>
            <input type="checkbox" defaultChecked className="w-4 h-4 accent-primary-600 cursor-pointer" />
          </div>

          {/* Security */}
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-emerald-600" />
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Digital Work ID Verification
                </h4>
                <p className="text-xs text-slate-500">Active campus student status check</p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
              Verified Student
            </span>
          </div>

        </div>

      </main>
    </div>
  );
}
