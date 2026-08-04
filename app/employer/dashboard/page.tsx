'use client';

import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { StatCard } from '@/components/ui/StatCard';
import { useAuthStore } from '@/store/useAuthStore';
import { useJobStore } from '@/store/useJobStore';
import { useApplicationStore } from '@/store/useApplicationStore';
import { Briefcase, Users, CheckCircle2, PlusCircle, MessageSquare, ShieldCheck, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function EmployerDashboard() {
  const { currentUser } = useAuthStore();
  const { jobs } = useJobStore();
  const { applications } = useApplicationStore();

  const employerJobs = jobs.filter((j) => j.companyId === currentUser?.id || j.companyName === currentUser?.companyName);
  const activeJobs = employerJobs.filter((j) => j.status === 'AVAILABLE');
  const filledJobs = employerJobs.filter((j) => j.status === 'FILLED');

  const pendingApps = applications.filter((a) => a.status === 'PENDING' || a.status === 'UNDER_REVIEW');
  const hiredApps = applications.filter((a) => a.status === 'ACCEPTED');

  return (
    <div className="flex gap-8">
      <Sidebar />

      <main className="flex-1 space-y-8 min-w-0">

        {/* Header */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
                Employer Command Center
              </span>
              {currentUser?.verified && (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 text-[10px] font-bold border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> VERIFIED
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">
              {currentUser?.companyName || 'TechCorp Innovations'}
            </h1>
            <p className="text-xs text-slate-300">
              Manage smart hiring quotas, student candidates, and direct messaging.
            </p>
          </div>
          <Link
            href="/employer/post-job"
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-primary-600 to-secondary-500 hover:opacity-95 text-xs font-extrabold text-white shadow-lg flex items-center justify-center gap-2 transition-transform hover:scale-105"
          >
            <PlusCircle className="w-4 h-4" /> Post Smart Job
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Active Job Postings"
            value={activeJobs.length}
            subtitle={`${filledJobs.length} positions filled`}
            icon={Briefcase}
            trend="+1 this month"
          />
          <StatCard
            title="Pending Candidates"
            value={pendingApps.length}
            subtitle="Needs recruiter review"
            icon={Users}
            colorGradient="from-indigo-500 to-purple-600"
          />
          <StatCard
            title="Hired Students"
            value={hiredApps.length}
            subtitle="Matched & accepted"
            icon={CheckCircle2}
            colorGradient="from-emerald-500 to-teal-600"
          />
          <StatCard
            title="Smart Quota Fill Rate"
            value="85%"
            subtitle="Automated close success"
            icon={ShieldCheck}
            colorGradient="from-amber-500 to-orange-600"
          />
        </div>

        {/* Quick Applicants List */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-glass space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-600" /> Candidates Awaiting Review
            </h3>
            <Link
              href="/employer/applicants"
              className="text-xs font-bold text-indigo-600 hover:underline"
            >
              Applicant Match Center →
            </Link>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {pendingApps.map((app) => (
              <div key={app.id} className="py-3.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={app.studentAvatar}
                    alt={app.studentName}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-primary-500/20"
                  />
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900 dark:text-slate-100">
                      {app.studentName}
                    </h4>
                    <span className="text-[11px] text-slate-500">
                      Applied for {app.jobTitle} • {app.studentDepartment}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-primary-50 dark:bg-primary-950 text-primary-600 border border-primary-200">
                    {app.matchPercentage}% AI Match
                  </span>
                  <Link
                    href="/employer/applicants"
                    className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-indigo-600 hover:text-white transition-colors"
                  >
                    Review Candidate
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}
