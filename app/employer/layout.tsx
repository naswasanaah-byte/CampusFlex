'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import {
  ShieldAlert,
  Clock,
  Building2,
  Lock,
  RefreshCw,
  LogOut,
  AlertTriangle,
  CheckCircle2,
  Mail,
  ShieldCheck,
  FileText
} from 'lucide-react';

export default function EmployerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentUser, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex items-center gap-2.5 text-slate-500 font-bold text-xs">
          <RefreshCw className="w-4 h-4 animate-spin text-[#5B46E5]" />
          <span>Verifying employer credentials...</span>
        </div>
      </div>
    );
  }

  // If not authenticated or not an employer, redirect to login
  if (!isAuthenticated || !currentUser || currentUser.role !== 'employer') {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-[#5B46E5] mx-auto">
            <Building2 className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              Employer Portal
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Please sign in with your verified employer account to manage job openings and hire students.
            </p>
          </div>
          <Link
            href="/login"
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#5B46E5] hover:bg-indigo-700 text-white text-xs font-black shadow-lg shadow-indigo-500/25 transition-all"
          >
            Sign In to Employer Portal
          </Link>
        </div>
      </div>
    );
  }

  const reportCount = currentUser.reportCount || (currentUser.reports?.length || 0);
  const isSuspendedOrBanned = currentUser.status === 'suspended' || reportCount >= 3;

  // --- 1. AUTOMATIC REMOVAL BARRIER (3 Student Reports Reached) ---
  if (isSuspendedOrBanned) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="max-w-lg w-full bg-white dark:bg-slate-900 border border-rose-300 dark:border-rose-900/80 rounded-3xl p-8 sm:p-10 shadow-2xl text-center space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-rose-100 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 flex items-center justify-center text-rose-600 dark:text-rose-400 mx-auto shadow-xl shadow-rose-500/10 animate-bounce">
            <AlertTriangle className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 text-xs font-black uppercase tracking-wider border border-rose-200 dark:border-rose-800">
              <ShieldAlert className="w-4 h-4" />
              Automated Safety Removal
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Employer Account Removed
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-md mx-auto">
              This organization has been <strong>automatically removed</strong> from CampusFlex after receiving <strong>3 verified student safety reports</strong> regarding workplace conduct, wage discrepancies, or fraudulent postings.
            </p>
          </div>

          {/* Report Breakdown */}
          <div className="p-4 rounded-2xl bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-left text-xs space-y-2.5">
            <div className="flex items-center justify-between font-bold text-rose-800 dark:text-rose-200">
              <span>Threshold Violation:</span>
              <span className="font-extrabold text-rose-600">{reportCount}/3 Maximum Student Reports</span>
            </div>
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-300 text-[11px]">
              <span>Job Postings Status:</span>
              <span className="font-bold text-rose-600">All Jobs Automatically Suspended</span>
            </div>
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-300 text-[11px]">
              <span>Student Hiring Status:</span>
              <span className="font-bold text-rose-600">Access Permanently Revoked</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                logout();
                router.push('/login');
              }}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black shadow-lg transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- 2. ADMIN VERIFICATION GATEKEEPING BARRIER (Pending Approval) ---
  if (!currentUser.verified) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="max-w-lg w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl text-center space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400 mx-auto shadow-xl shadow-amber-500/10">
            <Clock className="w-10 h-10 animate-pulse" />
          </div>

          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-xs font-black uppercase tracking-wider border border-amber-200 dark:border-amber-800">
              <ShieldAlert className="w-4 h-4 text-amber-500" />
              Pending Admin Verification
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Super Admin Approval Required
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-md mx-auto">
              Only verified employers authorized by the <strong>CampusFlex Super Administrator</strong> can enter the portal to post jobs and recruit student employees.
            </p>
          </div>

          {/* Submitted Business Profile Card */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-left text-xs space-y-2.5">
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
              <span className="font-semibold">Company Name:</span>
              <span className="font-extrabold text-slate-900 dark:text-white">{currentUser.companyName || currentUser.name}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
              <span className="font-semibold">Contact Email:</span>
              <span className="font-mono text-slate-800 dark:text-slate-200">{currentUser.email}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
              <span className="font-semibold">Business Reg #:</span>
              <span className="font-mono text-purple-600 dark:text-purple-400 font-bold">
                {currentUser.businessRegistrationNumber || 'REG-PENDING-AUDIT'}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-300 pt-1 border-t border-slate-200 dark:border-slate-700">
              <span className="font-semibold">Current Gate Status:</span>
              <span className="text-amber-600 font-extrabold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                Awaiting Super Admin Decision
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => {
                setIsRefreshing(true);
                setTimeout(() => setIsRefreshing(false), 800);
              }}
              disabled={isRefreshing}
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-extrabold text-slate-700 dark:text-slate-200 transition-all cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-[#5B46E5]' : ''}`} />
              Check Status
            </button>
            <button
              onClick={() => {
                logout();
                router.push('/login');
              }}
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black shadow-lg transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- 3. VERIFIED & ACTIVE: ALLOW ENTRY INTO EMPLOYER APP ---
  return <>{children}</>;
}
