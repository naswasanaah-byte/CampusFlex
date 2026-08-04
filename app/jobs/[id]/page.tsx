'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useJobStore } from '@/store/useJobStore';
import { useAuthStore } from '@/store/useAuthStore';
import { SmartJobBadge } from '@/components/jobs/SmartJobBadge';
import { ApplyModal } from '@/components/jobs/ApplyModal';
import { calculateAIMatch } from '@/lib/aiEngine';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  Building2,
  MapPin,
  Clock,
  DollarSign,
  ShieldCheck,
  Sparkles,
  Bookmark,
  Share2,
  ArrowLeft,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;

  const { jobs, savedJobIds, toggleSaveJob } = useJobStore();
  const { currentUser } = useAuthStore();

  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const job = jobs.find((j) => j.id === jobId);

  if (!job) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Job Not Found</h2>
        <Link href="/jobs" className="text-sm font-bold text-primary-600 hover:underline">
          ← Return to Marketplace
        </Link>
      </div>
    );
  }

  const isSaved = savedJobIds.includes(job.id);
  const isStudent = currentUser?.role === 'student';
  const isFilled = job.status === 'FILLED' || job.selectedEmployees >= job.requiredEmployees;
  const aiMatch = currentUser ? calculateAIMatch(currentUser, job) : { score: 92, reasons: ['Matches skill set'] };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Jobs
      </button>

      {/* Main Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-8 shadow-glass space-y-6">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={job.companyLogo}
              alt={job.companyName}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-primary-500/20 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">
                  {job.title}
                </h1>
              </div>
              <p className="text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1.5 mt-1">
                {job.companyName} <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span className="text-slate-300">•</span>
                <MapPin className="w-3.5 h-3.5 text-slate-400" /> {job.location}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Share Job Link"
            >
              <Share2 className="w-4 h-4" />
            </button>
            {isStudent && (
              <button
                onClick={() => toggleSaveJob(job.id)}
                className={`p-3 rounded-2xl border transition-colors ${
                  isSaved
                    ? 'bg-primary-50 dark:bg-primary-950/60 border-primary-300 text-primary-600'
                    : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-100'
                }`}
                title="Save Job"
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-primary-600' : ''}`} />
              </button>
            )}
          </div>
        </div>

        {/* Smart Job Quota Banner */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="text-2xl font-black text-primary-600 dark:text-primary-400">
              {formatCurrency(job.hourlyRate)}
              <span className="text-xs font-normal text-slate-500">/hr</span>
            </div>
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block" />
            <SmartJobBadge
              requiredEmployees={job.requiredEmployees}
              selectedEmployees={job.selectedEmployees}
              status={job.status}
              size="lg"
            />
          </div>

          {/* Apply Button or Filled Warning */}
          {isFilled ? (
            <div className="px-4 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 text-rose-600 text-xs font-bold flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              This position has already been filled.
            </div>
          ) : (
            isStudent && (
              <button
                onClick={() => setIsApplyOpen(true)}
                className="px-6 py-3 text-xs font-extrabold text-white bg-gradient-to-r from-primary-600 to-secondary-500 rounded-2xl shadow-lg hover:opacity-95 transition-opacity"
              >
                Apply Now ({job.requiredEmployees - job.selectedEmployees} slots left)
              </button>
            )
          )}
        </div>

        {/* AI Profile Match Breakdown */}
        {isStudent && (
          <div className="p-5 rounded-3xl bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-950/40 dark:to-secondary-950/40 border border-primary-200 dark:border-primary-800 space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary-600 animate-pulse" />
              <h3 className="text-sm font-extrabold text-primary-800 dark:text-primary-200">
                AI Recommendation: {aiMatch.score}% Profile Match
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {aiMatch.reasons.map((reason, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{reason}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Description Section */}
        <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Job Description
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
            {job.description}
          </p>
        </div>

        {/* Requirements Section */}
        <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Candidate Requirements
          </h3>
          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
            {job.requirements.map((req, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-600 mt-1.5 shrink-0" />
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Required Skills */}
        <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Required Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {job.skillsRequired.map((skill, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-xl text-xs font-semibold bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-300 border border-primary-200 dark:border-primary-800"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

      </div>

      {/* Apply Modal */}
      <ApplyModal
        job={job}
        isOpen={isApplyOpen}
        onClose={() => setIsApplyOpen(false)}
      />

    </div>
  );
}
