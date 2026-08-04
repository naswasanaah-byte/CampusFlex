'use client';

import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { ApplicationTimeline } from '@/components/student/ApplicationTimeline';
import { useAuthStore } from '@/store/useAuthStore';
import { useApplicationStore } from '@/store/useApplicationStore';
import { Clock, Briefcase, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function StudentApplicationsPage() {
  const { currentUser } = useAuthStore();
  const { applications } = useApplicationStore();

  const studentApps = applications.filter((a) => a.studentId === currentUser?.id);

  return (
    <div className="flex gap-8">
      <Sidebar />

      <main className="flex-1 space-y-6 min-w-0">

        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-primary-950 to-slate-900 text-white shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-primary-300 uppercase tracking-wider">
              Application Tracker
            </span>
            <h1 className="text-2xl sm:text-3xl font-black mt-1">
              Live Application Timelines
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Track hiring stages, interview invitations, and status notices in real-time.
            </p>
          </div>
          <Clock className="w-8 h-8 text-primary-400" />
        </div>

        {studentApps.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
            <AlertCircle className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
              No applications submitted yet
            </h3>
            <Link
              href="/jobs"
              className="inline-block px-5 py-2.5 text-xs font-bold text-white bg-primary-600 rounded-xl"
            >
              Browse Available Jobs
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {studentApps.map((app) => (
              <ApplicationTimeline key={app.id} application={app} />
            ))}
          </div>
        )}

      </main>
    </div>
  );
}
