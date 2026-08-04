'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useJobStore } from '@/store/useJobStore';
import { JobCard } from '@/components/jobs/JobCard';
import { ApplyModal } from '@/components/jobs/ApplyModal';
import { Job } from '@/types';
import {
  Sparkles,
  Search,
  CheckCircle2,
  Users,
  Building2,
  Zap,
  ArrowRight,
  ShieldCheck,
  QrCode,
  DollarSign
} from 'lucide-react';

export default function LandingPage() {
  const { jobs } = useJobStore();
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isApplyOpen, setIsApplyOpen] = useState(false);

  const featuredJobs = jobs.filter((j) => j.status === 'AVAILABLE').slice(0, 3);

  const handleApplyClick = (job: Job) => {
    setSelectedJob(job);
    setIsApplyOpen(true);
  };

  return (
    <div className="space-y-16 py-4">

      {/* HERO SECTION */}
      <section className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-primary-950 to-slate-900 text-white p-8 sm:p-14 overflow-hidden shadow-2xl border border-primary-500/20">

        {/* Ambient Holographic Blobs */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary-500/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 bg-secondary-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">

          {/* Badge Tagline */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-xs font-bold text-primary-300">
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
            <span>AI-Powered Student Marketplace</span>
          </div>

          {/* Title Header */}
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.1]">
            Smart Jobs.{' '}
            <span className="bg-gradient-to-r from-primary-400 via-secondary-300 to-amber-300 bg-clip-text text-transparent">
              Flexible Future.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            Discover verified part-time jobs, campus assistantships, and flexible remote gigs tailored to your academic schedule. Featuring automated smart hiring counters and instant digital work credentials.
          </p>

          {/* CTA Button Group */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <Link
              href="/jobs"
              className="px-8 py-4 text-sm font-extrabold text-white bg-gradient-to-r from-primary-600 to-secondary-500 hover:opacity-95 rounded-2xl shadow-lg shadow-primary-500/30 flex items-center justify-center gap-2 transition-transform hover:scale-105"
            >
              <Search className="w-4 h-4" /> Explore Available Jobs
            </Link>
            <Link
              href="/employer/post-job"
              className="px-8 py-4 text-sm font-bold text-slate-200 bg-white/10 hover:bg-white/20 border border-white/15 rounded-2xl backdrop-blur-md flex items-center justify-center gap-2 transition-all"
            >
              <Building2 className="w-4 h-4" /> Post a Smart Job
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="pt-8 grid grid-cols-3 gap-4 border-t border-white/10 text-center sm:text-left">
            <div>
              <div className="text-2xl font-black text-white">100%</div>
              <div className="text-xs text-slate-400 font-medium">Verified Campus Employers</div>
            </div>
            <div>
              <div className="text-2xl font-black text-emerald-400">95%+</div>
              <div className="text-xs text-slate-400 font-medium">AI Skill Match Precision</div>
            </div>
            <div>
              <div className="text-2xl font-black text-amber-300">Auto-Close</div>
              <div className="text-xs text-slate-400 font-medium">Smart Quota Protection</div>
            </div>
          </div>

        </div>
      </section>

      {/* FEATURED SMART JOBS GRID */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider">
              <Zap className="w-4 h-4" /> Real-Time Opportunities
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 mt-1">
              Top Trending Part-Time Jobs
            </h2>
          </div>
          <Link
            href="/jobs"
            className="text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
          >
            View All Marketplace Jobs →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredJobs.map((job) => (
            <JobCard key={job.id} job={job} onApplyClick={handleApplyClick} />
          ))}
        </div>
      </section>

      {/* PLATFORM FEATURES HIGHLIGHT */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-glass space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-primary-100 dark:bg-primary-950 text-primary-600 dark:text-primary-400 flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            AI Match Recommendation
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Our intelligent matching engine scores jobs based on your skills, department focus, and weekly schedule availability.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-glass space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Smart Auto-Close Hiring
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Employers set required slots (e.g. 5 hires). When quota is filled, jobs close automatically to protect student time.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-glass space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <QrCode className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Digital Work ID & QR Code
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Instant digital campus badge with QR code scanning for shift attendance and earnings verification.
          </p>
        </div>
      </section>

      {/* Apply Modal Component */}
      <ApplyModal
        job={selectedJob}
        isOpen={isApplyOpen}
        onClose={() => setIsApplyOpen(false)}
      />

    </div>
  );
}
