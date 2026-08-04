'use client';

import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { useAuthStore } from '@/store/useAuthStore';
import { useJobStore } from '@/store/useJobStore';
import { SmartJobBadge } from '@/components/jobs/SmartJobBadge';
import { Briefcase, Trash2, Eye, PlusCircle, Users } from 'lucide-react';
import Link from 'next/link';

export default function EmployerJobsPage() {
  const { currentUser } = useAuthStore();
  const { jobs, deleteJob } = useJobStore();

  const employerJobs = jobs.filter(
    (j) => j.companyId === currentUser?.id || j.companyName === currentUser?.companyName
  );

  return (
    <div className="flex gap-8">
      <Sidebar />

      <main className="flex-1 space-y-6 min-w-0">

        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
              Management
            </span>
            <h1 className="text-2xl sm:text-3xl font-black mt-1">
              Active Job Postings ({employerJobs.length})
            </h1>
          </div>
          <Link
            href="/employer/post-job"
            className="px-4 py-2.5 rounded-2xl bg-primary-600 hover:bg-primary-700 text-xs font-bold text-white shadow-md flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" /> Post Job
          </Link>
        </div>

        <div className="space-y-4">
          {employerJobs.map((job) => (
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
                  ${job.hourlyRate}/hr • {job.workType} • Posted on {job.postedAt.split('T')[0]}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/employer/applicants"
                  className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-indigo-600 hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <Users className="w-3.5 h-3.5" /> View Candidates
                </Link>
                <Link
                  href={`/jobs/${job.id}`}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-700"
                  title="Preview Listing"
                >
                  <Eye className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => deleteJob(job.id)}
                  className="p-2 rounded-xl border border-rose-200 dark:border-rose-900 text-rose-500 hover:bg-rose-50"
                  title="Delete Job"
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
