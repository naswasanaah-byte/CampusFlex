'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { JobCard } from '@/components/jobs/JobCard';
import { ApplyModal } from '@/components/jobs/ApplyModal';
import { useJobStore } from '@/store/useJobStore';
import { Job } from '@/types';
import { Bookmark, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function SavedJobsPage() {
  const { jobs, savedJobIds } = useJobStore();
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isApplyOpen, setIsApplyOpen] = useState(false);

  const savedJobs = jobs.filter((j) => savedJobIds.includes(j.id));

  const handleApplyClick = (job: Job) => {
    setSelectedJob(job);
    setIsApplyOpen(true);
  };

  return (
    <div className="flex gap-8">
      <Sidebar />

      <main className="flex-1 space-y-6 min-w-0">

        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-primary-950 to-slate-900 text-white shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-primary-300 uppercase tracking-wider">
              Favorites List
            </span>
            <h1 className="text-2xl sm:text-3xl font-black mt-1">
              Bookmarked Jobs ({savedJobs.length})
            </h1>
          </div>
          <Bookmark className="w-8 h-8 text-primary-400 fill-primary-400/20" />
        </div>

        {savedJobs.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
            <AlertCircle className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
              No saved jobs yet
            </h3>
            <Link
              href="/jobs"
              className="inline-block px-5 py-2.5 text-xs font-bold text-white bg-primary-600 rounded-xl"
            >
              Explore Job Marketplace
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {savedJobs.map((job) => (
              <JobCard key={job.id} job={job} onApplyClick={handleApplyClick} />
            ))}
          </div>
        )}

        <ApplyModal
          job={selectedJob}
          isOpen={isApplyOpen}
          onClose={() => setIsApplyOpen(false)}
        />

      </main>
    </div>
  );
}
