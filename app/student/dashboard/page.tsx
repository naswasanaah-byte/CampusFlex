'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { useAuthStore } from '@/store/useAuthStore';
import { useApplicationStore } from '@/store/useApplicationStore';
import { useJobStore } from '@/store/useJobStore';
import { Job } from '@/types';
import { ApplyModal } from '@/components/jobs/ApplyModal';
import { Sparkles, Calendar, Clock, ArrowRight, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function StudentDashboard() {
  const { currentUser } = useAuthStore();
  const { applications } = useApplicationStore();
  const { jobs } = useJobStore();

  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isApplyOpen, setIsApplyOpen] = useState(false);

  const studentApps = applications.filter((a) => a.studentId === currentUser?.id);
  const recommendedJobs = jobs.filter((j) => j.status === 'AVAILABLE');

  const handleApplyClick = (job: Job) => {
    setSelectedJob(job);
    setIsApplyOpen(true);
  };

  const getCompanyInitials = (name: string) => {
    return name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div className="flex gap-8">
      <Sidebar />

      <main className="flex-1 space-y-6 min-w-0">

        {/* Welcome Header (Matching Mockup Screen 2) */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-glass flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              Hello, {currentUser?.name || 'Ananya'}! 👋
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Find the best part-time jobs that fits your schedule and skills.
            </p>
          </div>
        </div>

        {/* 3 Summary Stat Cards (Matching Mockup Screen 2) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-glass space-y-1">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Jobs Recommended</span>
            <div className="text-3xl font-black text-slate-900 dark:text-white">12</div>
            <p className="text-[11px] text-slate-400">New jobs for you</p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-glass space-y-1">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Applications</span>
            <div className="text-3xl font-black text-slate-900 dark:text-white">5</div>
            <p className="text-[11px] text-slate-400">Total applied</p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-glass space-y-1">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Earnings</span>
            <div className="text-3xl font-black text-[#5B46E5]">₹4,250</div>
            <p className="text-[11px] text-slate-400">Total earned</p>
          </div>
        </div>

        {/* Top Recommended Jobs Section (Matching Mockup Screen 2) */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-glass space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              Top Recommended Jobs
            </h3>
            <Link href="/jobs" className="text-xs font-extrabold text-[#5B46E5] hover:underline">
              View All
            </Link>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {recommendedJobs.slice(0, 4).map((job, idx) => {
              const matchScores = [95, 90, 92, 88];
              const score = matchScores[idx % matchScores.length];
              return (
                <div
                  key={job.id}
                  onClick={() => handleApplyClick(job)}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 p-3 rounded-2xl transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    {/* Logo Square Initials Box */}
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-md">
                      {getCompanyInitials(job.companyName)}
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                        {job.title}
                      </h4>
                      <div className="text-xs text-slate-500 font-medium">
                        {job.companyName} • <span className="font-bold text-slate-700 dark:text-slate-300">₹{job.hourlyRate} / day</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-xs text-slate-500 font-medium text-right hidden md:block">
                      <div>Mon, Wed, Fri</div>
                      <div className="text-[11px] text-slate-400">5 PM – 7 PM</div>
                    </div>

                    <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-600 border border-emerald-200">
                      {score}% Match
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Apply Modal */}
        <ApplyModal
          job={selectedJob}
          isOpen={isApplyOpen}
          onClose={() => setIsApplyOpen(false)}
        />

      </main>
    </div>
  );
}
