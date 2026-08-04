'use client';

import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { StatCard } from '@/components/ui/StatCard';
import { useAuthStore } from '@/store/useAuthStore';
import { useJobStore } from '@/store/useJobStore';
import { ShieldCheck, Users, Building2, Briefcase, BarChart3, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const { usersList, toggleVerifyEmployer, toggleUserStatus } = useAuthStore();
  const { jobs } = useJobStore();

  const students = usersList.filter((u) => u.role === 'student');
  const employers = usersList.filter((u) => u.role === 'employer');
  const pendingEmployers = employers.filter((u) => !u.verified);

  return (
    <div className="flex gap-8">
      <Sidebar />

      <main className="flex-1 space-y-8 min-w-0">

        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-rose-300 uppercase tracking-wider">
              System Operations
            </span>
            <h1 className="text-2xl sm:text-3xl font-black">
              Platform Governance Dashboard
            </h1>
            <p className="text-xs text-slate-300">
              Verify employers, moderate job listings, and monitor student marketplace metrics.
            </p>
          </div>
          <Link
            href="/admin/employers"
            className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-bold backdrop-blur-md transition-colors text-center"
          >
            Review {pendingEmployers.length} Employer Queue →
          </Link>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Registered Students"
            value={students.length}
            subtitle="Active job seekers"
            icon={Users}
            colorGradient="from-primary-600 to-secondary-500"
          />
          <StatCard
            title="Verified Employers"
            value={employers.filter((e) => e.verified).length}
            subtitle={`${pendingEmployers.length} pending checks`}
            icon={Building2}
            colorGradient="from-indigo-600 to-purple-600"
          />
          <StatCard
            title="Total Jobs Posted"
            value={jobs.length}
            subtitle={`${jobs.filter((j) => j.status === 'FILLED').length} positions filled`}
            icon={Briefcase}
            colorGradient="from-emerald-500 to-teal-600"
          />
          <StatCard
            title="Platform Smart Fill Rate"
            value="92%"
            subtitle="Successful slot allocation"
            icon={BarChart3}
            colorGradient="from-rose-500 to-amber-600"
          />
        </div>

        {/* Employers Verification Queue Section */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-glass space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-rose-600" /> Employer Verification Audit
            </h3>
            <Link href="/admin/employers" className="text-xs font-bold text-rose-600 hover:underline">
              Manage All Employers →
            </Link>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {employers.map((emp) => (
              <div key={emp.id} className="py-3.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={emp.companyLogo || emp.avatar}
                    alt={emp.name}
                    className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200"
                  />
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900 dark:text-slate-100">
                      {emp.companyName || emp.name}
                    </h4>
                    <span className="text-[11px] text-slate-500">{emp.email} • {emp.location}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      emp.verified ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {emp.verified ? 'VERIFIED' : 'PENDING'}
                  </span>
                  <button
                    onClick={() => toggleVerifyEmployer(emp.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                      emp.verified
                        ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm'
                    }`}
                  >
                    {emp.verified ? 'Revoke Verification' : 'Approve & Verify'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}
