'use client';

import React, { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { currentUser, isAuthenticated } = useAuthStore();
  const router = useRouter();

  const isAdmin = isAuthenticated && currentUser?.role === 'admin';

  useEffect(() => {
    if (!isAdmin) {
      const timer = setTimeout(() => {
        if (currentUser?.role === 'employer') {
          router.push('/employer/dashboard');
        } else if (currentUser?.role === 'student') {
          router.push('/student/dashboard');
        } else {
          router.push('/login');
        }
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isAdmin, currentUser, router]);

  if (!isAdmin) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">
            Admin Access Restricted
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            The Human Admin Portal is restricted. Platform governance, employer verification, and fraud protection are autonomously managed 24/7 by the <strong>CampusFlex AI Admin Engine</strong>.
          </p>
          <div className="pt-2">
            <Link
              href={currentUser?.role === 'employer' ? '/employer/dashboard' : currentUser?.role === 'student' ? '/student/dashboard' : '/login'}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-primary-600 text-white text-xs font-bold shadow-lg hover:bg-primary-700 transition-colors w-full"
            >
              <ArrowLeft className="w-4 h-4" /> Return to Authorized Portal
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
