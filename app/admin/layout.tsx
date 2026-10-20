'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore, AUTHORIZED_ADMIN_EMAILS } from '@/store/useAuthStore';
import { ShieldAlert, Lock, ArrowRight, Home, RefreshCw, Sparkles } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentUser, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // During SSR / initial client mount, avoid unauthorized content flash
  if (!mounted) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex items-center gap-2.5 text-slate-500 font-bold text-xs">
          <RefreshCw className="w-4 h-4 animate-spin text-purple-600" />
          <span>Verifying administrator authorization...</span>
        </div>
      </div>
    );
  }

  // Strict Admin Authorization Check
  const isAuthorizedAdmin =
    isAuthenticated &&
    currentUser &&
    currentUser.role === 'admin' &&
    AUTHORIZED_ADMIN_EMAILS.includes(currentUser.email.toLowerCase().trim());

  if (!isAuthorizedAdmin) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-rose-100 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 flex items-center justify-center text-rose-600 dark:text-rose-400 mx-auto shadow-lg shadow-rose-500/10">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-black uppercase tracking-wider border border-rose-200 dark:border-rose-800">
              <ShieldAlert className="w-3.5 h-3.5" />
              Restricted Area
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              Administrator Access Only
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              This interface is strictly restricted. Only the verified platform administrator (<strong>avanislavanisl536</strong>) with the authorized master key can access and control the CampusFlex Admin Console.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-left text-xs space-y-2">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 font-semibold">
              <span>Authorized Admin Email:</span>
              <span className="font-mono text-purple-600 dark:text-purple-400 font-bold">avanislavanisl536</span>
            </div>
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 font-semibold">
              <span>Current Status:</span>
              <span className="text-rose-500 font-bold">Access Denied</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href="/"
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <Home className="w-4 h-4" />
              Home
            </Link>
            <Link
              href="/login"
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-black shadow-lg shadow-purple-600/25 transition-all"
            >
              Admin Login
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
