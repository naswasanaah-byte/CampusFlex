'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { StatCard } from '@/components/ui/StatCard';
import { JobCard } from '@/components/jobs/JobCard';
import { ApplyModal } from '@/components/jobs/ApplyModal';
import { useAuthStore } from '@/store/useAuthStore';
import { useApplicationStore } from '@/store/useApplicationStore';
import { useJobStore } from '@/store/useJobStore';
import { Job } from '@/types';
import { Briefcase, Calendar, DollarSign, Bookmark, Sparkles, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function StudentDashboard() {
  const { currentUser } = useAuthStore();
  const { applications } = useApplicationStore();
  const { jobs, savedJobIds } = useJobStore();

  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isApplyOpen, setIsApplyOpen] = useState(false);

  const studentApps = applications.filter((a) => a.studentId === currentUser?.id);
  const interviewApps = studentApps.filter((a) => a.status === 'INTERVIEW_SCHEDULED');

  const recommendedJobs = jobs.filter((j) => j.status === 'AVAILABLE').slice(0, 2);

  const handleApplyClick = (job: Job) => {
    setSelectedJob(job);
    setIsApplyOpen(true);
  };

  return (
    <div className="flex gap-8">
      <Sidebar />

      <main className="flex-1 space-y-8 min-w-0">

        {/* Welcome Header */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-primary-950 to-slate-900 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-primary-300 uppercase tracking-wider">
              Student Dashboard
            </span>
            <h1 className="text-2xl sm:text-3xl font-black">
              Welcome back, {currentUser?.name || 'Alex'}! 👋
            </h1>
            <p className="text-xs text-slate-300">
              Senior • Computer Science • GPA {currentUser?.gpa || '3.8'}
            </p>
          </div>
          <Link
            href="/student/profile"
            className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-bold backdrop-blur-md transition-colors text-center"
          >
            Digital Work ID & QR →
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Applications Submitted"
            value={studentApps.length}
            subtitle="Active track"
            icon={Briefcase}
            trend="+2 this week"
          />
          <StatCard
            title="Interviews Scheduled"
            value={interviewApps.length}
            subtitle="Upcoming calls"
            icon={Calendar}
            colorGradient="from-emerald-500 to-teal-600"
          />
          <StatCard
            title="Total Earned"
            value={currentUser?.gpa ? '$0.00' : '$0.00'}
            subtitle="Part-time income"
            icon={DollarSign}
            colorGradient="from-amber-500 to-orange-600"
          />
          <StatCard
            title="Bookmarked Jobs"
            value={savedJobIds.length}
            subtitle="Saved positions"
            icon={Bookmark}
            colorGradient="from-purple-500 to-indigo-600"
          />
        </div>

        {/* Recent Applications Activity */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-glass space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary-600" /> Recent Application Activity
            </h3>
            <Link
              href="/student/applications"
              className="text-xs font-bold text-primary-600 hover:underline"
            >
              View Application Timeline →
            </Link>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {studentApps.map((app) => (
              <div key={app.id} className="py-3 flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    {app.jobTitle}
                  </h4>
                  <span className="text-[11px] text-slate-500">{app.companyName}</span>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                    app.status === 'ACCEPTED'
                      ? 'bg-emerald-100 text-emerald-700'
                      : app.status === 'INTERVIEW_SCHEDULED'
                      ? 'bg-indigo-100 text-indigo-700'
                      : app.status === 'REJECTED'
                      ? 'bg-rose-100 text-rose-700'
                      : 'bg-primary-50 text-primary-600'
                  }`}
                >
                  {app.status.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Recommendations Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary-600 animate-pulse" />
            <h2 className="text-lg font-black text-slate-900 dark:text-slate-100">
              Top AI Jobs for Your Profile
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendedJobs.map((job) => (
              <JobCard key={job.id} job={job} onApplyClick={handleApplyClick} />
            ))}
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
