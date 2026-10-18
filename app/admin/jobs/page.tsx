'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { useJobStore } from '@/store/useJobStore';
import { Job, JobStatus } from '@/types';
import { AIAdminEngine } from '@/lib/aiAdmin';
import {
  Briefcase,
  Search,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Building2,
  MapPin,
  Clock,
  DollarSign,
  Filter,
  Eye,
  Check,
  Ban
} from 'lucide-react';
import Link from 'next/link';

export default function AdminJobsPage() {
  const { jobs, updateJob, deleteJob } = useJobStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | JobStatus>('ALL');
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.companyName.toLowerCase().includes(search.toLowerCase()) ||
      job.department.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex gap-8">
      <Sidebar />

      <main className="flex-1 space-y-6 min-w-0">

        {/* Toast */}
        {toastMessage && (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Header */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-[10px] font-extrabold uppercase">
                Admin Moderation
              </span>
              <span className="text-xs text-slate-400 font-bold">•</span>
              <span className="text-xs text-slate-500 font-bold">{jobs.length} Total Postings</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
              Job Postings Moderation
            </h1>
            <p className="text-xs text-slate-500">
              Audit campus job listings, inspect AI scam analysis risk scores, and manage hiring statuses.
            </p>
          </div>

          <Link
            href="/admin/dashboard"
            className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all text-center"
          >
            ← Back to Overview
          </Link>
        </div>

        {/* Search & Filter */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by job title, department, or company..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none"
            >
              <option value="ALL">All Postings</option>
              <option value="AVAILABLE">Available / Active</option>
              <option value="FILLED">Filled / Closed</option>
              <option value="FLAGGED">Flagged Listings</option>
            </select>
          </div>
        </div>

        {/* Jobs List */}
        <div className="space-y-4">
          {filteredJobs.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 text-slate-400 text-xs">
              No job postings found matching your filters.
            </div>
          ) : (
            filteredJobs.map((job) => {
              const aiScan = AIAdminEngine.scanJobPosting(job);
              const isHighRisk = aiScan.scamRiskScore >= 35;

              return (
                <div
                  key={job.id}
                  className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 hover:border-purple-300 dark:hover:border-purple-800 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <img
                        src={job.companyLogo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200'}
                        alt={job.companyName}
                        className="w-12 h-12 rounded-2xl object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                            {job.title}
                          </h3>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                            job.status === 'AVAILABLE'
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                              : job.status === 'FLAGGED'
                              ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}>
                            {job.status}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
                          <span className="font-bold text-slate-700 dark:text-slate-200">{job.companyName}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {job.location}</span>
                          <span>•</span>
                          <span className="font-bold text-purple-600 dark:text-purple-400">₹{job.hourlyRate}/hr</span>
                          <span>•</span>
                          <span>Slots: {job.selectedEmployees}/{job.requiredEmployees}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
                      {job.status !== 'AVAILABLE' && (
                        <button
                          onClick={() => {
                            updateJob(job.id, { status: 'AVAILABLE' });
                            showToast(`Listing "${job.title}" marked active.`);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" /> Approve
                        </button>
                      )}

                      {job.status !== 'FLAGGED' && (
                        <button
                          onClick={() => {
                            updateJob(job.id, { status: 'FLAGGED' });
                            showToast(`Listing "${job.title}" flagged for security review.`);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <AlertTriangle className="w-3.5 h-3.5" /> Flag
                        </button>
                      )}

                      {job.status !== 'FILLED' && (
                        <button
                          onClick={() => {
                            updateJob(job.id, { status: 'FILLED' });
                            showToast(`Listing "${job.title}" closed.`);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <Ban className="w-3.5 h-3.5" /> Close Shift
                        </button>
                      )}

                      <button
                        onClick={() => {
                          if (confirm(`Delete listing "${job.title}"?`)) {
                            deleteJob(job.id);
                            showToast(`Listing deleted.`);
                          }
                        }}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete listing"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* AI Autonomous Scan Audit Bar */}
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-700 dark:text-slate-300">AI Scam Risk Score:</span>
                      <span className={`px-2 py-0.5 rounded-full font-black text-[11px] ${
                        isHighRisk
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                          : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                      }`}>
                        {aiScan.scamRiskScore}% {isHighRisk ? 'HIGH RISK' : 'SAFE'}
                      </span>
                      {aiScan.flags.length > 0 && (
                        <span className="text-[11px] text-rose-600 dark:text-rose-400 font-medium">
                          ⚠️ {aiScan.flags.join(', ')}
                        </span>
                      )}
                    </div>

                    <div className="text-[11px] text-slate-400 font-medium">
                      Scanned by CampusFlex Java/AI Moderation Engine
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </main>
    </div>
  );
}
