'use client';

import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { useJobStore } from '@/store/useJobStore';
import { SmartJobBadge } from '@/components/jobs/SmartJobBadge';
import { Briefcase, Trash2, Eye, ShieldCheck, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function AdminJobsPage() {
  const { jobs, deleteJob, updateJob } = useJobStore();

  const handleForceClose = (jobId: string) => {
    updateJob(jobId, { status: 'FILLED' });
  };

  return (
    <div className="flex gap-8">
      <Sidebar />

      <main className="flex-1 space-y-6 min-w-0">

        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 text-white shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-rose-300 uppercase tracking-wider">
              Marketplace Audit
            </span>
            <h1 className="text-2xl sm:text-3xl font-black mt-1">
              Job Listings Moderation ({jobs.length})
            </h1>
          </div>
          <Briefcase className="w-8 h-8 text-rose-400" />
        </div>

        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-glass flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                    {job.title}
                  </h3>
                  <SmartJobBadge
                    requiredEmployees={job.requiredEmployees}
                    selectedEmployees={job.selectedEmployees}
                    status={job.status}
                    size="sm"
                  />
                </div>
                <p className="text-xs text-slate-500">
                  {job.companyName} • ${job.hourlyRate}/hr • Posted {job.postedAt.split('T')[0]}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {job.status === 'AVAILABLE' && (
                  <button
                    onClick={() => handleForceClose(job.id)}
                    className="px-3 py-1.5 rounded-xl bg-amber-100 text-amber-800 text-xs font-bold hover:bg-amber-200"
                  >
                    Force Close Slots
                  </button>
                )}
                <Link
                  href={`/jobs/${job.id}`}
                  className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:text-slate-700"
                  title="View"
                >
                  <Eye className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => deleteJob(job.id)}
                  className="p-2 rounded-xl border border-rose-200 text-rose-500 hover:bg-rose-50"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}
