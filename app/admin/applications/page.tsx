'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { useApplicationStore } from '@/store/useApplicationStore';
import { ApplicationStatus } from '@/types';
import {
  Clock,
  Search,
  CheckCircle2,
  XCircle,
  Filter,
  User,
  Building2,
  DollarSign,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';

export default function AdminApplicationsPage() {
  const { applications } = useApplicationStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | ApplicationStatus>('ALL');

  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      app.studentName.toLowerCase().includes(search.toLowerCase()) ||
      app.jobTitle.toLowerCase().includes(search.toLowerCase()) ||
      app.companyName.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex gap-8">
      <Sidebar />

      <main className="flex-1 space-y-6 min-w-0">

        {/* Header */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-[10px] font-extrabold uppercase">
                Admin Shift Monitor
              </span>
              <span className="text-xs text-slate-400 font-bold">•</span>
              <span className="text-xs text-slate-500 font-bold">{applications.length} Total Submissions</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
              Shift Applications & Placements
            </h1>
            <p className="text-xs text-slate-500">
              Live audit of student part-time job applications, match evaluations, and hiring outcomes.
            </p>
          </div>

          <Link
            href="/admin/dashboard"
            className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all text-center"
          >
            ← Back to Overview
          </Link>
        </div>

        {/* Filter bar */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search candidate, job, or employer..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none"
            >
              <option value="ALL">All Application Statuses</option>
              <option value="ACCEPTED">Accepted / Placed</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="PENDING">Pending</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>

        {/* Applications List */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-extrabold uppercase text-[10px] border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="px-5 py-4">Student Candidate</th>
                  <th className="px-5 py-4">Position & Employer</th>
                  <th className="px-5 py-4">AI Match</th>
                  <th className="px-5 py-4">Applied Date</th>
                  <th className="px-5 py-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {filteredApps.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">
                      No applications found.
                    </td>
                  </tr>
                ) : (
                  filteredApps.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={app.studentAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                            alt={app.studentName}
                            className="w-8 h-8 rounded-full object-cover shrink-0"
                          />
                          <div>
                            <div className="font-extrabold text-slate-900 dark:text-white">
                              {app.studentName}
                            </div>
                            <div className="text-[11px] text-slate-400">
                              {app.studentEmail}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="font-bold text-slate-800 dark:text-slate-100">
                          {app.jobTitle}
                        </div>
                        <div className="text-[11px] text-purple-600 dark:text-purple-400">
                          {app.companyName}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span className="px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-black text-[11px] border border-purple-200 dark:border-purple-800">
                          ⚡ {app.matchPercentage}%
                        </span>
                      </td>

                      <td className="px-5 py-4 text-slate-500 font-mono text-[11px]">
                        {new Date(app.appliedAt).toLocaleDateString()}
                      </td>

                      <td className="px-5 py-4 text-right">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                          app.status === 'ACCEPTED'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                            : app.status === 'REJECTED'
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                        }`}>
                          {app.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}
