'use client';

import React, { useState } from 'react';
import { useJobStore } from '@/store/useJobStore';
import { JobCard } from '@/components/jobs/JobCard';
import { JobFilter } from '@/components/jobs/JobFilter';
import { ApplyModal } from '@/components/jobs/ApplyModal';
import { Job } from '@/types';
import { Briefcase, Sparkles, AlertCircle } from 'lucide-react';

export default function JobsPage() {
  const { jobs, filters } = useJobStore();
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isApplyOpen, setIsApplyOpen] = useState(false);

  // Apply filters
  const filteredJobs = jobs.filter((j) => {
    // Search Query
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      const matchTitle = j.title.toLowerCase().includes(q);
      const matchComp = j.companyName.toLowerCase().includes(q);
      const matchSkills = j.skillsRequired.some((s) => s.toLowerCase().includes(q));
      if (!matchTitle && !matchComp && !matchSkills) return false;
    }

    // Department
    if (filters.department !== 'All Departments' && j.department !== filters.department) {
      return false;
    }

    // Work Type
    if (filters.workType !== 'All Types' && j.workType !== filters.workType) {
      return false;
    }

    // Min Salary
    if (filters.minSalary > 0 && j.hourlyRate < filters.minSalary) {
      return false;
    }

    // Status
    if (filters.status !== 'ALL' && j.status !== filters.status) {
      return false;
    }

    return true;
  });

  const handleApplyClick = (job: Job) => {
    setSelectedJob(job);
    setIsApplyOpen(true);
  };

  return (
    <div className="space-y-6">

      {/* Page Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-primary-900 via-slate-900 to-secondary-950 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-primary-300 uppercase tracking-wider">
            <Briefcase className="w-4 h-4" /> Student Job Marketplace
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight mt-1">
            Discover Verified Campus Jobs
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Real-time part-time postings with automated hiring quotas and instant AI profile matching.
          </p>
        </div>
        <div className="px-4 py-2 rounded-2xl bg-white/10 border border-white/15 text-xs font-bold backdrop-blur-md">
          {filteredJobs.length} Jobs Available
        </div>
      </div>

      {/* Main Filter & Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">

        {/* Sidebar Filters */}
        <div className="lg:col-span-1">
          <JobFilter />
        </div>

        {/* Jobs Grid */}
        <div className="lg:col-span-3 space-y-4">
          {filteredJobs.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
              <AlertCircle className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
                No matching jobs found
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try adjusting your search keywords, salary slider, or schedule filters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredJobs.map((job) => (
                <JobCard key={job.id} job={job} onApplyClick={handleApplyClick} />
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Apply Modal */}
      <ApplyModal
        job={selectedJob}
        isOpen={isApplyOpen}
        onClose={() => setIsApplyOpen(false)}
      />

    </div>
  );
}
