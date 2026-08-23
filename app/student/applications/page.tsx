'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { useAuthStore } from '@/store/useAuthStore';
import { useApplicationStore } from '@/store/useApplicationStore';
import { ChevronRight, Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function StudentApplicationsPage() {
  const { currentUser } = useAuthStore();
  const { applications } = useApplicationStore();
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'PENDING' | 'ACCEPTED' | 'REJECTED'>('ALL');

  const studentApps = applications.filter((a) => a.studentId === currentUser?.id);
  const filteredApps = studentApps.filter((a) => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'PENDING') return a.status === 'PENDING' || a.status === 'UNDER_REVIEW' || a.status === 'INTERVIEW_SCHEDULED';
    if (activeFilter === 'ACCEPTED') return a.status === 'ACCEPTED';
    if (activeFilter === 'REJECTED') return a.status === 'REJECTED';
    return true;
  });

  const getCompanyInitials = (name: string) => name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <div className="flex gap-8">
      <Sidebar />

      <main className="flex-1 space-y-6 min-w-0">

        {/* Title Header */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-glass space-y-4">
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            My Applications
          </h1>

          {/* Status Tabs (Matching Mockup Screen 5) */}
          <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
            {(['ALL', 'PENDING', 'ACCEPTED', 'REJECTED'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`py-2 text-xs font-extrabold capitalize rounded-xl transition-all cursor-pointer ${
                  activeFilter === tab
                    ? 'bg-[#5B46E5] text-white shadow-md'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {tab === 'ALL' ? 'All' : tab.charAt(0) + tab.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Application Cards List (Matching Mockup Screen 5) */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-glass space-y-4">
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredApps.map((app) => {
              const statusColor =
                app.status === 'ACCEPTED'
                  ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                  : app.status === 'REJECTED'
                  ? 'bg-rose-50 text-rose-600 border-rose-200'
                  : 'bg-amber-50 text-amber-600 border-amber-200';

              const statusText =
                app.status === 'ACCEPTED'
                  ? 'Accepted'
                  : app.status === 'REJECTED'
                  ? 'Rejected'
                  : 'Pending';

              return (
                <div
                  key={app.id}
                  className="py-4 flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 p-3 rounded-2xl transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    {/* Logo Box */}
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-md">
                      {getCompanyInitials(app.companyName)}
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                        {app.jobTitle}
                      </h4>
                      <div className="text-xs text-slate-500 font-medium">
                        {app.companyName}
                      </div>
                      <div className="text-[11px] text-slate-400 font-medium pt-0.5">
                        Applied on {app.appliedAt}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span
                      className={`px-3.5 py-1 rounded-full text-xs font-extrabold border ${statusColor}`}
                    >
                      {statusText}
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </main>
    </div>
  );
}
