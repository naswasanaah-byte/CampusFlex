'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { useJobStore } from '@/store/useJobStore';
import { Job } from '@/types';
import { ApplyModal } from '@/components/jobs/ApplyModal';
import { Search, Filter, Bookmark, MapPin, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function JobsPage() {
  const { jobs, savedJobIds, toggleSaveJob } = useJobStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isApplyOpen, setIsApplyOpen] = useState(false);

  const filteredJobs = jobs.filter(
    (j) =>
      j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.skillsRequired.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getCompanyInitials = (name: string) => {
    return name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const handleApplyClick = (job: Job) => {
    setSelectedJob(job);
    setIsApplyOpen(true);
  };

  return (
    <div className="flex gap-8">
      <Sidebar />

      <main className="flex-1 space-y-6 min-w-0">

        {/* Search Header & Filter Bar (Matching Mockup Screen 3) */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-glass space-y-4">
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            Find Jobs
          </h1>

          {/* Search Bar Input */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-4 top-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by job title, skills or company..."
              className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#5B46E5]"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="font-bold text-slate-400 text-[11px] uppercase tracking-wider flex items-center gap-1 shrink-0">
              <Filter className="w-3.5 h-3.5" /> Filters:
            </span>
            {['Category ▾', 'Location ▾', 'Salary ▾', 'Skills ▾'].map((f) => (
              <button
                key={f}
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-200 transition-colors shrink-0"
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Job Cards List (Matching Mockup Screen 3) */}
        <div className="space-y-4">
          {filteredJobs.map((job, idx) => {
            const isSaved = savedJobIds.includes(job.id);
            const matchScores = [92, 90, 89, 85, 95, 88];
            const score = matchScores[idx % matchScores.length];

            return (
              <div
                key={job.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-glass space-y-4 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    {/* Logo Box */}
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-md">
                      {getCompanyInitials(job.companyName)}
                    </div>
                    <div className="space-y-1">
                      <Link href={`/jobs/${job.id}`} className="hover:underline">
                        <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                          {job.title}
                        </h3>
                      </Link>
                      <div className="text-xs text-slate-500 font-medium">
                        {job.companyName}
                      </div>
                      <div className="flex items-center gap-4 text-xs font-semibold text-slate-600 dark:text-slate-400 pt-1">
                        <span>{job.location}</span>
                        <span>•</span>
                        <span className="font-extrabold text-slate-900 dark:text-white">₹{job.hourlyRate} / day</span>
                        <span>•</span>
                        <span>5 PM – 9 PM (Mon – Fri)</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="px-3.5 py-1 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-600 border border-emerald-200">
                      {score}% Match
                    </span>
                    <button
                      onClick={() => toggleSaveJob(job.id)}
                      className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition-colors"
                    >
                      <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-[#5B46E5] text-[#5B46E5]' : 'text-slate-400'}`} />
                    </button>
                  </div>
                </div>

                {/* Skills Chips */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  {job.skillsRequired.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold"
                    >
                      {skill}
                    </span>
                  ))}
                  <button
                    onClick={() => handleApplyClick(job)}
                    className="ml-auto px-5 py-2 rounded-2xl bg-[#5B46E5] hover:bg-indigo-700 text-white text-xs font-extrabold shadow-md transition-all cursor-pointer"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            );
          })}
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
