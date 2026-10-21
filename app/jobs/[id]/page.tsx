'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { useJobStore } from '@/store/useJobStore';
import { ApplyModal } from '@/components/jobs/ApplyModal';
import { ReportEmployerModal } from '@/components/jobs/ReportEmployerModal';
import { ArrowLeft, Bookmark, DollarSign, Calendar, Clock, MapPin, CheckCircle2, Sparkles, Flag } from 'lucide-react';

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { jobs, savedJobIds, toggleSaveJob } = useJobStore();

  const jobId = params?.id as string;
  const job = jobs.find((j) => j.id === jobId) || jobs[0];

  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const isSaved = job ? savedJobIds.includes(job.id) : false;
  const getCompanyInitials = (name: string) => name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase();

  if (!job) {
    return (
      <div className="flex gap-8">
        <Sidebar />
        <main className="flex-1 space-y-6 min-w-0">
          <button
            onClick={() => router.back()}
            className="px-4 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Jobs
          </button>
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-12 text-center shadow-glass space-y-3">
            <h2 className="text-xl font-black text-slate-900 dark:text-white">Job Listing Not Found</h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              This job posting may have been filled, removed, or is awaiting administrator verification.
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex gap-8">
      <Sidebar />

      <main className="flex-1 space-y-6 min-w-0">

        {/* Back Navigation Bar & Actions */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="px-4 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Jobs
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsReportOpen(true)}
              className="px-3.5 py-2 rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 text-xs font-bold hover:bg-rose-100 dark:hover:bg-rose-950/60 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Report employer workplace or payment violation"
            >
              <Flag className="w-3.5 h-3.5" />
              Report Employer
            </button>
            <button
              onClick={() => toggleSaveJob(job.id)}
              className="p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 transition-colors"
            >
              <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-[#5B46E5] text-[#5B46E5]' : 'text-slate-400'}`} />
            </button>
          </div>
        </div>

        {/* Main Job Detail Card (Matching Mockup Screen 4) */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-8 shadow-glass space-y-8">

          {/* Job Title Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-900 text-white font-black text-xl flex items-center justify-center shrink-0 shadow-lg">
                {getCompanyInitials(job.companyName)}
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-900 dark:text-white">
                  {job.title}
                </h1>
                <p className="text-sm font-semibold text-slate-500">
                  {job.companyName}
                </p>
              </div>
            </div>

            <span className="px-4 py-1.5 rounded-full text-sm font-black bg-emerald-50 text-emerald-600 border border-emerald-200 self-start sm:self-center">
              95% Match
            </span>
          </div>

          {/* 4 Stat Pills Grid (Matching Mockup Screen 4) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-emerald-500" /> Salary
              </span>
              <div className="text-sm font-extrabold text-slate-900 dark:text-white">
                ₹{job.hourlyRate} / day
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-indigo-500" /> Days
              </span>
              <div className="text-sm font-extrabold text-slate-900 dark:text-white">
                Mon, Wed, Fri
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-500" /> Time
              </span>
              <div className="text-sm font-extrabold text-slate-900 dark:text-white">
                5 PM – 7 PM
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-purple-500" /> Location
              </span>
              <div className="text-sm font-extrabold text-slate-900 dark:text-white truncate">
                {job.location}
              </div>
            </div>
          </div>

          {/* Job Description (Matching Mockup Screen 4) */}
          <div className="space-y-2">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
              Job Description
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {job.description}
            </p>
          </div>

          {/* Requirements List (Matching Mockup Screen 4) */}
          <div className="space-y-2">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
              Requirements
            </h3>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 font-medium">
              {job.requirements.map((req) => (
                <li key={req} className="flex items-start gap-2">
                  <span className="text-[#5B46E5] font-black">•</span>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Skills Required Chips (Matching Mockup Screen 4) */}
          <div className="space-y-2">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
              Skills Required
            </h3>
            <div className="flex flex-wrap gap-2">
              {job.skillsRequired.map((skill) => (
                <span
                  key={skill}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Bottom Action Buttons (Matching Mockup Screen 4) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => toggleSaveJob(job.id)}
              className="py-3.5 px-6 rounded-2xl border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-extrabold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {isSaved ? 'Saved to Bookmarks' : 'Save Job'}
            </button>
            <button
              onClick={() => setIsApplyOpen(true)}
              className="py-3.5 px-6 rounded-2xl bg-[#5B46E5] hover:bg-indigo-700 text-white text-xs font-black shadow-lg shadow-indigo-500/25 transition-all cursor-pointer"
            >
              Apply Now
            </button>
          </div>

        </div>

        {/* Apply Modal */}
        <ApplyModal
          job={job}
          isOpen={isApplyOpen}
          onClose={() => setIsApplyOpen(false)}
        />

        {/* Student Report Employer Modal */}
        <ReportEmployerModal
          isOpen={isReportOpen}
          onClose={() => setIsReportOpen(false)}
          employerId={job.companyId}
          employerName={job.companyName}
          jobId={job.id}
          jobTitle={job.title}
        />

      </main>
    </div>
  );
}
